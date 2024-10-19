<script setup lang="ts" name="Login">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { FirebaseError } from "firebase/app";
const router = useRouter();

const email = ref("");
const password = ref("");
const message = ref("請輸入您的帳號密碼");
const isPasswordVisible = ref(false);

// 切換密碼顯示或隱藏
const changePwVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
}

// 登入
const login = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

        // 登入成功就跳轉到首頁
        router.push({ name: "Home" })
    } catch (error) {
        const firebaseError = error as FirebaseError;
        switch (firebaseError.code) {
            case "auth/invalid-email":
                message.value = "請輸入有效的電子郵件"
                break
            case "auth/user-not-found":
                message.value = "該電子郵件尚未註冊帳號"
                break
            case "auth/wrong-password":
                message.value = "密碼錯誤"
                break
            case "auth/too-many-requests":
                message.value = "請求次數過多，請稍後再試"
                break
            default:
                message.value = "帳號或密碼錯誤"
                break
        }
    }
}
</script>

<template>
    <div class="bg-dark bg-gradient min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container px-3 ">
            <div class="text-center mt-4 mb-5"><img src="@/assets/logo.png" alt="logo" width="250px"></div>
            <form class="mx-auto col-lg-8 col-xl-6 bg-light p-5 rounded shadow-lg" @submit.prevent="login">
                <div class="text-center mb-4">
                    <h2 class="fw-bold">歡迎回來</h2>
                    <p class="text-muted">{{ message }}</p>
                </div>
                <div class="form-floating mb-4">
                    <input type="email" class="form-control" placeholder="name@example.com" v-model="email" required>
                    <label class="text-muted">帳號</label>
                </div>
                <div class="form-floating mb-4 position-relative">
                    <input :type="isPasswordVisible ? 'text' : 'password'" class="form-control" placeholder="Password"
                        v-model="password" required>
                    <label class="text-muted">密碼</label>
                    <button type="button" class="btn border-0 position-absolute end-0 top-0 me-2 mt-2 text-muted"
                        @click="changePwVisibility">
                        <i class="fs-5" :class="isPasswordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                </div>
                <div class="text-end mb-4">
                    <button type="button" class="btn btn-sm btn-outline-secondary">忘記密碼</button>
                </div>
                <button type="submit" class="btn btn-lg btn-dark w-100 mb-4">登入</button>
                <div class="d-flex justify-content-center">
                    <p class="my-2 text-muted">還沒有帳號嗎？</p>
                    <button type="button" class="btn btn-sm btn-outline-secondary ms-2">
                        <RouterLink to="/signup" class="dropdown-item">
                            立即註冊
                        </RouterLink>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
