import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { auth, fetchUserData, saveToFirestore } from "@/firebase";

interface Challenge {
    id: number;
    name: string;
    content: string;
    days: number;
    workoutDays: number;
    videoId: string;
    isSuccessful: boolean
}

export const useCreateChallengeStore = defineStore("createChallenge", () => {
    const challengeList = ref<Challenge[]>([]);
    const challengeData = ref<Challenge>({
        id: 0,
        name: "",
        content: "",
        days: 5,
        workoutDays: 0,
        videoId: "",
        isSuccessful: false
    })

    // 初始化challengeList
    const initChallengeList = async () => {
        const user = auth.currentUser;
        if (user) {
            const userData = await fetchUserData(user);
            if (userData && Array.isArray(userData.challengeList)) {
                challengeList.value = userData.challengeList;
            } else {
                challengeList.value = []; // 如果不是數組，重置為空數組
            }
        }
    };
    
    onMounted(()=> {
        initChallengeList();
    })

    const successfulList = computed(() => {
        return challengeList.value.filter(challenge => challenge.isSuccessful);
    });

    // 建立挑戰
    const newChallenge = async () => {
        // 避免改寫到儲存的內容
        const newChallengeItem = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: challengeData.value.name,
            content: challengeData.value.content,
            days: challengeData.value.days,
            workoutDays: 0,
            videoId: challengeData.value.videoId,
            isSuccessful: false
        };

        // 更新本地狀況
        challengeList.value.unshift(newChallengeItem);

        // 更新firestore資料
        await saveToFirestore({challengeList: challengeList.value});

        // 重置
        resetData();
    }

    const resetData = () => {
        challengeData.value = {
            id: 0,
            name: "",
            content: "",
            days: 5,
            workoutDays: 0,
            videoId: "",
            isSuccessful: false
        };
    };

    // 修改挑戰
    const updateChallenge =  async (updatedChallenge: Challenge) => {
        const challengeIndex = challengeList.value.findIndex(challenge => challenge.id === updatedChallenge.id);
        if (challengeIndex !== -1) {
            // 更新本地資料
            challengeList.value[challengeIndex] = updatedChallenge;

            // 確認打卡進度
            if (challengeList.value[challengeIndex].workoutDays >= challengeList.value[challengeIndex].days) {
                challengeList.value[challengeIndex].isSuccessful = true;
            }

            // 更新firestore資料
            await saveToFirestore({ challengeList: challengeList.value });
        }
    }

    // 刪除挑戰
    const deleteChallenge = async (id: number) => {
        const challengeIndex = challengeList.value.findIndex(challenge => challenge.id === id);
        if (challengeIndex !== -1) {
            // 更新本地資料
            challengeList.value.splice(challengeIndex, 1);

            // 更新firestore資料
            await saveToFirestore({ challengeList: challengeList.value });
        }
    }

    // 紀錄挑戰天數
    const increaseWorkoutDays = async (id: number) => {
        const challengeIndex = challengeList.value.findIndex(challenge => challenge.id === id);
        if (challengeIndex !== -1) {
            const currentChallenge = challengeList.value[challengeIndex];
            // 更新本地資料
            challengeList.value[challengeIndex].workoutDays ++;

            // 確認打卡進度
            if (challengeList.value[challengeIndex].workoutDays >= challengeList.value[challengeIndex].days) {
                challengeList.value[challengeIndex].isSuccessful = true;
            }

            // 更新firestore資料
            await saveToFirestore({ challengeList: challengeList.value });
        }
    }

    return {challengeList, challengeData, successfulList, newChallenge, updateChallenge, deleteChallenge, increaseWorkoutDays}
})

