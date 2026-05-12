// ==========================================
// FETCH DATA JSON
// ==========================================
async function loadWeddingData() {
  try {
    const response = await fetch("data/wedding-data.json");
    const data = await response.json();

    const coupleName = `${data.couple.groom.nickname} & ${data.couple.bride.nickname}`;
    document.getElementById("data-nav-name").innerText = coupleName;
    document.getElementById("data-os-name").innerText = coupleName;
    document.getElementById("data-footer-name").innerText = coupleName;

    document.getElementById("data-hero-groom").innerText =
      data.couple.groom.nickname;
    document.getElementById("data-hero-bride").innerText =
      data.couple.bride.nickname;
    document.getElementById("data-hero-date").innerText =
      data.event.date_string;

    document.getElementById("data-couple-groom").innerText =
      data.couple.groom.fullname;
    document.getElementById("data-couple-groom-parents").innerText =
      `Putra dari ${data.couple.groom.father} & ${data.couple.groom.mother}`;
    document.getElementById("data-couple-bride").innerText =
      data.couple.bride.fullname;
    document.getElementById("data-couple-bride-parents").innerText =
      `Putri dari ${data.couple.bride.father} & ${data.couple.bride.mother}`;

    document.getElementById("data-akad-date").innerText =
      data.event.akad.date_display;
    document.getElementById("data-akad-time").innerText =
      data.event.akad.time_string;
    document.getElementById("data-akad-location").innerText =
      data.event.akad.location;
    document.getElementById("data-akad-address").innerText =
      data.event.akad.address;
    document.getElementById("data-akad-map").href = data.event.akad.map_link;

    document.getElementById("data-reception-date").innerText =
      data.event.reception.date_display;
    document.getElementById("data-reception-time").innerText =
      data.event.reception.time_string;
    document.getElementById("data-reception-location").innerText =
      data.event.reception.location;
    document.getElementById("data-reception-address").innerText =
      data.event.reception.address;
    document.getElementById("data-reception-map").href =
      data.event.reception.map_link;

    const galleryContainer = document.getElementById("data-gallery-container");
    if (galleryContainer) {
      galleryContainer.innerHTML = "";
      data.gallery.forEach((imgSrc) => {
        const imgHTML = `
                    <div class="relative group overflow-hidden break-inside-avoid cursor-pointer rounded-sm mb-2 md:mb-4" onclick="window.openLightbox('${imgSrc}')">
                        <img src="${imgSrc}" class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" alt="Gallery Image">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                            <svg class="w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                        </div>
                    </div>
                `;
        galleryContainer.innerHTML += imgHTML;
      });
    }
  } catch (error) {
    console.error(
      "Gagal menarik data JSON. Pastikan jalan di Local Server (Live Server)!",
      error,
    );
  }
}

// ==========================================
// AUDIO MUSIC LOGIC (Play/Pause)
// ==========================================
const bgMusic = document.getElementById("bg-music");
const musicControl = document.getElementById("music-control");
const iconPlay = document.getElementById("music-icon-play");
const iconPause = document.getElementById("music-icon-pause");
let isPlaying = false;

// Play musik saat tombol "BUKA UNDANGAN" ditekan
const btnOpen = document.getElementById("btn-open");
if (btnOpen) {
  btnOpen.addEventListener("click", () => {
    if (bgMusic) {
      bgMusic
        .play()
        .then(() => {
          isPlaying = true;
          if (musicControl) {
            musicControl.classList.remove("hidden");
            setTimeout(() => {
              musicControl.classList.remove("opacity-0", "pointer-events-none");
            }, 500);
          }
        })
        .catch((err) => console.log("Gagal memutar audio:", err));
    }
  });
}

// Logic untuk tombol play/pause di pojok kanan bawah
if (musicControl) {
  musicControl.addEventListener("click", () => {
    if (isPlaying) {
      bgMusic.pause();
      iconPlay.classList.add("hidden");
      iconPause.classList.remove("hidden");
    } else {
      bgMusic.play();
      iconPlay.classList.remove("hidden");
      iconPause.classList.add("hidden");
    }
    isPlaying = !isPlaying;
  });
}

// ==========================================
// MOBILE MENU SIDEBAR LOGIC
// ==========================================
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const closeMenuBtn = document.getElementById("close-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileBackdrop = document.getElementById("mobile-menu-backdrop");
const mobileLinks = document.querySelectorAll(".mobile-link");

function openMobileMenu() {
  mobileMenu.classList.remove("translate-x-full");
  mobileBackdrop.classList.remove("pointer-events-none", "opacity-0");
  mobileBackdrop.classList.add("opacity-100");
}

function closeMobileMenu() {
  mobileMenu.classList.add("translate-x-full");
  mobileBackdrop.classList.remove("opacity-100");
  mobileBackdrop.classList.add("pointer-events-none", "opacity-0");
}

if (mobileMenuBtn)
  mobileMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openMobileMenu();
  });
if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMobileMenu);
if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileMenu);
mobileLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

// ==========================================
// LIGHTBOX GALLERY
// ==========================================
const lightboxModal = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");

// Menggunakan window. agar bisa dipanggil dari HTML (onclick)
window.openLightbox = function (imgSrc) {
  if (lightboxImg && lightboxModal) {
    lightboxImg.src = imgSrc;
    lightboxModal.classList.remove("hidden");
    setTimeout(() => {
      lightboxModal.classList.remove("opacity-0");
      lightboxImg.classList.remove("scale-95");
      lightboxImg.classList.add("scale-100");
    }, 20);
  }
};
window.closeLightbox = function () {
  if (lightboxModal && lightboxImg) {
    lightboxModal.classList.add("opacity-0");
    lightboxImg.classList.remove("scale-100");
    lightboxImg.classList.add("scale-95");
    setTimeout(() => {
      lightboxModal.classList.add("hidden");
      lightboxImg.src = "";
    }, 300);
  }
};

// ==========================================
// CUSTOM SELECT RSVP
// ==========================================
const selectBtn = document.getElementById("custom-select-btn");
const selectDropdown = document.getElementById("custom-select-dropdown");
const selectText = document.getElementById("custom-select-text");
const selectIcon = document.getElementById("custom-select-icon");
const attendanceInput = document.getElementById("new-rsvp-attendance");

if (selectBtn) {
  selectBtn.addEventListener("click", () => {
    if (selectText.classList.contains("text-red-400")) {
      selectText.innerText = "Konfirmasi Kehadiran";
      selectText.classList.replace("text-red-400", "text-gray-500");
      selectBtn.classList.replace("border-red-400", "border-gold/50");
    }
    selectDropdown.classList.toggle("hidden");
    setTimeout(() => {
      selectDropdown.classList.toggle("opacity-0");
      selectIcon.classList.toggle("rotate-180");
    }, 10);
  });

  document.querySelectorAll("#custom-select-dropdown div").forEach((option) => {
    option.addEventListener("click", (e) => {
      selectText.innerText = e.target.innerText;
      selectText.classList.remove("text-gray-500", "text-red-400");
      selectText.classList.add("text-white");
      attendanceInput.value = e.target.getAttribute("data-value");
      selectDropdown.classList.add("opacity-0");
      selectIcon.classList.remove("rotate-180");
      setTimeout(() => selectDropdown.classList.add("hidden"), 300);
    });
  });

  document.addEventListener("click", (e) => {
    const wrapper = document.getElementById("custom-select-wrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      selectDropdown.classList.add("opacity-0");
      selectIcon.classList.remove("rotate-180");
      setTimeout(() => selectDropdown.classList.add("hidden"), 300);
    }
  });
}

// ==========================================
// LOCAL STORAGE & RENDER UCAPAN
// ==========================================
const rsvpForm = document.getElementById("new-rsvp-form");
const wishesContainer = document.getElementById("new-wishes-container");
let wishes = JSON.parse(localStorage.getItem("wedding_wishes_v2")) || [
  {
    name: "Keluarga Montague",
    attendance: "Hadir",
    message:
      "Selamat menempuh hidup baru Romeo & Juliet! Semoga langgeng selamanya.",
    date: "10 Des 2026",
  },
  {
    name: "Sahabat Juliet",
    attendance: "Tidak Hadir",
    message: "Maaf belum bisa hadir, doa terbaik untuk kalian berdua ya ❤️",
    date: "11 Des 2026",
  },
];

function renderWishes() {
  if (!wishesContainer) return;
  wishesContainer.innerHTML = "";
  wishes.forEach((wish, index) => {
    if (!wish || !wish.name) return;
    const animClass =
      index % 2 === 0 ? "animate-slide-left" : "animate-slide-right";
    const badgeColor =
      wish.attendance === "Hadir"
        ? "border-gold text-gold"
        : "border-gray-500 text-gray-500";
    wishesContainer.innerHTML += `
            <div class="bg-[#081321]/80 border border-gold/20 p-5 md:p-6 rounded-sm opacity-0 ${animClass} backdrop-blur-sm" style="animation-delay: ${Math.min(index * 0.1, 0.5)}s; animation-fill-mode: forwards;">
                <div class="flex justify-between items-start mb-3 md:mb-4 gap-3 md:gap-4">
                    <h4 class="font-serif text-lg md:text-xl text-gold break-words flex-1">${wish.name}</h4>
                    <span class="font-sans text-[8px] md:text-[9px] uppercase tracking-widest px-2 py-1 border ${badgeColor} whitespace-nowrap">${wish.attendance}</span>
                </div>
                <p class="font-sans text-xs md:text-sm text-gray-300 leading-relaxed italic mb-3 md:mb-4 break-words">"${wish.message}"</p>
                <p class="text-[10px] md:text-xs text-gray-500 font-sans uppercase tracking-widest">${wish.date}</p>
            </div>`;
  });
}

if (rsvpForm) {
  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!attendanceInput.value) {
      selectText.innerText = "Mohon Pilih Kehadiran Anda!";
      selectText.classList.remove("text-white", "text-gray-500");
      selectText.classList.add("text-red-400");
      selectBtn.classList.replace("border-gold/50", "border-red-400");
      return;
    }
    const newWish = {
      name: document.getElementById("new-rsvp-name").value.trim(),
      attendance: attendanceInput.value,
      message: document.getElementById("new-rsvp-message").value.trim(),
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    wishes.unshift(newWish);
    localStorage.setItem("wedding_wishes_v2", JSON.stringify(wishes));

    rsvpForm.reset();
    selectText.innerText = "Konfirmasi Kehadiran";
    selectText.classList.remove("text-white", "text-red-400");
    selectText.classList.add("text-gray-500");
    attendanceInput.value = "";
    renderWishes();
  });
}

// Inisialisasi awal
document.addEventListener("DOMContentLoaded", () => {
  loadWeddingData();
  renderWishes();
});
