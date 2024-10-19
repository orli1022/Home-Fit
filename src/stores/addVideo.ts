import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { auth, fetchUserData, saveToFirestore } from "@/firebase";

interface Video {
    id: number;
    videoId: string;
    type: string;
}

export const useAddVideoStore = defineStore("addVideo", () => {
    const videoList = ref<Video[]>([]);
    const videoData = ref<Video>({
        id: 0,
        videoId: "",
        type: ""
    })

    // 初始化videoList
    const initVideoList = async () => {
        const user = auth.currentUser;
        if (user) {
            const userData = await fetchUserData(user);
            if (userData && userData.videoList) {
                videoList.value = userData.videoList;
            }
        }
    }
    
    onMounted(()=> {
        initVideoList();
    })

    const yogaList = computed(() => {
        return videoList.value.filter(video => video.type === "瑜珈拉筋");
    });

    const cardioList = computed(() => {
        return videoList.value.filter(video => video.type === "有氧訓練");
    });

    const hiitList = computed(() => {
        return videoList.value.filter(video => video.type === "高強度間歇訓練");
    });

    const upperList = computed(() => {
        return videoList.value.filter(video => video.type === "力量訓練-上肢");
    });
    const lowerList = computed(() => {
        return videoList.value.filter(video => video.type === "力量訓練-下肢");
    });

    // 新增video
    const newVideo = async () => {
        // 避免改寫到儲存的內容
        const newVideoItem = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            videoId: videoData.value.videoId,
            type: videoData.value.type
        };

        // 更新本地狀況
        videoList.value.push(newVideoItem);

        // 更新firestore資料
        await saveToFirestore({videoList: videoList.value});

        // 重置
        resetData();
    }

    const resetData = () => {
        videoData.value = {
            id: 0,
            videoId: "",
            type: ""
        };
    };

    // 刪除video
    const deleteVideo = async (id: number) => {
        const videoIndex = videoList.value.findIndex(video => video.id === id);
        if (videoIndex !== -1) {
            // 更新本地狀況
            videoList.value.splice(videoIndex, 1);

            // 更新firestore資料
            await saveToFirestore({videoList: videoList.value});
        }
    }

    // 更新分類
    const updateType = async (id: number, newType: string) => {
        const videoIndex = videoList.value.findIndex(video => video.id === id);
        if (videoIndex !== -1) {
            // 更新本地狀況
            videoList.value[videoIndex].type = newType;
            
            // 更新firestore資料
            await saveToFirestore({videoList: videoList.value});
        }
    }
    
    return {videoList, videoData, yogaList, cardioList, hiitList, upperList, lowerList, newVideo, deleteVideo, updateType}
})