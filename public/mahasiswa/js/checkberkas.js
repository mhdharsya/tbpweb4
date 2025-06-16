// Data simulasi berkas
const berkasData = {
    krs: {
        name: 'KRS_Semester_Ganjil_2024.pdf',
        size: '2.5 MB',
        status: 'approved',
        uploadDate: '2024-01-15'
    },
    ppt_penelitian: {
        name: 'Presentasi_Penelitian_Thesis.pdf',
        size: '8.7 MB',
        status: 'approved',
        uploadDate: '2024-01-20'
    },
    lampiran_pengesahan: {
        name: 'Surat_Pengesahan_Pembimbing.pdf',
        size: '1.2 MB',
        status: 'pending',
        uploadDate: '2024-01-25'
    },
    laporan_penelitian: {
        name: 'Laporan_Penelitian_Final.pdf',
        size: '15.3 MB',
        status: 'approved',
        uploadDate: '2024-01-30'
    }
};

// Fungsi untuk membuka modal dan menampilkan informasi berkas
function viewFile(berkasType) {
    const modal = document.getElementById('fileModal');
    const modalTitle = document.getElementById('modalTitle');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileStatus = document.getElementById('fileStatus');
    
    const berkas = berkasData[berkasType];
    
    if (berkas) {
        // Update modal content
        modalTitle.textContent = `Melihat Berkas - ${berkasType.toUpperCase().replace('_', ' ')}`;
        fileName.textContent = berkas.name;
        fileSize.textContent = berkas.size;
        
        // Update status dengan styling yang sesuai
        const statusElement = fileStatus;
        statusElement.className = ''; // Reset classes
        
        switch(berkas.status) {
            case 'approved':
                statusElement.textContent = '✓ Disetujui';
                statusElement.className = 'status-approved';
                break;
            case 'pending':
                statusElement.textContent = '⏳ Menunggu Review';
                statusElement.className = 'status-pending';
                break;
            case 'rejected':
                statusElement.textContent = '✗ Ditolak';
                statusElement.className = 'status-rejected';
                break;
            default:
                statusElement.textContent = '❓ Status Tidak Diketahui';
        }
        
        // Tampilkan modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Simulasi loading berkas
        simulateFileLoading();
    } else {
        alert('Berkas tidak ditemukan!');
    }
}

// Simulasi loading berkas
function simulateFileLoading() {
    const modalBody = document.querySelector('.modal-body');
    const originalContent = modalBody.innerHTML;
    
    // Tampilkan loading
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="loading-spinner"></div>
            <p>Memuat berkas...</p>
        </div>
    `;
    
    // Tambahkan CSS untuk spinner jika belum ada
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem auto;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Kembalikan konten asli setelah 1.5 detik
    setTimeout(() => {
        modalBody.innerHTML = originalContent;
    }, 1500);
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('fileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('fileModal');
    
    // Tutup modal ketika mengklik di luar modal
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Tutup modal dengan tombol ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Animasi hover untuk kartu berkas
    const berkasCards = document.querySelectorAll('.berkas-card');
    berkasCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Smooth scrolling untuk navigasi (jika ada anchor links)
    const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update waktu loading berdasarkan ukuran file (simulasi)
    window.getLoadingTime = function(fileSize) {
        const sizeInMB = parseFloat(fileSize);
        return Math.max(1000, sizeInMB * 200); // Minimum 1 detik, 200ms per MB
    };
    
    // Fungsi untuk menampilkan notifikasi
    window.showNotification = function(message, type = 'info') {
        // Buat elemen notifikasi
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styling notifikasi
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '6px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        // Warna berdasarkan type
        const colors = {
            info: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            error: '#e74c3c'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Tambahkan ke DOM
        document.body.appendChild(notification);
        
        // Animasi masuk
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hapus setelah 3 detik
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    };
    
    console.log('Check Berkas system initialized successfully!');
});