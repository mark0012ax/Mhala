const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// เมื่อกดปุ่ม Hamburger ให้เปิด/ปิดเมนู
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-active');
    navMenu.classList.toggle('active');
});

// เมื่อกดเลือกเมนูแล้ว ให้หุบเมนูกลับอัตโนมัติ และสโครลไปจุดนั้น
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // หุบเมนูกลับ
        mobileMenu.classList.remove('is-active');
        navMenu.classList.remove('active');

        // Smooth scroll
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});