document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year-select');
    const monthButtons = document.getElementById('month-buttons');

    if (yearSelect) {
        for (let y = 2023; y <= 2030; y++) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.text = y;
            if (y === new Date().getFullYear()) opt.selected = true;
            yearSelect.appendChild(opt);
        }

        yearSelect.addEventListener('change', renderMonthButtons);
        renderMonthButtons();
    }

    function renderMonthButtons() {
        const selectedYear = parseInt(yearSelect.value);
        monthButtons.innerHTML = '';

        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        months.forEach((name, idx) => {
            const btn = document.createElement('button');
            btn.textContent = name;
            btn.dataset.month = idx + 1;
            btn.onclick = () => {
                window.location.href = `/schedule/calendar?year=${selectedYear}&month=${idx + 1}`;
            };
            monthButtons.appendChild(btn);
        });
    }
});
