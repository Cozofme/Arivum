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
  CC1: "hsla(262, 63%, 12%, 0.98)",
  CC2: "hsla(189, 48%, 11%, 0.98)",
  CC3: "hsla(158, 95%, 12%, 0.98)",
  CC4: "hsla(33,  92%, 12%, 0.98)",
  CC5: "hsla(333, 72%, 14%, 0.98)",
  CC6: "hsla(176, 80%, 8%, 0.98)",
  CC7: "hsla(270, 80%, 14%, 0.98)",
  CC8: "hsla(145, 75%, 14%, 0.98)",
  CC9: "hsla(346, 78%, 13%, 0.98)",
  CC10: "hsla(199, 88%, 14%, 0.98)",
  CC11: "hsla(38,  92%, 14%, 0.98)",
  CC12: "hsla(165, 82%, 14%, 0.98)",
  CC13: "hsla(258, 85%, 15%, 0.98)",
  CC14: "hsla(174, 80%, 14%, 0.98)",
  GE1: "hsla(195, 79%, 13%, 0.98)",
  GE2: "hsla(133, 79%, 13%, 0.98)",
  GE3: "hsla(16, 56%, 20%, 0.98)",
  GE4: "hsla(332, 55%, 26%, 0.98)",
  AECC1: "hsla(263, 59%, 11%, 0.98)",
  SEC1: "hsla(64, 91%, 9%, 0.98)",
  SEC2: "hsla(149, 91%, 9%, 0.98)",
  DSE1: "hsla(0,   84%, 14%, 0.98)",
  DSE2: "hsla(238, 78%, 15%, 0.98)",
  DSE3: "hsla(190, 85%, 14%, 0.98)",
  DSE4: "hsla(273, 82%, 15%, 0.98)"
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
   FETCH DATA
========================= */
fetch("data/questions.json")
  .then(res => res.json())
  .then(data => {

    papersData = data.map(p => ({
      university: p.university,
      course: p.course,
      year: p.year,
      semester: p.semester,
      subject: p.subject,
      subjectname: p.subjectname
    }));

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

subjectSelect.onchange = render;

[
  universitySelect,
  courseSelect,
  yearSelect
].forEach(sel => sel.onchange = render);

/* =========================
   RENDER (YEAR → SEMESTER)
========================= */
function render() {
  content.innerHTML = "";

  const search = searchInput.value.toLowerCase();

  const uni = universitySelect.value;
  const course = courseSelect.value;
  const yearFilter = yearSelect.value;
  const semesterFilter = semesterSelect.value;
  const subjectFilter = subjectSelect.value;

  const filtered = papersData.filter(p =>
    (!uni || p.university === uni) &&
    (!course || p.course === course) &&
    (!yearFilter || p.year === yearFilter) &&
    (!semesterFilter || p.semester === semesterFilter) &&
    (!subjectFilter || p.subject === subjectFilter) &&
    (
      p.subject.toLowerCase().includes(search) ||
      p.subjectname.toLowerCase().includes(search)
    )
  );

  /* ===== GROUP BY YEAR → SEMESTER ===== */
  const grouped = {};

  filtered.forEach(p => {
    if (!grouped[p.year]) grouped[p.year] = {};
    if (!grouped[p.year][p.semester]) grouped[p.year][p.semester] = [];
    grouped[p.year][p.semester].push(p);
  });

  Object.keys(grouped)
    .sort((a, b) => b - a)
    .forEach(year => {

      const yearDiv = document.createElement("div");
      yearDiv.className = "year-group";
      yearDiv.innerHTML = `<div class="year-title">${year}</div>`;

      Object.keys(grouped[year])
        .sort((a, b) => a - b)
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
                `question-paper.html?year=${p.year}&semester=${p.semester}&subject=${p.subject}`;
            };

            yearDiv.appendChild(div);
          });
        });

      content.appendChild(yearDiv);
    });
}