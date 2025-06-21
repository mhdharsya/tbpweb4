document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            const selectedTab = tab.getAttribute("data-tab");
            alert(`Navigasi ke halaman ${selectedTab}`);
            // window.location.href = `${selectedTab}.html`;
        });
    });

    // PDF functionality
    const pdfContainer = document.getElementById('pdfContainer');
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfControls = document.getElementById('pdfControls');
    const downloadBtn = document.getElementById('downloadBtn');
    const closeBtn = document.getElementById('closeBtn');

    // Sembunyikan tombol di awal
    pdfViewer.style.display = 'none';
    pdfControls.style.display = 'none';

    // Open PDF viewer on container click
    pdfContainer.addEventListener('click', function () {
        console.log('Opening PDF panduan...');
        pdfContainer.style.display = 'none'; // Sembunyikan preview
        pdfViewer.style.display = 'block';
        pdfControls.style.display = 'flex'; // Tampilkan tombol kontrol
    });

    // Download PDF
    downloadBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Downloading PDF panduan...');

        const link = document.createElement('a');
        link.href = pdfViewer.src;
        link.download = 'Panduan-SISemhas.pdf';
        link.click();

        const originalText = this.innerHTML;
        this.innerHTML = '✅ PDF Diunduh!';
        this.style.background = 'linear-gradient(45deg, #48bb78, #38a169)';

        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        }, 2000);
    });

    // Close PDF viewer
    closeBtn.addEventListener('click', function () {
        pdfContainer.style.display = 'flex'; // Tampilkan kembali preview
        pdfViewer.style.display = 'none';
        pdfControls.style.display = 'none'; // Sembunyikan tombol kontrol
    });

    // Subtle animations
    const elements = document.querySelectorAll('.tab, .pdf-container, .btn');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});
