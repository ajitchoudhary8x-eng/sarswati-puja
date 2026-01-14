/* ========================================
   SARASWATI PUJA DONATION PORTAL
   Complete JavaScript Logic
   ======================================== */

// ========== CONFIGURATION ==========
const CONFIG = {
    // Google Apps Script URL
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzhxYqrEufBaLQnIQLxfUAqdBS2uOKfRDa8c8uZeAQ6J9GCLTme0pjeZyFvxKy9E1ND/exec',
    
    // UPI Details
    UPI_ID: 'rkrupeshchoudhary@oksbi',
    UPI_NAME: 'Saraswati Puja Committee',
    
    // Location Data
    LOCATION: {
        address: 'सिंगेस्वरी, बौंसी, बांका, बिहार - 813104',
        phones: ['+91 76316 80636', '+91 62021 82375']
    },
    
    // Committee Members
    COMMITTEE: [
        'श्री अमरेश चौधरी',
        'श्री दिवाकर चौधरी',
        'श्री रवि साह'
    ],
    
    // YouTube Playlist
    BHAJAN_PLAYLIST: [
        { id: 'mNly0e9lqM8', title: 'या कुन्देन्दु तुषारहार धवला' },
        { id: 'K-Yid43eD8U', title: 'सरस्वती वंदना' },
        { id: 'vB-W17HjNFE', title: 'विद्या दान दे माँ सरस्वती' },
        { id: 'Ey_QnJwb0lQ', title: 'माँ सरस्वती शारदे' },
        { id: 'X3vVz9g7VKo', title: 'ॐ ऐं सरस्वती नमः' },
        { id: 'TfGEiN5n5aw', title: 'जय जय हे भगवती' }
    ]
};

// ========== GLOBAL STATE ==========
let donorsData = [];
let currentYouTubePlayer = null;
let receiptCounter = 1001;

// ========== DOM ELEMENTS ==========
const elements = {
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('.section'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navLinksContainer: document.querySelector('.nav-links'),
    
    // Stats
    totalDonation: document.getElementById('totalDonation'),
    totalDonors: document.getElementById('totalDonors'),
    
    // Donation Form
    donationForm: document.getElementById('donationForm'),
    donorName: document.getElementById('donorName'),
    donorMobile: document.getElementById('donorMobile'),
    donationAmount: document.getElementById('donationAmount'),
    paymentScreenshot: document.getElementById('paymentScreenshot'),
    submitBtn: document.getElementById('submitBtn'),
    formMessage: document.getElementById('formMessage'),
    
    // QR Code
    qrCode: document.getElementById('qrCode'),
    upiId: document.getElementById('upiId'),
    
    // Donors Table
    donorsTableBody: document.getElementById('donorsTableBody'),
    donorSearch: document.getElementById('donorSearch'),
    
    // Receipt Modal
    receiptModal: document.getElementById('receiptModal'),
    receiptNo: document.getElementById('receiptNo'),
    receiptDate: document.getElementById('receiptDate'),
    receiptName: document.getElementById('receiptName'),
    receiptAmount: document.getElementById('receiptAmount'),
    receiptMobile: document.getElementById('receiptMobile'),
    
    // YouTube Player
    youtubePlayer: document.getElementById('youtubePlayer'),
    playlistItems: document.getElementById('playlistItems')
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🙏 Saraswati Puja Portal Initialized');
    
    initNavigation();
    initQRCode();
    initDonationForm();
    initDonorsList();
    initBhajanPlayer();
    initMobileMenu();
    loadDonorsData();
    
    // Set current date in receipt
    setCurrentDate();
});

// ========== NAVIGATION ==========
function initNavigation() {
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active states
            elements.navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            elements.sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            // Close mobile menu if open
            elements.navLinksContainer.classList.remove('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
    elements.mobileMenuBtn.addEventListener('click', function() {
        elements.navLinksContainer.classList.toggle('active');
    });
}

// ========== QR CODE GENERATION ==========
function initQRCode() {
    const upiString = `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.UPI_NAME)}&cu=INR`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;
    
    elements.qrCode.src = qrApiUrl;
    elements.upiId.textContent = CONFIG.UPI_ID;
}

// Copy UPI ID function
function copyUPI() {
    navigator.clipboard.writeText(CONFIG.UPI_ID).then(() => {
        showToast('✅ UPI ID कॉपी हो गया!');
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('❌ कॉपी नहीं हो सका', 'error');
    });
}

// ========== DONATION FORM ==========
function initDonationForm() {
    elements.donationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = {
            name: elements.donorName.value.trim(),
            mobile: elements.donorMobile.value.trim(),
            amount: elements.donationAmount.value.trim(),
            screenshot: elements.paymentScreenshot.files[0]
        };
        
        // Check file size (max 5MB)
        if (formData.screenshot.size > 5 * 1024 * 1024) {
            showFormMessage('फाइल का साइज 5MB से कम होना चाहिए', 'error');
            return;
        }
        
        // Disable submit button
        setSubmitButtonState(true);
        
        try {
            // Convert image to Base64
            const base64Image = await fileToBase64(formData.screenshot);
            
            // Prepare payload
            const payload = {
                action: 'submitDonation',
                name: formData.name,
                mobile: formData.mobile,
                amount: formData.amount,
                screenshot: base64Image,
                date: new Date().toLocaleDateString('hi-IN'),
                timestamp: new Date().toISOString()
            };
            
            // Send to Google Apps Script
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showFormMessage('✅ सहयोग सफलतापूर्वक सबमिट हो गया! कृपया प्रतीक्षा करें...', 'success');
                
                // Generate and show receipt
                setTimeout(() => {
                    generateReceipt({
                        name: formData.name,
                        mobile: formData.mobile,
                        amount: formData.amount,
                        receiptNo: result.receiptNo || `SP-${receiptCounter++}`
                    });
                    
                    // Reset form
                    elements.donationForm.reset();
                    showFormMessage('', '');
                }, 1500);
                
                // Reload donors list
                setTimeout(() => {
                    loadDonorsData();
                }, 2000);
                
            } else {
                showFormMessage('❌ कुछ गड़बड़ हुई। कृपया फिर से प्रयास करें।', 'error');
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            showFormMessage('❌ नेटवर्क में समस्या है। कृपया फिर से प्रयास करें।', 'error');
        } finally {
            setSubmitButtonState(false);
        }
    });
}

// Validate form
function validateForm() {
    const name = elements.donorName.value.trim();
    const mobile = elements.donorMobile.value.trim();
    const amount = elements.donationAmount.value.trim();
    const screenshot = elements.paymentScreenshot.files[0];
    
    if (!name || name.length < 3) {
        showFormMessage('कृपया सही नाम दर्ज करें (कम से कम 3 अक्षर)', 'error');
        return false;
    }
    
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        showFormMessage('कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें', 'error');
        return false;
    }
    
    if (!amount || amount < 1) {
        showFormMessage('कृपया सही राशि दर्ज करें', 'error');
        return false;
    }
    
    if (!screenshot) {
        showFormMessage('कृपया भुगतान का स्क्रीनशॉट अपलोड करें', 'error');
        return false;
    }
    
    return true;
}

// Convert file to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Set submit button state
function setSubmitButtonState(loading) {
    if (loading) {
        elements.submitBtn.disabled = true;
        elements.submitBtn.querySelector('.btn-text').textContent = 'सबमिट हो रहा है...';
        elements.submitBtn.querySelector('.loader').style.display = 'inline-block';
    } else {
        elements.submitBtn.disabled = false;
        elements.submitBtn.querySelector('.btn-text').textContent = 'सबमिट करें';
        elements.submitBtn.querySelector('.loader').style.display = 'none';
    }
}

// Show form message
function showFormMessage(message, type) {
    elements.formMessage.textContent = message;
    elements.formMessage.className = 'form-message ' + type;
    
    if (message) {
        setTimeout(() => {
            elements.formMessage.textContent = '';
            elements.formMessage.className = 'form-message';
        }, 5000);
    }
}

// ========== DONORS LIST ==========
function initDonorsList() {
    // Search functionality
    elements.donorSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        filterDonors(searchTerm);
    });
}

async function loadDonorsData() {
    try {
        showLoadingState();
        
        const response = await fetch(`${CONFIG.SCRIPT_URL}?action=getDonors&t=${Date.now()}`);
        const result = await response.json();
        
        if (result.success && result.donors) {
            donorsData = result.donors;
            displayDonors(donorsData);
            updateStats(donorsData);
        } else {
            showErrorState('डेटा लोड नहीं हो सका');
        }
        
    } catch (error) {
        console.error('Error loading donors:', error);
        showErrorState('नेटवर्क में समस्या है');
    }
}

function displayDonors(donors) {
    if (!donors || donors.length === 0) {
        elements.donorsTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
                    अभी तक कोई सहयोगी नहीं है
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    donors.forEach((donor, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(donor.name)}</td>
                <td>₹ ${formatNumber(donor.amount)}</td>
                <td>${donor.date || 'N/A'}</td>
                <td><strong>${donor.receiptNo || 'N/A'}</strong></td>
            </tr>
        `;
    });
    
    elements.donorsTableBody.innerHTML = html;
}

function filterDonors(searchTerm) {
    if (!searchTerm) {
        displayDonors(donorsData);
        return;
    }
    
    const filtered = donorsData.filter(donor => 
        donor.name.toLowerCase().includes(searchTerm) ||
        donor.receiptNo.toLowerCase().includes(searchTerm)
    );
    
    displayDonors(filtered);
}

function showLoadingState() {
    elements.donorsTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="loading-row">
                <div class="spinner"></div>
                <p>डेटा लोड हो रहा है...</p>
            </td>
        </tr>
    `;
}

function showErrorState(message) {
    elements.donorsTableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 2rem; color: #f44336;">
                ❌ ${message}
            </td>
        </tr>
    `;
}

// ========== STATS UPDATE ==========
function updateStats(donors) {
    const totalAmount = donors.reduce((sum, donor) => sum + parseFloat(donor.amount || 0), 0);
    const totalCount = donors.length;
    
    // Animate counter
    animateCounter(elements.totalDonation, totalAmount, '₹ ');
    animateCounter(elements.totalDonors, totalCount, '');
}

function animateCounter(element, target, prefix = '') {
    let current = 0;
    const increment = target / 50;
    const duration = 1000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = prefix + formatNumber(Math.floor(current));
    }, stepTime);
}

// ========== RECEIPT GENERATION ==========
function generateReceipt(data) {
    // Populate receipt data
    elements.receiptNo.textContent = data.receiptNo;
    elements.receiptDate.textContent = new Date().toLocaleDateString('hi-IN');
    elements.receiptName.textContent = data.name;
    elements.receiptAmount.textContent = `₹ ${formatNumber(data.amount)}`;
    elements.receiptMobile.textContent = data.mobile;
    
    // Show modal
    elements.receiptModal.classList.add('active');
}

function closeReceipt() {
    elements.receiptModal.classList.remove('active');
}

function printReceipt() {
    window.print();
}

// Close modal on clicking outside or close button
document.querySelector('.close-modal')?.addEventListener('click', closeReceipt);
elements.receiptModal.addEventListener('click', function(e) {
    if (e.target === this) {
        closeReceipt();
    }
});

// ========== BHAJAN PLAYER ==========
function initBhajanPlayer() {
    // Load YouTube IFrame API
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // Initialize when API is ready
    window.onYouTubeIframeAPIReady = initializePlayer;
    
    // Create playlist UI
    createPlaylist();
}

function initializePlayer() {
    currentYouTubePlayer = new YT.Player('youtubePlayer', {
        height: '450',
        width: '100%',
        videoId: CONFIG.BHAJAN_PLAYLIST[0].id,
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0
        }
    });
}

function createPlaylist() {
    let html = '';
    CONFIG.BHAJAN_PLAYLIST.forEach((bhajan, index) => {
        html += `
            <li data-video-id="${bhajan.id}" data-index="${index}" 
                class="${index === 0 ? 'active' : ''}" 
                onclick="playBhajan('${bhajan.id}', ${index})">
                <span>🎵</span> ${bhajan.title}
            </li>
        `;
    });
    elements.playlistItems.innerHTML = html;
}

function playBhajan(videoId, index) {
    if (currentYouTubePlayer && currentYouTubePlayer.loadVideoById) {
        currentYouTubePlayer.loadVideoById(videoId);
    }
    
    // Update active state
    document.querySelectorAll('.playlist-items li').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ========== UTILITY FUNCTIONS ==========
function formatNumber(num) {
    return new Intl.NumberFormat('hi-IN').format(num);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function setCurrentDate() {
    const today = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('hi-IN', options);
    elements.receiptDate.textContent = formattedDate;
}

function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    // ESC to close receipt modal
    if (e.key === 'Escape' && elements.receiptModal.classList.contains('active')) {
        closeReceipt();
    }
    
    // Ctrl+P to print receipt (when modal is open)
    if (e.ctrlKey && e.key === 'p' && elements.receiptModal.classList.contains('active')) {
        e.preventDefault();
        printReceipt();
    }
});

// ========== SMOOTH SCROLL ENHANCEMENT ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ========== AUTO-REFRESH DONORS (Every 30 seconds) ==========
setInterval(() => {
    if (document.querySelector('#donors').classList.contains('active')) {
        loadDonorsData();
    }
}, 30000);

// ========== SERVICE WORKER (Optional for offline support) ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you create a service worker
        // navigator.serviceWorker.register('/sw.js').then(registration => {
        //     console.log('SW registered:', registration);
        // }).catch(err => {
        //     console.log('SW registration failed:', err);
        // });
    });
}

// ========== CONSOLE BRANDING ==========
console.log('%c🙏 Saraswati Puja Portal', 'font-size: 24px; color: #FFD700; font-weight: bold;');
console.log('%cDeveloped with 💛 by ER. AJIT', 'font-size: 14px; color: #DAA520;');
console.log('%c⚠️ Warning: Do not paste any code here unless you know what you\'re doing!', 'font-size: 12px; color: red;');

// ========== EXPORT FOR TESTING ==========
window.SaraswatiPujaPortal = {
    loadDonorsData,
    generateReceipt,
    playBhajan,
    copyUPI,
    CONFIG
};