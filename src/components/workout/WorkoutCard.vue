<script setup lang="ts" name="WorkoutCard">
import ShowWorkout from "./ShowWorkout.vue";
import { useWorkoutPlanStore } from "@/stores/workoutPlan";

const workoutPlanStore = useWorkoutPlanStore();
defineProps({
    plan: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(["favoriteId", "deleteId"]);

// 是否收藏plan, 存放收藏的planId
const changeFavorite = (id: number) => {
    workoutPlanStore.planFavorite(id);
    emit("favoriteId", id);

}

// 存放要被刪除的planId
const deletePlan = (id: number) => {
    const deleteId = id;
    emit("deleteId", deleteId);
}
</script>

<template>
    <div v-if="plan" class="col">
        <div class="card border-4 mb-3 h-100">
            <div class="card-header d-flex justify-content-between">
                <h5 class="m-0 py-1"><i class="fs-3 bi text-secondary" :class="[plan.icon]"></i></h5>
                <button class="btn-close my-auto" @click="deletePlan(plan.id)"></button>
            </div>
            <div class="p-4 text-center">
                <div class="card-text">
                    <h4 class="mb-0">{{ plan.name }}</h4>
                </div>
            </div>
            <div class="card-footer border-0 bg-white d-flex justify-content-center">
                <button class="custom-btn btn btn-outline-warning me-3" @click="changeFavorite(plan.id)"><i class="bi"
                        :class="{ 'bi-star-fill': plan.isFavorite, 'bi-star': !plan.isFavorite }"></i>
                    收藏</button>
                <button class="btn btn-secondary" data-bs-toggle="modal"
                    :data-bs-target="'#showModal' + plan.id">查看挑戰</button>
            </div>
        </div>
        <div class="modal fade" tabindex="-1" role="dialog" :id="'showModal' + plan.id" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <ShowWorkout :plan="plan"></ShowWorkout>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-btn:hover {
    color: white;
}
</style>
