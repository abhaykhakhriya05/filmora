// Append inside your active DOMContentLoaded listener block
const btnMonthly = document.getElementById('btnMonthly');
const btnYearly = document.getElementById('btnYearly');

// Pricing fields elements
const basicPrice = document.getElementById('basicPrice');
const standardPrice = document.getElementById('standardPrice');
const premiumPrice = document.getElementById('premiumPrice');

const basicDuration = document.getElementById('basicDuration');
const standardDuration = document.getElementById('standardDuration');
const premiumDuration = document.getElementById('premiumDuration');

if (btnMonthly && btnYearly) {
    btnMonthly.addEventListener('click', () => {
        btnMonthly.classList.add('active');
        btnYearly.classList.remove('active');
        
        // Update display values to Monthly amounts
        basicPrice.textContent = "$9.99";
        standardPrice.textContent = "$12.99";
        premiumPrice.textContent = "$14.99";
        
        basicDuration.textContent = "/month";
        standardDuration.textContent = "/month";
        premiumDuration.textContent = "/month";
    });

    btnYearly.addEventListener('click', () => {
        btnYearly.classList.add('active');
        btnMonthly.classList.remove('active');
        
        // Update display values to Yearly amounts (with standard discount rates calculated)
        basicPrice.textContent = "$95.88";
        standardPrice.textContent = "$124.68";
        premiumPrice.textContent = "$143.88";
        
        basicDuration.textContent = "/year";
        standardDuration.textContent = "/year";
        premiumDuration.textContent = "/year";
    });
}

