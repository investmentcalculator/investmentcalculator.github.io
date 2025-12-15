// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Chart.js setup
let investmentChart = null;

// Investment Calculator Function
function calculateInvestment() {
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const annualReturn = parseFloat(document.getElementById('annualReturn').value) || 0;
    const years = parseInt(document.getElementById('investmentYears').value) || 0;

    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;

    // Calculate future value with compound interest
    let balance = initialInvestment;
    const balanceData = [initialInvestment];
    const investmentData = [initialInvestment];
    
    for (let i = 1; i <= months; i++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        if (i % 12 === 0) {
            balanceData.push(balance);
            investmentData.push(initialInvestment + (monthlyContribution * i));
        }
    }

    const totalInvestment = initialInvestment + (monthlyContribution * months);
    const finalBalance = balance;
    const totalReturns = finalBalance - totalInvestment;
    const totalGainPercent = ((totalReturns / totalInvestment) * 100).toFixed(1);

    // Update results
    document.getElementById('totalInvestment').textContent = formatCurrency(totalInvestment);
    document.getElementById('totalReturns').textContent = formatCurrency(totalReturns);
    document.getElementById('finalBalance').textContent = formatCurrency(finalBalance);
    document.getElementById('totalGain').textContent = `+${totalGainPercent}%`;

    // Create chart
    updateChart(years, investmentData, balanceData);

    // Animate results
    animateResults();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function updateChart(years, investmentData, balanceData) {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) return;

    const labels = [];
    for (let i = 0; i <= years; i++) {
        labels.push(`Year ${i}`);
    }

    if (investmentChart) {
        investmentChart.destroy();
    }

    investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Investment',
                    data: investmentData,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Investment Value',
                    data: balanceData,
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatCurrency(context.parsed.y);
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

function animateResults() {
    const results = document.querySelectorAll('.result-value');
    results.forEach(result => {
        result.style.animation = 'none';
        setTimeout(() => {
            result.style.animation = 'fadeInUp 0.5s ease both';
        }, 10);
    });
}

// Add input change listeners
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('input', () => {
        calculateInvestment();
    });
});

// Initialize Chart.js
function loadChartJS() {
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
        script.onload = () => {
            calculateInvestment();
        };
        document.head.appendChild(script);
    } else {
        calculateInvestment();
    }
}

// Run calculation on page load
window.addEventListener('load', () => {
    loadChartJS();
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease both';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});