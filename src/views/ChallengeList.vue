<script setup lang="ts" name="ChallengeList">;
import { ref, computed, watchEffect } from "vue";
import ChallengeCard from "@/components/challenge/ChallengeCard.vue";
import { useCreateChallengeStore } from "@/stores/createChallenge";

const createChallengeStore = useCreateChallengeStore();

const showAll = ref(true);
const message = ref("");

// 刪除challenge
const deleteData = (id: number) => {
    createChallengeStore.deleteChallenge(id);
}

// 分類challengeList
const categoryList = computed(() => {
    return showAll.value ? createChallengeStore.challengeList : createChallengeStore.successfulList;
});

// 選擇類別
const changeSelect = (value: boolean) => {
    showAll.value = value;
};

// 檢查是否有challenge, 並更新message
watchEffect(() => {
    if (createChallengeStore.challengeList.length === 0) {
        message.value = "這裡還沒有挑戰，快去創建吧！";
    } else if (!showAll.value && createChallengeStore.challengeList.length > 0 && createChallengeStore.successfulList.length === 0) {
        message.value = "沒有已完成的挑戰喔！";
    } else {
        message.value = "";
    }
});
</script>

<template>
    <div class="container p-5 min-vh-100 position-relative">
        <div>
            <h1 class="text-center mb-5 pb-3 border-bottom">挑戰清單</h1>
            <div class="btn-group d-flex d-lg-block ">
                <button type="button" class="btn btn-outline-secondary" :class="{ 'active': showAll }"
                    @click="changeSelect(true)"><i class="bi bi-list me-1"></i>所有挑戰</button>
                <button type="button" class="btn btn-outline-secondary" :class="{ 'active': !showAll }"
                    @click="changeSelect(false)"><i class="bi bi-check me-1"></i>已完成</button>
            </div>
        </div>
        <div class="text-center position-absolute top-50 start-0 end-0">
            <h3 class="text-secondary">{{ message }}</h3>
        </div>

        <div class="row row-cols-1 row-cols-md-3 row-cols-xl-4 g-5 g-md-4 mx-auto mt-3 mb-5 mt-md-5">
            <ChallengeCard v-for="challenge in categoryList" :key="challenge.id" :challenge="challenge"
                @deleteId="deleteData">
            </ChallengeCard>
        </div>

        <div class="text-center position-absolute mx-auto start-0 end-0" style="bottom: 25px;">
            <button type="button" class="btn btn-outline-secondary btn-lg">
                <RouterLink to="/createChallenge" class="dropdown-item">
                    發起挑戰
                    <i class="bi bi-arrow-right ms-1"></i>
                </RouterLink>
            </button>
        </div>
    </div>
</template>

<style scoped></style>
