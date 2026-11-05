const products = [
  { id: "p1", name: "Product1", imageUrl: "https://picsum.photos/seed/product1/600/400", inStock: true,  price: 19.99 },
  { id: "p2", name: "Product2", imageUrl: "https://picsum.photos/seed/product2/600/400", inStock: false, price: 29.99 },
];

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const $products = document.getElementById("products");
const $cart = document.getElementById("cart");
const $cartItems = document.getElementById("cart-items");
const $cartCount = document.getElementById("cart-count");
const $cartTotal = document.getElementById("cart-total");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function cartCount() {
  return cart.reduce((sum, i) => sum + i.quantity, 0);
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function openCart() { $cart.classList.add("open"); }
function closeCart() { $cart.classList.remove("open"); }

function addToCart(productId) {
  const p = products.find(x => x.id === productId);
  if (!p || !p.inStock) return;

  const existing = cart.find(i => i.productId === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ productId: p.id, name: p.name, price: p.price, quantity: 1 });

  saveCart();
  renderCart();
}

function buyNow(productId) {
  addToCart(productId);
  openCart();
  $cart.scrollIntoView({ behavior: "smooth", block: "start" });
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(i => i.productId !== productId);
  saveCart();
  renderCart();
}

function renderProducts() {
  $products.innerHTML = products.map(p => `
    <article class="card">
      <img src="${p.imageUrl}" alt="${p.name}" />
      <div class="row">
        <h2 style="margin:0;font-size:18px">${p.name}</h2>
        <span class="badge ${p.inStock ? "in" : "out"}">${p.inStock ? "In Stock" : "Out of Stock"}</span>
      </div>
      <div class="small">$${p.price.toFixed(2)}</div>
      <div class="actions">
        <button class="btn" ${p.inStock ? "" : "disabled"} onclick="addToCart('${p.id}')">Add to Cart</button>
        <button class="btn btn-ghost" ${p.inStock ? "" : "disabled"} onclick="buyNow('${p.id}')">Buy</button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  $cartItems.innerHTML = cart.length ? cart.map(i => `
    <div class="cart-item">
      <div class="meta">
        <strong>${i.name}</strong>
        <span class="small">$${i.price.toFixed(2)} each</span>
      </div>
      <div class="meta" style="align-items:flex-end">
        <div class="row" style="gap:8px">
          <button class="btn btn-ghost" onclick="changeQty('${i.productId}', -1)">-</button>
          <strong>${i.quantity}</strong>
          <button class="btn btn-ghost" onclick="changeQty('${i.productId}', 1)">+</button>
        </div>
        <span class="small">$${(i.price * i.quantity).toFixed(2)}</span>
      </div>
    </div>
  `).join("") : `<div class="small">Cart is empty.</div>`;

  $cartCount.textContent = cartCount();
  $cartTotal.textContent = `$${cartTotal().toFixed(2)}`;
}

document.getElementById("view-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

renderProducts();
renderCart();
