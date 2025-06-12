document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');

    // Fungsi pembantu untuk membuat elemen dengan kelas dan teks
    function createElement(tag, classes = [], textContent = '', attributes = {}) {
        const element = document.createElement(tag);
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        if (textContent) {
            element.textContent = textContent;
        }
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }

    // Fungsi untuk membuat header
    function createHeader() {
        const header = createElement('header', ['header']);

        const headerLeft = createElement('div', ['header-left']);
        const mobileToggle = createElement('i', ['fas', 'fa-arrow-left', 'mobile-sidebar-toggle']);
        const titleSpan = createElement('span', [], 'SISemhas - Universitas Andalas');
        headerLeft.append(mobileToggle, titleSpan);

        const headerRight = createElement('div', ['header-right']);
        const userIcon = createElement('i', ['far', 'fa-user-circle', 'user-icon']);
        headerRight.appendChild(userIcon);

        header.append(headerLeft, headerRight);
        return header;
    }

    // Fungsi untuk membuat sidebar
    function createSidebar(activePage) {
        const aside = createElement('aside', ['sidebar']);
        const ul = createElement('ul', ['sidebar-menu']);

        const menuItems = [
            { text: 'Daftar Role User', id: 'daftarRoleUser' },
            { text: 'Permintaan Akses', id: 'permintaanAkses' },
            { text: 'Panduan Seminar Hasil', id: 'panduanSeminar' },
            { text: 'Evaluasi Sistem', id: 'evaluasiSistem' },
            { text: 'Daftar Jadwal', id: 'daftarJadwal' },
        ];

        menuItems.forEach(item => {
            const li = createElement('li');
            const a = createElement('a', [], item.text, { href: '#' }); // Gunakan '#' karena JS yang akan menangani
            a.dataset.page = item.id; // Data attribute untuk identifikasi halaman

            if (item.id === activePage) {
                a.classList.add('active');
            }

            a.addEventListener('click', (e) => {
                e.preventDefault(); // Mencegah reload halaman
                renderPage(item.id);
            });

            li.appendChild(a);
            ul.appendChild(li);
        });

        aside.appendChild(ul);

        // Toggle sidebar di mobile
        // Ini perlu ada di sini agar event listener terpasang saat sidebar dibuat
        setTimeout(() => { // Sedikit delay untuk memastikan DOM sudah ada
            const mobileToggle = document.querySelector('.mobile-sidebar-toggle');
            const sidebar = document.querySelector('.sidebar');
            if (mobileToggle && sidebar) {
                mobileToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('active');
                });
            }
        }, 0);


        return aside;
    }

    // Fungsi untuk membuat tabel generik
    function createTable(headers, data, renderCellContent) {
        const table = createElement('table', ['user-table']);
        const thead = createElement('thead');
        const tbody = createElement('tbody');

        const headerRow = createElement('tr');
        headers.forEach(headerText => {
            const th = createElement('th', [], headerText);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        data.forEach((rowData, rowIndex) => {
            const tr = createElement('tr');
            rowData.forEach((cellData, colIndex) => {
                const td = createElement('td');
                // Menggunakan fungsi callback untuk mengisi konten sel yang spesifik
                td.appendChild(renderCellContent(cellData, rowIndex, colIndex, rowData));
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.append(thead, tbody);
        return table;
    }


    // --- Halaman: Daftar Role User ---
    function renderDaftarRoleUser() {
        const cardContent = document.createDocumentFragment(); // Untuk efisiensi

        const cardHeader = createElement('div', ['card-header']);
        cardHeader.appendChild(createElement('h2', [], 'Daftar Role User'));

        const roleFilter = createElement('div', ['role-filter']);
        roleFilter.appendChild(createElement('label', [], 'Role :', { 'for': 'role-select' }));
        const selectFilter = createElement('select', [], '', { id: 'role-select' });
        ['Semua', 'Mahasiswa', 'Dosen', 'Admin'].forEach(optionText => {
            const option = createElement('option', [], optionText, { value: optionText.toLowerCase() });
            selectFilter.appendChild(option);
        });
        roleFilter.appendChild(selectFilter);
        cardHeader.appendChild(roleFilter);

        const cardBody = createElement('div', ['card-body']);
        const tableHeaders = ['No', 'Nama', 'Email', 'Role', 'Update'];
        const tableData = [
            ['1', 'andi', 'a@student.unand.ac.id', 'Mahasiswa',''],
            ['2', 'budi', 'b@student.unand.ac.id', 'Mahasiswa',''],
            ['3', 'cika', 'c@student.unand.ac.id', 'Mahasiswa',''],
            ['4', 'dewi', 'd@student.unand.ac.id', 'Mahasiswa',''],
            ['5', 'erwin', 'e@student.unand.ac.id', 'Mahasiswa',''],
            ['6', 'faras', 'f@student.unand.ac.id', 'Mahasiswa',''],
            ['7', 'galih', 'g@student.unand.ac.id', 'Mahasiswa',''],
            ['8', 'hani', 'h@student.unand.ac.id', 'Mahasiswa',''],
            ['9', 'iwan', 'i@student.unand.ac.id', 'Mahasiswa',''],
        ];

        const userTable = createTable(tableHeaders, tableData, (cellData, rowIndex, colIndex, row) => {
            if (colIndex === 4) { // Kolom 'Update'
                const selectUpdate = createElement('select');
                ['Mahasiswa', 'Dosen', 'Admin'].forEach(optionText => {
                    const option = createElement('option', [], optionText);
                    // Perbaikan di sini: Ambil nilai role dari data yang sama dengan yang ditampilkan
                    if (optionText === row[3]) { // row[3] adalah 'Role' yang ditampilkan di tabel
                        option.selected = true;
                    }
                    selectUpdate.appendChild(option);
                });
                return selectUpdate;
            }
            return document.createTextNode(cellData); // Untuk teks biasa
        });
        cardBody.appendChild(userTable);

        const cardFooter = createElement('div', ['card-footer']);
        const updateButton = createElement('button', ['btn-update'], 'Update Role');
        cardFooter.appendChild(updateButton);

        const card = createElement('div', ['card']);
        card.append(cardHeader, cardBody, cardFooter);
        return card;
    }

    // --- Halaman: Permintaan Akses ---
    function renderPermintaanAkses() {
        const cardContent = document.createDocumentFragment();

        const cardHeader = createElement('div', ['card-header']);
        cardHeader.appendChild(createElement('h2', [], 'Permintaan Akses'));

        const cardBody = createElement('div', ['card-body']);
        const tableHeaders = ['No', 'Nama', 'Email', 'Role', 'Aksi'];
        const tableData = [
            ['1', 'andi', 'a@student.unand.ac.id', 'Mahasiswa',''],
            ['2', 'budi', 'b@student.unand.ac.id', 'Mahasiswa',''],
            // ... tambahkan data sesuai kebutuhan
        ];

        const permTable = createTable(tableHeaders, tableData, (cellData, rowIndex, colIndex) => {
            if (colIndex === 4) { // Kolom 'Aksi'
                const actionDiv = createElement('div', ['action-buttons']);
                const acceptBtn = createElement('button', ['btn-action', 'btn-accept'], 'Terima');
                const rejectBtn = createElement('button', ['btn-action', 'btn-reject'], 'Tolak');
                actionDiv.append(acceptBtn, rejectBtn);
                return actionDiv;
            }
            return document.createTextNode(cellData);
        });
        cardBody.appendChild(permTable);

        const card = createElement('div', ['card']);
        card.append(cardHeader, cardBody);
        return card;
    }

    // --- Halaman: Panduan Seminar Hasil ---
    function renderPanduanSeminar() {
        const cardContent = document.createDocumentFragment();

        const cardHeader = createElement('div', ['card-header']);
        cardHeader.appendChild(createElement('h2', [], 'Panduan Seminar Hasil'));

        const cardBody = createElement('div', ['card-body']);

        const panduanSection = createElement('div', ['panduan-upload-section']);

        const bookCard = createElement('div', ['panduan-card', 'book-panduan']);
        bookCard.appendChild(createElement('h3', [], 'Buku Panduan'));
        const imgContainer = createElement('div', ['panduan-image-container']);
        const img = createElement('img', ['panduan-thumbnail'], '', { src: 'placeholder_book.jpg', alt: 'Buku Panduan' });
        imgContainer.appendChild(img);
        bookCard.appendChild(imgContainer);
        panduanSection.appendChild(bookCard);

        const uploadCard = createElement('div', ['panduan-card', 'upload-panduan']);
        uploadCard.appendChild(createElement('h3', [], 'Update Panduan'));
        const uploadArea = createElement('div', ['upload-area']);
        const uploadIcon = createElement('i', ['fas', 'fa-cloud-upload-alt', 'upload-icon']);
        const fileInput = createElement('input', [], '', { type: 'file', id: 'uploadFile' });
        fileInput.style.display = 'none'; // Sembunyikan input asli
        const uploadLabel = createElement('label', ['btn-upload-file'], 'Update File', { 'for': 'uploadFile' });
        uploadArea.append(uploadIcon, fileInput, uploadLabel);
        uploadCard.appendChild(uploadArea);
        panduanSection.appendChild(uploadCard);

        cardBody.appendChild(panduanSection);

        const tableHeaders = ['Riwayat', 'Judul', 'Versi', 'Tanggal Unggah'];
        const tableData = [
            ['1', 'Panduan Penelitian dan Pengabdian Kepada Masyarakat', '2023.1.1', '4/4/2023'],
            ['2', 'Panduan Penelitian dan Pengabdian Kepada Masyarakat', '2023.1.0', '1/1/2023'],
            ['3', 'Panduan Penelitian dan Pengabdian Kepada Masyarakat', '2022.1.1', '4/12/2022'],
        ];

        const panduanTable = createTable(tableHeaders, tableData, (cellData) => document.createTextNode(cellData));
        panduanTable.classList.add('panduan-table'); // Tambahkan kelas spesifik jika perlu
        cardBody.appendChild(panduanTable);

        const card = createElement('div', ['card']);
        card.append(cardHeader, cardBody);
        return card;
    }

    // --- Halaman: Evaluasi Sistem ---
    function renderEvaluasiSistem() {
        const cardContent = document.createDocumentFragment();

        const cardHeader = createElement('div', ['card-header']);
        cardHeader.appendChild(createElement('h2', [], 'Evaluasi Sistem'));

        const roleFilter = createElement('div', ['role-filter']);
        roleFilter.appendChild(createElement('label', [], 'Role :', { 'for': 'role-select-eval' }));
        const selectFilter = createElement('select', [], '', { id: 'role-select-eval' });
        ['Semua', 'Mahasiswa', 'Dosen', 'Admin'].forEach(optionText => {
            const option = createElement('option', [], optionText, { value: optionText.toLowerCase() });
            selectFilter.appendChild(option);
        });
        roleFilter.appendChild(selectFilter);
        cardHeader.appendChild(roleFilter);

        const cardBody = createElement('div', ['card-body']);
        const tableHeaders = ['No', 'Nama', 'Masukan', 'Role'];
        const tableData = [
            ['1', 'andi', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Mahasiswa'],
            ['2', 'budi', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Mahasiswa'],
            ['3', 'cika', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Dosen'],
        ];

        const evalTable = createTable(tableHeaders, tableData, (cellData) => document.createTextNode(cellData));
        cardBody.appendChild(evalTable);

        const card = createElement('div', ['card']);
        card.append(cardHeader, cardBody);
        return card;
    }

    // --- Halaman: Daftar Jadwal ---
    function renderDaftarJadwal() {
        const cardContent = document.createDocumentFragment();

        const cardHeader = createElement('div', ['card-header']);
        cardHeader.appendChild(createElement('h2', [], 'Daftar Jadwal'));

        const cardBody = createElement('div', ['card-body']);
        const tableHeaders = ['No', 'Nim', 'Nama', 'Judul', 'Tanggal', 'Waktu', 'Konfirmasi'];
        const tableData = [
            ['1', '2178xxxxxx', 'andi', 'Lorem ipsum dolor sit amet.', '20/05/2023', '10.00 - 11.00 WIB',''],
            ['2', '2178xxxxxx', 'budi', 'Lorem ipsum dolor sit amet.', '22/05/2023', '13.00 - 14.00 WIB',''],
            ['3', '2178xxxxxx', 'cika', 'Lorem ipsum dolor sit amet.', '24/05/2023', '13.00 - 14.00 WIB',''],
        ];

        const jadwalTable = createTable(tableHeaders, tableData, (cellData, rowIndex, colIndex) => {
            if (colIndex === 6) { // Kolom 'Konfirmasi'
                const actionDiv = createElement('div', ['action-buttons']);
                const confirmBtn = createElement('button', ['btn-action', 'btn-confirm'], 'Konfirmasi');
                const cancelBtn = createElement('button', ['btn-action', 'btn-cancel'], 'Batal');
                actionDiv.append(confirmBtn, cancelBtn);
                return actionDiv;
            }
            return document.createTextNode(cellData);
        });
        cardBody.appendChild(jadwalTable);

        const cardFooter = createElement('div', ['card-footer']);
        const confirmAllBtn = createElement('button', ['btn-update'], 'Konfirmasi Semua');
        cardFooter.appendChild(confirmAllBtn);

        const card = createElement('div', ['card']);
        card.append(cardHeader, cardBody, cardFooter);
        return card;
    }


    // --- Fungsi Utama untuk Merender Seluruh Halaman ---
    function renderPage(pageId) {
        appContainer.innerHTML = ''; // Bersihkan konten sebelumnya

        const header = createHeader();
        const mainContent = createElement('main', ['main-content']);
        const sidebar = createSidebar(pageId);
        const contentArea = createElement('section', ['content-area']);

        let pageContent;
        switch (pageId) {
            case 'daftarRoleUser':
                pageContent = renderDaftarRoleUser();
                break;
            case 'permintaanAkses':
                pageContent = renderPermintaanAkses();
                break;
            case 'panduanSeminar':
                pageContent = renderPanduanSeminar();
                break;
            case 'evaluasiSistem':
                pageContent = renderEvaluasiSistem();
                break;
            case 'daftarJadwal':
                pageContent = renderDaftarJadwal();
                break;
            default:
                pageContent = renderDaftarRoleUser(); // Default page
                pageId = 'daftarRoleUser'; // Set active for default
        }

        contentArea.appendChild(pageContent);
        mainContent.append(sidebar, contentArea);
        appContainer.append(header, mainContent);

        // Update active class on sidebar after rendering
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Render halaman default saat aplikasi pertama kali dimuat
    renderPage('daftarRoleUser');
});