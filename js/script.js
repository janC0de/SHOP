// ---------------------------------------------
// SHOP — placeholder product data & interactions
// Swap PRODUCTS with real inventory once the niche is decided.
// ---------------------------------------------

const PRODUCTS = [
  { id: 1, name: "Wool Overcoat", category: "Outerwear", price: 210, tag: "New" },
  { id: 2, name: "Relaxed Linen Shirt", category: "Tops", price: 68, tag: "New" },
  { id: 3, name: "Straight Leg Trouser", category: "Bottoms", price: 92, tag: null },
  { id: 4, name: "Merino Crewneck", category: "Knitwear", price: 78, tag: "New" },
  { id: 5, name: "Canvas Tote", category: "Accessories", price: 34, tag: null },
  { id: 6, name: "Suede Chelsea Boot", category: "Footwear", price: 165, tag: null },
  { id: 7, name: "Cotton Chino", category: "Bottoms", price: 74, tag: null },
  { id: 8, name: "Silk Scarf", category: "Accessories", price: 46, tag: "Sale" },
];

let cartCount = 0;

function currency(amount) {
  return `$${amount.toFixed(2)}`;
}

function productCard(product) {
  const initial = product.name.charAt(0);
  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-media" data-initial="${initial}">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-meta">
          <span class="product-cat">${product.category}</span>
          <span class="product-price">${currency(product.price)}</span>
        </div>
        <button class="add-btn" type="button">Add to Bag</button>
      </div>
    </article>
  `;
}

function renderProducts() {
  const newGrid = document.getElementById("productGrid");
  const collectionGrid = document.getElementById("collectionGrid");

  if (newGrid) {
    newGrid.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join("");
  }
  if (collectionGrid) {
    collectionGrid.innerHTML = PRODUCTS.map(productCard).join("");
  }
}

function updateCartCount(delta) {
  cartCount = Math.max(0, cartCount + delta);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cartCount;
}

function bindAddToBag() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".add-btn");
    if (!btn) return;
    updateCartCount(1);
    const original = btn.textContent;
    btn.textContent = "Added ✓";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 900);
  });
}

function bindMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function bindNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  const note = document.getElementById("formNote");
  if (!form || !note) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    note.textContent = "Thanks for subscribing — check your inbox to confirm.";
    form.reset();
  });
}

function setFooterYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  bindAddToBag();
  bindMobileMenu();
  bindNewsletterForm();
  setFooterYear();
});
