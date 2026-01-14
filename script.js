/* ========================================
   SARASWATI PUJA DONATION PORTAL v2.0
   Enhanced JavaScript with All Features
   ======================================== */

// ========== CONFIGURATION ==========
const CONFIG = {
    // Google Apps Script URL (User provided)
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzhxYqrEufBaLQnIQLxfUAqdBS2uOKfRDa8c8uZeAQ6J9GCLTme0pjeZyFvxKy9E1ND/exec',
    
    // Google Drive Folder ID (User provided)
    DRIVE_FOLDER_ID: '1yaiRT8HHCFF8SS_gea8NdOgFY8h1fVDa',
    
    // UPI Details
    UPI_ID: 'rkrupeshchoudhary@oksbi',
    UPI_NAME: 'Saraswati Puja Committee',
    
    // Puja Date (23 January 2026)
    PUJA_DATE: new Date('2026-01-23T00:00:00'),
    
    // Donation Goal
    DONATION_GOAL: 100000,
    
    // Location Data
    LOCATION: {
        address: 'सिंगेस्वरी, बौंसी, बांका, बिहार - 813104',
        phones: ['+91 76316 80636', '+91 62021 82375'],
        schoolName: 'Singeswari High School, Bounsi'
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
let currentPlaylistIndex = 0;
let receiptData = null;

// ========== DOM ELEMENTS ==========
const elements = {
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('.section'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navLinksContainer: document.getElementById('navLinks'),
    
    // FAB
    fabBtn: document.getElementById('fabBtn'),
    fabMenu: document.getElementById('fabMenu'),
    
    // Countdown
    countdownDays: document.getElementById('days'),
    countdownHours: document.getElementById('hours'),
    countdownMinutes: document.getElementById('minutes'),
    countdownSeconds: document.getElementById('seconds'),
    
    // Stats
    totalDonation: document.getElementById('totalDonation'),
    totalDonors: document.getElementById('totalDonors'),
    todayDonors: document.getElementById('todayDonors'),
    progressBar: document.querySelector('.progress-fill'),
    progressPercent: document.getElementById('progressPercent'),
    
    // Donation Form
    donationForm: document.getElementById('donationForm'),
    donorName: document.getElementById('donorName'),
    donorMobile: document.getElementById('donorMobile'),
    donationAmount: document.getElementById('donationAmount'),
    paymentScreenshot: document.getElementById('paymentScreenshot'),
    fileName: document.getElementById('fileName'),
    imagePreview: document.getElementById('imagePreview'),
    submitBtn: document.getElementById('submitBtn'),
    formMessage: document.getElementById('formMessage'),
    
    // QR Code
    qrCode: document.getElementById('qrCode'),
    
    // Donors Table
    donorsTableBody: document.getElementById('donorsTableBody'),
    donorSearch: document.getElementById('donorSearch'),
    clearSearch: document.getElementById('clearSearch'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // Receipt Modal
    receiptModal: document.getElementById('receiptModal'),
    receiptNo: document.getElementById('receiptNo'),
    receiptDate: document.getElementById('receiptDate'),
    receiptName: document.getElementById('receiptName'),
    receiptAmount: document.getElementById('receiptAmount'),
    receiptMobile: document.getElementById('receiptMobile'),
    amountInWords: document.getElementById('amountInWords'),
    receiptQR: document.getElementById('receiptQR'),
    socialShare: document.getElementById('socialShare'),
    
    // YouTube Player
    playlistItems: document.getElementById('playlistItems'),
    nowPlayingTitle: document.getElementById('nowPlayingTitle'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    
    // Back to Top
    backToTop: document.getElementById('backToTop')
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🙏 Saraswati Puja Portal v2.0 Initialized');
    
    // Initialize all modules
    initParticles();
    initAOS();
    initNavigation();
    initFAB();
    initMobileMenu();
    initQRCode();
    initCountdown();
    initDonationForm();
    initDonorsList();
    initBhajanPlayer();
    initBackToTop();
    
    // Load data
    loadDonorsData();
    
    // Start auto-refresh
    startAutoRefresh();
    
    console.log('✨ All modules loaded successfully!');
});

// ========== PARTICLE.JS INITIALIZATION ==========
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#FFD700'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#FFD700',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// ========== AOS INITIALIZATION ==========
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// ========== NAVIGATION ==========
function initNavigation() {
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
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
            
            // Close mobile menu
            elements.navLinksContainer.classList.remove('active');
            elements.mobileMenuBtn.classList.remove('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Reinitialize AOS
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    });
}

// ========== FLOATING ACTION BUTTON ==========
function initFAB() {
    elements.fabBtn.addEventListener('click', function() {
        elements.fabMenu.classList.toggle('active');
        this.style.transform = elements.fabMenu.classList.contains('active') 
            ? 'rotate(45deg)' 
            : 'rotate(0deg)';
    });
    
    // Close FAB menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.fab-container')) {
            elements.fabMenu.classList.remove('active');
            elements.fabBtn.style.transform = 'rotate(0deg)';
        }
    });
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
    elements.mobileMenuBtn.addEventListener('click', function() {
        elements.navLinksContainer.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// ========== QR CODE GENERATION ==========
function initQRCode() {
    const upiString = `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.UPI_NAME)}&cu=INR`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;
    
    elements.qrCode.src = qrApiUrl;
}

// Copy UPI ID function
function copyUPI() {
    navigator.clipboard.writeText(CONFIG.UPI_ID).then(() => {
        showToast('✅ UPI ID कॉपी हो गया!', 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = CONFIG.UPI_ID;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('✅ UPI ID कॉपी हो गया!', 'success');
    });
}

// ========== COUNTDOWN TIMER ==========
function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = CONFIG.PUJA_DATE.getTime() - now;
    
    if (distance < 0) {
        elements.countdownDays.textContent = '00';
        elements.countdownHours.textContent = '00';
        elements.countdownMinutes.textContent = '00';
        elements.countdownSeconds.textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    elements.countdownDays.textContent = String(days).padStart(2, '0');
    elements.countdownHours.textContent = String(hours).padStart(2, '0');
    elements.countdownMinutes.textContent = String(minutes).padStart(2, '0');
    elements.countdownSeconds.textContent = String(seconds).padStart(2, '0');
}

// ========== DONATION FORM ==========
function initDonationForm() {
    // File upload preview
    elements.paymentScreenshot.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            elements.fileName.textContent = file.name;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                elements.imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                elements.imagePreview.classList.add('active');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Form submission
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
            showFormMessage('❌ फाइल का साइज 5MB से कम होना चाहिए', 'error');
            return;
        }
        
        // Set loading state
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
                showFormMessage('✅ सहयोग सफलतापूर्वक सबमिट हो गया! रसीद तैयार हो रही है...', 'success');
                
                // Generate and show receipt
                setTimeout(() => {
                    generateReceipt({
                        name: formData.name,
                        mobile: formData.mobile,
                        amount: formData.amount,
                        receiptNo: result.receiptNo || `SP-${Date.now()}`
                    });
                    
                    // Reset form
                    elements.donationForm.reset();
                    elements.imagePreview.classList.remove('active');
                    elements.fileName.textContent = 'फाइल चुनें या यहाँ ड्रैग करें';
                    showFormMessage('', '');
                }, 1500);
                
                // Reload donors list
                setTimeout(() => {
                    loadDonorsData();
                }, 2000);
                
            } else {
                showFormMessage('❌ ' + (result.message || 'कुछ गड़बड़ हुई। कृपया फिर से प्रयास करें।'), 'error');
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            showFormMessage('❌ नेटवर्क में समस्या है। कृपया फिर से प्रयास करें।', 'error');
        } finally {
            setSubmitButtonState(false);
        }
    });
}

// Quick amount buttons
function setAmount(amount) {
    elements.donationAmount.value = amount;
    elements.donationAmount.focus();
}

// Validate form
function validateForm() {
    const name = elements.donorName.value.trim();
    const mobile = elements.donorMobile.value.trim();
    const amount = elements.donationAmount.value.trim();
    const screenshot = elements.paymentScreenshot.files[0];
    
    if (!name || name.length < 3) {
        showFormMessage('❌ कृपया सही नाम दर्ज करें (कम से कम 3 अक्षर)', 'error');
        elements.donorName.focus();
        return false;
    }
    
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        showFormMessage('❌ कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें', 'error');
        elements.donorMobile.focus();
        return false;
    }
    
    if (!amount || amount < 1) {
        showFormMessage('❌ कृपया सही राशि दर्ज करें', 'error');
        elements.donationAmount.focus();
        return false;
    }
    
    if (!screenshot) {
        showFormMessage('❌ कृपया भुगतान का स्क्रीनशॉट अपलोड करें', 'error');
        return false;
    }
    
    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(screenshot.type)) {
        showFormMessage('❌ कृपया PNG या JPG फॉर्मेट की फाइल अपलोड करें', 'error');
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
        elements.submitBtn.classList.add('loading');
    } else {
        elements.submitBtn.disabled = false;
        elements.submitBtn.classList.remove('loading');
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
        
        if (searchTerm) {
            elements.clearSearch.classList.add('active');
        } else {
            elements.clearSearch.classList.remove('active');
        }
        
        filterDonors(searchTerm);
    });
    
    // Clear search
    elements.clearSearch.addEventListener('click', function() {
        elements.donorSearch.value = '';
        this.classList.remove('active');
        displayDonors(donorsData);
    });
    
    // Filter buttons
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            applyFilter(filter);
        });
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
        showErrorState('नेटवर्क में समस्या है। कृपया पेज रिफ्रेश करें।');
    }
}

function displayDonors(donors) {
    if (!donors || donors.length === 0) {
        elements.donorsTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                    <p style="color: var(--text-light);">अभी तक कोई सहयोगी नहीं है</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    donors.forEach((donor, index) => {
        html += `
            <tr data-aos="fade-up" data-aos-delay="${Math.min(index * 50, 500)}">
                <td><strong>${index + 1}</strong></td>
                <td>${escapeHtml(donor.name)}</td>
                <td><strong style="color: var(--dark-gold);">₹ ${formatNumber(donor.amount)}</strong></td>
                <td>${donor.date || 'N/A'}</td>
                <td><span style="background: var(--light-basant); padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; color: var(--dark-gold);">${donor.receiptNo || 'N/A'}</span></td>
            </tr>
        `;
    });
    
    elements.donorsTableBody.innerHTML = html;
    
    // Reinitialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

function filterDonors(searchTerm) {
    if (!searchTerm) {
        displayDonors(donorsData);
        return;
    }
    
    const filtered = donorsData.filter(donor => 
        donor.name.toLowerCase().includes(searchTerm) ||
        (donor.receiptNo && donor.receiptNo.toLowerCase().includes(searchTerm))
    );
    
    displayDonors(filtered);
}

function applyFilter(filter) {
    let filtered = [...donorsData];
    
    if (filter === 'today') {
        const today = new Date().toLocaleDateString('hi-IN');
        filtered = filtered.filter(donor => donor.date === today);
    } else if (filter === 'high') {
        filtered = filtered.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    }
    
    displayDonors(filtered);
}

function showLoadingState() {
    elements.donorsTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="loading-row">
                <div class="spinner-container">
                    <div class="spinner"></div>
                    <p>डेटा लोड हो रहा है...</p>
                </div>
            </td>
        </tr>
    `;
}

function showErrorState(message) {
    elements.donorsTableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 3rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <p style="color: var(--error);">${message}</p>
                <button onclick="loadDonorsData()" style="margin-top: 1rem; padding: 0.8rem 1.5rem; background: var(--primary-gold); border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    🔄 फिर से कोशिश करें
                </button>
            </td>
        </tr>
    `;
}

// Export to Excel function
function exportToExcel() {
    if (!donorsData || donorsData.length === 0) {
        showToast('❌ कोई डेटा नहीं है', 'error');
        return;
    }
    
    let csv = 'क्र.सं.,नाम,राशि,तिथि,रसीद नं.\n';
    donorsData.forEach((donor, index) => {
        csv += `${index + 1},"${donor.name}",${donor.amount},"${donor.date}","${donor.receiptNo}"\n`;
    });
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `सहयोगी_सूची_${new Date().toLocaleDateString('hi-IN')}.csv`;
    link.click();
    
    showToast('✅ डेटा डाउनलोड हो गया!', 'success');
}

// ========== STATS UPDATE ==========
function updateStats(donors) {
    const totalAmount = donors.reduce((sum, donor) => sum + parseFloat(donor.amount || 0), 0);
    const totalCount = donors.length;
    
    // Count today's donors
    const today = new Date().toLocaleDateString('hi-IN');
    const todayCount = donors.filter(donor => donor.date === today).length;
    
    // Animate counters
    animateCounter(elements.totalDonation, totalAmount, '₹ ');
    animateCounter(elements.totalDonors, totalCount, '');
    animateCounter(elements.todayDonors, todayCount, '');
    
    // Update progress bar
    updateProgressBar(totalAmount);
}

function animateCounter(element, target, prefix = '') {
    if (!element) return;
    
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
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

function updateProgressBar(currentAmount) {
    const percentage = Math.min((currentAmount / CONFIG.DONATION_GOAL) * 100, 100);
    
    if (elements.progressBar) {
        setTimeout(() => {
            elements.progressBar.style.width = percentage + '%';
        }, 300);
    }
    
    if (elements.progressPercent) {
        elements.progressPercent.textContent = Math.floor(percentage) + '%';
    }
}

// ========== RECEIPT GENERATION ==========
function generateReceipt(data) {
    receiptData = data;
    
    // Populate receipt data
    elements.receiptNo.textContent = data.receiptNo;
    elements.receiptDate.textContent = new Date().toLocaleDateString('hi-IN');
    elements.receiptName.textContent = data.name;
    elements.receiptAmount.textContent = `₹ ${formatNumber(data.amount)}`;
    elements.receiptMobile.textContent = data.mobile;
    
    // Convert amount to words
    const amountInWords = numberToWordsHindi(data.amount);
    elements.amountInWords.textContent = `रुपये ${amountInWords} मात्र`;
    
    // Generate QR code for receipt verification
    generateReceiptQR(data.receiptNo);
    
    // Show modal
    elements.receiptModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeReceipt() {
    elements.receiptModal.classList.remove('active');
    elements.socialShare.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Generate QR code for receipt
function generateReceiptQR(receiptNo) {
    if (typeof QRCode !== 'undefined' && elements.receiptQR) {
        // Clear previous QR code
        elements.receiptQR.innerHTML = '';
        
        // Create new QR code
        const qr = new QRCode(elements.receiptQR, {
            text: `Receipt: ${receiptNo} | Saraswati Puja 2026 | Verify at: ${window.location.origin}`,
            width: 100,
            height: 100,
            colorDark: '#DAA520',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// Print receipt
function printReceipt() {
    window.print();
}

// Download receipt as image
async function downloadReceipt() {
    if (typeof html2canvas === 'undefined') {
        showToast('❌ डाउनलोड फीचर लोड नहीं हो सका', 'error');
        return;
    }
    
    try {
        showToast('📸 रसीद तैयार हो रही है...', 'info');
        
        const receiptContainer = document.getElementById('receiptContainer');
        const canvas = await html2canvas(receiptContainer, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });
        
        const link = document.createElement('a');
        link.download = `रसीद_${receiptData.receiptNo}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast('✅ रसीद डाउनलोड हो गई!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showToast('❌ डाउनलोड में समस्या हुई', 'error');
    }
}

// Share receipt
function shareReceipt() {
    elements.socialShare.style.display = elements.socialShare.style.display === 'none' ? 'block' : 'none';
}

// Social sharing functions
function shareToWhatsApp() {
    const message = `🙏 सरस्वती पूजा सहयोग रसीद\n\nरसीद नं: ${receiptData.receiptNo}\nनाम: ${receiptData.name}\nराशि: ₹${formatNumber(receiptData.amount)}\n\nधन्यवाद!\n\n${window.location.origin}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function shareToFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent('मैंने सरस्वती पूजा में सहयोग किया! आप भी करें।')}`;
    window.open(url, '_blank', 'width=600,height=400');
}

function shareToTelegram() {
    const message = `🙏 सरस्वती पूजा सहयोग\n\nमैंने सरस्वती पूजा 2026 में सहयोग किया!\n\n${window.location.origin}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function shareToTwitter() {
    const message = `🙏 मैंने सरस्वती पूजा 2026 में सहयोग किया! आप भी करें।\n\n#SaraswatiPuja2026 #BasantPanchami`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank', 'width=600,height=400');
}

function copyReceiptLink() {
    const link = window.location.origin;
    navigator.clipboard.writeText(link).then(() => {
        showToast('✅ लिंक कॉपी हो गया!', 'success');
    }).catch(() => {
        showToast('❌ कॉपी नहीं हो सका', 'error');
    });
}

// ========== BHAJAN PLAYER ==========
function initBhajanPlayer() {
    // Load YouTube IFrame API
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // Create playlist UI
    createPlaylist();
    
    // Player controls
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', () => playPrevious());
    }
    
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', () => playNext());
    }
}

// Initialize YouTube Player when API is ready
window.onYouTubeIframeAPIReady = function() {
    currentYouTubePlayer = new YT.Player('youtubePlayer', {
        height: '100%',
        width: '100%',
        videoId: CONFIG.BHAJAN_PLAYLIST[0].id,
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0
        },
        events: {
            onStateChange: onPlayerStateChange
        }
    });
};

function createPlaylist() {
    let html = '';
    CONFIG.BHAJAN_PLAYLIST.forEach((bhajan, index) => {
        html += `
            <li data-video-id="${bhajan.id}" data-index="${index}" 
                class="${index === 0 ? 'active' : ''}" 
                onclick="playBhajan(${index})">
                <span style="margin-right: 0.5rem;">🎵</span> ${bhajan.title}
            </li>
        `;
    });
    elements.playlistItems.innerHTML = html;
    
    // Set initial title
    elements.nowPlayingTitle.textContent = CONFIG.BHAJAN_PLAYLIST[0].title;
}

function playBhajan(index) {
    if (!currentYouTubePlayer || !currentYouTubePlayer.loadVideoById) return;
    
    currentPlaylistIndex = index;
    const bhajan = CONFIG.BHAJAN_PLAYLIST[index];
    
    currentYouTubePlayer.loadVideoById(bhajan.id);
    
    // Update active state
    document.querySelectorAll('.playlist-items li').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Update now playing
    elements.nowPlayingTitle.textContent = bhajan.title;
}

function playNext() {
    const nextIndex = (currentPlaylistIndex + 1) % CONFIG.BHAJAN_PLAYLIST.length;
    playBhajan(nextIndex);
}

function playPrevious() {
    const prevIndex = (currentPlaylistIndex - 1 + CONFIG.BHAJAN_PLAYLIST.length) % CONFIG.BHAJAN_PLAYLIST.length;
    playBhajan(prevIndex);
}

function onPlayerStateChange(event) {
    // Auto-play next video when current ends
    if (event.data === YT.PlayerState.ENDED) {
        playNext();
    }
}

// ========== BACK TO TOP ==========
function initBackToTop() {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            elements.backToTop.classList.add('active');
        } else {
            elements.backToTop.classList.remove('active');
        }
    });
    
    elements.backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== AUTO REFRESH ==========
function startAutoRefresh() {
    // Refresh donors list every 30 seconds if on donors section
    setInterval(() => {
        const donorsSection = document.getElementById('donors');
        if (donorsSection && donorsSection.classList.contains('active')) {
            loadDonorsData();
        }
    }, 30000);
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
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Convert number to Hindi words
function numberToWordsHindi(num) {
    const ones = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ'];
    const tens = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];
    const teens = ['दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
    
    if (num === 0) return 'शून्य';
    
    let words = '';
    
    if (num >= 10000000) {
        words += numberToWordsHindi(Math.floor(num / 10000000)) + ' करोड़ ';
        num %= 10000000;
    }
    
    if (num >= 100000) {
        words += numberToWordsHindi(Math.floor(num / 100000)) + ' लाख ';
        num %= 100000;
    }
    
    if (num >= 1000) {
        words += numberToWordsHindi(Math.floor(num / 1000)) + ' हज़ार ';
        num %= 1000;
    }
    
    if (num >= 100) {
        words += ones[Math.floor(num / 100)] + ' सौ ';
        num %= 100;
    }
    
    if (num >= 20) {
        words += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
    } else if (num >= 10) {
        words += teens[num - 10] + ' ';
        return words.trim();
    }
    
    if (num > 0) {
        words += ones[num] + ' ';
    }
    
    return words.trim();
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 350px;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
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

// ========== SMOOTH SCROLL FOR ALL LINKS ==========
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

// ========== PREVENT FORM RESUBMISSION ==========
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ========== CONSOLE BRANDING ==========
console.log('%c🙏 Saraswati Puja Portal v2.0', 'font-size: 28px; color: #FFD700; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%c✨ Enhanced Edition with Premium Features', 'font-size: 16px; color: #DAA520; font-weight: bold;');
console.log('%cDeveloped with 💛 by ER. AJIT', 'font-size: 14px; color: #F4C430; font-style: italic;');
console.log('%c⚠️ Warning: Do not paste any code here unless you know what you\'re doing!', 'font-size: 12px; color: red; font-weight: bold;');

// ========== EXPORT FOR GLOBAL ACCESS ==========
window.SaraswatiPujaPortal = {
    loadDonorsData,
    generateReceipt,
    closeReceipt,
    printReceipt,
    downloadReceipt,
    shareReceipt,
    playBhajan,
    copyUPI,
    exportToExcel,
    CONFIG
};

// ========== PERFORMANCE MONITORING ==========
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`⚡ Page loaded in ${loadTime}ms`);
});
