// ดึงข้อมูลสินค้าจากคลังสินค้า LocalStorage ตัวเดียวกัน
let products = JSON.parse(localStorage.getItem('inventory_products')) || [];

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');

// ฟังก์ชันวิเคราะห์สถานะ
function getStatusDetails(qty) {
    const quantity = parseInt(qty);
    if (quantity === 0) {
        return { text: '❌ สินค้าหมดชั่วคราว', class: 'status-out-of-stock', disableBtn: true };
    } else if (quantity <= 5) {
        return { text: `⚠️ เหลือเพียง ${quantity} ชิ้นสุดท้าย`, class: 'status-low-stock', disableBtn: false };
    } else {
        return { text: '✔️ 有สินค้าพร้อมส่ง', class: 'status-in-stock', disableBtn: false };
    }
}

// ฟังก์ชันวาดหน้าร้านค้า
function renderShop(filteredProducts = products) {
    productGrid.innerHTML = ''; // ล้างตารางเดิม

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<div class="no-products">🔍 ไม่พบสินค้าในร้านค้า</div>`;
        return;
    }

    filteredProducts.forEach((product) => {
        const status = getStatusDetails(product.qty);
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // 🛠️ ตรวจสอบอย่างละเอียด: หากข้อมูล product.image มีค่าและขึ้นต้นด้วย data:image
        let imageHTML = `<div class="product-image-placeholder">📦</div>`;
        if (product.image && product.image.startsWith('data:image')) {
            imageHTML = `<div class="product-image-container">
                            <img src="${product.image}" alt="${product.name}">
                         </div>`;
        }
        
        card.innerHTML = `
            ${imageHTML}
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="stock-count">คงเหลือในคลัง: ${product.qty} ชิ้น</div>
                <div class="status-badge ${status.class}">${status.text}</div>
            </div>
        `;
        
        productGrid.appendChild(card);
    });
}

// ระบบกรองและค้นหาข้อมูลสินค้า
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filterValue = statusFilter.value;

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const qty = parseInt(product.qty);
        
        let matchesStatus = true;
        if (filterValue === 'in-stock') matchesStatus = (qty > 5);
        if (filterValue === 'low-stock') matchesStatus = (qty > 0 && qty <= 5);
        if (filterValue === 'out-of-stock') matchesStatus = (qty === 0);

        return matchesSearch && matchesStatus;
    });

    renderShop(filtered);
}

searchInput.addEventListener('input', filterProducts);
statusFilter.addEventListener('change', filterProducts);

// รันการทำงานครั้งแรก
renderShop();