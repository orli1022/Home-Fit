<script setup lang="ts" name="AddVideo">
import { ref } from "vue";
import { useAddVideoStore } from "@/stores/addVideo";

const addVideoStore = useAddVideoStore();

const inputUrl = ref("");

// 解析youtube影片網址, 找出videoId
function parseUrl(videoUrl: string) {
    const url = new URL(videoUrl);
    const params = new URLSearchParams(url.search);
    return params.get("v");
}

// 新增video
const addVideo = () => {
    const videoId = parseUrl(inputUrl.value);
    if (videoId) {
        addVideoStore.videoData.videoId = videoId;
        addVideoStore.videoData.type = "";
        addVideoStore.newVideo();
    }
    inputUrl.value = ""
}
</script>

<template>
    <div class="input-group mb-3 py-3">
        <input type="text" class="form-control" v-model="inputUrl" placeholder="請輸入Youtube影片連結">
        <button class="btn btn-outline-secondary" type="button" @click="addVideo">新增</button>
    </div>
</template>

<style scoped></style>