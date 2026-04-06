const state = {
  data: null,
  wishes: JSON.parse(localStorage.getItem("wishes") || "[]"),
  musicPlaying: false,
};

const $ = (id) => document.getElementById(id);

const loader = $("loader");
const opening = $("opening");
const mainContent = $("mainContent");
const openInviteBtn = $("openInviteBtn");
const bgMusic = $("bgMusic");
const musicToggleBtn = $("musicToggleBtn");
const menuToggle = $("menuToggle");
const navLinks = $("navLinks");
const toast = $("toast");
const scrollProgress = $("scrollProgress");

async function loadData() {
  try {
    const res = await fetch("data/wedding.json");
    if (!res.ok) throw new Error("Gagal memuat JSON");
    state.data = await res.json();

    renderAll();
    startCountdown();
    renderWishes();
    setupTilt();

    // Inisialisasi event listener yang sudah dioptimasi
    initOptimizedScroll();
  } catch (e) {
    console.error(e);
    alert("Data undangan gagal dimuat. Cek file data/wedding.json");
  } finally {
    setTimeout(() => loader.classList.add("hidden"), 700);
  }
}

function renderAll() {
  const d = state.data;
  $("openingNames").textContent =
    `${d.couple.groom.nickname} & ${d.couple.bride.nickname}`;
  $("openingDate").textContent = d.event.akad.dateText;
  $("heroNames").textContent =
    `${d.couple.groom.nickname} & ${d.couple.bride.nickname}`;
  $("heroDate").textContent = d.event.akad.dateText;

  $("groomPhoto").src = d.couple.groom.photo;
  $("groomName").textContent = d.couple.groom.name;
  $("groomParents").textContent = d.couple.groom.parents;
  $("groomInstagram").href = d.couple.groom.instagram;

  $("bridePhoto").src = d.couple.bride.photo;
  $("brideName").textContent = d.couple.bride.name;
  $("brideParents").textContent = d.couple.bride.parents;
  $("brideInstagram").href = d.couple.bride.instagram;

  $("akadTitle").textContent = d.event.akad.title;
  $("akadDate").textContent = d.event.akad.dateText;
  $("akadTime").textContent = d.event.akad.time;
  $("akadLocation").textContent = d.event.akad.location;

  $("receptionTitle").textContent = d.event.reception.title;
  $("receptionDate").textContent = d.event.reception.dateText;
  $("receptionTime").textContent = d.event.reception.time;
  $("receptionLocation").textContent = d.event.reception.location;

  $("mapsLink").href = d.event.mapsUrl;
  $("calendarLink").href = buildGoogleCalendarUrl(d);

  $("timeline").innerHTML = d.story
    .map(
      (item) => `
    <article class="timeline-item reveal">
      <h4>${item.year} - ${item.title}</h4>
      <p>${item.desc}</p>
    </article>
  `,
    )
    .join("");

  $("galleryGrid").innerHTML = d.gallery
    .map(
      (src) => `
    <div class="gallery-item reveal"><img src="${src}" alt="Gallery photo" loading="lazy"/></div>
  `,
    )
    .join("");

  $("bankName").textContent = `Bank: ${d.gift.bankName}`;
  $("accountNumber").textContent = d.gift.accountNumber;
  $("accountName").textContent = `a.n. ${d.gift.accountName}`;
  $("ewalletNumber").textContent = d.gift.ewallet;
  $("footerText").textContent =
    d.footerText || "Terima kasih atas doa dan kehadiran Anda.";
}

function startCountdown() {
  const target = new Date(state.data.event.date).getTime();
  const timer = setInterval(() => {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      clearInterval(timer);
      ["cdDays", "cdHours", "cdMinutes", "cdSeconds"].forEach(
        (id) => ($(id).textContent = "0"),
      );
      return;
    }
    $("cdDays").textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
    $("cdHours").textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
    $("cdMinutes").textContent = Math.floor((diff / (1000 * 60)) % 60);
    $("cdSeconds").textContent = Math.floor((diff / 1000) % 60);
  }, 1000);
}

function buildGoogleCalendarUrl(d) {
  const title = encodeURIComponent(
    `Pernikahan ${d.couple.groom.nickname} & ${d.couple.bride.nickname}`,
  );
  const details = encodeURIComponent(
    `Undangan Pernikahan\nLokasi: ${d.event.akad.location}`,
  );
  const location = encodeURIComponent(d.event.akad.location);
  const start = formatDateCal(new Date(d.event.date));
  const end = formatDateCal(
    new Date(new Date(d.event.date).getTime() + 2 * 60 * 60 * 1000),
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

function formatDateCal(date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mi = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
}

function setupInteractions() {
  openInviteBtn.addEventListener("click", () => {
    opening.classList.add("hidden");
    mainContent.classList.remove("hidden");
    document.body.style.overflow = "auto";

    // Trigger scroll ke atas secara instan agar tidak loncat
    window.scrollTo({ top: 0, behavior: "instant" });

    // PERBAIKAN: Jalankan observer SETELAH elemen visible
    setTimeout(() => {
      revealOnScroll();
    }, 50);

    launchConfetti();

    if (!state.musicPlaying) {
      bgMusic
        .play()
        .then(() => {
          state.musicPlaying = true;
          musicToggleBtn.textContent = "🎵 Musik: On";
        })
        .catch(() => {});
    }
  });

  musicToggleBtn.addEventListener("click", () => {
    if (state.musicPlaying) {
      bgMusic.pause();
      state.musicPlaying = false;
      musicToggleBtn.textContent = "🎵 Musik: Off";
    } else {
      bgMusic
        .play()
        .then(() => {
          state.musicPlaying = true;
          musicToggleBtn.textContent = "🎵 Musik: On";
        })
        .catch(() => {});
    }
  });

  menuToggle?.addEventListener("click", () =>
    navLinks.classList.toggle("show"),
  );

  $("rsvpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const wish = {
      name: $("rsvpName").value.trim(),
      attend: $("rsvpAttend").value,
      guests: $("rsvpGuests").value || "1",
      message: $("rsvpMessage").value.trim(),
      time: new Date().toLocaleString("id-ID"),
    };
    if (!wish.name || !wish.attend || !wish.message) return;
    state.wishes.unshift(wish);
    localStorage.setItem("wishes", JSON.stringify(state.wishes));
    renderWishes();
    e.target.reset();
    showToast("Ucapan berhasil dikirim 💛");
  });

  $("copyAccountBtn").addEventListener("click", () =>
    copyText($("accountNumber").textContent, "No. rekening tersalin"),
  );
  $("copyEwalletBtn").addEventListener("click", () =>
    copyText($("ewalletNumber").textContent, "No. e-wallet tersalin"),
  );

  $("shareBtn").addEventListener("click", shareWhatsapp);

  setupLightbox();
}

// PERBAIKAN: Satukan semua event scroll menggunakan requestAnimationFrame (Biar gak lag/patah2)
function initOptimizedScroll() {
  let isScrolling = false;
  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".nav-links a")];
  const heroParallax = $("heroParallax");

  window.addEventListener(
    "scroll",
    () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          // 1. Progress Bar
          const h = document.documentElement;
          const scrolled =
            (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
          scrollProgress.style.width = `${scrolled}%`;

          // 2. Parallax
          if (heroParallax) {
            const y = window.scrollY * 0.08;
            heroParallax.style.transform = `translateY(${Math.min(y, 24)}px)`;
          }

          // 3. Active Nav
          const scrollY = window.scrollY + 120;
          let current = "hero";
          for (const sec of sections) {
            if (scrollY >= sec.offsetTop) current = sec.id;
          }
          links.forEach((a) =>
            a.classList.toggle(
              "active",
              a.getAttribute("href") === `#${current}`,
            ),
          );

          isScrolling = false;
        });
        isScrolling = true;
      }
    },
    { passive: true },
  ); // passive true memperlancar scroll di HP
}

function renderWishes() {
  const wishList = $("wishList");
  if (!state.wishes.length) {
    wishList.innerHTML = `<p class="center small">Belum ada ucapan. Jadilah yang pertama ❤️</p>`;
    return;
  }
  wishList.innerHTML = state.wishes
    .map(
      (w) => `
    <article class="wish-item">
      <strong>${escapeHtml(w.name)}</strong> • <small>${escapeHtml(w.attend)} (${escapeHtml(w.guests)} tamu)</small>
      <p>${escapeHtml(w.message)}</p>
      <small>${escapeHtml(w.time)}</small>
    </article>
  `,
    )
    .join("");
}

function revealOnScroll() {
  const els = document.querySelectorAll(".reveal");
  // Perbesar sedikit area threshold biar muncul duluan saat di scroll
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target); // Lepas observer setelah muncul agar memory enteng
        }
      });
    },
    { threshold: 0.1 },
  );

  els.forEach((el) => obs.observe(el));
}

function setupLightbox() {
  const lightbox = $("lightbox");
  const lightboxImg = $("lightboxImg");
  $("closeLightbox").addEventListener("click", () =>
    lightbox.classList.add("hidden"),
  );
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".gallery-item img");
    if (!img) return;
    lightboxImg.src = img.src;
    lightbox.classList.remove("hidden");
  });
}

function setupTilt() {
  const cards = document.querySelectorAll(".tilt");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = (y / rect.height - 0.5) * -6;
      const ry = (x / rect.width - 0.5) * 6;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0) rotateY(0)";
    });
  });
}

function launchConfetti() {
  const canvas = $("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 10,
    speed: 1 + Math.random() * 3,
    color: Math.random() > 0.5 ? "#c9a227" : "#6fa1ff",
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.y += p.speed;
      if (p.y > canvas.height + 20) p.y = -20;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.w, p.h);
    });
    frame++;
    if (frame < 150) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

function shareWhatsapp() {
  const d = state.data;
  const guest = $("guestName").textContent || "Bapak/Ibu/Saudara/i";
  const text = `Assalamu'alaikum ${guest}%0A%0AAnda diundang ke pernikahan ${d.couple.groom.nickname} & ${d.couple.bride.nickname}.%0A${location.href}`;
  window.open(`https://wa.me/?text=${text}`, "_blank");
}

async function copyText(text, msg) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(msg);
  } catch {
    showToast("Gagal menyalin");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function setGuestFromQuery() {
  const guest = new URLSearchParams(window.location.search).get("to");
  if (guest) $("guestName").textContent = guest;
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.body.style.overflow = "hidden";
setGuestFromQuery();
setupInteractions();
loadData();
