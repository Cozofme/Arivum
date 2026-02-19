// ================================
// NAVIGATION + MENU
// ================================
const nav = document.querySelector(".nav");
const menu = document.getElementById("menu");
const menuItems = document.querySelectorAll(".nav ul li a");
const underline = document.querySelector(".nav-underline");

// Mobile menu toggle
function toggleMenu(e) {
  e?.stopPropagation(); // prevent instant close
  menu.classList.toggle("show");
}
window.toggleMenu = toggleMenu;

// Prevent clicks inside menu from closing it
if (menu) {
  menu.addEventListener("click", (e) => e.stopPropagation());
}

// Close menu when clicking / touching anywhere outside
function closeMenuOnOutsideTap(e) {
  const toggleBtn = document.querySelector('[onclick="toggleMenu()"]');
  
  if (
    menu &&
    menu.classList.contains("show") &&
    !menu.contains(e.target) &&
    !toggleBtn?.contains(e.target)
  ) {
    menu.classList.remove("show");
  }
}

document.addEventListener("click", closeMenuOnOutsideTap);
document.addEventListener("touchstart", closeMenuOnOutsideTap);

// Close menu when clicking a menu item
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menu.classList.remove("show");
  });
});

// ================================
// NAV UNDERLINE EFFECT
// ================================
menuItems.forEach(item => {
  item.addEventListener("mouseenter", (e) => {
    const rect = e.target.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    underline.style.width = `${rect.width}px`;
    underline.style.left = `${rect.left - navRect.left}px`;
  });
});

if (nav) {
  nav.addEventListener("mouseleave", () => {
    underline.style.width = "0";
  });
}

/* =========================
   NAVIGATION (MAIN PAGE)
   ========================= */
const pyqBtn = document.getElementById("Pyq");
const queBtn = document.getElementById("Que");

if (pyqBtn) {
  pyqBtn.onclick = () => {
    window.location.href = "pyq.html";
  };
}

if (queBtn) {
  queBtn.onclick = () => {
    window.location.href = "important.html";
  };
}

// ================================
// DATE
// ================================
function updateDate() {
  const d = new Date();
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  const dateEl = document.getElementById("date");
  if (dateEl) {
    dateEl.textContent = d.toLocaleDateString(undefined, options);
  }
}
updateDate();
setInterval(updateDate, 60000);

// ================================
// QUOTES
// ================================
const fallbackQuotes = [
  { q: "Education is the most powerful weapon which you can use to change the world.", a: "Nelson Mandela" },
  { q: "Live as if you were to die tomorrow. Learn as if you were to live forever.", a: "Mahatma Gandhi" },
  { q: "Learning never exhausts the mind.", a: "Leonardo da Vinci" },
  { q: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.", a: "A. P. J. Abdul Kalam" },
  { q: "An investment in knowledge pays the best interest.", a: "Benjamin Franklin" },
  { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
  { q: "The roots of education are bitter, but the fruit is sweet.", a: "Aristotle" },
  { q: "The expert in anything was once a beginner.", a: "Helen Hayes" },
  { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  { q: "Today a reader, tomorrow a leader.", a: "Margaret Fuller" },
  { q: "Padhai karo doston , reel toh baad me bhi dekhi ja sakti hai.", a: "Team Arivum" },
  { q: "Success is the result of preparation, hard work, and learning from failure.", a: "Colin Powell" },
  { q: "Your education is a dress rehearsal for a life that is yours to lead.", a: "Nora Ephron" },
  { q: "If you think education is expensive, try ignorance.", a: "Derek Bok" }
];


const quoteBox = document.getElementById("quoteBox");

// Show fallback instantly
function showInstantQuote() {
  if (!quoteBox) return;
  const quote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  quoteBox.innerHTML = `${quote.q} — <b>${quote.a}</b>`;
}

// Fetch API quote silently
async function fetchApiQuote() {
  try {
    const res = await fetch(
      "https://api.allorigins.win/get?url=" +
      encodeURIComponent("https://zenquotes.io/api/random")
    );

    const data = await res.json();
    const parsed = JSON.parse(data.contents);

    // Replace only when API succeeds
    quoteBox.innerHTML = `${parsed[0].q} — <b>${parsed[0].a}</b>`;
  } catch (e) {
    // Do nothing → fallback already shown
  }
}

// ================================
// INIT
// ================================
showInstantQuote();   // no loading state
fetchApiQuote();      // background update


// ================================
// TO-DO LIST
// ================================
const tasksKey = "my_todo_tasks_v2";
const focusKey = "my_todo_focus_v2";

let tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];
let focus = localStorage.getItem(focusKey) || "Complete Assignment 2";

const taskList = document.getElementById("task-list");
const progressPath = document.querySelector(".circular-chart .progress");
const percentText = document.querySelector(".circular-chart .percent-text");
const overlay = document.getElementById("overlay");
const taskContainer = document.getElementById("task-container");
const newTaskInput = document.getElementById("new-task");
const addBtn = document.getElementById("add-btn");
const closeBtn = document.getElementById("close-btn");
const editBtn = document.getElementById("edit-btn");
const focusTextEl = document.getElementById("focus-text");
const focusEdit = document.getElementById("focus-edit");

function saveAll() {
  localStorage.setItem(tasksKey, JSON.stringify(tasks));
  localStorage.setItem(focusKey, focus);
}

function setProgress(percent) {
  if (!progressPath || !percentText) return;
  progressPath.setAttribute("stroke-dashoffset", 100 - percent);
  percentText.textContent = percent + "%";
}

function updateProgress() {
  const done = tasks.filter(t => t.done).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  setProgress(percent);

  // 🔥 ADD THIS LINE
  updateMotivation(percent);
}

function sortTasks() {
  tasks.sort((a, b) => a.done - b.done);
}

function renderMainTasks() {
  if (!taskList || !focusTextEl) return;
  
  taskList.innerHTML = "";
  focusTextEl.textContent = "Today's Focus: " + focus;
  sortTasks();
  
  tasks.slice(0, 4).forEach((task, idx) => {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = task.done;
    
    cb.addEventListener("change", () => {
      tasks[idx].done = !tasks[idx].done;
      saveAll();
      renderMainTasks();
      renderEditorTasks();
    });
    
    label.appendChild(cb);
    label.append(" " + task.name);
    taskList.appendChild(label);
  });
  
  updateProgress();
}

function updateMotivation(progress) {
  const message = document.getElementById("motivationMessage");
  if (!message) return;

  if (progress === 0) {
    message.textContent = "Let's get started! 💪";
  } else if (progress < 10) {
    message.textContent = "First steps are the hardest! 👣";
  } else if (progress < 25) {
    message.textContent = "You've got a rhythm going! 🎶";
  } else if (progress < 50) {
    message.textContent = "Keep going, you're doing great! 🚀";
  } else if (progress === 50) {
    message.textContent = "Halfway there! Keep that momentum! ⚡";
  } else if (progress < 75) {
    message.textContent = "Over the hump! Don't stop now! 🏔️";
  } else if (progress < 90) {
    message.textContent = "Almost there, stay focused! 🔥";
  } else if (progress < 100) {
    message.textContent = "The finish line is in sight! 🏁";
  } else {
    message.textContent = "Goal Achieved! You did it! 🎉";
  }
}

function renderEditorTasks() {
  if (!taskContainer) return;
  taskContainer.innerHTML = "";
  sortTasks();
  
  tasks.forEach((task, idx) => {
    const item = document.createElement("div");
    item.className = "task-item" + (task.done ? " completed" : "");
    
    const label = document.createElement("label");
    
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = task.done;
    
    cb.addEventListener("change", () => {
      tasks[idx].done = cb.checked;
      saveAll();
      renderMainTasks();
      renderEditorTasks();
    });
    
    const span = document.createElement("span");
    span.textContent = task.name;
    
    // ✅ INLINE EDITING
    span.addEventListener("click", () => {
      span.contentEditable = "true";
      span.focus();
      document.execCommand("selectAll", false, null);
    });
    
    span.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        span.blur();
      }
    });
    
    span.addEventListener("blur", () => {
      const newText = span.textContent.trim();
      if (newText) {
        tasks[idx].name = newText;
        saveAll();
        renderMainTasks();
      } else {
        span.textContent = task.name; // revert if empty
      }
      span.contentEditable = "false";
    });
    
    label.appendChild(cb);
    label.appendChild(span);
    item.appendChild(label);
    
    // 🗑 Delete
    const del = document.createElement("i");
    del.className = "fas fa-trash small-icon";
    del.title = "Delete task";
    del.onclick = () => {
      tasks.splice(idx, 1);
      saveAll();
      renderMainTasks();
      renderEditorTasks();
    };
    
    item.appendChild(del);
    taskContainer.appendChild(item);
  });
}

if (editBtn) {
  editBtn.onclick = () => {
    overlay.classList.add("active");
    focusEdit.value = focus;
    renderEditorTasks();
  };
}

if (closeBtn) {
  closeBtn.onclick = () => {
    overlay.classList.remove("active");
    focus = focusEdit.value;
    saveAll();
    renderMainTasks();
  };
}

if (addBtn) {
  addBtn.onclick = () => {
    const val = newTaskInput.value.trim();
    if (!val) return;
    tasks.push({ name: val, done: false });
    newTaskInput.value = "";
    saveAll();
    renderEditorTasks();
    renderMainTasks();
  };
}

// ===============================
// ABOUT SECTION SLIDE CONTROL
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.querySelector(".about-section");
  const aboutBtn = document.getElementById("aboutBtn");
  const aboutClose = document.getElementById("aboutClose");

  // Safety check
  if (!aboutSection || !aboutBtn || !aboutClose) return;

  // Open About section
  aboutBtn.addEventListener("click", () => {
    aboutSection.classList.add("active");
    document.body.style.overflow = "hidden"; // prevent background scroll
  });

  // Close via close button
  aboutClose.addEventListener("click", () => {
    closeAbout();
  });

  // Close when clicking outside container
  aboutSection.addEventListener("click", (e) => {
    if (!e.target.closest(".about-container")) {
      closeAbout();
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && aboutSection.classList.contains("active")) {
      closeAbout();
    }
  });

  // Reusable close function
  function closeAbout() {
    aboutSection.classList.remove("active");
    document.body.style.overflow = ""; // restore scroll
  }
});


renderMainTasks();
