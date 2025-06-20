document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("nilai-body");

    dataNilai.forEach((item) => {
        const row = document.createElement("tr");

        const colNo = document.createElement("td");
        colNo.textContent = item.no;
        row.appendChild(colNo);

        const colKategori = document.createElement("td");
        colKategori.textContent = item.kategori;
        row.appendChild(colKategori);

        const colNilai = document.createElement("td");
        colNilai.textContent = item.nilai;
        row.appendChild(colNilai);

        tbody.appendChild(row);
    });
});


function downloadPDF() {
    const nama = getCookieValue("nama") || "Mahasiswa";

    const doc = new window.jspdf.jsPDF();
    doc.setFontSize(16);
    doc.text(`Nilai ${nama} - Seminar Akhir`, 14, 15);

    const headers = [["No", "Kategori", "Nilai"]];
    const rows = dataNilai.map(item => [item.no, item.kategori, item.nilai]);

    doc.autoTable({
        head: headers,
        body: rows,
        startY: 25,
        styles: { fontSize: 12 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const filename = `nilai_${nama.replace(/\s+/g, "_")}.pdf`;
    doc.save(filename);
}
