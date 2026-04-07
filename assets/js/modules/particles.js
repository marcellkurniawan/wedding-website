export const initParticles = () => {
  tsParticles.load("tsparticles", {
    particles: {
      number: {
        value: 40,
        density: { enable: true, value_area: 800 },
      },
      color: { value: ["#D4AF37", "#FDF8E7"] }, // Warna Emas dan Kuning Terang
      shape: {
        type: "circle", // Menggunakan lingkaran (debu emas) bukan gambar
      },
      opacity: {
        value: 0.6,
        random: true,
        anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false },
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: true, speed: 2, size_min: 0.5, sync: false },
      },
      move: {
        enable: true,
        speed: 1, // Gerakan perlahan (melayang)
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" }, // Menghindar pelan saat disentuh mouse
        onclick: { enable: false },
      },
    },
    retina_detect: true,
  });
};
