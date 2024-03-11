// Mendapatkan tombol "Next Page"
const nextPageButton = document.getElementById('nextPageButton');

// Menghubungkan tombol dengan URL halaman selanjutnya
nextPageButton.addEventListener('click', () => {
    window.location.href = 'next/index.html'; // Ganti dengan URL yang sesuai
});
