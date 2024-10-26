<script setup lang="ts" name="AddVideo">
import { ref } from "vue";
import { useAddVideoStore } from "@/stores/addVideo";

const addVideoStore = useAddVideoStore();

const inputUrl = ref("");

// 解析youtube影片網址, 找出videoId
function parseUrl(videoUrl: string) {
    const url = new URL(videoUrl);

    // 若為 youtu.be 短連結 (手機版)，則 videoId 是 pathname 的第一部分
    if (url.hostname === "youtu.be") {
        return url.pathname.substring(1);
    }

    // 若為 YouTube shorts 連結 (shorts)，則 videoId 是 pathname 中 "/shorts/" 後的部分
    if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2];
    }

    // 若為標準 YouTube 連結，則從 search params 中取得 videoId
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