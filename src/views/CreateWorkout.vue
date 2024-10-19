<script setup lang="ts" name="CreateWorkout">
import { ref } from "vue";
import WorkoutPlan from "@/components/workout/WorkoutPlan.vue";
import VideoList from "@/components/video/VideoList.vue";

const activePage = ref("workoutPlan");
</script>

<template>
    <div class="container py-5 px-sm-5">
        <div>
            <nav>
                <div class="nav nav-tabs">
                    <button class="nav-link active" data-bs-toggle="tab" @click="activePage = 'workoutPlan'">
                        創建課表
                    </button>
                    <button class="nav-link" data-bs-toggle="tab" @click="activePage = 'videoList'">
                        影片清單</button>
                </div>
            </nav>
            <main>
                <WorkoutPlan v-if="activePage === 'workoutPlan'">
                    <template #slotWorkoutPlan></template>
                </WorkoutPlan>
                <VideoList v-if="activePage === 'videoList'">
                    <template #slotVideoList></template>
                </VideoList>
            </main>
        </div>
    </div>
</template>

<style scoped>
.nav-tabs .nav-link.active {
    color: #000;
}

.nav-tabs .nav-link {
    color: #fff;
}
</style>
