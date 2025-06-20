// Variabel global untuk menampung instance DataTable
let table;
// Variabel global untuk seminar ID yang akan diupdate
let currentSeminarId = null;

$(document).ready(function() {
    // 1. Inisialisasi DataTables
    table = $('#riwayatSeminarTable').DataTable({
        "processing": true, // Menampilkan indikator loading
        "serverSide": true, // Mengaktifkan server-side processing
        "ajax": {
            "url": "/dosen/riwayatseminar/api/data", // URL API dari controller Anda
            "type": "GET"
        },
        "columns": [
            { "data": "no", "orderable": false, "searchable": false },
            { "data": "nim" },
            { "data": "nama" },
            { "data": "judul" },
            { "data": "status", "orderable": false, "searchable": false },
            { "data": "tanggalSeminar" },
            { "data": "actions", "orderable": false, "searchable": false }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.13.7/i18n/id.json" // Terjemahan Bahasa Indonesia
        },
        "responsive": true
    });

    // 2. Event listener untuk form submit di modal
    $('#updateForm').on('submit', function(e) {
        e.preventDefault(); // Mencegah form dari reload halaman

        const status = $('#statusSelect').val();
        const catatan = $('#catatanText').val();

        if (!status) {
            Swal.fire('Error', 'Silakan pilih status terlebih dahulu.', 'error');
            return;
        }

        // Kirim data menggunakan Fetch API
        fetch(`/dosen/riwayatseminar/status/${currentSeminarId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status, catatan: catatan })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeModal();
                Swal.fire({
                    title: 'Berhasil!',
                    text: data.message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                table.ajax.reload(null, false); // Reload tabel tanpa kembali ke halaman pertama
            } else {
                Swal.fire('Gagal!', data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            Swal.fire('Error!', 'Terjadi kesalahan saat menghubungi server.', 'error');
        });
    });
});

// 3. Fungsi yang dipanggil dari tombol 'Detail' di dalam tabel
function viewDetail(id) {
    // Arahkan ke halaman detail sesuai rute yang sudah dibuat
    window.location.href = `/dosen/riwayatseminar/detail/${id}`;
}

// 4. Fungsi yang dipanggil dari tombol 'Update' di dalam tabel
function updateStatus(id) {
    // Simpan ID seminar yang dipilih ke variabel global
    currentSeminarId = id;
    
    // Reset form sebelum ditampilkan
    $('#updateForm')[0].reset();

    // Tampilkan modal
    $('#updateModal').removeClass('hidden');
}

// 5. Fungsi untuk menutup modal
function closeModal() {
    $('#updateModal').addClass('hidden');
}