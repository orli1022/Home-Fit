import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { auth, fetchUserData, saveToFirestore } from "@/firebase";

export const useHomeStore = defineStore("home", () => {
    const workoutDays = ref<number[]>([]); // 有打卡的日期
    const daysInMonth = ref<number[]>([]); // 存放當月的天數
    const isTodayWorkout = ref(false); // 今日是否打卡

    // 獲取當前月份的天數 
    const generateDays = () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const days = new Date(year, month, 0).getDate(); // 0會返回最後一天
        for (let i = 1; i <= days; i++) {
            daysInMonth.value.push(i);
        }
    };

    // 今日打卡
    const todayWorkout = async () => {
        const today = new Date().getDate();
        if (!isTodayWorkout.value) {
            workoutDays.value.push(today);
        } else {
            const index = workoutDays.value.indexOf(today);
            if (index !== -1) {
                workoutDays.value.splice(index, 1);
            }
        }
        isTodayWorkout.value = !isTodayWorkout.value;

        await saveToFirestore({ workoutDays: workoutDays.value });
    };

    // 初始化workoutDays
    const initWorkoutDays = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userData = await fetchUserData(user);
                if (userData && userData.workoutDays) {
                    workoutDays.value = userData.workoutDays;

                    const today = new Date().getDate();
                    isTodayWorkout.value = workoutDays.value.includes(today);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    };

    onMounted(() => {
        generateDays();
        initWorkoutDays();
    });

    return {workoutDays, daysInMonth, isTodayWorkout, todayWorkout}
})