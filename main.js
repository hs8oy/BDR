document.getElementById("searchBtn").addEventListener("click", function () {
    let filter = document.getElementById("searchInput").value.toLowerCase();
    let products = document.getElementsByClassName("product-card");
    let noResultsMessage = document.getElementById("noResultsMessage");
    let searchButton = document.getElementById("searchBtn");
    let backButton = document.getElementById("backButton");
    let warningMessage = document.getElementById("warningMessage");
    let hasResults = false;

    // إظهار رسالة التحذير إذا كان حقل البحث فارغًا
    if (filter.trim() === "") {
        warningMessage.style.display = "block";
        return;
    } else {
        warningMessage.style.display = "none";
    }

    // إخفاء زر البحث وإظهار زر الرجوع عند الضغط على زر البحث
    searchButton.style.display = "none";
    backButton.style.display = "block";

    // إعادة عرض جميع المنتجات أولاً
    Array.from(products).forEach(product => product.style.display = "");

    // تصفية المنتجات بناءً على البحث
    const filteredProducts = Array.from(products).filter(product => {
        let productName = product.getElementsByClassName("st-name")[0].textContent.toLowerCase();
        if (productName.includes(filter)) {
            hasResults = true;
            return true;
        }
        return false;
    });
    

    // إدارة الرسالة التحذيرية بناءً على وجود نتائج
    if (!hasResults) {
        noResultsMessage.style.display = "block";
        noResultsMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        noResultsMessage.style.display = "none";
    }

    // ترتيب المنتجات المطابقة في صفوف جديدة
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    let currentRow;
    filteredProducts.forEach((product, index) => {
        if (!currentRow || index % 10 === 0) {
            currentRow = document.createElement("div");
            currentRow.classList.add("row");
            productsContainer.appendChild(currentRow);
        }
        currentRow.appendChild(product);
    });

    if (hasResults) {
        let firstVisibleProduct = filteredProducts[0];
        if (firstVisibleProduct) {
            firstVisibleProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

document.getElementById("backButton").addEventListener("click", function () {
    document.getElementById("searchBtn").style.display = "block";
    document.getElementById("backButton").style.display = "none";
    location.reload();
});

const productsContainer = document.getElementById("productsContainer");

async function fetchProducts() {
    try {
        const response = await fetch("products.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        localStorage.setItem("productsData", JSON.stringify(products));  // تخزين المنتجات في localStorage
  displayProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function displayProducts(products) {
  const productsContainer = document.getElementById("productsContainer");
    let currentRow;

    products.forEach((product, index) => {
        if (!currentRow || index % 10 === 0) {
            currentRow = document.createElement("div");
            currentRow.classList.add("row");
            productsContainer.appendChild(currentRow);
        }

        const card = document.createElement("div");
  card.classList.add("st-card", "product-card");

  card.innerHTML = `
    <img class="st-img" src="${product.img}" alt="${product.name}">
    <h3 class="st-name">${product.name}</h3>
    <p class="st-title">${product.price.replace(/\n/g, "<br>")}</p>
    <div class="btn-t"><button class="st-btn" onclick="orderProduct('${product.name}')">طلب العطر</button>
    <button class="st-btn" onclick="showProductInfo(${product.id})">معلومات</button></div>
  `;
  currentRow.appendChild(card);
  
});


}

function showProductInfo(productId) {
const products = JSON.parse(localStorage.getItem("productsData"));
const product = products.find(p => p.id === productId);

localStorage.setItem("currentProduct", JSON.stringify(product));  // تخزين المنتج المختار في localStorage
window.location.href = "product-info.html";  // الانتقال إلى صفحة التفاصيل
}

function orderProduct(name) {
    const phoneNumber = "+9647707458798"; // ضع رقمك هنا
    const message = ` مـرحـبـا اريــد أطـلـب هـذا  الـعـطـر :
- الاسم: ${name}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
});

fetchProducts();
