/* =========================
   DOM ELEMENTS
========================= */
const content = document.getElementById("content");
const searchInput = document.getElementById("searchInput");

const universitySelect = document.getElementById("universitySelect");
const courseSelect = document.getElementById("courseSelect");
const yearSelect = document.getElementById("yearSelect");
const semesterSelect = document.getElementById("semesterSelect");
const subjectSelect = document.getElementById("subjectSelect");

const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const applyFilter = document.getElementById("applyFilter");

/* =========================
   BACK BUTTON
========================= */
document.getElementById("backBtn")?.addEventListener("click", () => {
  window.history.back();
});

/* =========================
   SUBJECT COLORS
========================= */
const subjectColors = {
  C1: "hsla(262, 63%, 12%, 0.98)",
  C2: "hsla(189, 48%, 11%, 0.98)",
  C3: "hsla(158, 95%, 12%, 0.98)",
  C4: "hsla(33,  92%, 12%, 0.98)",
  C5: "hsla(333, 72%, 14%, 0.98)",
  C8: "hsla(176, 80%, 8%, 0.98)",
  DSE1: "hsla(0, 84%, 14%, 0.98)",
  C13: "hsla(238, 78%, 15%, 0.98)"
};

/* =========================
   DATA STORE
========================= */
let papersData = [];

/* =========================
   UTILITY
========================= */
function populateSelect(selectEl, values, prefix = "") {
  selectEl.innerHTML = `<option value="">All</option>`;
  [...new Set(values)]
    .filter(Boolean)
    .sort()
    .forEach(val => {
      const option = document.createElement("option");
      option.value = val;
      option.textContent = prefix ? `${prefix} ${val}` : val;
      selectEl.appendChild(option);
    });
}

/* =========================
   UPDATE SUBJECT BY SEMESTER
========================= */
function updateSubjectBySemester() {
  const semester = semesterSelect.value;

  const subjects = papersData
    .filter(p => !semester || p.semester === semester)
    .map(p => p.subject);

  populateSelect(subjectSelect, subjects);
}

/* =========================
   FETCH & TRANSFORM JSON
========================= */
fetch("data/papers.json")
  .then(res => res.json())
  .then(data => {
    const { year, university, course, semesters } = data;

    Object.entries(semesters).forEach(([semKey, subjects]) => {
      const semesterNumber = semKey.replace("semester_", "");

      Object.entries(subjects).forEach(([subjectCode, subjectData]) => {
        papersData.push({
          year,
          university,
          course,
          semester: semesterNumber,
          subject: subjectCode,
          subjectname: subjectData.subjectname,
          questions: subjectData.questions
        });
      });
    });

    populateSelect(universitySelect, papersData.map(p => p.university));
    populateSelect(courseSelect, papersData.map(p => p.course));
    populateSelect(yearSelect, papersData.map(p => p.year));
    populateSelect(semesterSelect, papersData.map(p => p.semester), "Sem");
    populateSelect(subjectSelect, papersData.map(p => p.subject));

    render();
  })
  .catch(err => console.error("JSON Load Error:", err));

/* =========================
   EVENTS
========================= */
filterBtn.onclick = () => filterPanel.classList.toggle("open");

applyFilter.onclick = () => {
  filterPanel.classList.remove("open");
  render();
};

searchInput.oninput = render;

semesterSelect.onchange = () => {
  updateSubjectBySemester();
  render();
};

[universitySelect, courseSelect, yearSelect, subjectSelect]
  .forEach(sel => sel.onchange = render);

/* =========================
   RENDER (YEAR → SEMESTER)
========================= */
function render() {
  content.innerHTML = "";

  const search = searchInput.value.toLowerCase();

  const filtered = papersData.filter(p =>
    (!universitySelect.value || p.university === universitySelect.value) &&
    (!courseSelect.value || p.course === courseSelect.value) &&
    (!yearSelect.value || p.year === yearSelect.value) &&
    (!semesterSelect.value || p.semester === semesterSelect.value) &&
    (!subjectSelect.value || p.subject === subjectSelect.value) &&
    (
      p.subject.toLowerCase().includes(search) ||
      p.subjectname.toLowerCase().includes(search)
    )
  );

  if (!filtered.length) {
    content.innerHTML = `<p class="no-results">No papers found</p>`;
    return;
  }

  const grouped = {};

  filtered.forEach(p => {
    if (!grouped[p.year]) grouped[p.year] = {};
    if (!grouped[p.year][p.semester]) grouped[p.year][p.semester] = [];
    grouped[p.year][p.semester].push(p);
  });

  Object.keys(grouped).forEach(year => {
    const yearDiv = document.createElement("div");
    yearDiv.className = "year-group";
    yearDiv.innerHTML = `<div class="year-title">${year}</div>`;

    Object.keys(grouped[year])
      .sort((a, b) => Number(a) - Number(b))
      .forEach(semester => {
        const semTitle = document.createElement("div");
        semTitle.className = "semester-title";
        semTitle.textContent = `Semester ${semester}`;
        yearDiv.appendChild(semTitle);

        grouped[year][semester].forEach(p => {
          const div = document.createElement("div");
          div.className = "paper";

          const color = subjectColors[p.subject] || "rgba(0,0,0,0.6)";
          div.style.setProperty("--paper-color", color);
          div.style.setProperty("--paper-border", color);

          div.innerHTML = `
            <strong>${p.subject}</strong> - ${p.subjectname}
            <span>${p.course}</span>
          `;

          div.onclick = () => {
            window.location.href =
              `imp-que.html?year=${encodeURIComponent(p.year)}&semester=${encodeURIComponent(p.semester)}&subject=${encodeURIComponent(p.subject)}`;
          };

          yearDiv.appendChild(div);
        });
      });

    content.appendChild(yearDiv);
  });
}