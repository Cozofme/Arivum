import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= COLORS =================
const gradientColors = [
  "#C2185B87",
  "#C6282887",
  "#8E24AA87",
  "#43A04787",
  "#FDD83587"
];

// ================= DEFAULT REVIEWS =================
const defaultReviews = [
  {
    name: "Aman Kumar",
    course: "BSc IT",
    review: "StudyBuddy helped me a lot when I moved to a new city for studies."
  },
  {
    name: "Sneha Singh",
    course: "BCA",
    review: "Very clean UI and genuinely useful for students ❤️"
  },
  {
    name: "Rahul Verma",
    course: "MBA",
    review: "Perfect platform for finding notes, friends, and guidance."
  }
];

// ================= FIRESTORE REF =================
const reviewsRef = collection(db, "reviews");

// ================= PRELOAD DEFAULT REVIEWS =================
async function preloadReviews() {
  const snap = await getDocs(reviewsRef);
  if (!snap.empty) return;

  for (const r of defaultReviews) {
    await addDoc(reviewsRef, {
      ...r,
      createdAt: serverTimestamp()
    });
  }
}

// ================= LOAD REVIEWS (REALTIME) =================
function loadReviewsRealtime() {
  const track = document.getElementById("reviewTrack");
  if (!track) return;

  const q = query(reviewsRef, orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    track.innerHTML = "";

    let reviews = [];
    snapshot.forEach(doc => reviews.push(doc.data()));

    if (reviews.length === 0) {
      track.innerHTML = `
        <div class="review-card" style="background:linear-gradient(135deg,#333,#000)">
          <h3>No reviews yet</h3>
          <p>Be the first to share your feedback 🌟</p>
        </div>
      `;
      return;
    }

    // Duplicate for marquee effect
    for (let i = 0; i < 2; i++) {
      reviews.forEach((r, index) => {
        const color = gradientColors[index % gradientColors.length];
        track.innerHTML += `
          <div class="review-card"
            style="background: linear-gradient(135deg, ${color}, #000);">
            <h3>${r.name} <span>• ${r.course}</span></h3>
            <p>${r.review}</p>
          </div>
        `;
      });
    }
  });
}

// ================= SUBMIT REVIEW =================
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("feedbackForm");
  const input = document.getElementById("userReview");
  const button = form?.querySelector("button");

  if (!form || !input || !button) return;

  await preloadReviews();
  loadReviewsRealtime();

  const originalText = button.textContent;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reviewText = input.value.trim();
    if (!reviewText) return;

    const user = JSON.parse(localStorage.getItem("studybuddyUser"));
    if (!user) {
      alert("Please login to submit feedback");
      return;
    }

    // Sending effect
    button.disabled = true;
    let dots = 0;
    button.textContent = "Sending";

    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      button.textContent = "Sending" + ".".repeat(dots);
    }, 400);

    try {
      await addDoc(reviewsRef, {
        name: user.name,
        course: user.college || user.semester || "Student",
        review: reviewText,
        createdAt: serverTimestamp()
      });

      form.reset();
    } catch (err) {
      alert("Failed to submit review");
    }

    clearInterval(interval);
    button.disabled = false;
    button.textContent = originalText;
  });
});