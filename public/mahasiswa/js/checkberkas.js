// Simulasi data berkas
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

function viewFile(berkasType) {
    const modal = document.getElementById('fileModal');
    const modalTitle = document.getElementById('modalTitle');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileStatus = document.getElementById('fileStatus');
    
    const berkas = berkasData[berkasType];
    
    if (berkas) {
        modalTitle.textContent = `Melihat Berkas - ${berkasType.toUpperCase().replace('_', ' ')}`;
        fileName.textContent = berkas.name;
        fileSize.textContent = berkas.size;

        fileStatus.className = '';

        switch (berkas.status) {
            case 'approved':
                fileStatus.textContent = '✓ Disetujui';
                fileStatus.className = 'status-approved';
                break;
            case 'pending':
                fileStatus.textContent = '⏳ Menunggu Review';
                fileStatus.className = 'status-pending';
                break;
            case 'rejected':
                fileStatus.textContent = '✗ Ditolak';
                fileStatus.className = 'status-rejected';
                break;
            default:
                fileStatus.textContent = '❓ Status Tidak Diketahui';
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        simulateFileLoading();
    } else {
        alert('Berkas tidak ditemukan!');
    }
}

function simulateFileLoading() {
    const modalBody = document.querySelector('.modal-body');
    const originalContent = modalBody.innerHTML;

    modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="loading-spinner"></div>
            <p>Memuat berkas...</p>
        </div>
    `;

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

    setTimeout(() => {
        modalBody.innerHTML = originalContent;
    }, 1500);
}

function closeModal() {
    const modal = document.getElementById('fileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('fileModal');

    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    const berkasCards = document.querySelectorAll('.berkas-card');
    berkasCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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

    window.getLoadingTime = function (fileSize) {
        const sizeInMB = parseFloat(fileSize);
        return Math.max(1000, sizeInMB * 200);
    };

    window.showNotification = function (message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

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

        const colors = {
            info: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            error: '#e74c3c'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

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
