// =============================
// ELEMENT REFERENCES
// =============================

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const searchInput = document.getElementById("search-input");
const categoryTitle = document.getElementById("category-title");
const productGrid = document.getElementById("product-grid");

const modal = document.getElementById("product-modal");
const closeBtn = document.getElementById("close-modal");

const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalSize = document.getElementById("modal-size");
const modalDescription = document.getElementById("modal-description");

const filterType = document.getElementById("filter-type");
const filterStrength = document.getElementById("filter-strength");

let allProducts = [];

// =============================
// SET CATEGORY TITLE
// =============================

if (category && categoryTitle) {
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

  if (!products.length) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
    <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
    </div>
    <h3>${product.name}</h3>
    <p>₹ ${product.price}</p>
`;

    card.addEventListener("click", () => openModal(product));
    productGrid.appendChild(card);
  });
}

// =============================
// APPLY ALL FILTERS (Search + Type + Strength)
// =============================

function applyAllFilters() {
  const selectedType = filterType ? filterType.value : "all";
  const selectedStrength = filterStrength ? filterStrength.value : "all";
  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";

  const filtered = allProducts.filter((product) => {
    const typeMatch = selectedType === "all" || product.type === selectedType;

    const strengthMatch =
      selectedStrength === "all" || product.strength === selectedStrength;

    const searchMatch = product.name.toLowerCase().includes(searchValue);

    return typeMatch && strengthMatch && searchMatch;
  });

  renderProducts(filtered);
}

// =============================
// FETCH PRODUCTS
// =============================

fetch("data/drinks.json")
  .then((response) => response.json())
  .then((data) => {
    allProducts = data.filter((item) => item.category === category);

    // Show filters ONLY for beer
    if (category === "beer") {
      const beerFilters = document.getElementById("beer-filters");
      if (beerFilters) {
        beerFilters.style.display = "flex";
      }
    }

    applyAllFilters();
  })
  .catch((error) => {
    console.error("Error loading products:", error);
    productGrid.innerHTML = "<p>Error loading products.</p>";
  });

// =============================
// EVENT LISTENERS
// =============================

if (searchInput) {
  searchInput.addEventListener("input", applyAllFilters);
}

if (filterType) {
  filterType.addEventListener("change", applyAllFilters);
}

if (filterStrength) {
  filterStrength.addEventListener("change", applyAllFilters);
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});
