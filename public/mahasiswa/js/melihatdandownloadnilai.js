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

function cetakNilai() {
    window.print();
}
