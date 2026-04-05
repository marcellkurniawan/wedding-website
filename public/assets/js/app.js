document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize AOS
  AOS.init({ once: false, mirror: true, offset: 50 });

  // 2. DOM Elements
  const scrollContainer = document.querySelector(".scroll-container");
  const sections = document.querySelectorAll(".snap-section");
  const navLinks = document.querySelectorAll("nav ul li a");
  const bgMusic = document.getElementById("bg-music");
  const musicControl = document.getElementById("music-control");
  let isPlaying = false;
  let userInteracted = false;

  // 3. Handle Auto-Play Music on First Interaction
  const startAudio = () => {
    if (!userInteracted) {
      bgMusic
        .play()
        .then(() => {
          isPlaying = true;
          musicControl.classList.add("spinning");
          musicControl.textContent = "🎵";
          userInteracted = true;
        })
        .catch((e) => console.log("Audio autoplay blocked by browser"));
    }
  };

  // Trigger audio on scroll or click anywhere in the container
  scrollContainer.addEventListener("scroll", startAudio, { once: true });
  document.body.addEventListener("click", startAudio, { once: true });

  musicControl.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent triggering body click
    if (isPlaying) {
      bgMusic.pause();
      musicControl.classList.remove("spinning");
      musicControl.textContent = "🔇";
    } else {
      bgMusic.play();
      musicControl.classList.add("spinning");
      musicControl.textContent = "🎵";
    }
    isPlaying = !isPlaying;
  });

  // 4. ScrollSpy (Active Navbar on Scroll)
  const observerOptions = {
    root: scrollContainer,
    rootMargin: "0px",
    threshold: 0.5, // trigger when 50% of section is visible
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => navObserver.observe(sec));

  // 5. Fetch JSON Data
  fetch("data/wedding.json")
    .then((res) => res.json())
    .then((data) => {
      populateData(data);
      startCountdown(data.event.targetDate);
      renderTimeline(data.timeline);
      renderGallery(data.gallery);
      renderGifts(data.gifts);
      // Refresh AOS after DOM injected
      setTimeout(() => AOS.refresh(), 500);
    });

  function populateData(data) {
    // Couple
    document.getElementById("bride-photo").src = data.bride.photo;
    document.getElementById("bride-name").textContent = data.bride.fullName;
    document.getElementById("bride-parents").textContent = data.bride.parents;
    document.getElementById("bride-bio").textContent = data.bride.bio;

    document.getElementById("groom-photo").src = data.groom.photo;
    document.getElementById("groom-name").textContent = data.groom.fullName;
    document.getElementById("groom-parents").textContent = data.groom.parents;
    document.getElementById("groom-bio").textContent = data.groom.bio;

    // Events
    document.getElementById("akad-time").textContent = data.event.akad.time;
    document.getElementById("akad-venue").textContent = data.event.akad.venue;
    document.getElementById("akad-address").textContent =
      data.event.akad.address;
    document.getElementById("akad-dresscode").textContent =
      data.event.akad.dresscode;

    document.getElementById("resepsi-time").textContent =
      data.event.resepsi.time;
    document.getElementById("resepsi-venue").textContent =
      data.event.resepsi.venue;
    document.getElementById("resepsi-address").textContent =
      data.event.resepsi.address;
    document.getElementById("resepsi-dresscode").textContent =
      data.event.resepsi.dresscode;

    document.getElementById("btn-gcal").href = data.event.gcalLink;
  }

  function renderTimeline(timeline) {
    const container = document.getElementById("timeline-container");
    timeline.forEach((item, index) => {
      const sideClass = index % 2 === 0 ? "timeline-left" : "timeline-right";
      const html = `
                <div class="timeline-item ${sideClass}" data-aos="fade-up">
                    <div class="timeline-content">
                        <h3>${item.year} - ${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                </div>`;
      container.innerHTML += html;
    });
  }

  function renderGallery(images) {
    const container = document.getElementById("gallery-container");
    images.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.setAttribute("data-aos", "zoom-in");
      img.setAttribute("data-aos-delay", (index * 100).toString());
      img.onclick = () => openLightbox(src);
      container.appendChild(img);
    });
  }

  function renderGifts(gifts) {
    const container = document.getElementById("gift-container");
    gifts.forEach((gift, index) => {
      const html = `
                <div class="gift-card" data-aos="flip-up" data-aos-delay="${index * 100}">
                    <h3>${gift.bank}</h3>
                    <p class="mt-2 bold" id="acc-${index}">${gift.accountNumber}</p>
                    <p>a.n ${gift.accountName}</p>
                    <button class="btn-gold mt-2" onclick="copyText('acc-${index}')">Salin Nomor</button>
                </div>`;
      container.innerHTML += html;
    });
  }

  // 6. Countdown Logic
  function startCountdown(target) {
    const countDownDate = new Date(target).getTime();
    setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      if (distance < 0) return;
      document.getElementById("days").innerHTML = String(
        Math.floor(distance / (1000 * 60 * 60 * 24)),
      ).padStart(2, "0");
      document.getElementById("hours").innerHTML = String(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      ).padStart(2, "0");
      document.getElementById("minutes").innerHTML = String(
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      ).padStart(2, "0");
      document.getElementById("seconds").innerHTML = String(
        Math.floor((distance % (1000 * 60)) / 1000),
      ).padStart(2, "0");
    }, 1000);
  }

  // 7. Lightbox Logic
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");

  function openLightbox(src) {
    lightbox.style.display = "flex";
    lightboxImg.src = src;
  }

  closeBtn.onclick = () => (lightbox.style.display = "none");
  lightbox.onclick = (e) => {
    if (e.target === lightbox) lightbox.style.display = "none";
  };

  // 8. Copy to Clipboard API
  window.copyText = function (elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Nomor rekening berhasil disalin!");
      })
      .catch((err) => {
        console.error("Gagal menyalin teks: ", err);
      });
  };

  // 9. RSVP & LocalStorage Logic
  const rsvpForm = document.getElementById("rsvp-form");
  const wishesList = document.getElementById("wishes-list");

  // Load existing wishes
  let wishes = JSON.parse(localStorage.getItem("wedding_wishes")) || [
    {
      name: "John Doe",
      attendance: "Hadir",
      message: "Selamat menempuh hidup baru!",
    }, // dummy starter
  ];

  function renderWishes() {
    wishesList.innerHTML = "";
    // reverse array so newest is on top
    [...wishes].reverse().forEach((wish) => {
      wishesList.innerHTML += `
                <div class="wish-item">
                    <h4>${wish.name} <span style="font-size:0.8em; color:#666;">(${wish.attendance})</span></h4>
                    <p>"${wish.message}"</p>
                </div>
            `;
    });
  }

  renderWishes(); // Init render

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newWish = {
      name: document.getElementById("guest-name").value,
      attendance: document.getElementById("guest-attendance").value,
      message: document.getElementById("guest-message").value,
    };

    wishes.push(newWish);
    localStorage.setItem("wedding_wishes", JSON.stringify(wishes));

    renderWishes();
    rsvpForm.reset();
    alert("Terima kasih atas RSVP dan ucapan Anda!");
  });
});
