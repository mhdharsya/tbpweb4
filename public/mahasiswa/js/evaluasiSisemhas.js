document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            const selectedTab = tab.getAttribute("data-tab");
            alert(`Navigasi ke halaman ${selectedTab}`);
            // Ganti alert dengan window.location.href jika ingin pindah halaman:
            // window.location.href = `${selectedTab}.html`;
        });
    });

    const evaluationForm = document.getElementById("evaluationForm");

    evaluationForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const ratings = ["q1", "q2", "q3", "q4", "q5"];
        let isValid = true;

        ratings.forEach((question) => {
            const selected = document.querySelector(`input[name="${question}"]:checked`);
            if (!selected) {
                isValid = false;
            }
        });

        if (!isValid) {
            alert("Silakan isi semua pertanyaan sebelum mengirim.");
            return;
        }

        const data = {
            q1: document.querySelector('input[name="q1"]:checked').value,
            q2: document.querySelector('input[name="q2"]:checked').value,
            q3: document.querySelector('input[name="q3"]:checked').value,
            q4: document.querySelector('input[name="q4"]:checked').value,
            q5: document.querySelector('input[name="q5"]:checked').value,
            saran: document.getElementById("saran").value,
            kritik: document.getElementById("kritik").value,
        };

        console.log("Data evaluasi:", data);

        alert("Terima kasih atas evaluasi Anda!");
        evaluationForm.reset();
    });
});
