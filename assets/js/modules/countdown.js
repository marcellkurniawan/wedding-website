export const initCountdown = () => {
  // Tentukan tanggal pernikahan (Format: Tahun, Bulan (0-11), Tanggal, Jam, Menit, Detik)
  // Bulan di JS dimulai dari 0 (0 = Januari, 11 = Desember)
  const weddingDate = new Date(2026, 11, 12, 8, 0, 0).getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      document.getElementById("days").innerText = "00";
      document.getElementById("hours").innerText = "00";
      document.getElementById("minutes").innerText = "00";
      document.getElementById("seconds").innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").innerText = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").innerText = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").innerText = seconds
      .toString()
      .padStart(2, "0");
  };

  // Update setiap detik
  setInterval(updateCountdown, 1000);
  updateCountdown(); // Panggil sekali di awal agar tidak delay 1 detik
};
