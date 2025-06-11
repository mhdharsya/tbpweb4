        // Seminar item click handlers
        document.querySelectorAll('.seminar-item').forEach(item => {
            item.addEventListener('click', function() {
                alert('Membuka detail seminar...');
            });
        });

        // Button click handlers
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                alert(`Membuka ${this.textContent}...`);
            });
        });

        document.querySelector('.eval-btn').addEventListener('click', function() {
            alert('Membuka form evaluasi...');
        });

        document.querySelector('.guide-btn').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Membuka buku panduan...');
        });