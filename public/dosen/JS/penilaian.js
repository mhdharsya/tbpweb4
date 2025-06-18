document.addEventListener('DOMContentLoaded', function() {
    // Seleksi Elemen
    const studentSelect = document.getElementById('studentSelect');
    const assessmentForm = document.getElementById('assessmentForm');
    const scoreInputs = document.querySelectorAll('.score-input');
    const finalScoreEl = document.getElementById('finalScore');
    const weightedScoreEls = document.querySelectorAll('.weighted-score');
    const submitButton = document.querySelector('.btn-submit');
    const printButton = document.querySelector('.btn-print');
    const reviseButton = document.querySelector('.btn-revise');

    // --- FUNGSI UTAMA ---

    // 1. Mengisi dropdown mahasiswa
    async function populateStudentDropdown() {
        try {
            const response = await fetch('/dosen/penilaian/api/mahasiswa-bimbingan');
            if (!response.ok) throw new Error('Gagal mengambil data mahasiswa');
            const students = await response.json();
            
            studentSelect.innerHTML = '<option value="">-- Pilih Mahasiswa --</option>';
            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id; // Asumsikan ada ID unik untuk setiap seminar/mahasiswa
                option.textContent = `${student.nama} (${student.nim})`;
                studentSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching students:', error);
            alert('Tidak dapat memuat daftar mahasiswa.');
        }
    }

    // 2. Mengambil data penilaian yang sudah ada jika mahasiswa dipilih
    async function fetchExistingScores(mahasiswaId) {
        // Reset form setiap kali mahasiswa baru dipilih
        resetForm();
        if (!mahasiswaId) {
            setFormDisabled(true);
            return;
        }

        setFormDisabled(false); // Aktifkan form

        try {
            // Anda perlu membuat API endpoint ini di backend
            const response = await fetch(`/dosen/penilaian/api/nilai/${mahasiswaId}`);
            if (response.status === 404) {
                 console.log('Belum ada penilaian untuk mahasiswa ini. Form siap diisi.');
                 return; // Tidak ada data, biarkan form kosong
            }
            if (!response.ok) throw new Error('Gagal mengambil data nilai yang ada.');
            
            const existingData = await response.json();
            
            if (existingData && existingData.nilai) {
                populateForm(existingData.nilai);
            }
        } catch (error) {
            console.error('Error fetching existing scores:', error);
            alert(error.message);
        }
    }

    // 3. Menghitung skor total secara real-time
    function calculateScores() {
        let totalFinalScore = 0;
        scoreInputs.forEach(input => {
            const nilai = parseFloat(input.value) || 0;
            const bobot = parseFloat(input.dataset.weight) || 0;
            const skorTerbobot = (nilai * bobot) / 100;
            totalFinalScore += skorTerbobot;

            // Cari elemen skor terbobot di baris yang sama
            const row = input.closest('tr');
            row.querySelector('.weighted-score').textContent = skorTerbobot.toFixed(2);
        });
        finalScoreEl.textContent = totalFinalScore.toFixed(2);
    }

    // 4. Mengirim data penilaian ke server
    async function submitAssessment(event) {
        event.preventDefault(); // Mencegah form dari reload halaman
        const selectedStudentId = studentSelect.value;
        
        if (!selectedStudentId) {
            alert('Silakan pilih nama mahasiswa terlebih dahulu.');
            return;
        }

        const nilai = Array.from(scoreInputs).map(input => ({
            kategoriId: input.dataset.kategoriId, // Kirim ID, bukan teks
            nilai: parseFloat(input.value) || 0
        }));

        const dataToSubmit = {
            mahasiswaId: selectedStudentId,
            nilai: nilai,
            nilaiAkhir: parseFloat(finalScoreEl.textContent)
        };

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Menyimpan...';

            const response = await fetch('/dosen/penilaian/api/penilaian', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal menyimpan penilaian');
            
            alert('Penilaian berhasil disimpan!');
            window.location.reload();

        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    }

    // --- FUNGSI BANTU ---

    function populateForm(scores) {
        scores.forEach(score => {
            const input = document.querySelector(`.score-input[data-kategori-id='${score.kategoriId}']`);
            if (input) {
                input.value = score.nilai;
            }
        });
        calculateScores(); // Hitung ulang skor setelah memuat data
    }

    function resetForm() {
        assessmentForm.reset();
        weightedScoreEls.forEach(el => el.textContent = '0.00');
        finalScoreEl.textContent = '0.00';
    }
    
    function setFormDisabled(disabled) {
        scoreInputs.forEach(input => input.disabled = disabled);
        submitButton.disabled = disabled;
        printButton.disabled = disabled;
        reviseButton.disabled = disabled;
    }


    // --- EVENT LISTENERS ---

    // Ketika pengguna memilih mahasiswa dari dropdown
    studentSelect.addEventListener('change', () => fetchExistingScores(studentSelect.value));

    // Ketika pengguna memasukkan nilai
    scoreInputs.forEach(input => input.addEventListener('input', calculateScores));

    // Ketika form disubmit
    assessmentForm.addEventListener('submit', submitAssessment);

    // Fungsionalitas Cetak
    printButton.addEventListener('click', () => {
        if (!studentSelect.value) {
            alert('Pilih mahasiswa terlebih dahulu untuk mencetak.');
            return;
        }
        window.print();
    });

    // Fungsionalitas Revisi (Contoh)
    reviseButton.addEventListener('click', () => {
        // Implementasi logika revisi, misal:
        // - Mengirim status 'revisi' ke backend
        // - Membuka modal untuk catatan revisi
        alert('Fungsionalitas "Revisi" belum diimplementasikan.');
    });

    // --- INISIALISASI ---

    populateStudentDropdown();
});