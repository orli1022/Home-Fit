import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { auth, fetchUserData, saveToFirestore } from "@/firebase";

interface Course {
    courseId: number;
    videoId: string
}

interface Plan {
    id: number;
    name: string;
    icon: string;
    monday: Course[];
    tuesday: Course[];
    wednesday: Course[];
    thursday: Course[];
    friday: Course[];
    saturday: Course[];
    sunday: Course[];
    isFavorite: boolean;
}

export const useWorkoutPlanStore = defineStore("workoutPlan", () => {
    type WeekdayType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    const planList = ref<Plan[]>([]);
    const planData = ref<Plan>({
        id: 0,
        name: "",
        icon: "",
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
        isFavorite: false
    })

    // 初始化planList
    const initPlanList = async () => {
        const user = auth.currentUser;
        if (user) {
            const userData = await fetchUserData(user);
            if (userData && userData.planList) {
                planList.value = userData.planList;
            }
        }
    }
    
    onMounted(()=> {
        initPlanList();
    })

    const favoriteList = computed(() => {
        return planList.value.filter(plan => plan.isFavorite);
    });

    // 新增課程
    const newCourse = (weekday: WeekdayType, newCourseItem: Course) => {
        if (planData.value[weekday] === null) {
            planData.value[weekday] = []; // 初始化
        }
        planData.value[weekday].push(newCourseItem);
    }

    // 更換影片
    const updateVideo = (weekday: WeekdayType, courseIndex: number, newVideo: string) => {
        planData.value[weekday][courseIndex].videoId = newVideo;
    }

    // 刪除課程
    const removeCourse = (weekday: WeekdayType, courseIndex: number) => {
        planData.value[weekday].splice(courseIndex, 1);
    }

    // 創建課表
    const newPlan = async () => {
        // 避免改寫到儲存的內容
        const newPlanItem = {
            id: planList.value.length + 1,
            name: planData.value.name,
            icon: planData.value.icon,
            monday: planData.value.monday,
            tuesday: planData.value.tuesday,
            wednesday: planData.value.wednesday,
            thursday: planData.value.thursday,
            friday: planData.value.friday,
            saturday: planData.value.saturday,
            sunday: planData.value.sunday,
            isFavorite: planData.value.isFavorite
        };

        // 更新本地狀況
        planList.value.unshift(newPlanItem);

        // 更新firestore資料
        await saveToFirestore({planList: planList.value});

        // 重置
        resetData();
    }

    const resetData = () => {
        planData.value = {
            id: 0,
            name: "",
            icon: "",
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
            isFavorite: false
        };
    };

    // 刪除課表
    const removePlan = async (id: number) => {
        const planIndex = planList.value.findIndex(plan => plan.id === id);
        if (planIndex !== -1) {
            // 更新本地資料
           planList.value.splice(planIndex, 1);

            // 更新firestore資料
            await saveToFirestore({planList: planList.value});

        }
    }

    // 修改課表
    const editPlan = async (planIndex: number, updatedPlan: Plan) => {
        if (planIndex !== -1) {
            // 更新本地資料
            planList.value[planIndex] = updatedPlan;

            // 更新firestore資料
            await saveToFirestore({planList: planList.value});
        }    
    }

    // 是否收藏課表
    const planFavorite = async (id: number) => {
        const planIndex = planList.value.findIndex(plan => plan.id === id);
        if (planIndex !== -1) {
            // 更新本地資料
            planList.value[planIndex].isFavorite = !planList.value[planIndex].isFavorite;

            // 更新firestore資料
            await saveToFirestore({planList: planList.value});
         }
    }

    return {planList, planData, favoriteList, newCourse, updateVideo, removeCourse, newPlan, removePlan, planFavorite, editPlan}
})

