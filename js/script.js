// =============================
// MOBILE NAVIGATION
// =============================

const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-links a");

if (toggle && navLinks) {

    toggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        toggle.classList.toggle("active");
    });

    navItems.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            toggle.classList.remove("active");
        });
    });
}


// =============================
// CATEGORY CLICK REDIRECT
// =============================

const categories = document.querySelectorAll(".category-card");

if (categories.length > 0) {
    categories.forEach(card => {
        card.addEventListener("click", () => {
            const category = card.dataset.category;
            window.location.href = `products.html?category=${category}`;
        });
    });
}

// =============================
// AGE VERIFICATION (10 RELOAD LIMIT)
// =============================

const agePopup = document.getElementById("age-popup");
const ageYes = document.getElementById("age-yes");
const ageNo = document.getElementById("age-no");

if (agePopup) {

    let reloadCount = parseInt(localStorage.getItem("reloadCount")) || 0;
    let isVerified = localStorage.getItem("ageVerified");

    // Increment reload count
    reloadCount++;
    localStorage.setItem("reloadCount", reloadCount);

    // If verified AND reloads < 10 → hide popup
    if (isVerified === "true" && reloadCount <= 10) {
        agePopup.style.display = "none";
    } else {
        // Reset verification after 10 reloads
        localStorage.removeItem("ageVerified");
        localStorage.setItem("reloadCount", 0);
        agePopup.style.display = "flex";
    }

    // When user confirms age
    ageYes.addEventListener("click", () => {
        localStorage.setItem("ageVerified", "true");
        localStorage.setItem("reloadCount", 0);
        agePopup.style.display = "none";
    });

    // If user clicks No
    ageNo.addEventListener("click", () => {
        window.location.href = "https://www.google.com";
    });
}

// Page fade in
window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

// =============================
// SCROLL TO TOP
// =============================

const scrollBtn = document.getElementById("scroll-top");

if (scrollBtn) {

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    });

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}