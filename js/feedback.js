// feedback.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================== CONFIG ================== */

const gradientColors = [
  "#C2185B87",
  "#C6282887",
  "#8E24AA87",
  "#43A04787",
  "#FDD83587"
];

const defaultReviews = [
  {
    name: "Aman Kumar",
    course: "BSc IT",
    review: "Arivum helped me a lot when I moved to a new city for studies."
  },
  {
    name: "Sneha Singh",
    course: "BCA",
    review: "Very clean UI and genuinely useful for students ❤️"
  },
  {
    name: "Rahul Verma",
    course: "MBA",
    review: "Perfect platform for finding PYQs and important questions."
  }
];

/* ================== FIRESTORE ================== */

const reviewsRef = collection(db, "reviews");

/* ================== PRELOAD DEFAULT REVIEWS ================== */

async function preloadReviews() {
  try {
    const snap = await getDocs(reviewsRef);
    if (!snap.empty) return;

    for (const r of defaultReviews) {
      await addDoc(reviewsRef, {
        ...r,
        createdAt: new Date()
      });
    }
  } catch (err) {
    console.error("Preload reviews failed:", err);
  }
}

/* ================== LOAD REVIEWS (REALTIME) ================== */

function loadReviewsRealtime() {
  const track = document.getElementById("reviewTrack");

  if (!track) {
    console.warn("reviewTrack element not found");
    return;
  }

  onSnapshot(
    reviewsRef,
    (snapshot) => {
      track.innerHTML = "";

      if (snapshot.empty) {
        track.innerHTML = `
          <div class="review-card"
            style="background:linear-gradient(135deg,#333,#000)">
            <h3>No reviews yet</h3>
            <p>Be the first to share your feedback 🌟</p>
          </div>
        `;
        return;
      }

      // Convert docs → data + safe sorting
      const reviews = snapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() || new Date(a.createdAt || 0).getTime();
          const tb = b.createdAt?.toMillis?.() || new Date(b.createdAt || 0).getTime();
          return tb - ta;
        });

      // Duplicate for marquee effect
      for (let loop = 0; loop < 2; loop++) {
        reviews.forEach((r, index) => {
          const color = gradientColors[index % gradientColors.length];

          track.innerHTML += `
            <div class="review-card"
              style="background:linear-gradient(135deg,${color},#000)">
              <h3>${r.name || "Anonymous"} <span>• ${r.course || "Student"}</span></h3>
              <p>${r.review || ""}</p>
            </div>
          `;
        });
      }
    },
    (error) => {
      console.error("Firestore listener error:", error);
    }
  );
}

/* ================== SUBMIT FEEDBACK ================== */

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("feedbackForm");
  const input = document.getElementById("userReview");
  const button = form?.querySelector("button");

  if (!form || !input || !button) {
    console.warn("Feedback form elements missing");
    return;
  }

  await preloadReviews();
  loadReviewsRealtime();

  const originalText = button.textContent;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reviewText = input.value.trim();
    if (!reviewText) return;

    const user = JSON.parse(localStorage.getItem("arivumUser"));

    if (!user || !user.uid) {
      alert("Please login to submit feedback");
      return;
    }

    // Sending animation
    button.disabled = true;
    let dots = 0;
    button.textContent = "Sending";

    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      button.textContent = "Sending" + ".".repeat(dots);
    }, 400);

    try {
      await addDoc(reviewsRef, {
        uid: user.uid,
        name: user.name || "Anonymous",
        course:
          user.course ||
          user.college ||
          user.semester ||
          "Student",
        review: reviewText,
        createdAt: new Date()
      });

      form.reset();
    } catch (err) {
      console.error("Submit review failed:", err);
      alert("Failed to submit feedback");
    }

    clearInterval(interval);
    button.disabled = false;
    button.textContent = originalText;
  });
});
