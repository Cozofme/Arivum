// profileDrawer.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   DOM
================================ */
const profileBtn = document.getElementById("profileBtn");
const profileDrawer = document.getElementById("profileDrawer");
const profileOverlay = document.getElementById("profileOverlay");
const profileClose = document.getElementById("profileClose");

const editBtn = document.getElementById("editProfileBtn");
const saveBtn = document.getElementById("saveProfileBtn");
const cancelBtn = document.getElementById("cancelProfileBtn");

/* ===============================
   OPEN / CLOSE
================================ */
profileBtn?.addEventListener("click", () => {
  if (!auth.currentUser) return alert("Please login first");
  profileDrawer.classList.add("open");
  profileOverlay.classList.add("show");
});

function closeProfileDrawer() {
  profileDrawer.classList.remove("open");
  profileOverlay.classList.remove("show");
}

profileOverlay?.addEventListener("click", closeProfileDrawer);
profileClose?.addEventListener("click", closeProfileDrawer);

/* ===============================
   LOAD PROFILE (SOURCE = FIREBASE)
================================ */
async function loadProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return;

  const user = snap.data();

  // Cache only
  localStorage.setItem("arivumUser", JSON.stringify(user));

  document.getElementById("profile-name").textContent = user.name || "-";
  document.getElementById("profile-email").textContent = user.email || "-";
  document.getElementById("profile-college").textContent = user.college || "-";
  document.getElementById("profile-course").textContent = user.course || "-";
  document.getElementById("profile-semester").textContent = user.semester || "-";
  document.getElementById("profile-session").textContent = user.session || "-";
}

/* ===============================
   AUTH STATE (IMPORTANT)
================================ */
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadProfile(user.uid); // ALWAYS from Firebase
  } else {
    localStorage.removeItem("arivumUser");
  }
});

/* ===============================
   EDIT MODE
================================ */
function enableEdit(enable) {
  ["college","course","semester","session"].forEach(id => {
    document.getElementById(`profile-${id}`).contentEditable = enable;
  });

  editBtn.classList.toggle("hidden", enable);
  saveBtn.classList.toggle("hidden", !enable);
  cancelBtn.classList.toggle("hidden", !enable);
}

editBtn?.addEventListener("click", () => enableEdit(true));
cancelBtn?.addEventListener("click", () => enableEdit(false));

/* ===============================
   SAVE PROFILE (FIREBASE)
================================ */
saveBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const updated = {
    college: document.getElementById("profile-college").textContent.trim(),
    course: document.getElementById("profile-course").textContent.trim(),
    semester: document.getElementById("profile-semester").textContent.trim(),
    session: document.getElementById("profile-session").textContent.trim()
  };

  await updateDoc(doc(db, "users", user.uid), updated);
  await loadProfile(user.uid); // refresh from Firebase
  enableEdit(false);
});

/* ===============================
   LOGOUT
================================ */
window.logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem("arivumUser");
  location.reload();
};