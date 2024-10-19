<script setup lang="ts" name="UserProfile">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, fetchUserData } from "@/firebase";

const router = useRouter();

const username = ref("");
const email = ref("");
const userPic = ref("");

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

</script>

<template>
    <div class="container min-vh-100 d-flex justify-content-center align-items-center">
        <div class="card col-12 col-lg-8 col-xl-6 text-center py-5 px-4 bg-dark text-light border-light border-3">
            <div class="mt-3">
                <img :src="userPic" class="rounded-circle border border-secondary border-5 mb-3" alt="userPic"
                    style="width: 150px; height: 150px;">
                <h3>{{ username }}</h3>
            </div>
            <div class="card-body">
                <!-- <h5 class="card-title">Card title</h5> -->
                <p class="card-text mb-5">Email: {{ email }}</p>
                <button class="btn btn-lg btn-light w-100 mb-3"><i class="bi bi-pencil-square"></i> 修改個人資料</button>
                <button class="btn btn-lg btn-danger w-100" @click="logout"><i class="bi bi-box-arrow-right"></i>
                    登出</button>
            </div>
        </div>
    </div>

</template>

<style scoped></style>
