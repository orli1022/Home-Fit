<script setup lang="ts" name="ShowChallenge">
import { onMounted, ref, computed } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { Modal } from "bootstrap";
import { useCreateChallengeStore } from "@/stores/createChallenge";

const router = useRouter();
const createChallengeStore = useCreateChallengeStore();

// 當前的challenge
const props = defineProps({
    challenge: {
        type: Object,
        default: () => ({})
    }
});

const isSuccessful = ref(props.challenge.isSuccessful);
const message = ref("");

// 顯示challenge content的換行
const contentLines = computed(() => {
    return props.challenge.content.split('\n');
});

// 紀錄挑戰天數
const addDay = (id: number) => {
    if (props.challenge.workoutDays < props.challenge.days) {
        createChallengeStore.increaseWorkoutDays(id);
        message.value = `已經完成了${props.challenge.workoutDays}天啦！繼續保持！`;
    }
    if (props.challenge.workoutDays >= props.challenge.days) {
        message.value = "恭喜！完成挑戰！";
        isSuccessful.value = true;
    }
}

// 修改challenge
const editChallenge = (id: number) => {
    router.push({ name: "EditChallenge", params: { id: id } });
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

onMounted(() => {
    message.value = "別忘了今天的挑戰喔，加油！";
    if (props.challenge.workoutDays >= props.challenge.days) {
        message.value = "恭喜！完成挑戰！";
        isSuccessful.value = true;
    }
})

</script>

<template>
    <div v-if="challenge" class="card bg-dark">
        <div class="card-header p-3 d-flex justify-content-between bg-light">
            <h3 class="fw-bold m-0">{{ challenge.name }}</h3>
            <button type="button" class="btn-close my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="card-body p-0 text-light">
            <div class="p-4 border-bottom">
                <h6 class="fw-bold mb-3 section-title">
                    <i class="bi bi-list-check me-2"></i>挑戰事項
                </h6>
                <div>
                    <span v-for="(line, index) in contentLines" :key="index">
                        {{ line }}<span v-if="index < contentLines.length - 1"><br></span>
                    </span>
                </div>
            </div>

            <div v-if="challenge.videoId">
                <div class="p-4 border-bottom">
                    <h6 class="fw-bold mb-3 section-title ">
                        <i class="bi bi-play-circle me-2"></i>挑戰影片
                    </h6>
                    <div class="ratio ratio-16x9 rounded overflow-hidden w-75 mx-auto ">
                        <iframe :src="`https://www.youtube.com/embed/${challenge.videoId}`" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>
                    </div>
                </div>
            </div>

            <div class="p-4 border-bottom">
                <h6 class="fw-bold mb-3 section-title">
                    <i class="bi bi-calendar-event me-2"></i>挑戰天數
                </h6>
                <div class="text-center pt-3 pb-4 px-4">
                    <h5 class="py-3 bg-secondary bg-opacity-50 rounded">{{ message }}</h5>
                </div>
                <div class="d-flex align-item-center">
                    <div class="text-center fw-bold my-auto" style="font-size: 75px;">
                        <span>{{ challenge.workoutDays }}/</span>
                        <span style="font-size: 40px;">{{ challenge.days }}</span>
                    </div>
                    <div class="row my-auto me-0 ms-4 mx-sm-5 w-50">
                        <div class="col-2" v-for="(_, index) in Array.from({ length: challenge.days })" :key="index">
                            <div class="d-flex m-1 justify-content-center align-items-center border p-2"
                                :class="{ 'bg-warning': index < challenge.workoutDays }">
                            </div>
                        </div>
                    </div>

                </div>
                <div v-if="!isSuccessful" class="text-center my-4">
                    <button type="button" class="btn btn-light" @click="addDay(challenge.id)">
                        <i class=" bi bi-check2-circle"></i> 打卡
                    </button>
                </div>
            </div>
        </div>
        <div class="card-header p-4 d-flex justify-content-end">
            <div>
                <button v-if="!isSuccessful" type="button" class="btn btn-outline-light"
                    @click="editChallenge(challenge.id)">
                    <i class="bi bi-pencil"></i> 修改
                </button>
                <button type="button" class="btn btn-outline-light ms-3">
                    <i class="bi bi-share"></i> 分享
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
