<script setup lang="ts" name="CreateChallenge">
import { ref } from "vue";
import ChooseVideoModal from "@/components/video/ChooseVideoModal.vue";
import { useCreateChallengeStore } from "@/stores/createChallenge";

const createChallengeStore = useCreateChallengeStore();

const challengeName = ref("");
const challengeContent = ref("");
const challengeDays = ref(5);
const chooseId = ref("");
const isVisible = ref(false);

// 更新選擇影片的id
const handleData = (id: string) => {
    chooseId.value = id;
}

// 清除所選影片
const deleteVideo = () => {
    chooseId.value = "";
}

// 清空表單
const clearForm = () => {
    challengeName.value = "";
    challengeContent.value = "";
    challengeDays.value = 5;
    chooseId.value = "";
}

// 顯示成功訊息
const showMessage = () => {
    isVisible.value = true;
    setTimeout(() => {
        isVisible.value = false;
    }, 2000);
};

// 建立challenge
const submitChallenge = () => {
    createChallengeStore.challengeData.name = challengeName.value;
    createChallengeStore.challengeData.content = challengeContent.value;
    createChallengeStore.challengeData.days = challengeDays.value;
    createChallengeStore.challengeData.videoId = chooseId.value;

    // 新增newChallenge
    createChallengeStore.newChallenge();

    clearForm();
    showMessage();
}
</script>

<template>
    <div class="container p-5">
        <div>
            <h1 class="text-center mb-5 pb-3 border-bottom">發起挑戰</h1>
        </div>
        <div class="row justify-content-center">
            <form class="col-12 col-md-8 col-lg-6" @submit.prevent="submitChallenge">
                <div class="mb-3">
                    <label for="challengeName" class="form-label">挑戰名稱</label>
                    <input type="text" class="form-control" id="challengeName" v-model="challengeName" required>
                </div>
                <div class="mb-3">
                    <label for="challengeContent" class="form-label">挑戰事項</label>
                    <textarea class="form-control" id="challengeContent" rows="3" v-model="challengeContent"
                        required></textarea>
                </div>
                <div class="mb-3">
                    <label for="challengeDays" class="form-label">挑戰天數</label>
                    <select class="form-select" id="challengeDays" v-model="challengeDays">
                        <option value="5" selected>5 天</option>
                        <option value="7">7 天</option>
                        <option value="10">10 天</option>
                        <option value="14">14 天</option>
                        <option value="21">21 天</option>
                        <option value="28">28 天</option>
                        <option value="30">30 天</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="chooseVideo" class="form-label">選擇挑戰影片</label>
                    <button type="button" class="btn btn-outline-primary form-control" data-bs-toggle="modal"
                        data-bs-target="#videoListModal">
                        影片清單
                    </button>
                </div>
                <div v-if="chooseId" class="custom-width mx-auto">
                    <div class="card mt-5">
                        <div class="card-header d-flex justify-content-between">
                            <p class="m-0">已選擇的影片</p>
                            <button type="button" class="btn-close" @click="deleteVideo"></button>
                        </div>
                        <div class="card-body p-0">
                            <iframe :src="`https://www.youtube.com/embed/${chooseId}`" class="card-img-top"
                                frameborder="0" allow="autoplay; encrypted-media"></iframe>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-end my-5">
                    <button type="reset" class="btn btn-dark" @click="clearForm">清除表單</button>
                    <button type="submit" class="btn btn-dark ms-4">建立挑戰</button>
                </div>
                <p class="text-transition text-center fw-bold" :class="{ 'text-light': isVisible }"
                    style="color: rgba(0, 0, 0, 0);">
                    挑戰建立成功，快去查看吧！</p>
            </form>
        </div>
        <div class="text-center mt-5">
            <button type="button" class="btn btn-outline-secondary btn-lg">
                <RouterLink to="/challengeList" class="dropdown-item">挑戰清單
                    <i class="bi bi-arrow-right ms-1"></i>
                </RouterLink>
            </button>

        </div>
        <ChooseVideoModal @updateId="handleData"></ChooseVideoModal>
    </div>
</template>

<style scoped>
.text-transition {
    transition: color 0.3s ease;
}

.custom-width {
    width: 75%;
}

@media (max-width: 576px) {
    .custom-width {
        width: 100%;
    }
}

@media (min-width: 1200px) {
    .custom-width {
        width: 50%;
    }
}
</style>
