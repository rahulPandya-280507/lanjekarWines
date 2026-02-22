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

const beerFilters = document.getElementById("beer-filters");
const filterType = document.getElementById("filter-type");
const filterStrength = document.getElementById("filter-strength");

let allProducts = []; // store category products


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
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
}


// =============================
// RENDER PRODUCTS
// =============================

function renderProducts(products) {

    productGrid.innerHTML = "";

    if (products.length === 0) {
        productGrid.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹ ${product.price}</p>
        `;

        card.addEventListener("click", () => openModal(product));

        productGrid.appendChild(card);
    });
}


// =============================
// APPLY BEER FILTERS
// =============================

function applyBeerFilters() {

    const selectedType = filterType.value;
    const selectedStrength = filterStrength.value;

    const filtered = allProducts.filter(product => {

        const typeMatch =
            selectedType === "all" || product.type === selectedType;

        const strengthMatch =
            selectedStrength === "all" || product.strength === selectedStrength;

        return typeMatch && strengthMatch;
    });

    renderProducts(filtered);
}


// =============================
// FETCH PRODUCTS
// =============================

fetch("data/drinks.json")
    .then(response => response.json())
    .then(data => {

        allProducts = data.filter(
            item => item.category === category
        );

        if (allProducts.length === 0) {
            productGrid.innerHTML = "<p>No products available.</p>";
            return;
        }

        renderProducts(allProducts);

        // Show filters ONLY for beer
        if (category === "beer") {
            beerFilters.style.display = "flex";

            filterType.addEventListener("change", applyBeerFilters);
            filterStrength.addEventListener("change", applyBeerFilters);
        }

    })
    .catch(error => {
        console.error("Error loading products:", error);
        productGrid.innerHTML = "<p>Error loading products.</p>";
    });


// =============================
// MODAL EVENT LISTENERS
// =============================

closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
    }
});