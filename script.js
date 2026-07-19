// ดึงข้อมูลสินค้าจาก LocalStorage (ถ้าไม่มีให้เป็นอาร์เรย์ว่าง)
let products = JSON.parse(localStorage.getItem('inventory_products')) || [];

// ดึง Elements จาก HTML
const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productQtyInput = document.getElementById('product-qty');
const productIndexInput = document.getElementById('product-index');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const tableBody = document.getElementById('product-table-body');

// ฟังก์ชันสำหรับบันทึกข้อมูลลง LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('inventory_products', JSON.stringify(products));
}

// ฟังก์ชันล้างค่าฟอร์มและรีเซ็ตปุ่ม
function resetForm() {
    productForm.reset();
    productIndexInput.value = '';
    submitBtn.innerText = 'บันทึกสินค้า';
    cancelBtn.style.display = 'none';
}

// ฟังก์ชันวิเคราะห์สถานะสินค้า (หน้าบ้าน)
function getStockStatus(qty) {
    const quantity = parseInt(qty);
    if (quantity === 0) {
        return '<span class="badge badge-out-of-stock">❌ สินค้าหมด</span>';
    } else if (quantity <= 5) {
        return '<span class="badge badge-low-stock">⚠️ สินค้าใกล้หมด</span>';
    } else {
        return '<span class="badge badge-in-stock">✔️ มีสินค้า</span>';
    }
}

// ฟังก์ชันแสดงผลรายการสินค้าบนตาราง
function displayProducts() {
    tableBody.innerHTML = ''; // ล้างข้อมูลเก่าในตารางก่อน

    if (products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">ไม่มีข้อมูลสินค้าในสต็อก</td></tr>`;
        return;
    }

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        
        // ถอด onclick ออกจาก HTML แล้วใส่ data-index กับ class แทนเพื่อความปลอดภัย
        row.innerHTML = `
            <td><strong>${product.name}</strong></td>
            <td>${product.qty} ชิ้น</td>
            <td>${getStockStatus(product.qty)}</td>
            <td>
                <button class="btn btn-warning edit-btn" data-index="${index}">แก้ไข</button>
                <button class="btn btn-danger delete-btn" data-index="${index}">ลบ</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// ฟังก์ชันเพิ่มหรือแก้ไขสินค้า
productForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = productNameInput.value.trim();
    const qty = parseInt(productQtyInput.value);
    const index = productIndexInput.value;

    if (index === '') {
        // โหมดเพิ่มสินค้าใหม่
        products.push({ name, qty });
    } else {
        // โหมดแก้ไขสินค้าเดิม
        products[index] = { name, qty };
        resetForm();
    }

    saveToLocalStorage();
    displayProducts();
    productForm.reset();
});

// 🛠️ วิธีใหม่: ดักจับการกดปุ่ม "ลบ" หรือ "แก้ไข" ผ่านตัวตารางโดยตรง (Event Delegation)
tableBody.addEventListener('click', function(e) {
    // เช็คว่าเป้าหมายที่คลิกมี class เป็นปุ่มลบหรือไม่
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index'); // ดึงตำแหน่งลำดับสินค้า
        
        if (confirm(`คุณแน่ใจใช่ไหมที่จะลบสินค้า "${products[index].name}"?`)) {
            products.splice(index, 1); // ลบออกจาก Array
            saveToLocalStorage();     // เซฟลงระบบหลังบ้านจำลอง
            displayProducts();        // อัปเดตตารางหน้าบ้าน
            resetForm();
        }
    }

    // เช็คว่าเป้าหมายที่คลิกมี class เป็นปุ่มแก้ไขหรือไม่
    if (e.target.classList.contains('edit-btn')) {
        const index = e.target.getAttribute('data-index');
        
        productNameInput.value = products[index].name;
        productQtyInput.value = products[index].qty;
        productIndexInput.value = index;
        
        submitBtn.innerText = 'อัปเดตข้อมูล';
        cancelBtn.style.display = 'inline-block';
    }
});

// ฟังก์ชันยกเลิกการแก้ไข
cancelBtn.addEventListener('click', resetForm);

// เรียกใช้งานครั้งแรกเมื่อเปิดหน้าเว็บเพื่อแสดงข้อมูลที่มีอยู่
displayProducts();