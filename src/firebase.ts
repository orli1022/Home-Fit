import { initializeApp } from "firebase/app"; 
import { getDoc, getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
};

// 初始化firebase應用
const firebaseApp = initializeApp(firebaseConfig);

// 初始化firestore
const firestore = getFirestore(firebaseApp);

// 初始化storage
const storage = getStorage();

// 初始化auth
const auth = getAuth(firebaseApp);

// 註冊帳號並儲存到firestore
const registerUser = async (username: string, email: string, password: string, userPicUrl: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user

        // 將user的個人資訊儲存到Firestore的users集合中
        await setDoc(doc(firestore, "users", user.uid), {
            uid: user.uid, // Firebase提供的userID
            username: username,
            email: email,
            userPicUrl: userPicUrl,
            WorkoutMonth: new Date().getMonth() + 1,
            workoutDays: [],
            videoList: [],
            planList: [],
            challengeList: []
        });

        // 註冊成功後立即登出
        await signOut(auth);
        return {success: true};
    } catch (error) {
        return {success: false, error: error};
    }
};

// 獲取user資料
const fetchUserData = async (user: User) => {
    try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            // 返回user資料
            return userDoc.data();
        }
    } catch (error) {
        console.log("Error fetching user data:", error);
    }
}

// 取得當前user資料
const getUserDocRef = () => {
    const user = auth.currentUser; // 獲取當前用戶
    return user ? doc(firestore, "users", user.uid) : null;
};

// 儲存到firestore
const saveToFirestore = async (updateData: object) => {
    const userDocRef = getUserDocRef();
    if (userDocRef) {
        try {
            await setDoc(userDocRef, updateData, { merge: true });
        } catch (error) {
            console.error("儲存到 Firestore 失敗:", error);
        }
    }
};

export { firebaseApp, firestore, storage, auth, registerUser, fetchUserData, getUserDocRef, saveToFirestore };
