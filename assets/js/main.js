import { initAnimations } from "./modules/animation.js";
import { initParticles } from "./modules/particles.js";
import { initCountdown } from "./modules/countdown.js";
import { initRSVP } from "./modules/rsvp.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil nama tamu dari URL (?to=Nama Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to") || "Tamu Undangan";
  document.getElementById("guest-name").innerText = guestName;

  // 2. Inisiasi library AOS (Animasi Scroll)
  AOS.init({ once: true, offset: 50, duration: 1000 });

  // 3. Inisialisasi Peta Leaflet (Dark Mode Tema Navy Premium)
  const mapOptions = {
    scrollWheelZoom: false,
    zoomControl: false, // Hilangkan tombol + dan -
    attributionControl: false, // Hilangkan tulisan copyright bawah
  };

  // Peta Akad (-6.2755, 106.7367 adalah contoh koordinat Bintaro)
  const mapAkad = L.map("map-akad", mapOptions).setView(
    [-6.2755, 106.7367],
    15,
  );
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapAkad);

  // Peta Resepsi (-6.2168, 106.7981 adalah contoh koordinat Senayan)
  const mapResepsi = L.map("map-resepsi", mapOptions).setView(
    [-6.2168, 106.7981],
    15,
  );
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapResepsi);

  // Custom Icon Marker Elegan untuk Peta
  const premiumIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color:#D4AF37; width:16px; height:16px; border-radius:50%; border:3px solid #0B192C; box-shadow: 0 0 10px rgba(212,175,55,0.8);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  L.marker([-6.2755, 106.7367], { icon: premiumIcon }).addTo(mapAkad);
  L.marker([-6.2168, 106.7981], { icon: premiumIcon }).addTo(mapResepsi);

  // Mencegah Peta Error/Abu-abu sebagian akibat render animasi lambat
  setTimeout(() => {
    mapAkad.invalidateSize();
    mapResepsi.invalidateSize();
  }, 1500);

  // 4. Inisiasi Swiper Gallery
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

  // 5. Inisiasi Countdown & RSVP Form
  initCountdown();
  initRSVP();

  // 6. Logika Navbar Scroll & Mobile Menu
  const navbar = document.getElementById("navbar");
  const heroSection = document.getElementById("hero");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  // Deteksi Scroll untuk merubah background Navbar
  window.addEventListener("scroll", () => {
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

  // 7. Handle Opening Screen (Buka Undangan)
  const btnOpen = document.getElementById("btn-open");
  const openingScreen = document.getElementById("opening-screen");

  btnOpen.addEventListener("click", () => {
    // Animasi slide up cover undangan
    openingScreen.style.transform = "translateY(-100vh)";

    // Buka KUNCI SCROLL VERTIKAL
    document.body.classList.remove("overflow-y-hidden");

    // Munculkan Navbar perlahan
    navbar.classList.remove("opacity-0");

    // Mulai animasi GSAP & Partikel saat undangan dibuka
    initAnimations();
    initParticles();

    // Hapus elemen dari DOM setelah animasi selesai
    setTimeout(() => {
      openingScreen.remove();
    }, 1000);
  });
});
