if (!localStorage.getItem("admin")) {
  window.location = "admin-login.html";
}

let products = JSON.parse(localStorage.getItem("products")) || [];

function addProduct() {
  const file = pimage.files[0];
  const reader = new FileReader();

  if (!pname.value || !pprice.value) {
    alert("Please enter both name and price");
    return;
  }

  reader.onload = function (e) {
    const p = {
      id: Date.now(),
      name: pname.value,
      price: pprice.value,
      image: e.target.result
    };
    products.push(p);
    localStorage.setItem("products", JSON.stringify(products));
    render();
    pname.value = "";
    pprice.value = "";
    pimage.value = "";
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    const p = {
      id: Date.now(),
      name: pname.value,
      price: pprice.value,
      image: null
    };
    products.push(p);
    localStorage.setItem("products", JSON.stringify(products));
    render();
    pname.value = "";
    pprice.value = "";
  }
}

function render() {
  productList.innerHTML = "";
  if (products.length === 0) {
    productList.innerHTML = "<li style='padding: 20px; color: #777;'>No products in inventory.</li>";
    return;
  }
  
  products.forEach((p, i) => {
    productList.innerHTML += `
      <li>
        <img class="admin-thumb" src="${p.image || 'https://via.placeholder.com/60?text=No+Img'}" alt="${p.name}">
        <div style="flex-grow: 1;">
          <div style="font-weight: 600; color: #111;">${p.name}</div>
          <div style="color: #B12704; font-weight: 500;">₹${p.price}</div>
        </div>
        <button onclick="del(${i})" style="background: transparent; color: #777; font-size: 20px; padding: 5px;">❌</button>
      </li>`;
  });
}

function del(i) {
  if (confirm("Delete this product?")) {
    products.splice(i, 1);
    localStorage.setItem("products", JSON.stringify(products));
    render();
  }
}

render();
