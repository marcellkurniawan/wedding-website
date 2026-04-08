import { initAnimations } from "./modules/animation.js";
import { initParticles } from "./modules/particles.js";
import { initCountdown } from "./modules/countdown.js";
import { initRSVP } from "./modules/rsvp.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil nama tamu dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to") || "Tamu Undangan";
  document.getElementById("guest-name").innerText = guestName;

  // 2. Inisiasi library AOS
  AOS.init({ once: true, offset: 50, duration: 1000 });

  // 3. Inisiasi Swiper Gallery (Langsung jalan di awal)
  new Swiper(".gallery-swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // 4. Inisiasi Countdown & RSVP Form
  initCountdown();
  initRSVP();

  const navbar = document.getElementById("navbar");
  const heroSection = document.getElementById("hero");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  // Deteksi Scroll untuk merubah background Navbar
  window.addEventListener("scroll", () => {
    // Jika scroll melewati setengah tinggi Hero Section
    if (window.scrollY > heroSection.offsetHeight / 2) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  });

  // Buka/Tutup Mobile Menu
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-full");
  });

  closeMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("translate-x-full");
  });

  // Tutup menu otomatis saat link diklik (di versi Mobile)
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
    });
  });

  // 5. Handle Opening Screen
  // 5. Handle Opening Screen
  const btnOpen = document.getElementById("btn-open");
  const openingScreen = document.getElementById("opening-screen");

  btnOpen.addEventListener("click", () => {
    // Animasi slide up cover undangan
    openingScreen.style.transform = "translateY(-100vh)";

    // Buka KUNCI SCROLL VERTIKAL (biarkan overflow-x-hidden tetap ada di HTML)
    document.body.classList.remove("overflow-y-hidden");

    // Munculkan Navbar perlahan
    navbar.classList.remove("opacity-0");

    // Mulai animasi GSAP & Partikel saat undangan dibuka
    initAnimations();
    initParticles();

    // Hapus elemen dari DOM setelah animasi selesai agar tidak memberatkan
    setTimeout(() => {
      openingScreen.remove();
    }, 1000);
  });
});
