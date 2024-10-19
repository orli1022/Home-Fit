<script setup lang="ts" name="ChooseVideoModal">
import { ref, computed } from "vue";
// import { defineEmits } from "vue";
import { useAddVideoStore } from "@/stores/addVideo";
const emit = defineEmits();
const addVideoStore = useAddVideoStore();

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

// 選擇影片
const chooseVideo = (id: string) => {
    const chooseid = id;
    emit("updateId", chooseid);
}

</script>

<template>
    <div class="modal fade" id="videoListModal" tabindex="-1" aria-labelledby="videoListModal" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content text-dark">
                <div class="modal-header">
                    <h5 class="modal-title">選擇影片</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="btn-group mb-4">
                        <button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
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

                    <div v-if="addVideoStore.videoList.length <= 0" class="text-center p-4 m-5">
                        <h3 class="text-secondary pb-5 pt-1">尚未加入任何影片</h3>
                    </div>
                    <div v-else-if="categoryList.length <= 0" class="text-center p-4 m-5">
                        <h3 class="text-secondary pb-5 pt-1">該分類暫無影片</h3>
                    </div>

                    <div class="d-flex overflow-auto">
                        <div class="card me-3 mb-4" style="min-width: 200px;" v-for="(video, index) in categoryList"
                            :key="index">
                            <iframe :src="`https://www.youtube.com/embed/${video.videoId}`" class="card-img-top"
                                frameborder="0" allow="autoplay; encrypted-media"></iframe>
                            <div class="card-body d-flex justify-content-end">
                                <button class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal"
                                    @click="chooseVideo(video.videoId)">
                                    添加
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
