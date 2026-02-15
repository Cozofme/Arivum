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

const signupFields = document.getElementById("signupFields");
const confirmPassword = document.getElementById("confirmPassword");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

let isLogin = false;

// ================== TOGGLE LOGIN / SIGNUP ==================
toggleAuth.onclick = () => {
  isLogin = !isLogin;

  signupFields.style.display = isLogin ? "none" : "block";
  confirmPassword.style.display = isLogin ? "none" : "block";

  authTitle.textContent = isLogin ? "Login to ARIVUM" : "Join your ARIVUM";
  authBtn.textContent = isLogin ? "Login" : "Sign Up";
  toggleAuth.textContent = isLogin ? "Sign Up" : "Login";
};

// ================== AUTH ACTION ==================
authBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  try {
    // ===== LOGIN =====
    if (isLogin) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await loadUser(res.user.uid);
      return;
    }

    // ===== SIGNUP =====
    const name = nameInput.value.trim();
    const confirm = confirmPassword.value.trim();

    if (!name) {
      alert("Name is required");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await createUserWithEmailAndPassword(auth, email, password);

    // ✅ IMPORTANT: initialize all profile fields
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

  } catch (err) {
    console.error(err);

    if (err.code === "auth/email-already-in-use") {
      alert("Email already registered. Please login.");
    } else if (err.code === "auth/invalid-credential") {
      alert("Invalid email or password");
    } else {
      alert(err.message);
    }
  }
};

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
