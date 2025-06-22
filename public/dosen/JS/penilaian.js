// Lokasi: public/dosen/JS/penilaian.js
document.addEventListener('DOMContentLoaded', function() {
    
<<<<<<< HEAD
    // Seleksi Elemen DOM
=======
    // Seleksi Elemen DOM (tetap sama)
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
    const studentSelect = document.getElementById('studentSelect');
    const assessmentForm = document.getElementById('assessmentForm'); // Ini adalah form interaktif
    const scoreInputs = document.querySelectorAll('.score-input');
<<<<<<< HEAD
    const finalScoreEl = document.getElementById('finalScore');
    const submitButton = document.querySelector('.btn-submit'); // Ini akan selalu jadi "Kirim Penilaian"
    const printButton = document.querySelector('.btn-print');
    // const reviseButton = document.querySelector('.btn-revise'); // HAPUS: Tidak ada lagi tombol Revisi
    const statusSemhasSelect = document.getElementById('statusSemhas');
    const komentarInput = document.getElementById('komentar');

    // Seleksi elemen placeholder untuk laporan cetak (tetap sama)
=======
    const finalScoreEl = document.getElementById('finalScore'); // Nilai akhir di form interaktif
    const submitButton = document.querySelector('.btn-submit');
    const printButton = document.querySelector('.btn-print');
    const reviseButton = document.querySelector('.btn-revise');
    const statusSemhasSelect = document.getElementById('statusSemhas'); // Select status di form interaktif
    const komentarInput = document.getElementById('komentar'); // Textarea komentar di form interaktif

    // Seleksi elemen placeholder untuk laporan cetak (ada di div#printReportContent)
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
    const printStudentNamePlaceholder = document.getElementById('printStudentNamePlaceholder');
    const printStudentIdPlaceholder = document.getElementById('printStudentIdPlaceholder');
    const printDosenNamePlaceholder = document.getElementById('printDosenNamePlaceholder');
    const printDosenIdPlaceholder = document.getElementById('printDosenIdPlaceholder');
    const printJudulPenelitianPlaceholder = document.getElementById('printJudulPenelitianPlaceholder');
    const printDatePlaceholder = document.getElementById('printDatePlaceholder');

    // Seleksi elemen nilai akhir untuk print
<<<<<<< HEAD
    const printFinalScorePlaceholder = document.getElementById('print-final-score-cell');
=======
    const printFinalScorePlaceholder = document.getElementById('print-final-score-cell'); // Ini adalah TD-nya
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
    // Seleksi elemen tanda tangan dosen untuk print
    const printDosenSignatureName = document.getElementById('printDosenSignatureName');
    const printDosenSignatureId = document.getElementById('printDosenSignatureId');
    const printCityDatePlaceholder = document.getElementById('printCityDatePlaceholder');

    // Seleksi placeholder Status & Komentar baru di bawah tabel
    const printStatusPlaceholder = document.getElementById('printStatusPlaceholder');
    const printKomentarPlaceholder = document.getElementById('printKomentarPlaceholder');

<<<<<<< HEAD
=======

>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
    // Ambil data dosen dari hidden input (Pastikan ID ini ada di EJS Anda)
    const loggedInDosenNama = document.getElementById('loggedInDosenNama') ? document.getElementById('loggedInDosenNama').value : '';
    const loggedInDosenId = document.getElementById('loggedInDosenId') ? document.getElementById('loggedInDosenId').value : '';


    // --- FUNGSI UTAMA ---

    async function fetchExistingScores(mahasiswaId) {
        resetForm(); // Reset form interaktif
<<<<<<< HEAD
        setFormDisabled(false); // Aktifkan form interaktif (akan diubah jika tidak ada mahasiswaId)

        if (!mahasiswaId) {
            setFormDisabled(true); // Nonaktifkan form jika tidak ada mahasiswaId
            clearPrintPlaceholders();
            clearPrintScoreAndCommentDataAttributes();
=======
        setFormDisabled(false); // Aktifkan form interaktif

        if (!mahasiswaId) {
            setFormDisabled(true);
            clearPrintPlaceholders(); // Bersihkan placeholder cetak
            clearPrintScoreAndCommentDataAttributes(); // Bersihkan data-attributes cetak
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
            return;
        }

        const selectedOption = studentSelect.options[studentSelect.selectedIndex];
<<<<<<< HEAD
        // const isDinilai = selectedOption.dataset.isDinilai === 'true'; // HAPUS: tidak digunakan lagi untuk mengubah teks tombol submit
        const judulPenelitian = selectedOption.dataset.judulPenelitian || 'Tidak Ada Judul';

        // Logika untuk tombol Submit dan Cetak
        // Tombol submit selalu "Kirim Penilaian"
        submitButton.textContent = 'Kirim Penilaian'; 
        // Tombol cetak bisa aktif jika mahasiswaId dipilih
        printButton.disabled = false; 
        // Tombol Revisi sudah dihapus, jadi tidak perlu logikanya di sini

        // --- Mengisi Placeholder Info Laporan (di luar tabel) --- (Tetap sama)
=======
        const isDinilai = selectedOption.dataset.isDinilai === 'true'; 
        const judulPenelitian = selectedOption.dataset.judulPenelitian || 'Tidak Ada Judul';

        // Logika untuk mengubah teks tombol Submit dan status tombol Revisi/Cetak
        if (isDinilai) {
            submitButton.textContent = 'Update Penilaian';
            reviseButton.disabled = false;
            printButton.disabled = false;
        } else {
            submitButton.textContent = 'Kirim Penilaian';
            reviseButton.disabled = true;
            printButton.disabled = true;
        }

        // --- Mengisi Placeholder Info Laporan (di luar tabel) ---
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        if (printStudentNamePlaceholder) {
            printStudentNamePlaceholder.textContent = selectedOption.textContent.replace('(Sudah Dinilai)', '').trim();
        }
        if (printStudentIdPlaceholder) {
            printStudentIdPlaceholder.textContent = mahasiswaId;
        }
        if (printDosenNamePlaceholder) {
            printDosenNamePlaceholder.textContent = loggedInDosenNama;
        }
        if (printDosenIdPlaceholder) {
            printDosenIdPlaceholder.textContent = loggedInDosenId;
        }
        if (printJudulPenelitianPlaceholder) {
            printJudulPenelitianPlaceholder.textContent = judulPenelitian;
        }
        if (printDatePlaceholder) {
            const now = new Date();
            const options = { 
                year: 'numeric', month: 'long', day: 'numeric', 
                hour: '2-digit', minute: '2-digit', 
                hour12: false 
            };
            const formatter = new Intl.DateTimeFormat('id-ID', options);
            printDatePlaceholder.textContent = formatter.format(now);
        }

        // Mengisi placeholder tanda tangan dosen di footer laporan cetak
        if (printDosenSignatureName) printDosenSignatureName.textContent = loggedInDosenNama;
        if (printDosenSignatureId) printDosenSignatureId.textContent = loggedInDosenId;
        if (printCityDatePlaceholder) {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            printCityDatePlaceholder.textContent = formatter.format(now);
        }
        // --- Akhir Mengisi Placeholder ---


        try {
            const response = await fetch(`/dosen/penilaian/api/nilai/${mahasiswaId}`);
            
            if (response.status === 404) {
                console.log('Belum ada penilaian untuk mahasiswa ini. Form siap diisi.');
<<<<<<< HEAD
                submitButton.textContent = 'Kirim Penilaian'; // Pastikan selalu ini
                printButton.disabled = false; // Tetap aktifkan cetak
                clearPrintScoreAndCommentDataAttributes();
=======
                submitButton.textContent = 'Kirim Penilaian';
                reviseButton.disabled = true;
                printButton.disabled = true;
                
                clearPrintScoreAndCommentDataAttributes(); // Bersihkan data-attributes jika 404
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
                return;
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mengambil data nilai yang ada.');
            }
            
            const existingData = await response.json();
            
            if (existingData) {
                if (existingData.scores) {
<<<<<<< HEAD
                    populateFormScores(existingData.scores);
=======
                    populateFormScores(existingData.scores); // Mengisi form interaktif
                    // Mengisi data-attributes skor untuk sel tabel cetak
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
                    scoreInputs.forEach(input => {
                        const scorePrintCell = document.getElementById(`print-score-${input.dataset.kategoriId}`);
                        if (scorePrintCell) {
                            scorePrintCell.dataset.scoreValue = input.value;
                        }
                    });
                } else {
<<<<<<< HEAD
=======
                    // Kosongkan data-attributes skor jika scores null
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
                    scoreInputs.forEach(input => {
                        const scorePrintCell = document.getElementById(`print-score-${input.dataset.kategoriId}`);
                        if (scorePrintCell) scorePrintCell.dataset.scoreValue = '';
                    });
                }

                if (existingData.commentData) {
                    if (statusSemhasSelect) statusSemhasSelect.value = existingData.commentData.status_semhas;
                    if (komentarInput) komentarInput.value = existingData.commentData.komentar;
                    
<<<<<<< HEAD
                    if (printStatusPlaceholder) printStatusPlaceholder.textContent = existingData.commentData.status_semhas;
                    if (printKomentarPlaceholder) printKomentarPlaceholder.textContent = existingData.commentData.komentar;
                } else {
=======
                    // Mengisi data-attributes untuk placeholder status & komentar baru
                    if (printStatusPlaceholder) printStatusPlaceholder.textContent = existingData.commentData.status_semhas;
                    if (printKomentarPlaceholder) printKomentarPlaceholder.textContent = existingData.commentData.komentar;
                } else {
                     // Kosongkan placeholder status & komentar jika commentData null
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
                    if (printStatusPlaceholder) printStatusPlaceholder.textContent = '';
                    if (printKomentarPlaceholder) printKomentarPlaceholder.textContent = '';
                }
                
<<<<<<< HEAD
=======
                // Mengisi nilai akhir untuk laporan cetak
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
                if (printFinalScorePlaceholder) {
                    printFinalScorePlaceholder.textContent = finalScoreEl.textContent;
                }

<<<<<<< HEAD
                // submitButton.textContent = 'Update Penilaian'; // HAPUS: Ini sudah ditangani di atas
                printButton.disabled = false; // Pastikan tombol cetak aktif
                // reviseButton.disabled = false; // HAPUS: Tidak ada lagi tombol Revisi
=======
                reviseButton.disabled = false;
                printButton.disabled = false;
                submitButton.textContent = 'Update Penilaian';
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
            }
        } catch (error) {
            console.error('Error fetching existing scores:', error);
            alert(`Terjadi kesalahan: ${error.message}`);
<<<<<<< HEAD
            setFormDisabled(true); // Nonaktifkan form jika ada error fetch
            clearPrintScoreAndCommentDataAttributes();
=======
            setFormDisabled(true);
            clearPrintScoreAndCommentDataAttributes(); // Kosongkan jika ada error
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        }
    }

    function calculateScores() {
        let totalFinalScore = 0;
        scoreInputs.forEach(input => {
            const nilai = parseFloat(input.value) || 0;
            const bobot = parseFloat(input.dataset.weight) || 0;
            const skorTerbobot = (nilai * bobot);
            totalFinalScore += skorTerbobot;
        });
        finalScoreEl.textContent = totalFinalScore.toFixed(2);

<<<<<<< HEAD
=======
        // Update print Final Score placeholder saat nilai berubah di form interaktif
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        if (printFinalScorePlaceholder) {
            printFinalScorePlaceholder.textContent = finalScoreEl.textContent;
        }

<<<<<<< HEAD
=======
        // Update data-attributes skor saat nilai berubah di form interaktif
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        scoreInputs.forEach(input => {
            const scorePrintCell = document.getElementById(`print-score-${input.dataset.kategoriId}`);
            if (scorePrintCell) {
                scorePrintCell.dataset.scoreValue = input.value;
            }
        });
    }

    async function submitAssessment(event) {
        event.preventDefault();
        const selectedStudentId = studentSelect.value;
        
        if (!selectedStudentId) {
            alert('Silakan pilih nama mahasiswa terlebih dahulu.');
            return;
        }

        const scores = {};
        scoreInputs.forEach(input => {
<<<<<<< HEAD
            scores[input.dataset.kategoriId] = parseFloat(input.value) || 0; // Tetap kirim sebagai float, controller yang parse
=======
            scores[input.dataset.kategoriId] = parseFloat(input.value) || 0;
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        });

        const statusSemhas = statusSemhasSelect.value;
        const komentar = komentarInput.value;

        if (!statusSemhas) {
            alert('Status Seminar Hasil wajib diisi.');
            return;
        }

        const dataToSubmit = {
            mahasiswaId: selectedStudentId,
            scores: scores,
            status_semhas: statusSemhas,
            komentar: komentar
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
            if (!response.ok) {
                throw new Error(result.message || 'Gagal menyimpan penilaian');
            }
            
            alert('Penilaian berhasil disimpan!');
            window.location.reload();

        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
        } finally {
            submitButton.disabled = false;
<<<<<<< HEAD
            submitButton.textContent = 'Kirim Penilaian'; // Pastikan kembali ke teks default
=======
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        }
    }

    // --- FUNGSI BANTU ---

    function populateFormScores(scoresObject) {
        for (const key in scoresObject) {
            if (scoresObject.hasOwnProperty(key)) {
                const input = document.querySelector(`.score-input[data-kategori-id='${key}']`);
                if (input) {
                    input.value = parseFloat(scoresObject[key]); 
                }
            }
        }
        calculateScores();
    }

    function resetForm() {
        assessmentForm.reset();
        finalScoreEl.textContent = '0.00';
        if (statusSemhasSelect) statusSemhasSelect.value = '';
        if (komentarInput) komentarInput.value = '';
<<<<<<< HEAD
        clearPrintScoreAndCommentDataAttributes();
=======
        clearPrintScoreAndCommentDataAttributes(); // Tambahkan ini di reset form
        // Also clear info placeholders when resetting form
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        clearPrintPlaceholders();
    }
    
    function setFormDisabled(disabled) {
        scoreInputs.forEach(input => input.disabled = disabled);
        submitButton.disabled = disabled;
        printButton.disabled = disabled;
<<<<<<< HEAD
        // reviseButton.disabled = disabled; // HAPUS: Tidak ada lagi tombol Revisi
=======
        reviseButton.disabled = disabled;
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        if (statusSemhasSelect) statusSemhasSelect.disabled = disabled;
        if (komentarInput) komentarInput.disabled = disabled;
    }

<<<<<<< HEAD
=======
    // Fungsi untuk membersihkan semua placeholder info laporan (di luar tabel)
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
    function clearPrintPlaceholders() {
        if (printStudentNamePlaceholder) printStudentNamePlaceholder.textContent = '';
        if (printStudentIdPlaceholder) printStudentIdPlaceholder.textContent = '';
        if (printDosenNamePlaceholder) printDosenNamePlaceholder.textContent = '';
        if (printDosenIdPlaceholder) printDosenIdPlaceholder.textContent = '';
        if (printJudulPenelitianPlaceholder) printJudulPenelitianPlaceholder.textContent = '';
        if (printDatePlaceholder) printDatePlaceholder.textContent = '';
        if (printDosenSignatureName) printDosenSignatureName.textContent = '';
        if (printDosenSignatureId) printDosenSignatureId.textContent = '';
        if (printCityDatePlaceholder) printCityDatePlaceholder.textContent = '';
    }

<<<<<<< HEAD
    function clearPrintScoreAndCommentDataAttributes() {
=======
    // Fungsi baru untuk membersihkan data-attributes di sel tabel cetak
    function clearPrintScoreAndCommentDataAttributes() {
        // Bersihkan skor
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        scoreInputs.forEach(input => {
            const scorePrintCell = document.getElementById(`print-score-${input.dataset.kategoriId}`);
            if (scorePrintCell) {
                scorePrintCell.dataset.scoreValue = '';
            }
        });
<<<<<<< HEAD
        if (printStatusPlaceholder) printStatusPlaceholder.textContent = '';
        if (printKomentarPlaceholder) printKomentarPlaceholder.textContent = '';
=======
        // Bersihkan status dan komentar
        if (printStatusPlaceholder) printStatusPlaceholder.textContent = '';
        if (printKomentarPlaceholder) printKomentarPlaceholder.textContent = '';
        // Bersihkan nilai akhir
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
        if (printFinalScorePlaceholder) printFinalScorePlaceholder.textContent = '0.00';
    }


    // --- EVENT LISTENERS ---

    studentSelect.addEventListener('change', () => {
        fetchExistingScores(studentSelect.value);
    });

    scoreInputs.forEach(input => input.addEventListener('input', calculateScores));
    // Update data-attributes untuk status dan komentar saat ada perubahan di form interaktif
    if (statusSemhasSelect) {
        statusSemhasSelect.addEventListener('input', () => {
            if (printStatusPlaceholder) printStatusPlaceholder.textContent = statusSemhasSelect.value;
        });
    }
    if (komentarInput) {
        komentarInput.addEventListener('input', () => {
            if (printKomentarPlaceholder) printKomentarPlaceholder.textContent = komentarInput.value;
        });
    }


<<<<<<< HEAD
    if (statusSemhasSelect) {
        statusSemhasSelect.addEventListener('input', () => {
            if (printStatusPlaceholder) printStatusPlaceholder.textContent = statusSemhasSelect.value;
        });
    }
    if (komentarInput) {
        komentarInput.addEventListener('input', () => {
            if (printKomentarPlaceholder) printKomentarPlaceholder.textContent = komentarInput.value;
        });
    }

=======
>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
    assessmentForm.addEventListener('submit', submitAssessment);

    printButton.addEventListener('click', () => {
        if (!studentSelect.value) {
            alert('Pilih mahasiswa terlebih dahulu untuk mencetak.');
            return;
        }
        window.print();
    });

<<<<<<< HEAD
    // reviseButton.addEventListener('click', () => { // HAPUS: Tidak ada lagi tombol Revisi
    //     if (!studentSelect.value) {
    //         alert('Pilih mahasiswa terlebih dahulu untuk merevisi.');
    //         return;
    //     }
    //     
    //     const confirmRevise = confirm('Anda yakin ingin merevisi penilaian ini? Status seminar akan diubah menjadi "REVISI".');
    //     if (!confirmRevise) {
    //         return;
    //     }

    //     if (statusSemhasSelect) {
    //         statusSemhasSelect.value = 'REVISI';
    //         if (printStatusPlaceholder) printStatusPlaceholder.textContent = 'REVISI';
    //     }
    //     
    //     alert('Form penilaian siap untuk direvisi. Silakan ubah nilai atau komentar dan klik "Kirim Penilaian".'); // Ubah teks tombol di alert
    // });

=======
    reviseButton.addEventListener('click', () => {
        if (!studentSelect.value) {
            alert('Pilih mahasiswa terlebih dahulu untuk merevisi.');
            return;
        }
        
        const confirmRevise = confirm('Anda yakin ingin merevisi penilaian ini? Status seminar akan diubah menjadi "REVISI".');
        if (!confirmRevise) {
            return;
        }

        if (statusSemhasSelect) {
            statusSemhasSelect.value = 'REVISI';
            // Pastikan placeholder status juga terupdate
            if (printStatusPlaceholder) printStatusPlaceholder.textContent = 'REVISI';
        }
        
        alert('Form penilaian siap untuk direvisi. Silakan ubah nilai atau komentar dan klik "Update Penilaian".');
    });

>>>>>>> 58f18611fc873b2acc297e72c8b47363e8d23b61
    // --- INISIALISASI SAAT HALAMAN DIMUAT ---
    if (studentSelect.value) {
        fetchExistingScores(studentSelect.value);
    } else {
        setFormDisabled(true);
        clearPrintPlaceholders();
        clearPrintScoreAndCommentDataAttributes();
    }
});