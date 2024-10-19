<script setup lang="ts" name="Home">
import { ref, computed, onMounted } from 'vue';

// 模擬用戶數據
const username = ref('Orli'); // 用戶名
const userProfilePic = ref('https://via.placeholder.com/100'); // 使用者大頭貼 URL
const hello = ref(<string[]>[
    "再堅持一點點，你已經在成功的道路上了！",
    "每一次的挑戰，都是向自己的突破！",
    "持之以恆，才是達成目標的關鍵！",
    "每一次的汗水，都是成功的印記！",
    "做自己的超級英雄，挑戰每一個極限！"]);

const userGreeting = computed(() => {
    return workoutDays.value.length > 0
        ? `${hello.value[Math.floor(Math.random() * 5)]}`
        : `歡迎來到HomeFit宅運動！今天就開始您的健身之旅吧！`;
});

const workoutDays = ref<number[]>([1, 3, 5, 10, 20]); // 有打卡的日期
const daysInMonth = ref<number[]>([]); // 存放當月的天數

// 獲取當前月份的天數
const generateDays = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1; // 當前月份
    const days = new Date(year, month, 0).getDate(); // 取得當月天數
    daysInMonth.value = [];
    for (let i = 1; i <= days; i++) {
        daysInMonth.value.push(i);
    }
};

onMounted(() => {
    generateDays();
});

</script>

<template>
    <div class="container text-center ">
        <div class="row align-items-center min-vh-100 py-5 px-sm-4 px-md-5">
            <div class="col-12 col-lg-5 ">
                <div class="card bg-transparent border-0 text-light">
                    <img :src="userProfilePic" class="card-img-top rounded-circle img-fluid mx-auto mt-5"
                        alt="userProfilePic" style="width: 200px; height: 200px;">
                    <div class="card-body">
                        <h2 class="card-title mt-2">
                            {{ username }}
                        </h2>
                        <h5 class="card-text mt-5">
                            <input type="checkbox" class="btn-check" id="todayCheck" checked autocomplete="off">
                            <label class="btn btn-outline-secondary btn-lg" for="todayCheck"><i
                                    class="bi bi-check-circle me-1"></i>今日打卡</label><br>
                        </h5>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-7">
                <h2 class="my-5 mx-2">{{ userGreeting }}</h2>
                <div class="row m-auto justify-content-center justify-content-md-start">
                    <div v-for="day in daysInMonth" :key="day"
                        class="day col-1 m-2 d-flex justify-content-center align-items-center border p-2"
                        :class="{ 'bg-info text-white': workoutDays.includes(day) }">
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
