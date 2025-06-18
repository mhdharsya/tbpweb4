// public/js/pages/panduanSeminar.js

// Asumsi createElement, createTable, renderPage sudah tersedia secara global
async function renderPanduanSeminar() {
    console.log('--- ENTERING renderPanduanSeminar ---');
    const cardContent = document.createDocumentFragment();

    const cardHeader = createElement('div', ['card-header']);
    cardHeader.appendChild(createElement('h2', [], 'Panduan Seminar Hasil'));

    const cardBody = createElement('div', ['card-body']);

    const panduanSection = createElement('div', ['panduan-upload-section']);

    // --- BAGIAN BUKU PANDUAN TERBARU ---
    const bookCard = createElement('div', ['panduan-card', 'book-panduan']);
    bookCard.appendChild(createElement('h3', [], 'Buku Panduan Terbaru'));
    const imgContainer = createElement('div', ['panduan-image-container']);
    const pdfLink = createElement('a', [], '', { target: '_blank' }); // Link untuk PDF
    const defaultPdfIcon = createElement('img', ['panduan-thumbnail'], '', {
        src: '/admin/img/pdf-icon.png', // <--- GANTI DENGAN PATH ICON PDF ANDA
        alt: 'PDF Icon'
    });
    pdfLink.appendChild(defaultPdfIcon);
    const pdfTitle = createElement('p', [], 'Memuat...'); // Nama file PDF
    pdfLink.appendChild(pdfTitle);
    imgContainer.appendChild(pdfLink);
    bookCard.appendChild(imgContainer);
    panduanSection.appendChild(bookCard);

    // Fetch latest panduan
    try {
        const response = await fetch('/api/panduan/latest');
        if (response.ok) {
            const latest = await response.json();
            if (latest && latest.id_panduan && latest.nama_file) {
                pdfLink.href = `/api/panduan/file/${latest.id_panduan}`; // URL untuk menampilkan PDF
                pdfTitle.textContent = latest.nama_file;
            } else {
                pdfTitle.textContent = 'Tidak ada panduan tersedia';
                pdfLink.removeAttribute('href'); // Hapus link jika tidak ada file
            }
        } else if (response.status === 404) {
            pdfTitle.textContent = 'Tidak ada panduan tersedia';
            pdfLink.removeAttribute('href');
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching latest panduan:", error);
        pdfTitle.textContent = 'Gagal memuat panduan terbaru';
        pdfLink.removeAttribute('href');
    }


    // --- BAGIAN UPLOAD PANDUAN ---
    const uploadCard = createElement('div', ['panduan-card', 'upload-panduan']);
    uploadCard.appendChild(createElement('h3', [], 'Unggah Panduan Baru'));
    const uploadArea = createElement('div', ['upload-area']);
    const uploadIcon = createElement('i', ['fas', 'fa-cloud-upload-alt', 'upload-icon']);
    const fileInput = createElement('input', [], '', { type: 'file', id: 'uploadFile', accept: '.pdf' }); // Hanya terima PDF
    fileInput.style.display = 'none';
    const uploadLabel = createElement('label', ['btn-upload-file'], 'Pilih File PDF', { 'for': 'uploadFile' });
    const fileNameSpan = createElement('span', [], 'Belum ada file dipilih'); // Untuk menampilkan nama file yang dipilih
    

    uploadArea.append(uploadIcon, fileInput, uploadLabel, fileNameSpan);
    uploadCard.appendChild(uploadArea);
    panduanSection.appendChild(uploadCard);

    const uploadButton = createElement('button', ['btn-update'], 'Unggah Panduan'); // Tombol untuk memulai upload
    uploadCard.appendChild(uploadButton);

    // Event listener untuk menampilkan nama file yang dipilih
    fileInput.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            fileNameSpan.textContent = event.target.files[0].name;
        } else {
            fileNameSpan.textContent = 'Belum ada file dipilih';
        }
    });

    // Event listener untuk tombol Unggah
    uploadButton.addEventListener('click', async () => {
        if (fileInput.files.length === 0) {
            alert('Mohon pilih file PDF terlebih dahulu.');
            return;
        }
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('pdfFile', file); // 'pdfFile' harus cocok dengan nama field multer di backend (upload.single('pdfFile'))

        try {
            const response = await fetch('/api/panduan/upload', {
                method: 'POST',
                body: formData, // FormData akan mengatur Content-Type secara otomatis
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengunggah panduan.');
            }

            const result = await response.json();
            alert(result.message);
            console.log('Upload berhasil:', result);

            // Bersihkan input file dan refresh tabel setelah berhasil
            fileInput.value = ''; // Reset input file
            fileNameSpan.textContent = 'Belum ada file dipilih';
            renderPage('panduanSeminar'); // Refresh halaman untuk menampilkan daftar terbaru
        } catch (error) {
            console.error('Error saat mengunggah panduan:', error);
            alert(`Gagal mengunggah panduan: ${error.message}`);
        }
    });


    cardBody.appendChild(panduanSection);

    // --- BAGIAN RIWAYAT PANDUAN ---
    const tableHeaders = ['Riwayat', 'Judul', 'Tanggal Unggah', 'Aksi']; // Tambahkan kolom Aksi jika ingin download
    let panduanListData = [];

    try {
        const response = await fetch('/api/panduan/list');
        if (response.ok) {
            const list = await response.json();
            panduanListData = list.map((item, index) => {
                return [
                    index + 1,
                    item.namaFile,
                    item.tanggalUnggah,
                    item.id // Simpan ID untuk tombol aksi
                ];
            });
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching panduan list:", error);
        cardBody.appendChild(createElement('p', ['error-message'], 'Gagal memuat riwayat panduan. ' + error.message));
    }


    const panduanTable = createTable(tableHeaders, panduanListData, (cellData, rowIndex, colIndex, rowData) => {
        if (colIndex === 3) { // Kolom 'Aksi'
            const downloadLink = createElement('a', ['btn-action', 'btn-accept'], 'Lihat/Unduh', {
                href: `/api/panduan/file/${rowData[3]}`, // rowData[3] adalah ID panduan
                // target: '_blank' // Buka di tab baru
            });
            return downloadLink;
        }
        return document.createTextNode(String(cellData));
    });
    panduanTable.classList.add('panduan-table');
    cardBody.appendChild(panduanTable);

    const card = createElement('div', ['card']);
    card.append(cardHeader, cardBody);
    console.log('renderPanduanSeminar: Card created and returned.');
    return card;
}