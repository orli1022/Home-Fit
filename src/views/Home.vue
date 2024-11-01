<script setup lang="ts" name="Home">
import { ref, computed, onMounted } from 'vue';
import { onAuthStateChanged } from "firebase/auth";
import { auth, fetchUserData } from "@/firebase";
import { useHomeStore } from "@/stores/home";

const homeStore = useHomeStore();

const username = ref("");
const userPic = ref("");
const message = computed(() => {
    return homeStore.workoutDays.length > 0
        ? `這個月已經運動 ${homeStore.workoutDays.length} 天了，繼續加油吧！`
        : "歡迎來到HomeFit宅運動！今天就開始您的健身之旅吧！"
})

// 組件掛載顯示user資訊
onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await homeStore.checkMonth(); // 檢查月份是否更新
            try {
                const userData = await fetchUserData(user);
                if (userData) {
                    username.value = userData.username;
                    userPic.value = userData.userPicUrl;

                    homeStore.workoutDays = userData.workoutDays;

                    const today = new Date().getDate();
                    homeStore.isTodayWorkout = userData.workoutDays.includes(today);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            homeStore.clearWorkoutDays();
        }
    });
});
</script>

<template>
    <div class="container text-center ">
        <div class="row align-items-center min-vh-100 py-5 px-sm-4 px-md-5">
            <div class="col-12 col-lg-5 ">
                <div class="card bg-transparent border-0 text-light">
                    <img :src="userPic"
                        class="card-img-top rounded-circle img-fluid mx-auto mt-5 border border-secondary border-5"
                        alt="userProfilePic" style="width: 200px; height: 200px;">
                    <div class="card-body">
                        <h2 class="card-title mt-2">
                            {{ username }}
                        </h2>
                        <h5 class="card-text mt-5">
                            <input type="checkbox" class="btn-check" :checked="!homeStore.isTodayWorkout"
                                id="todayCheck" autocomplete="off" @click="homeStore.todayWorkout">
                            <label class="btn btn-outline-secondary btn-lg" for="todayCheck"><i
                                    class="bi bi-check-circle me-1"></i>今日打卡</label><br>
                        </h5>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-7">
                <h2 class="my-5 mx-2">{{ message }}</h2>
                <div class="row m-auto justify-content-center justify-content-md-start">
                    <div v-for="day in homeStore.daysInMonth" :key="day"
                        class="day col-1 m-2 d-flex justify-content-center align-items-center border p-2"
                        :class="{ 'bg-info text-white': homeStore.workoutDays.includes(day) }">
                        {{ day }}
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
@media (max-width:540px) {
    .day {
        width: 43px;
        height: 43px;
    }
}

@media (min-width:541px) {
    .day {
        width: 50px;
        height: 50px;
    }
}
</style>
