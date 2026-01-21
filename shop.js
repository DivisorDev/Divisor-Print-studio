const shop = document.getElementById("shop");
const products = JSON.parse(localStorage.getItem("products")) || [];

function renderShop() {
  if (products.length === 0) {
    shop.innerHTML = `
      <div style="grid-column: 1/-1; padding: 100px 0; text-align: center;">
        <h2 style="color: #555;">No products found</h2>
        <p style="color: #777;">Check back later or visit the admin panel to add products.</p>
      </div>`;
    return;
  }

  shop.innerHTML = "";
  products.forEach((p, index) => {
    // Ensure product has an ID, use index if not present
    const productId = p.id || index;
    shop.innerHTML += `
    <div class="product-card">
      <div class="img-box">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<div style="color: #ccc; font-size: 40px;">📦</div>`}
      </div>
      <div class="product-details">
        <h3>${p.name}</h3>
        <div class="price">
          <span>₹</span>${p.price}
        </div>
        <button class="order-button" onclick="addToCart('${productId}')">Add to Cart</button>
      </div>
    </div>`;
  });
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id) {
  // Try to find by ID (checking both string and number)
  let p = products.find(x => x.id == id);
  
  // If not found by ID, it might be using the index as ID
  if (!p && !isNaN(id)) {
    p = products[id];
  }

  if (!p) {
    console.error("Product not found for ID/Index:", id);
    alert("Sorry, this product could not be added.");
    return;
  }
  
  cart.push({...p});
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${p.name} added to cart!`);
  renderCart();
}

function renderCart() {
  const cartDiv = document.getElementById("cart-section");
  if (!cartDiv) return;
  
  if (cart.length === 0) {
    cartDiv.innerHTML = "<h3>Your Cart</h3><p style='color: #777;'>Your cart is empty</p>";
    return;
  }
  
  let total = 0;
  let html = "<h3>Your Cart</h3>";
  cart.forEach((item, index) => {
    total += parseFloat(item.price) || 0;
    html += `
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
        <span>${item.name}</span>
        <span>₹${item.price} <button onclick="removeFromCart(${index})" style="background: none; border: none; cursor: pointer;">❌</button></span>
      </div>`;
  });
  
  html += `<div style="font-weight: 800; padding: 15px 0; font-size: 18px;">Total: ₹${total}</div>`;
  html += `<a href="https://wa.me/918679219613?text=I want to order: ${encodeURIComponent(cart.map(i => i.name).join(', '))} Total: ₹${total}" target="_blank" style="text-decoration: none;">
            <button class="order-button" style="background: #25D366; border-color: #25D366; color: #fff;">Checkout on WhatsApp</button>
          </a>`;
  
  cartDiv.innerHTML = html;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderShop();
renderCart();
