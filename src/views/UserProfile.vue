<script setup lang="ts" name="UserProfile">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { signOut, onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification } from "firebase/auth";
import { auth, fetchUserData, saveToFirestore, storage } from "@/firebase";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import type { FirebaseError } from "firebase/app";
import defaultUserPic from "@/assets/default-user-pic.svg";

const router = useRouter();

const username = ref("");
const email = ref("");
const userPic = ref("");
const defaultPic = ref(defaultUserPic); // 預設的user圖片
const selectedFile = ref<File | null>(null); // 儲存選擇的圖片檔案
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const strengthPct = ref(0); // 密碼強度
const isPasswordVisible = ref(false); // 隱藏/顯示密碼
const message = ref("");
const isVerify = ref(); // 電子郵件是否驗證
const verifyMsg = ref("");

// 切換密碼顯示或隱藏
const changePwVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
}

// 組件掛載顯示user資訊
onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userData = await fetchUserData(user);
                if (userData) {
                    username.value = userData.username;
                    email.value = userData.email;
                    userPic.value = userData.userPicUrl;
                }

                if (user.emailVerified) {
                    isVerify.value = true;
                } else {
                    isVerify.value = false;
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    });
});

// 登出
const logout = () => {
    signOut(auth)
        .then(() => {
            // 成功登出後回到登入頁面
            router.push({ name: "Login" });
        })
        .catch((error) => {
            console.error("登出失敗：", error);
        });
};

// 選擇圖片檔案
const selectFile = (event: Event) => {
    // event: 選擇檔案後觸發這個事件
    // 將觸發事件的元素轉換為HTML的<input>，型態為文件選擇器
    const target = event.target as HTMLInputElement;
    // 檢查是否有選取的檔案，且至少選取一個檔案
    if (target.files && target.files[0]) {
        selectedFile.value = target.files[0];

        // 讀取檔案
        const reader = new FileReader();

        // 讀取檔案後，觸發onload事件
        reader.onload = (e) => {
            // 將讀取完成的圖片資料(Data URL)存在userPic
            // 使用optional chaing(?.)避免e.target可能為null的情況
            userPic.value = e.target?.result as string;
        };

        // 讀取圖片，將檔案轉換為Data URL的格式
        reader.readAsDataURL(selectedFile.value);
    }
}

// 移除圖片
const removePic = () => {
    userPic.value = defaultPic.value;
    selectedFile.value = null;
}

// 更新個人資料
const updateUserInfo = async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            let userPicUrl = userPic.value;
            if (selectedFile.value) {
                // 定義儲存圖片的路徑
                const storagePath = `userPictures/${user.uid}/${selectedFile.value.name}`;
                // 創建指向firebase storage的檔案引用
                const fileRef = storageRef(storage, storagePath);
                // 上傳選擇的檔案到firebase storage
                await uploadBytes(fileRef, selectedFile.value);
                // 獲取上傳後檔案下載的URL
                userPicUrl = await getDownloadURL(fileRef);
            }
            // 更新firestore
            await saveToFirestore({ username: username.value, userPicUrl });

            // 顯示最新的圖片
            userPic.value = userPicUrl;

        } catch (error) {
            console.log("個人資料更新失敗：", error);
        }
    }
}

// 清空表單, 恢復原本的資料
const clearForm = async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            const userData = await fetchUserData(user);
            if (userData) {
                username.value = userData.username;
                userPic.value = userData.userPicUrl;

                selectedFile.value = null;
                oldPassword.value = "";
                newPassword.value = "";
                confirmPassword.value = "";
                message.value = "";
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
}

// 檢查密碼強度
const checkPwStrength = () => {
    const value = newPassword.value;
    let strength = 0;

    if (value.length >= 8) strength++; // 至少8個字符
    if (/[0-9]/.test(value)) strength++; // 包含數字
    if (/[A-Z]/.test(value)) strength++; // 包含大寫英文字母
    if (/[a-z]/.test(value)) strength++; // 包含小寫英文字母
    if (/[^A-Za-z0-9]/.test(value)) strength++; // 包含特殊符號

    switch (strength) {
        case 0:
        case 1:
            strengthPct.value = 25;
            break;
        case 2:
        case 3:
            strengthPct.value = 50;
            break;
        case 4:
            strengthPct.value = 75;
            break;
        case 5:
            strengthPct.value = 100;
            break;
    }
};

// 更新密碼
const updatePw = async () => {
    const user = auth.currentUser;
    if (user && user.email) {
        try {
            const credential = EmailAuthProvider.credential(user.email, oldPassword.value);

            // 重新驗證用戶
            await reauthenticateWithCredential(user, credential);

            // 檢查密碼強度
            if (strengthPct.value < 75) {
                message.value = "密碼太弱了！";
                return;
            }

            // 檢查新密碼與確認密碼是否一致
            if (confirmPassword.value === newPassword.value) {
                await updatePassword(user, newPassword.value);
                message.value = "密碼更新成功！";
            } else {
                message.value = "密碼不一致";
            }
        } catch (error) {
            const firebaseError = error as FirebaseError;
            if (firebaseError.code === "auth/invalid-credential") {
                message.value = "請檢查舊密碼是否正確";
            } else {
                console.error("更新密碼時出錯：", error);
            }
        }
    }
};

// 驗證電子郵件
const sendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
        try {
            await sendEmailVerification(user);
            verifyMsg.value = "驗證郵件已發送，請檢查您的郵件收件箱";
        } catch (error) {
            verifyMsg.value = "發送驗證郵件失敗，請稍後再試";
        }
    } else {
        console.log("您的電子郵件已驗證");
    }
};

</script>

<template>
    <div class="container min-vh-100 d-flex justify-content-center align-items-center">
        <div class="card col-12 col-lg-8 col-xl-6 text-center py-5 px-4 bg-dark text-light border-light border-3">
            <div class="mt-3">
                <img :src="userPic" class="rounded-circle border border-secondary border-5 mb-3"
                    style="width: 150px; height: 150px;">
                <h3>{{ username }}</h3>
            </div>
            <div class="card-body">
                <p class="card-text mb-5"> {{ email }}</p>
                <button class="btn btn-lg btn-light w-100 mb-3" data-bs-toggle="modal"
                    data-bs-target="#updateUserInfoModal"><i class="bi bi-pencil-square"></i>
                    個人資料設定</button>
                <button class="btn btn-lg btn-danger w-100" @click="logout"><i class="bi bi-box-arrow-right"></i>
                    登出</button>
            </div>
        </div>
    </div>

    <div class="modal fade" id="updateUserInfoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="updateUserInfoModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-dark">
                <div class="modal-body">
                    <h4 class="fw-bold p-2">個人資料設定</h4>
                    <form class="px-5 py-4" @submit.prevent="updateUserInfo">
                        <div class="text-center position-relative mb-5">
                            <img :src="userPic" class="rounded-circle border border-secondary border-1" alt="userPic"
                                style="width: 100px; height: 100px;">
                            <button class="btn btn-light position-absolute shadow rounded-circle"
                                data-bs-toggle="dropdown" style="right: 130px; bottom: -10px;"><i
                                    class="bi bi-camera"></i></button>
                            <div class="dropdown-menu">
                                <input type="file" id="uploadPic" @change="selectFile" accept="image/*" class="d-none">
                                <label for="uploadPic" class="dropdown-item btn"><i class="bi bi-upload"></i>
                                    更換照片</label>
                                <button class="dropdown-item text-danger" @click="removePic"><i class="bi bi-trash"></i>
                                    移除照片</button>
                            </div>
                        </div>
                        <div class="form-floating mb-4">
                            <input type="text" class="form-control" placeholder="name@example.com" v-model="username"
                                required>
                            <label class="text-muted">使用者名稱</label>

                        </div>
                        <div class="form-floating pb-4 mb-4 border-bottom position-relative">
                            <input type="email" class="form-control" placeholder="name@example.com" v-model="email"
                                readonly>
                            <label class="text-muted">電子郵件</label>
                            <div class="position-absolute end-0 me-2 mt-2" style="top: 5px;">
                                <i class="fs-5 bi"
                                    :class="isVerify ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-muted'"></i>
                            </div>
                        </div>

                        <div class="mb-5 text-muted">
                            <p>安全性設定</p>
                            <p>{{ verifyMsg }}</p>
                            <button v-if="!isVerify"
                                class="btn btn-light w-100 d-flex justify-content-between text-muted mb-2"
                                @click="sendVerificationEmail"><span><i class="bi bi-envelope-check"></i>
                                    驗證電子郵件</span><span><i class="bi bi-arrow-right"></i></span></button>

                            <button class="btn btn-light w-100 d-flex justify-content-between text-muted"
                                data-bs-toggle="modal" data-bs-target="#updatePasswordModal"><span><i
                                        class="bi bi-shield-lock"></i> 修改密碼</span><span><i
                                        class="bi bi-arrow-right"></i></span></button>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"
                                @click="clearForm">取消</button>
                            <button type="submit" class="btn btn-dark ms-2" data-bs-dismiss="modal">儲存變更</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="updatePasswordModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="updatePasswordModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-dark">
                <div class="modal-body">
                    <h4 class="fw-bold p-2">修改密碼</h4>
                    <form class="px-5 pb-4" @submit.prevent="updatePw">
                        <div class="text-center mb-4">
                            <p v-if="!message" class="text-muted">請輸入舊密碼與新密碼</p>
                            <p class="text-danger">{{ message }}</p>
                        </div>
                        <div class="form-floating mb-4">
                            <input type="password" class="form-control" placeholder="oldPassword" v-model="oldPassword"
                                required>
                            <label class="text-muted">舊密碼</label>
                        </div>
                        <div class="form-floating mb-4 position-relative">
                            <input :type="isPasswordVisible ? 'text' : 'password'" class="form-control"
                                placeholder="newPassword" v-model="newPassword" @input="checkPwStrength" required>
                            <label class="text-muted">新密碼</label>
                            <button type="button"
                                class="btn border-0 position-absolute end-0 top-0 me-2 mt-2 text-muted"
                                @click="changePwVisibility">
                                <i class="fs-5" :class="isPasswordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                            </button>
                        </div>
                        <div class="form-floating pb-4">
                            <input type="password" class="form-control" placeholder="confirmPassword"
                                v-model="confirmPassword" required>
                            <label class="text-muted">確認密碼</label>
                        </div>
                        <div class="mb-5 text-muted bg-secondary bg-opacity-10 rounded p-3">
                            <p class="mb-0">新密碼必須符合：<br />
                                <i class="bi bi-exclamation-circle"></i> 至少 8 個字元<br />
                                <i class="bi bi-exclamation-circle"></i> 包含數字<br />
                                <i class="bi bi-exclamation-circle"></i> 包含大寫字母<br />
                                <i class="bi bi-exclamation-circle"></i> 包含小寫字母
                            </p>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"
                                @click="clearForm">取消</button>
                            <button type="submit" class="btn btn-dark ms-2">確認修改</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
