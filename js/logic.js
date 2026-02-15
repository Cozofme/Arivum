document.addEventListener("DOMContentLoaded", () => {

  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveProfileBtn");
  const cancelBtn = document.getElementById("cancelProfileBtn");

  if (!editBtn) return; // safety check

  const fields = ["name","college", "course","semester", "session"];
  let originalData = {};

  editBtn.addEventListener("click", () => {
    fields.forEach(field => {
      const span = document.getElementById(`profile-${field}`);
      originalData[field] = span.textContent;

      const input = document.createElement("input");
      input.value = span.textContent;
      input.id = `input-${field}`;

      span.replaceWith(input);
    });

    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
  });

  saveBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("studybuddyUser")) || {};

    fields.forEach(field => {
      const input = document.getElementById(`input-${field}`);
      user[field] = input.value;

      const span = document.createElement("span");
      span.id = `profile-${field}`;
      span.className = "value";
      span.textContent = input.value;

      input.replaceWith(span);
    });

    localStorage.setItem("studybuddyUser", JSON.stringify(user));
    resetButtons();
  });

  cancelBtn.addEventListener("click", () => {
    fields.forEach(field => {
      const input = document.getElementById(`input-${field}`);

      const span = document.createElement("span");
      span.id = `profile-${field}`;
      span.className = "value";
      span.textContent = originalData[field];

      input.replaceWith(span);
    });

    resetButtons();
  });

  function resetButtons() {
    editBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
  }

});