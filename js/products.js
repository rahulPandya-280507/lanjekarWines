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

const filterWhiskeyType = document.getElementById("filter-whiskey-type");
const filterWhiskeyStyle = document.getElementById("filter-whiskey-style");

const filterRumType = document.getElementById("filter-rum-type");

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
  let filtered = [...allProducts];

  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";

  // ======================
  // BEER FILTER
  // ======================
  if (category === "beer") {
    const selectedType = filterType ? filterType.value : "all";
    const selectedStrength = filterStrength ? filterStrength.value : "all";

    filtered = filtered.filter((product) => {
      const typeMatch =
        selectedType === "all" || product.type.toLowerCase() === selectedType;

      const strengthMatch =
        selectedStrength === "all" ||
        product.strength.toLowerCase() === selectedStrength;

      return typeMatch && strengthMatch;
    });
  }

  // ======================
  // WHISKEY FILTER
  // ======================
  if (category === "whiskey") {
    const selectedType = filterWhiskeyType ? filterWhiskeyType.value : "all";
    const selectedStyle = filterWhiskeyStyle ? filterWhiskeyStyle.value : "all";

    filtered = filtered.filter((product) => {
      const typeMatch =
        selectedType === "all" || product.type.toLowerCase() === selectedType;

      const styleMatch =
        selectedStyle === "all" ||
        product.style.toLowerCase() === selectedStyle;

      return typeMatch && styleMatch;
    });
  }

  // ======================
  // RUM FILTER
  // ======================
if (category === "rum") {
    const selectedType = filterRumType ? filterRumType.value : "all";

    filtered = filtered.filter((product) => {
      const typeMatch =
        selectedType === "all" || product.type.toLowerCase() === selectedType;

      return typeMatch;
    });
  }


  // ======================
  // SEARCH
  // ======================
  filtered = filtered.filter((product) =>
    product.name.toLowerCase().includes(searchValue),
  );

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
    const beerFilters = document.getElementById("beer-filters");
    const whiskeyFilters = document.getElementById("whiskey-filters");
    const rumFilters = document.getElementById("rum-filters");

    // Hide both first
    if (beerFilters) beerFilters.classList.remove("active");
    if (whiskeyFilters) whiskeyFilters.classList.remove("active");
    if (rumFilters) rumFilters.classList.remove("active");

    // Show only correct one
    if (category === "beer" && beerFilters) {
      beerFilters.classList.add("active");
    }

    if (category === "whiskey" && whiskeyFilters) {
      whiskeyFilters.classList.add("active");
    }
    if (category === "rum" && rumFilters) {
      rumFilters.classList.add("active");
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

if (filterWhiskeyType) {
  filterWhiskeyType.addEventListener("change", applyAllFilters);
}

if (filterWhiskeyStyle) {
  filterWhiskeyStyle.addEventListener("change", applyAllFilters);
}

if(filterRumType) {
  filterRumType.addEventListener("change", applyAllFilters);
}

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
