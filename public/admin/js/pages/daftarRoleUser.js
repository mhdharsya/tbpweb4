// public/js/pages/daftarRoleUser.js

// Asumsi createElement, createTable, pendingRoleUpdates, renderPage sudah tersedia secara global

async function renderDaftarRoleUser() {
    console.log('--- ENTERING renderDaftarRoleUser ---');
    const cardContent = document.createDocumentFragment();

    const cardHeader = createElement('div', ['card-header']);
    cardHeader.appendChild(createElement('h2', [], 'Daftar Role User'));

    // --- BAGIAN FILTER INI DIHAPUS SEPENUHNYA ---
    // Karena kita sudah memutuskan untuk tidak memiliki fitur filter di sini
    // (Kode yang sebelumnya dikomentari di sini, kini dihapus total)
    // --- AKHIR BAGIAN FILTER YANG DIHAPUS ---

    const cardBody = createElement('div', ['card-body']);

    let tableData = []; // Pastikan deklarasi ini ada di sini.

    try {
        // URL API sekarang selalu sama, tanpa parameter filter
        const apiUrl = '/api/users'; // URL API disederhanakan
        console.log('renderDaftarRoleUser: Attempting to fetch data from:', apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}. Details: ${errorText}`);
        }
        const users = await response.json();
        console.log('renderDaftarRoleUser: Data received from API:', users);

        tableData = users.map((user, index) => {
            return [
                index + 1,
                user.name, // user.name berasal dari user.nama_lengkap di service
                user.email,
                user.role, // user.role berasal dari Enum (ADMIN, DOSEN, dll)
                '' // Kolom update
            ];
        });
        console.log('renderDaftarRoleUser: Formatted tableData:', tableData);

    } catch (error) {
        console.error("renderDaftarRoleUser: Failed to fetch user data:", error);
        cardBody.appendChild(createElement('p', ['error-message'], 'Gagal memuat data pengguna. ' + error.message));
    }

    const tableHeaders = ['No', 'Nama', 'Email', 'Role', 'Update'];
    const userTable = createTable(tableHeaders, tableData, (cellData, rowIndex, colIndex, row) => {
        if (colIndex === 4) { // Kolom 'Update'
            const selectUpdate = createElement('select');
            // Opsi role yang tersedia
            ['Mahasiswa', 'Dosen', 'Admin', 'Kadep'].forEach(optionText => {
                const option = createElement('option', [], optionText);
                // Membandingkan dengan role dari backend (user.role) yang sekarang UPPERCASE ENUM
                if (optionText.toUpperCase() === String(row[3])) { // row[3] adalah user.role (Enum String), pastikan string
                    option.selected = true;
                }
                selectUpdate.appendChild(option);
            });

            selectUpdate.addEventListener('change', (event) => {
                const newRole = event.target.value; // Ini akan tetap lowercase dari dropdown
                const userEmail = row[2]; // Email user
                // pendingRoleUpdates akan menyimpan newRole (lowercase)
                pendingRoleUpdates.set(userEmail, newRole);
                console.log(`Perubahan role disimpan sementara untuk ${userEmail}: ${row[3]} -> ${newRole}`);
            });
            return selectUpdate;
        }
        return document.createTextNode(String(cellData)); // Pastikan data sel diubah ke string
    });
    cardBody.appendChild(userTable);

    const cardFooter = createElement('div', ['card-footer']);
    const updateButton = createElement('button', ['btn-update'], 'Update Role');

    updateButton.addEventListener('click', async () => {
        if (pendingRoleUpdates.size === 0) {
            alert('Tidak ada perubahan role yang terdeteksi.');
            return;
        }

        const updatesToSend = Array.from(pendingRoleUpdates.entries()).map(([email, newRole]) => ({ email, newRole }));
        console.log('Mengirim update role ke backend:', updatesToSend);

        try {
            const response = await fetch('/api/users/roles', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatesToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengupdate role.');
            }

            const result = await response.json();
            alert(`Update role selesai: ${result.message}\nDetail: ${result.results.map(r => `${r.email}: ${r.message}`).join('\n')}`);
            console.log('Update role berhasil:', result);

            pendingRoleUpdates.clear();
            renderPage('daftarRoleUser'); // Refresh halaman untuk menampilkan role terbaru
        } catch (error) {
            console.error('Error saat mengupdate role:', error);
            alert(`Gagal mengupdate role: ${error.message}`);
        }
    });

    cardFooter.appendChild(updateButton);

    const card = createElement('div', ['card']);
    card.append(cardHeader, cardBody, cardFooter);
    console.log('renderDaftarRoleUser: Card created and returned.');
    return card;
}