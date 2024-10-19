<script setup lang="ts" name="VideoList">
import { ref, computed } from "vue";
import AddVideo from "./AddVideo.vue";
import VideoCard from "./VideoCard.vue";
import { useAddVideoStore } from "@/stores/addVideo";

const addVideoStore = useAddVideoStore();

const activeSlot = ref("slotWorkoutPlan");

let selectType = ref("全部");

// 分類videoList
const categoryList = computed(() => {
    switch (selectType.value) {
        case "瑜珈拉筋":
            return addVideoStore.yogaList;
        case "有氧訓練":
            return addVideoStore.cardioList;
        case "高強度間歇訓練":
            return addVideoStore.hiitList;
        case "力量訓練-上肢":
            return addVideoStore.upperList;
        case "力量訓練-下肢":
            return addVideoStore.lowerList;
        default:
            return addVideoStore.videoList;
    }
});

// 選擇類別
const changeSelectText = (text: string) => {
    selectType.value = text;
};

// 刪除video
const removeVideo = (id: number) => {
    const videoId = id;
    addVideoStore.deleteVideo(videoId);
}

</script>

<template>
    <slot name="slotVideoList">
        <div class="container p-5 min-vh-100  position-relative">
            <AddVideo />
            <div class="my-5">
                <div class="btn-group d-flex d-lg-block" role="group" aria-label="Basic outlined example">
                    <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                        {{ selectType }}
                    </button>
                    <div class="dropdown-menu">
                        <button class="dropdown-item" @click="changeSelectText('全部')">全部</button>
                        <button class="dropdown-item" @click="changeSelectText('瑜珈拉筋')">瑜珈拉筋</button>
                        <button class="dropdown-item" @click="changeSelectText('有氧訓練')">有氧訓練</button>
                        <button class="dropdown-item" @click="changeSelectText('高強度間歇訓練')">高強度間歇訓練</button>
                        <button class="dropdown-item" @click="changeSelectText('力量訓練-上肢')">力量訓練-上肢</button>
                        <button class="dropdown-item" @click="changeSelectText('力量訓練-下肢')">力量訓練-下肢</button>
                    </div>
                </div>
            </div>

            <div v-if="addVideoStore.videoList.length <= 0" class="text-center position-absolute top-50 start-0 end-0">
                <h3 class="text-secondary">尚未加入任何影片</h3>
            </div>
            <div v-else-if="categoryList.length <= 0" class="text-center position-absolute top-50 start-0 end-0">
                <h3 class="text-secondary">該分類暫無影片</h3>
            </div>

            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-5 g-md-4 mx-auto my-3 my-md-5">
                <VideoCard v-for="(video, index) in categoryList" :key="index" :video="video"
                    @deleteVideo="removeVideo(video.id)">
                </VideoCard>
            </div>
        </div>
    </slot>

</template>

<style scoped></style>
