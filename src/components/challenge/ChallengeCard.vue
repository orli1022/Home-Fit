<script setup lang="ts" name="ChallengeCard">
import { computed } from "vue";
import ShowChallenge from "@/components/challenge/ShowChallenge.vue";

const props = defineProps({
    challenge: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(["deleteId"]);

// 存放要被刪除的challengeId
const deleteChallenge = (id: number) => {
    const deleteId = id;
    emit("deleteId", deleteId);
}
// 顯示challenge content的換行
const contentLines = computed(() => {
    return props.challenge.content.split('\n');
});
</script>

<template>
    <div v-if="challenge" class="col">
        <div class="card border-4 mb-3 h-100" :class="{ 'border-danger': challenge.isSuccessful }">
            <div class="card-header d-flex justify-content-between">
                <h4 class="m-0 py-1">{{ challenge.name }}</h4>
                <button class="btn-close my-auto" @click="deleteChallenge(challenge.id)"></button>
            </div>
            <div class="card-body text-center">
                <div class="card-text">
                    <span v-for="(line, index) in contentLines" :key="index">
                        {{ line }}<span v-if="index < contentLines.length - 1"><br></span>
                    </span>
                </div>
            </div>
            <div class="card-footer border-0 bg-white mx-auto">
                <button class="btn btn-secondary" data-bs-toggle="modal"
                    :data-bs-target="'#showModal' + challenge.id">查看挑戰</button>
            </div>
        </div>
        <div class="modal fade" tabindex="-1" role="dialog" :id="'showModal' + challenge.id" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <ShowChallenge :challenge="challenge"></ShowChallenge>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
