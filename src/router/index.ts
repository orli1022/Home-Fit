import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Home from "@/views/Home.vue";
import WorkoutList from "@/views/WorkoutList.vue";
import ChallengeList from "@/views/ChallengeList.vue";
import CreateWorkout from "@/views/CreateWorkout.vue";
import CreateChallenge from "@/views/CreateChallenge.vue";
import UserProfile from "@/views/UserProfile.vue";
import EditChallenge from "@/views/EditChallenge.vue";
import EditWorkout from "@/views/EditWorkout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
      meta: { requiresAuth: true } // 需要登入
    },
    {
      path: "/workoutList",
      component: WorkoutList,
      meta: { requiresAuth: true } // 需要登入
    },
    {
      path: "/challengeList",
      component: ChallengeList,
      meta: { requiresAuth: true } // 需要登入
    },
    {
      path: "/createWorkout",
      component: CreateWorkout,
      meta: { requiresAuth: true } // 需要登入
    },
    {
      path: "/createChallenge",
      component: CreateChallenge,
      meta: { requiresAuth: true } // 需要登入
    },
    {
      path: "/userProfile",
      component: UserProfile,
      meta: { requiresAuth: true } // 需要登入
    },
    {
      path: "/editChallenge/:id",
      name: "EditChallenge",
      component: EditChallenge,
      meta: { requiresAuth: true } // 需要登入
    },
    {
      path: "/editWorkout/:id",
      name: "EditWorkout",
      component: EditWorkout,
      meta: { requiresAuth: true } // 需要登入
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 檢查route是否需要登入
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      // 如果目標route需要登入且未登入，重定向到登入頁面
      next({ name: "Login" });
    } else if ((to.name === "Login" || to.name === "Signup") && user) {
      // 如果已登入且要去登入/註冊頁面，重定向到首頁
      next({ name: "Home" });
    } else {
      // 允許導航
      next();
    }
  });
});

export default router;
