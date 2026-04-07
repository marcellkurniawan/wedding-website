export const initRSVP = () => {
  const form = document.getElementById("rsvp-form");
  const container = document.getElementById("wishes-container");

  if (!form || !container) return; // Mencegah error jika elemen belum ada

  // Fungsi untuk me-render daftar ucapan ke HTML
  const renderWishes = () => {
    // Ambil data dari localStorage, jika kosong gunakan array kosong
    const wishes = JSON.parse(localStorage.getItem("weddingWishes")) || [];

    container.innerHTML = ""; // Bersihkan container

    if (wishes.length === 0) {
      container.innerHTML =
        '<p class="text-center text-gray-500 text-sm">Belum ada ucapan. Jadilah yang pertama!</p>';
      return;
    }

    wishes.forEach((wish) => {
      const badgeColor =
        wish.attendance === "Hadir"
          ? "bg-green-900 text-green-300"
          : "bg-red-900 text-red-300";
      const html = `
                <div class="bg-navy/40 p-4 rounded-lg border border-gold/10 mb-3 text-left">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-bold text-gold">${wish.name}</h4>
                        <span class="text-[10px] px-2 py-1 rounded ${badgeColor}">${wish.attendance}</span>
                    </div>
                    <p class="text-sm text-gray-300">${wish.message}</p>
                </div>
            `;
      container.innerHTML += html;
    });
  };

  // Render ucapan saat pertama kali dimuat
  renderWishes();

  // Handle submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Mencegah reload halaman

    const name = document.getElementById("rsvp-name").value;
    const attendance = document.getElementById("rsvp-attendance").value;
    const message = document.getElementById("rsvp-message").value;

    const newWish = { name, attendance, message };

    // Simpan ke localStorage
    const wishes = JSON.parse(localStorage.getItem("weddingWishes")) || [];
    wishes.unshift(newWish); // Tambahkan di urutan paling atas
    localStorage.setItem("weddingWishes", JSON.stringify(wishes));

    // Reset form dan render ulang
    form.reset();
    renderWishes();

    alert("Terima kasih atas doa dan ucapannya!");
  });
};
