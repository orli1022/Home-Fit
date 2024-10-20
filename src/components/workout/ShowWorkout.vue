<script setup lang="ts" name="ShowWorkout">
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { Modal } from "bootstrap";

const router = useRouter();


// 當前的plan
const props = defineProps({
    plan: {
        type: Object,
        default: () => ({})
    }
})

type WeekdayType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
const weekDaysTitle = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const weekDaysName: WeekdayType[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// 修改workoutPlan
const editWorkout = (id: number) => {
    router.push({ name: "EditWorkout", params: { id: id } });
}


// 關閉modal
onBeforeRouteLeave((to, from, next) => {
    const modalElement = document.querySelector('.modal.show');
    if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
    next();
});

</script>

<template>
    <div v-if="plan" class="card bg-dark">
        <div class="card-header p-3 d-flex justify-content-between bg-light">
            <h3 class="fw-bold m-0"><i class="fs-3 bi me-3" :class="[plan.icon]"></i>{{ plan.name }}</h3>
            <button type="button" class="btn-close my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="card-body mx-3 mt-5 row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            <div v-for="(day, index) in weekDaysName" :key="index" class="col">
                <div class="card weekday-card">
                    <div class="card-header">{{ weekDaysTitle[index] }}</div>
                    <div class="card-body py-0 d-flex flex-column overflow-auto" v-if="plan[day].length > 0">
                        <div v-for="(course, courseIndex) in plan[day]" :key="courseIndex" class="card-text pt-3 pb-4"
                            :class="{ 'border-bottom': courseIndex !== plan[day].length - 1 }">
                            <span class="badge bg-primary rounded-circle bg-opacity-25">{{ course.courseId }}</span>
                            <div class="ratio ratio-16x9 rounded overflow-hidden w-75 mx-auto">
                                <iframe :src="`https://www.youtube.com/embed/${course.videoId}`" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                    <div v-else class="card-body py-5 d-flex justify-content-center">
                        <p class="my-auto">今日沒有課程</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-header p-4 d-flex justify-content-end">
            <button type="button" class="btn btn-outline-light" @click="editWorkout(plan.id)">
                <i class="bi bi-pencil"></i> 修改
            </button>
        </div>
    </div>

</template>

<style scoped>
@media (min-width: 576px) {
    .weekday-card {
        height: 200px;
    }
}
</style>
