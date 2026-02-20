// =============================
// ELEMENT REFERENCES
// =============================

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const categoryTitle = document.getElementById("category-title");
const productGrid = document.getElementById("product-grid");

const modal = document.getElementById("product-modal");
const closeBtn = document.getElementById("close-modal");

const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalSize = document.getElementById("modal-size");
const modalDescription = document.getElementById("modal-description");


// =============================
// SET CATEGORY TITLE
// =============================

if (category) {
    categoryTitle.textContent =
        category.charAt(0).toUpperCase() + category.slice(1);
}


// =============================
// MODAL FUNCTIONS
// =============================

function openModal(product) {
    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalPrice.textContent = "Price: ₹ " + product.price;
    modalSize.textContent = "Size: " + product.size;
    modalDescription.textContent = product.description;

    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // lock background scroll
}

function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto"; // restore scroll
}


// =============================
// FETCH PRODUCTS
// =============================

fetch("data/drinks.json")
    .then(response => response.json())
    .then(data => {

        const filteredProducts = data.filter(
            item => item.category === category
        );

        if (filteredProducts.length === 0) {
            productGrid.innerHTML = "<p>No products available.</p>";
            return;
        }

        filteredProducts.forEach(product => {

            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₹ ${product.price}</p>
            `;

            card.addEventListener("click", () => {
                openModal(product);
            });

            productGrid.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error loading products:", error);
        productGrid.innerHTML = "<p>Error loading products.</p>";
    });


// =============================
// MODAL EVENT LISTENERS
// =============================

// Close button
closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
});

// Click outside modal-content
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
    }
});