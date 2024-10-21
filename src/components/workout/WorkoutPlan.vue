<script setup lang="ts" name="WorkoutPlan">
import { ref } from "vue";
import ChooseVideoModal from "@/components/video/ChooseVideoModal.vue";
import { useWorkoutPlanStore } from "@/stores/workoutPlan";

const workoutPlanStore = useWorkoutPlanStore();
const activeSlot = ref("slotWorkoutPlan");

type WeekdayType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

const planName = ref("宅運動課表");
const selectIcon = ref("bi-pin-angle-fill");
const weekDaysTitle = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const weekDaysName: WeekdayType[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const currentDay = ref<WeekdayType>("monday"); // 當前選擇星期幾
const chooseVideoId = ref(""); // 當前選擇的videoId
const currentCourseIndex = ref(); // 當前需更新的課程index
const isUpdating = ref(false); // 判斷是新增課程還是更新影片
const isVisible = ref(false);

// 選擇icon
const changeSelectIcon = (icon: string) => {
    selectIcon.value = icon;
};

// 更新選擇影片的id
const videoData = (id: string) => {
    chooseVideoId.value = id;
    if (isUpdating.value) { // 更換影片
        changeVideo(currentDay.value, currentCourseIndex.value);
        isUpdating.value = false;
    } else {
        addNewCourse(); // 新增課程
    }
}

// 移除課程
const removeCourse = (day: WeekdayType, courseIndex: number) => {
    workoutPlanStore.removeCourse(day, courseIndex);
}

// 更換影片
const changeVideo = (day: WeekdayType, courseIndex: number) => {
    isUpdating.value = true;
    workoutPlanStore.updateVideo(day, courseIndex, chooseVideoId.value);
}

// 更新選擇的weekday
const chooseDay = (dayIndex: number) => {
    currentDay.value = weekDaysName[dayIndex];
}

// 新增課程
const addNewCourse = () => {
    const newCourseItem = {
        courseId: workoutPlanStore.planData[currentDay.value] ? workoutPlanStore.planData[currentDay.value].length + 1 : 1,
        videoId: chooseVideoId.value
    }
    workoutPlanStore.newCourse(currentDay.value, newCourseItem);
}

// 建立課表
const createPlan = () => {
    workoutPlanStore.planData.name = planName.value;
    workoutPlanStore.planData.icon = selectIcon.value;
    workoutPlanStore.newPlan();
    planName.value = "宅運動課表";
    showMessage();
}

// 顯示成功訊息
const showMessage = () => {
    isVisible.value = true;
    setTimeout(() => {
        isVisible.value = false;
    }, 2000);
};
</script>

<template>
    <slot name="slotWorkoutPlan">
        <div class="pt-5 d-flex flex-column align-items-center">
            <div class="col-12 col-lg-8">
                <div class="card">
                    <div class="card-header bg-primary bg-opacity-75 text-white py-3 d-flex align-items-center">
                        <button class="btn me-3 rounded-circle btn-light text-secondary" data-bs-toggle="dropdown">
                            <i class="bi fs-3" :class="[selectIcon]"></i>
                        </button>
                        <div class="dropdown-menu">
                            <button class="dropdown-item text-secondary"
                                @click="changeSelectIcon('bi-pin-angle-fill')"><i
                                    class="bi bi-pin-angle-fill"></i></button>
                            <button class="dropdown-item text-secondary" @click="changeSelectIcon('bi-bell')"><i
                                    class="bi bi-bell"></i></button>
                            <button class="dropdown-item text-secondary" @click="changeSelectIcon('bi-box2-heart')"><i
                                    class="bi bi-box2-heart"></i></button>
                            <button class="dropdown-item text-secondary"
                                @click="changeSelectIcon('bi-calendar-check')"><i
                                    class="bi bi-calendar-check"></i></button>
                            <button class="dropdown-item text-secondary"
                                @click="changeSelectIcon('bi-exclamation-circle')"><i
                                    class="bi bi-exclamation-circle"></i></button>
                        </div>
                        <h4 class="mb-0 text-center" style="height: 27px;">{{ planName }}
                        </h4>
                    </div>
                    <div class="card-body p-0">
                        <div class="accordion">
                            <div class="accordion-item" v-for="(title, index) in weekDaysTitle" :key="index">
                                <h2 class="accordion-header" :id="'heading' + index + 1">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        :data-bs-target="'#collapse' + index + 1">
                                        <span class="badge bg-dark rounded-circle bg-opacity-25 me-3">{{
                                            workoutPlanStore.planData[weekDaysName[index]].length }} </span>{{ title }}
                                    </button>
                                </h2>
                                <div :id="'collapse' + index + 1" class="accordion-collapse collapse">
                                    <div class="accordion-body pb-0">
                                        <div class="d-flex align-item-center mt-3 mb-4">
                                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal"
                                                data-bs-target="#videoListModal" @click="chooseDay(index)"><i
                                                    class="bi bi-plus-lg"></i>
                                            </button>
                                            <p class="my-auto mx-3">新增課程</p>
                                        </div>

                                        <div
                                            v-if="workoutPlanStore.planData[weekDaysName[index]] && workoutPlanStore.planData[weekDaysName[index]].length > 0">

                                            <div v-for="(course, courseIndex) in workoutPlanStore.planData[weekDaysName[index]]"
                                                :key="courseIndex" class="border-top py-3">
                                                <span class="fs-6 badge bg-primary rounded-circle bg-opacity-25">{{
                                                    courseIndex
                                                    + 1 }}</span>
                                                <div class="ratio ratio-16x9 rounded overflow-hidden w-50 mx-auto mb-3">

                                                    <iframe :src="`https://www.youtube.com/embed/${course.videoId}`"
                                                        frameborder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowfullscreen></iframe>
                                                </div>
                                                <div class="text-center">
                                                    <button type="button"
                                                        class="btn btn-sm btn-outline-secondary me-2 me-sm-3 me-md-4"
                                                        data-bs-toggle="modal" data-bs-target="#videoListModal"
                                                        @click="changeVideo(weekDaysName[index], courseIndex)"><i
                                                            class="bi bi-play-btn"></i>
                                                        更換影片
                                                    </button>
                                                    <button type="button" class="btn btn-sm btn-outline-secondary"
                                                        @click="removeCourse(weekDaysName[index], courseIndex)"><i
                                                            class="bi bi-x-lg"></i>
                                                        刪除課程</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChooseVideoModal @updateId="videoData"></ChooseVideoModal>
            <div class="col-12 col-lg-8 mt-5">
                <div class="d-flex justify-content-center">
                    <input type="text" name="planName" class="form-control w-75 me-3 me-md-5" v-model="planName"
                        placeholder="輸入課表名稱...">
                    <button type="button" class="btn btn-outline-secondary" @click="createPlan">新增</button>
                </div>
                <p class="text-transition text-center fw-bold my-5 " :class="{ 'text-light': isVisible }"
                    style="color: rgba(0, 0, 0, 0);">
                    課表建立成功，快去查看吧！</p>
            </div>
            <div class="text-center">
                <button type="button" class="btn btn-outline-secondary btn-lg">
                    <RouterLink to="/workoutList" class="dropdown-item">課表總覽
                        <i class="bi bi-arrow-right ms-1"></i>
                    </RouterLink>
                </button>
            </div>
        </div>
    </slot>
</template>

<style scoped>
.text-transition {
    transition: color 0.3s ease;
}
</style>
