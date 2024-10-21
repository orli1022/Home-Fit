<script setup lang="ts" name="App">
import { ref, onMounted } from "vue";
import { RouterView } from "vue-router";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/home/Navbar.vue";
import BottomBar from "@/components/home/BottomBar.vue";

const isAuthenticated = ref(false); // 儲存user是否登入

// 監聽登入狀態
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
    }
  });
});
</script>

<template>
  <!-- 沒有登入則顯示登入或註冊頁面 -->
  <RouterView v-if="!isAuthenticated"></RouterView>

  <div v-else>
    <header>
      <Navbar />
    </header>
    <main class="text-light" style="background-color:#1c1c1e">
      <RouterView />
    </main>
    <footer class="bg-dark">
      <BottomBar />
    </footer>
  </div>
</template>