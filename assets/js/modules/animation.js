export const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Efek Bloom (Mekar) pada elemen text Hero Section
  gsap.from(".bloom-text", {
    y: 30,
    opacity: 0,
    scale: 0.9,
    duration: 1.5,
    stagger: 0.3,
    ease: "power3.out",
    delay: 0.5,
  });

  // 2. Animasi Floating Leaves (Daun bergerak naik turun lembut berulang kali)
  // Ini membuat website terasa "hidup" tapi tidak berlebihan
  gsap.to(".floating-leaf", {
    y: -15,
    x: 10,
    rotation: 5,
    duration: 4,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  // 3. Floral Corner Reveal saat scroll
  gsap.utils.toArray(".floral-corner").forEach((corner) => {
    gsap.from(corner, {
      scrollTrigger: {
        trigger: corner,
        start: "top 80%",
      },
      scale: 0,
      rotation: 45,
      opacity: 0,
      duration: 1.5,
      ease: "back.out(1.5)",
    });
  });
};
