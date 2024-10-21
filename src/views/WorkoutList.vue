<script setup lang="ts" name="WorkoutList">
import { ref, computed, watchEffect } from "vue";
import WorkoutCard from "@/components/workout/WorkoutCard.vue";
import { useWorkoutPlanStore } from "@/stores/workoutPlan";

const workoutPlanStore = useWorkoutPlanStore();

const showAll = ref(true);
const message = ref("");

// 分類planList
const categoryList = computed(() => {
    return showAll.value ? workoutPlanStore.planList : workoutPlanStore.favoriteList;
})

// 選擇類別
const changeSelect = (value: boolean) => {
    showAll.value = value;
}

// 刪除課表
const deleteData = (id: number) => {
    workoutPlanStore.removePlan(id);
}

// 檢查是否有課表, 並更新message
watchEffect(() => {
    if (workoutPlanStore.planList.length === 0) {
        message.value = "這裡還沒有課表，快去創建吧！";
    }
    else if (!showAll.value && workoutPlanStore.planList.length > 0 && workoutPlanStore.favoriteList.length === 0) {
        message.value = "沒有收藏的課表喔！";
    }
    else {
        message.value = "";
    }
})
</script>

<template>
    <div class="container p-5 min-vh-100 position-relative">
        <div>
            <h1 class="text-center mb-5 pb-3 border-bottom">課表總覽</h1>
            <div class="btn-group d-flex d-lg-block" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-secondary" :class="{ 'active': showAll }"
                    @click="changeSelect(true)"><i class="bi bi-list me-1"></i>所有課表</button>
                <button type="button" class="btn btn-outline-secondary" :class="{ 'active': !showAll }"
                    @click="changeSelect(false)"><i class="bi bi-star me-1"></i>我的收藏</button>
            </div>
        </div>

        <div class="text-center position-absolute top-50 start-0 end-0">
            <h3 class="text-secondary">{{ message }}</h3>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-5 g-md-4 mx-auto mt-3 mb-5 mt-md-5">
            <WorkoutCard v-for="plan in categoryList" :key="plan.id" :plan="plan" @deleteId="deleteData"
                @favoriteId="watchEffect">
            </WorkoutCard>
        </div>

        <div class="text-center position-absolute mx-auto start-0 end-0" style="bottom: 25px;">
            <button type="button" class="btn btn-outline-secondary btn-lg">
                <RouterLink to="/createWorkout" class="dropdown-item">創建課表
                    <i class="bi bi-arrow-right ms-1"></i>
                </RouterLink>
            </button>
        </div>
    </div>
</template>
