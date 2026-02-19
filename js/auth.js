// auth.js
import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================== DOM ==================
const authOverlay = document.getElementById("authOverlay");
const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const toggleAuth = document.getElementById("toggleAuth");
const authForm = document.getElementById("authForm"); // ✅ NEW

const signupFields = document.getElementById("signupFields");
const confirmPassword = document.getElementById("confirmPassword");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Toast
const toast = document.getElementById("toast");

let isLogin = false;

// ================== TOAST ==================
function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// ================== TOGGLE LOGIN / SIGNUP ==================
toggleAuth.onclick = () => {
  isLogin = !isLogin;

  signupFields.style.display = isLogin ? "none" : "block";
  confirmPassword.style.display = isLogin ? "none" : "block";

  authTitle.textContent = isLogin ? "Login to ARIVUM" : "Join ARIVUM";
  authBtn.textContent = isLogin ? "Login" : "Sign Up";
  toggleAuth.textContent = isLogin ? "Sign Up" : "Login";
};

// ================== AUTH SUBMIT (ENTER + CLICK) ==================
authForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // 🔴 important

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showToast("⚠️ Email and password are required", "login");
    return;
  }

  try {
    // ===== LOGIN =====
    if (isLogin) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await loadUser(res.user.uid);

      showToast(
        "👋 Welcome back!\nLet’s continue your learning journey 🚀",
        "login"
      );
      return;
    }

    // ===== SIGNUP =====
    const name = nameInput.value.trim();
    const confirm = confirmPassword.value.trim();

    if (!name) {
      showToast("⚠️ Please enter your name", "login");
      return;
    }

    if (password !== confirm) {
      showToast("❌ Passwords do not match", "login");
      return;
    }

    const res = await createUserWithEmailAndPassword(auth, email, password);

    const userData = {
      uid: res.user.uid,
      name,
      email,
      college: "",
      course: "",
      semester: "",
      session: "",
      createdAt: Date.now()
    };

    await setDoc(doc(db, "users", res.user.uid), userData);
    localStorage.setItem("arivumUser", JSON.stringify(userData));
    applyUser(userData);

    showToast(
      `🎉 Signup Successful!\nWelcome to ARIVUM, ${name} 💙`,
      "success"
    );

  } catch (err) {
    console.error(err);

    if (err.code === "auth/email-already-in-use") {
      showToast("⚠️ Email already registered. Please login.", "login");
    } else if (err.code === "auth/invalid-credential") {
      showToast("❌ Invalid email or password", "login");
    } else {
      showToast(err.message, "login");
    }
  }
});

// ================== LOAD USER ==================
async function loadUser(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) {
    const data = snap.data();
    localStorage.setItem("arivumUser", JSON.stringify(data));
    applyUser(data);
  }
}

// ================== APPLY USER ==================
function applyUser(user) {
  authOverlay.style.display = "none";

  const welcome = document.getElementById("welcome-text");
  if (welcome) welcome.textContent = `Welcome, ${user.name} 👋`;
}

// ================== AUTO LOGIN ==================
const savedUser = localStorage.getItem("arivumUser");
if (savedUser) {
  applyUser(JSON.parse(savedUser));
}

// ================== AUTH STATE ==================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await loadUser(user.uid);
  } else if (!localStorage.getItem("arivumUser")) {
    authOverlay.style.display = "flex";
  }
});

// ================== LOGOUT ==================
window.logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem("arivumUser");
  location.reload();
};
