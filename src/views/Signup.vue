<script setup lang="ts" name="Signup">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerUser } from "@/firebase";
import type { FirebaseError } from "firebase/app";
import defaultUserPic from "@/assets/default-user-pic.svg";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref('');
const userPic = ref(defaultUserPic); // 預設的user圖片
const message = ref("請填寫以下資料完成註冊");
const isPasswordVisible = ref(false); // 隱藏/顯示密碼
const strengthPct = ref(0); // 密碼強度
const strengthClass = ref('bg-danger');

// 切換密碼顯示或隱藏
const changePwVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
}

// 檢查密碼強度
const checkPwStrength = () => {
    const value = password.value;
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
            strengthClass.value = "bg-danger";
            break;
        case 2:
        case 3:
            strengthPct.value = 50;
            strengthClass.value = "bg-danger";
            break;
        case 4:
            strengthPct.value = 75;
            strengthClass.value = "bg-info"; // 符合密碼要求
            break;
        case 5:
            strengthPct.value = 100;
            strengthClass.value = "bg-success";
            break;
    }
};

// 註冊
const register = async () => {
    if (strengthPct.value < 75) {
        message.value = "密碼太弱了！";
        return;
    }

    if (password.value !== confirmPassword.value) {
        message.value = "密碼不一致！";
        return;
    }

    if (password.value === confirmPassword.value) {
        const result = await registerUser(username.value, email.value, password.value, userPic.value);

        if (result.success) {
            clearForm();
            router.push({ name: "Login" });
        } else {
            const firebaseError = result.error as FirebaseError;
            switch (firebaseError.code) {
                case "auth/invalid-email":
                    message.value = "請輸入有效的電子郵件";
                    break;
                case "auth/email-already-in-use":
                    message.value = "該電子郵件已被註冊";
                    break;
                case "auth/timeout":
                    message.value = "請求超時，請稍後再試";
                    break;
                case "auth/too-many-requests":
                    message.value = "請求次數過多，請稍後再試";
                    break;
                default:
                    message.value = "發生錯誤，請稍後再試";
                    break;
            }
        }
    }
};

// 清空表單
const clearForm = () => {
    username.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
}

</script>

<template>
    <div class="bg-dark bg-gradient min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container px-3 ">
            <div class="text-center m-3"><img src="@/assets/logo.png" alt="logo" width="250px"></div>
            <form class="mx-auto col-lg-8 col-xl-6 bg-light py-5 px-4 px-sm-5 rounded shadow-lg"
                @submit.prevent="register">
                <div class="text-center mb-4">
                    <h2 class="fw-bold">建立新帳號</h2>
                    <p class="text-muted mt-3">{{ message }}</p>
                </div>
                <div class="form-floating mb-4">
                    <input type="text" class="form-control" placeholder="name@example.com" v-model="username" required>
                    <label class="text-muted">使用者名稱</label>

                </div>
                <div class="form-floating mb-4">
                    <input type="email" class="form-control" placeholder="name@example.com" v-model="email" required>
                    <label class="text-muted">電子郵件</label>
                </div>

                <div class="form-floating mb-4 position-relative">
                    <input :type="isPasswordVisible ? 'text' : 'password'" class="form-control" placeholder="Password"
                        v-model="password" @input="checkPwStrength" required>
                    <label class="text-muted">密碼</label>
                    <div class="form-text">密碼至少 8 個字符，並包含數字和大小寫字母</div>
                    <div class="progress mt-3">
                        <div class="progress-bar" :class="strengthClass" :style="{ width: strengthPct + '%' }">
                        </div>
                    </div>
                    <button type="button" class="btn border-0 position-absolute end-0 top-0 me-2 mt-2 text-muted"
                        @click="changePwVisibility">
                        <i class="fs-5" :class="isPasswordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                </div>

                <div class="form-floating mb-4">
                    <input type="password" class="form-control" placeholder="confirmPassword" v-model="confirmPassword"
                        required>
                    <label class="text-muted">確認密碼</label>
                </div>
                <button type="submit" class="btn btn-lg btn-dark w-100 mb-4">註冊 </button>
                <div class="d-flex justify-content-center">
                    <p class="my-2 text-muted">已經有帳號了？</p>
                    <button type="button" class="btn btn-sm btn-outline-secondary ms-2">
                        <RouterLink to="/login" class="dropdown-item">
                            立即登入
                        </RouterLink>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
