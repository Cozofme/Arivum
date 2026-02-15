const creators = [
  {
    name: "Insha Kaynat",
    course: "Bsc IT",
    roll: "22BS62100374",
    color: "#FF6B6B",
    image: "images/A.png"
  },
  {
    name: "Rajesh Das",
    course: "Bsc IT",
    roll: "22BS62100374",
    color: "#4ECDC4",
    image: "images/B.png"
  },
  {
    name: "Rehan Khan",
    course: "Bsc IT",
    roll: "22BS62100381",
    color: "#A78BFA",
    image: "images/C.png"
  },
  {
    name: "MD Rashif",
    course: "Bsc IT",
    roll: "22BS62100361",
    color: "#F472B6",
    image: "images/D.png"
  },
  {
    name: "Amit Sharma",
    course: "Bsc IT",
    roll: "22BS62100324",
    color: "#60A5FA",
    image: "images/E.png"
  }
];

const defaultConfig = {
  section_title: "Our Creators",
  background_color: "#1a1a2e",
  text_color: "#ffffff",
  accent_color: "#A78BFA"
};

let activeIndex = -1;

function renderProfiles() {
  const container = document.getElementById('profilesContainer');
  container.innerHTML = '';

  creators.forEach((creator, index) => {
    const profile = document.createElement('div');
    profile.className = 'profile';
    profile.dataset.index = index;

    profile.innerHTML = `
          <div class="profile-glow" style="background: ${creator.color}"></div>
          <div class="profile-image">
  <img src="${creator.image}" alt="${creator.name}" />
</div>
        `;

    profile.addEventListener('click', () => handleProfileClick(index));
    profile.addEventListener('mouseenter', () => {
      if (activeIndex === -1) {
        activateProfile(index, false);
      }
    });
    container.appendChild(profile);
  });
}

function activateProfile(index, isClick = false) {
  const creator = creators[index];
  const section = document.getElementById('creatorsSection');
  const profiles = document.querySelectorAll('.profile');
  const container = document.getElementById('profilesContainer');
  const info = document.getElementById('creatorInfo');
  const resetBtn = document.getElementById('resetBtn');

  // Calculate translation to move hovered profile to left
  const hoveredProfile = profiles[index];
  const containerRect = container.getBoundingClientRect();
  const profileRect = hoveredProfile.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();

  const targetX = sectionRect.left + 50;
  const currentX = profileRect.left + profileRect.width / 2;
  const translateX = targetX - currentX;

  container.style.transform = `translateX(${translateX}px)`;

  // Update profiles visibility
  profiles.forEach((p, i) => {
    if (i === index) {
      p.classList.add('active-profile');
      p.classList.remove('hidden-profile');
    } else {
      p.classList.add('hidden-profile');
      p.classList.remove('active-profile');
    }
  });

  // Update section background with gradient
  section.style.background = `linear-gradient(135deg, ${creator.color}22 0%, ${creator.color}44 50%, ${creator.color}22 100%)`;
  section.style.borderColor = `${creator.color}66`;

  // Show creator info
  document.getElementById('creatorName').textContent = creator.name;
  document.getElementById('creatorCourse').textContent = creator.course;
  document.getElementById('creatorRoll').textContent = creator.roll;

  setTimeout(() => {
    info.classList.add('visible');
  }, 50);

  // Show reset button
  resetBtn.classList.add('visible');

  if (isClick) {
    activeIndex = index;
  }
}

function deactivateProfile() {
  if (activeIndex !== -1) return; // Stay active if clicked

  const section = document.getElementById('creatorsSection');
  const profiles = document.querySelectorAll('.profile');
  const container = document.getElementById('profilesContainer');
  const info = document.getElementById('creatorInfo');
  const resetBtn = document.getElementById('resetBtn');

  // Reset container position
  container.style.transform = 'translateX(0)';

  // Reset all profiles
  profiles.forEach(p => {
    p.classList.remove('active-profile', 'hidden-profile');
  });

  // Reset section background
  section.style.background = 'rgba(255, 255, 255, 0.1)';
  section.style.borderColor = 'rgba(255, 255, 255, 0.18)';

  // Hide creator info
  info.classList.remove('visible');

  // Hide reset button
  resetBtn.classList.remove('visible');
}

function handleProfileClick(index) {
  activeIndex = index;
  activateProfile(index, true);
}

function resetView() {
  activeIndex = -1;
  deactivateProfile();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProfiles();
  document.getElementById('resetBtn').addEventListener('click', resetView);

  const creatorsSection = document.getElementById('creatorsSection');
  creatorsSection.addEventListener('mouseleave', () => {
    if (activeIndex === -1) {
      deactivateProfile();
    }
  });
});

// Element SDK initialization
const onConfigChange = async (config) => {
  // Config-driven updates can be added here
};

const mapToCapabilities = (config) => ({
  recolorables: [
    {
      get: () => config.background_color || defaultConfig.background_color,
      set: (value) => {
        config.background_color = value;
        window.elementSdk.setConfig({ background_color: value });
      }
    },
    {
      get: () => config.text_color || defaultConfig.text_color,
      set: (value) => {
        config.text_color = value;
        window.elementSdk.setConfig({ text_color: value });
      }
    },
    {
      get: () => config.accent_color || defaultConfig.accent_color,
      set: (value) => {
        config.accent_color = value;
        window.elementSdk.setConfig({ accent_color: value });
      }
    }
  ],
  borderables: [],
  fontEditable: undefined,
  fontSizeable: undefined
});

const mapToEditPanelValues = (config) => new Map([
  ["section_title", config.section_title || defaultConfig.section_title]
]);

(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'9c8f6a7a166c41e5',t:'MTc3MDI2MzEzNy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();
