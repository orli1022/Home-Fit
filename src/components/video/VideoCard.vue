<script setup lang="ts" name="VideoCard">
import { ref } from "vue";
import { useAddVideoStore } from "@/stores/addVideo";

defineProps({
    video: {
        type: Object,
        default: () => ({})
    }
})

const addVideoStore = useAddVideoStore();
const emit = defineEmits();

const chooseType = ref("");

// 存放要被刪除的videoId
const deleteVideo = (id: string) => {
    const deleteId = id;
    emit("deleteVideo", deleteId);
}

// 選擇類別
const selectType = (id: number, type: string) => {
    chooseType.value = type;
    addVideoStore.updateType(id, chooseType.value);
}
</script>

<template>
    <div class="col">
        <div class="card h-100">
            <iframe :src="`https://www.youtube.com/embed/${video.videoId}`" class="card-img-top" frameborder="0"
                allow="autoplay; encrypted-media"></iframe>
            <p class="ms-2 mb-0 pt-3" :class="{ 'text-white': video.type == '', 'text-muted': video.type }"><i
                    class="bi bi-caret-right me-2"></i>{{
                        video.type }}</p>
            <div class="card-body d-flex justify-content-end">
                <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                    分類
                </button>
                <div class="dropdown-menu">
                    <button class="dropdown-item" @click="selectType(video.id, '瑜珈拉筋')">瑜珈拉筋</button>
                    <button class="dropdown-item" @click="selectType(video.id, '有氧訓練')">有氧訓練</button>
                    <button class="dropdown-item" @click="selectType(video.id, '高強度間歇訓練')">高強度間歇訓練</button>
                    <button class="dropdown-item" @click="selectType(video.id, '力量訓練-上肢')">力量訓練-上肢</button>
                    <button class="dropdown-item" @click="selectType(video.id, '力量訓練-下肢')">力量訓練-下肢</button>
                </div>
                <button type="button" class="btn btn-outline-danger ms-3"
                    @click="deleteVideo(video.videoId)">刪除</button>
            </div>
        </div>
    </div>
</template>