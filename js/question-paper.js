/* =========================
   URL PARAMS
   ========================= */
const params = new URLSearchParams(window.location.search);

const year = params.get("year");
const semester = params.get("semester");
const subject = params.get("subject");

const container = document.getElementById("questionsContainer");
const title = document.getElementById("pageTitle");

title.textContent = `Semester ${semester} • ${subject} • ${year}`;

/* =========================
   GLOBAL STATE
   ========================= */
let currentImages = [];
let currentIndex = 0;

/* =========================
   FETCH QUESTIONS
   ========================= */
fetch("/data/questions.json")
  .then(res => res.json())
  .then(data => {
    const paper = data.find(p =>
      p.year === year &&
      p.semester === semester &&
      p.subject === subject
    );
    
    if (!paper || !paper.questions) {
      container.innerHTML = "<p>No questions found.</p>";
      return;
    }
    
    renderImages(paper.questions.images);
    renderVideos(paper.questions.videos);
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>Error loading questions.</p>";
  });

/* =========================
   RENDER IMAGE THUMBNAILS
   ========================= */
function renderImages(images) {
  container.innerHTML = "";
  currentImages = images;
  
  images.forEach((imgSrc, i) => {
    const div = document.createElement("div");
    div.className = "question-card";
    
    div.innerHTML = `
      <h4>Page ${i + 1}</h4>
      <div class="image-thumb" onclick="openImage(${i})">
        <img src="data/${imgSrc}" alt="Paper Page ${i + 1}">
      </div>
    `;
    
    container.appendChild(div);
  });
}

/* =========================
   IMAGE MODAL FUNCTIONS
   ========================= */
function openImage(index) {
  currentIndex = index;
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  
  modal.style.display = "flex";
  modalImg.src = "data/" + currentImages[currentIndex];
}

function closeImage() {
  const modal = document.getElementById("imageModal");
  modal.style.display = "none";
}

function nextImage() {
  if (currentIndex < currentImages.length - 1) {
    currentIndex++;
    updateModalImage();
  }
}

function prevImage() {
  if (currentIndex > 0) {
    currentIndex--;
    updateModalImage();
  }
}

function updateModalImage() {
  const modalImg = document.getElementById("modalImage");
  modalImg.src = "data/" + currentImages[currentIndex];
}

/* =========================
   IMAGE MODAL SWIPE (MOBILE)
   ========================= */
let startX = 0;
const imageModal = document.getElementById("imageModal");

imageModal.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

imageModal.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  
  if (diff > 50) nextImage(); // swipe left
  if (diff < -50) prevImage(); // swipe right
});

/* =========================
   KEYBOARD SUPPORT
   ========================= */
document.addEventListener("keydown", e => {
  if (imageModal.style.display === "flex") {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeImage();
  }
  
  const videoModal = document.getElementById("videoModal");
  if (videoModal.style.display === "flex" && e.key === "Escape") {
    closeVideo();
  }
});

/* =========================
   RENDER VIDEO THUMBNAILS
   ========================= */
function renderVideos(videos) {
  if (!videos || !videos.length) return;
  
  const section = document.createElement("section");
  section.className = "video-section";
  
  section.innerHTML = `<h3>Related Videos</h3>`;
  
  const grid = document.createElement("div");
  grid.className = "video-grid";
  
  videos.forEach(link => {
let videoId = "";
if (link.includes("youtu.be/")) {
  videoId = link.split("youtu.be/")[1].split("?")[0];
} else if (link.includes("v=")) {
  videoId = link.split("v=")[1].split("&")[0];
}
    
    const thumb = document.createElement("div");
    thumb.className = "video-thumb";
    thumb.innerHTML = `
      <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg">
      <span class="play-icon">▶</span>
    `;
    thumb.onclick = () => openVideo(videoId);
    
    grid.appendChild(thumb);
  });
  
  section.appendChild(grid);
  container.appendChild(section);
}

/* =========================
   VIDEO MODAL FUNCTIONS
   ========================= */
function openVideo(videoId) {
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoFrame");
  
  frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  modal.style.display = "flex";
}

function closeVideo() {
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoFrame");
  
  frame.src = "";
  modal.style.display = "none";
}