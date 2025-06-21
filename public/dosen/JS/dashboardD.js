document.addEventListener('DOMContentLoaded', function() {
    // Fungsi ini akan dipanggil saat seluruh halaman HTML selesai dimuat

    function generateCalendar() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const today = now.getDate();
        

        // SOLUSI 2: Menggunakan Bahasa Indonesia
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        // Setel header bulan
        const monthHeader = document.getElementById('monthHeader');
        if (monthHeader) {
            monthHeader.textContent = monthNames[currentMonth] + ' ' + currentYear;
        }

        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) {
            console.error("Elemen dengan ID 'calendarGrid' tidak ditemukan.");
            return;
        }

        // Hapus hari-hari kalender yang ada (sisakan header)
        const existingDays = calendarGrid.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        // Dapatkan hari pertama dalam sebulan dan jumlah hari dalam sebulan
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0=Minggu, 1=Senin,..
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Tambahkan sel kosong untuk hari sebelum bulan dimulai
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Tambahkan hari-hari dalam sebulan
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // SOLUSI 3: Logika 'today' yang lebih aman
            if (day === today && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
                dayElement.classList.add('today');
            }

            // Tambahkan event click
            dayElement.addEventListener('click', function() {
                if (this.textContent.trim()) {
                    // Hapus seleksi dari hari lain
                    const selectedDay = document.querySelector('.calendar-day.selected');
                    if (selectedDay) {
                        selectedDay.classList.remove('selected');
                    }
                    // Tambahkan seleksi ke hari yang diklik
                    this.classList.add('selected');
                }
            });

            calendarGrid.appendChild(dayElement);
        }
    }

    // SOLUSI 1: Jalankan kalender HANYA SEKALI saat halaman dimuat.
    generateCalendar();

    // OPSIONAL: Jika Anda ingin kalender update otomatis saat tengah malam
    function scheduleNextCalendarUpdate() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msUntilMidnight = tomorrow - now;

        setTimeout(() => {
            generateCalendar(); // Buat ulang kalender tepat saat tengah malam
            setInterval(generateCalendar, 24 * 60 * 60 * 1000); // Lalu ulangi setiap 24 jam
        }, msUntilMidnight);
    }
    
    scheduleNextCalendarUpdate(); // Panggil penjadwalan update
});