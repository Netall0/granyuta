// КОНФИГУРАЦИЯ КАЛЬКУЛЯТОРА - ЗДЕСЬ МОЖНО МЕНЯТЬ ВСЕ ПОД СЕБЯ
const CONFIG = {
    // Базовые цены на размеры бань
    sizes: {
        '200000': { name: '2м × 4м', price: 200000 },
        '250000': { name: '2м × 5м', price: 250000 },
        '300000': { name: '2м × 6м', price: 300000 },
        '350000': { name: '2.5м × 6м', price: 350000 }
    },
    
    // Коэффициенты для материалов
    materials: {
        '1': { name: 'Кедр сибирский', multiplier: 1 },
        '1.3': { name: 'Кедр канадский', multiplier: 1.3 },
        '0.8': { name: 'Липа', multiplier: 0.8 },
        '0.9': { name: 'Осина', multiplier: 0.9 }
    },
    
    // Цены на печи
    stoves: {
        '0': { name: 'Без печи', price: 0 },
        '50000': { name: 'Электрическая печь', price: 50000 },
        '80000': { name: 'Дровяная печь', price: 80000 },
        '120000': { name: 'Премиум дровяная', price: 120000 }
    },
    
    // Дополнительные опции
    extras: {
        lighting: { name: 'LED-освещение', price: 15000 },
        delivery: { name: 'Доставка и установка (по договорённости)', price: 0}
    }
};

// Функция переключения вкладок
function switchTab(tabName) {
    // Скрываем все вкладки
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Убираем активный класс со всех ссылок
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Показываем нужную вкладку
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Активируем соответствующую ссылку
    const targetLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
}

// Функция расчета цены
function calculatePrice() {
    const sizeValue = document.getElementById('size').value;
    let totalPrice = parseInt(sizeValue);
    // Если выбрана доставка, добавляем 50 000
    const deliveryCheckbox = document.getElementById('delivery');
    if (deliveryCheckbox && deliveryCheckbox.checked) {
        totalPrice += 0;
    }
    // Если выбрана подсветка, добавляем 15 000
    const lightingCheckbox = document.getElementById('lighting');
    if (lightingCheckbox && lightingCheckbox.checked) {
        totalPrice += 15000;
    }
    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
}

// Функция фильтрации работ
function filterWorks(category) {
    const workCards = document.querySelectorAll('.work-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Убираем активный класс со всех кнопок
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Активируем нажатую кнопку
    const activeButton = document.querySelector(`[data-filter="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Показываем/скрываем карточки
    workCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'slideIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- Динамическая загрузка каталога бань ---
async function loadCatalog() {
    const grid = document.querySelector('.catalog-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loading">Загрузка...</div>';
    try {
        const response = await fetch('/api/catalog');
        if (!response.ok) throw new Error('Ошибка загрузки каталога');
        const baths = await response.json();
        if (!baths.length) {
            grid.innerHTML = '<div class="empty-catalog">Каталог пуст</div>';
            return;
        }
        grid.innerHTML = baths.map(bath => `
            <div class="catalog-card">
                <div class="catalog-card-img">
                    <img src="${bath.image.startsWith('http') ? bath.image : (bath.image.startsWith('image/') ? bath.image : 'image/' + bath.image)}" alt="${bath.name}">
                </div>
                <div class="catalog-card-content">
                    <h3>${bath.name}</h3>
                    <p>${bath.description}</p>
                </div>
                <div class="catalog-card-footer">
                    <div class="catalog-card-price">${Number(bath.price).toLocaleString('ru-RU')} ₽</div>
                    <button class="catalog-btn" onclick="openOrderModal('${bath.name}', '${bath.price}')">Заказать</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = '<div class="error">Ошибка загрузки каталога</div>';
    }
}
// Обработка формы заявки
async function handleOrderForm(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    // Добавляем данные калькулятора
    data.calculatedPrice = document.getElementById('totalPrice')?.textContent || '';
    const sizeSelect = document.getElementById('size');
    data.selectedSize = sizeSelect ? sizeSelect.options[sizeSelect.selectedIndex].text : '';
    const materialSelect = document.getElementById('material');
    data.selectedMaterial = materialSelect ? materialSelect.options[materialSelect.selectedIndex].text : '';
    const stoveSelect = document.getElementById('stove');
    data.selectedStove = stoveSelect ? stoveSelect.options[stoveSelect.selectedIndex].text : '';
    const selectedExtras = [];
    Object.keys(CONFIG.extras).forEach(option => {
        const checkbox = document.getElementById(option);
        if (checkbox && checkbox.checked) {
            let name = CONFIG.extras[option].name;
            if(option === 'delivery') name += ' (по договорённости)';
            selectedExtras.push(name);
        }
    });
    data.selectedExtras = selectedExtras.join(', ') || 'Не выбраны';
    try {
        // Отправка на сервер
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                phone: data.phone,
                email: data.email,
                message: data.comment,
                price: data.calculatedPrice,
                size: data.selectedSize,
                extras: data.selectedExtras
            })
        });
        if (!response.ok) throw new Error('Ошибка сервера');
        // Показываем красивый алерт
        showCustomAlert('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут, чтобы обсудить создание уюта и комфорта для вашей семьи.');
        this.reset();
        loadCatalog();
        setTimeout(() => {
            const successMessage = document.getElementById('successMessage');
            if (successMessage) successMessage.classList.remove('show');
        }, 5000);
        console.log('✅ Заявка успешно обработана:', data);
    } catch (error) {
        console.error('❌ Ошибка при отправке заявки:', error);
        showCustomAlert('❌ Произошла ошибка при отправке заявки. Пожалуйста, свяжитесь с нами по телефону.');
    }
}

// Функция фильтрации каталога
function filterCatalog(category) {
    const catalogCards = document.querySelectorAll('.catalog-card');
    const filterButtons = document.querySelectorAll('.catalog-filter .filter-btn');

    // Убираем активный класс со всех кнопок
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Активируем нажатую кнопку
    const activeButton = document.querySelector(`.catalog-filter [data-filter="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Показываем/скрываем карточки
    catalogCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'slideIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Функции для модального окна заказа
function openOrderModal(productName, productPrice) {
    document.getElementById('orderProductName').textContent = productName;
    document.getElementById('orderProductPrice').textContent = productPrice;
    document.getElementById('orderModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
    if (productPrice !== '') {
        showCustomAlert('Вы оформляете заказ из каталога. Пожалуйста, заполните форму и мы свяжемся с вами!');
    }
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Возвращаем прокрутку страницы
    document.getElementById('orderModalForm').reset(); // Очищаем форму
}

// Обработка формы заказа из каталога
async function handleOrderModalForm(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    const productName = document.getElementById('orderProductName').textContent;
    const productPrice = document.getElementById('orderProductPrice').textContent;
    try {
        // Отправка на сервер
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                phone: data.phone,
                email: data.email,
                message: data.comment,
                price: productPrice,
                size: productName,
                extras: ''
            })
        });
        if (!response.ok) throw new Error('Ошибка сервера');
        showCustomAlert('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут, чтобы обсудить создание уюта и комфорта для вашей семьи.');
        closeOrderModal();
    }catch (error) {
        console.error('Ошибка отправки заявки:', error);
        showCustomAlert('❌ Ошибка отправки заявки. Попробуйте позже или свяжитесь с нами по телефону.');
    }
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderModal();
    }
}


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Привязываем обработчик к форме заказа из каталога
    const orderModalForm = document.getElementById('orderModalForm');
    if (orderModalForm) {
        orderModalForm.addEventListener('submit', handleOrderModalForm);
    }
    
    // Привязываем обработчик к форме калькулятора
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderForm);
    }
    
    // Обработчики навигации
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Привязываем обработчики к кнопкам фильтрации
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-filter');
            if (this.closest('.catalog-filter')) {
                filterCatalog(category);
            } else {
                filterWorks(category);
            }
        });
    });
    
    // Инициализируем калькулятор
    calculatePrice();
    loadCatalog();

    // Обработчики калькулятора
    const calculatorInputs = document.querySelectorAll('#size, #material, #stove');
    calculatorInputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });

    const calculatorCheckboxes = document.querySelectorAll('#lighting, #ventilation, #delivery, #foundation');
    calculatorCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками и другими элементами
    const animatedElements = document.querySelectorAll('.feature-card, .work-card, .catalog-card, .team-member, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    console.log('🚀 Сайт БаняБочка успешно загружен!');
});

// Глобальная функция для переключения вкладок (для кнопок)
window.switchTab = switchTab;

// Функции для работы с модальным окном изображений
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Закрытие модального окна при клике вне изображения
document.addEventListener('DOMContentLoaded', function() {
    const imageModal = document.getElementById('imageModal');
    
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
            closeOrderModal();
        }
    });
});

// Фокус и снятие фокуса в галерее
function showUnfocusBtn(img) {
    const btn = img.nextElementSibling;
    if(btn && btn.classList.contains('unfocus-btn')) {
        btn.style.display = 'inline-block';
    }
}
function hideUnfocusBtn(img) {
    const btn = img.nextElementSibling;
    if(btn && btn.classList.contains('unfocus-btn')) {
        btn.style.display = 'none';
    }
}
function unfocusImage(btn) {
    btn.style.display = 'none';
    if(btn.previousElementSibling) btn.previousElementSibling.blur();
}

// Простое мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burgerBtn');
    const nav = document.getElementById('mainNav');
    const contacts = document.querySelector('.contact-info');
    
    if (burger && nav && contacts) {
        burger.addEventListener('click', function() {
            nav.classList.toggle('open');
            contacts.classList.toggle('open');
            burger.classList.toggle('open');
        });
        
        // Закрывать при клике на пункты меню
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('open');
                contacts.classList.remove('open');
                burger.classList.remove('open');
            });
        });
    }
});

// ПРИНУДИТЕЛЬНО УДАЛИТЬ DRAWER НА ПК
document.addEventListener('DOMContentLoaded', function() {
    const drawer = document.getElementById('mobileDrawer');
    const burger = document.getElementById('burgerBtn');
    
    // Проверяем ширину экрана
    function checkScreenSize() {
        if (window.innerWidth >= 901) {
            // На ПК - удаляем drawer
            if (drawer) {
                drawer.style.display = 'none';
                drawer.style.visibility = 'hidden';
                drawer.style.position = 'absolute';
                drawer.style.left = '-9999px';
                drawer.style.width = '0';
                drawer.style.height = '0';
                drawer.style.overflow = 'hidden';
            }
            if (burger) {
                burger.style.display = 'none';
            }
        } else {
            // На мобильных - показываем drawer
            if (drawer) {
                drawer.style.display = 'flex';
                drawer.style.visibility = 'visible';
                drawer.style.position = 'fixed';
                drawer.style.left = '-100%';
                drawer.style.width = '85vw';
                drawer.style.maxWidth = '350px';
                drawer.style.height = '100vh';
                drawer.style.overflow = 'auto';
            }
            if (burger) {
                burger.style.display = 'flex';
            }
        }
    }
    
    // Проверяем при загрузке
    checkScreenSize();
    
    // Проверяем при изменении размера окна
    window.addEventListener('resize', checkScreenSize);
    
    // Мобильный drawer
    if (burger && drawer) {
        burger.addEventListener('click', function() {
            if (window.innerWidth < 901) {
                drawer.classList.toggle('open');
                document.body.classList.toggle('drawer-open');
            }
        });
        
        // Закрывать при клике на пункты меню
        const links = drawer.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 901) {
                    drawer.classList.remove('open');
                    document.body.classList.remove('drawer-open');
                }
            });
        });
    }
});

function showCustomAlert(message) {
    const alertDiv = document.getElementById('customAlert');
    alertDiv.querySelector('.alert-message').textContent = message;
    alertDiv.style.display = 'flex';
    setTimeout(() => alertDiv.classList.add('show'), 10);
    // Автоматически скрывать через 4 секунды
    clearTimeout(window._customAlertTimeout);
    window._customAlertTimeout = setTimeout(closeCustomAlert, 4000);
}
function closeCustomAlert() {
    const alertDiv = document.getElementById('customAlert');
    alertDiv.classList.remove('show');
    setTimeout(() => { alertDiv.style.display = 'none'; }, 400);
}

// Гарантированно навешиваем обработчик
document.addEventListener('DOMContentLoaded', function() {
  const burger = document.getElementById('burgerBtn');
  if (burger) {
    burger.addEventListener('click', toggleMobileMenu);
  }
});

