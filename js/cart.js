// ====================================
// BobWich Cart System
// Add to cart, manage quantities, send to WhatsApp
// ====================================

// Cart data stored in localStorage
let cart = JSON.parse(localStorage.getItem('bobwich_cart')) || [];

// WhatsApp number
const WHATSAPP_NUMBER = '201556311496';

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('bobwich_cart', JSON.stringify(cart));
    updateCartUI();
}

// Add item to cart
function addToCart(name, price, size = '') {
    const itemName = size ? `${name} (${size})` : name;

    // Check if item already exists
    const existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: parseFloat(price),
            quantity: 1
        });
    }

    saveCart();
    showNotification(`تمت إضافة ${name} للسلة ✓`);
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

// Update item quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
    }
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get total items count
function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
}

// Update cart UI
function updateCartUI() {
    // Update cart count badge
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = getCartCount();

    cartCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });

    // Update cart items list
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartActions = document.getElementById('cartActions');
    const customerForm = document.getElementById('customerForm');

    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartActions) cartActions.style.display = 'none';
            if (customerForm) customerForm.style.display = 'none';
        } else {
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            if (cartActions) cartActions.style.display = 'block';
            if (customerForm) customerForm.style.display = 'block';

            cartItemsContainer.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <button class="remove-btn" onclick="removeFromCart(${index})" title="حذف من السلة">
                            <span>✕</span>
                        </button>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-controls">
                            <button class="qty-btn qty-minus" onclick="updateQuantity(${index}, -1)">−</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn qty-plus" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        <div class="cart-item-pricing">
                            <span class="item-unit-price">${item.price} × ${item.quantity}</span>
                            <span class="item-total-price">${item.price * item.quantity} جنيه</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    if (cartTotalElement) {
        cartTotalElement.textContent = getCartTotal();
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }
}

// Close cart
function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Validate customer form
function validateCustomerForm() {
    const name = document.getElementById('customerName');
    const phone = document.getElementById('customerPhone');
    const address = document.getElementById('customerAddress');

    let isValid = true;

    // Remove previous error states
    [name, phone, address].forEach(field => {
        if (field) field.classList.remove('error');
    });

    // Validate name
    if (!name || !name.value.trim()) {
        if (name) name.classList.add('error');
        isValid = false;
    }

    // Validate phone
    if (!phone || !phone.value.trim()) {
        if (phone) phone.classList.add('error');
        isValid = false;
    } else {
        // Check phone format (Egyptian numbers)
        const phoneRegex = /^01[0-9]{9}$/;
        if (!phoneRegex.test(phone.value.trim().replace(/\s/g, ''))) {
            phone.classList.add('error');
            isValid = false;
        }
    }

    // Validate address
    if (!address || !address.value.trim()) {
        if (address) address.classList.add('error');
        isValid = false;
    }

    return isValid;
}

// Get customer data
function getCustomerData() {
    return {
        name: document.getElementById('customerName')?.value.trim() || '',
        phone: document.getElementById('customerPhone')?.value.trim() || '',
        phone2: document.getElementById('customerPhone2')?.value.trim() || '',
        address: document.getElementById('customerAddress')?.value.trim() || '',
        notes: document.getElementById('orderNotes')?.value.trim() || ''
    };
}

// Clear customer form
function clearCustomerForm() {
    const fields = ['customerName', 'customerPhone', 'customerPhone2', 'customerAddress', 'orderNotes'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';
            field.classList.remove('error');
        }
    });
}

// Send order to WhatsApp
function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        showNotification('السلة فارغة!', 'error');
        return;
    }

    // Validate customer form
    if (!validateCustomerForm()) {
        showNotification('من فضلك أكمل بيانات العميل أولاً!', 'error');

        const customerForm = document.getElementById('customerForm');
        if (customerForm) {
            customerForm.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Focus on the first empty required field
            const firstError = document.querySelector('.form-group input.error, .form-group textarea.error');
            if (firstError) {
                setTimeout(() => firstError.focus(), 500);
            }
        }
        return;
    }

    // Get customer data
    const customer = getCustomerData();

    // Build order message
    let message = '🍔 *طلب جديد من موقع بوب ويتش*\n\n';

    // Customer Information Section
    message += '👤 *بيانات العميل:*\n';
    message += '━━━━━━━━━━━━━━━\n';
    message += `📛 الاسم: ${customer.name}\n`;
    message += `📱 رقم الهاتف: ${customer.phone}\n`;
    if (customer.phone2) {
        message += `📱 رقم إضافي: ${customer.phone2}\n`;
    }
    message += `📍 العنوان: ${customer.address}\n`;
    message += '━━━━━━━━━━━━━━━\n\n';

    // Order Details Section
    message += '📋 *تفاصيل الطلب:*\n';
    message += '━━━━━━━━━━━━━━━\n';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name}\n`;
        message += `   الكمية: ${item.quantity} × ${item.price} = ${itemTotal} جنيه\n`;
    });

    message += '━━━━━━━━━━━━━━━\n';
    message += `💰 *الإجمالي: ${getCartTotal()} جنيه (بدون توصيل)*\n\n`;

    // Notes Section
    if (customer.notes) {
        message += `📝 *ملاحظات:* ${customer.notes}\n\n`;
    }

    message += '_شكراً لطلبكم من بوب ويتش! 🙏💖_';

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    // Clear cart and form after sending
    clearCart();
    clearCustomerForm();
    closeCart();

    showNotification('تم فتح الواتساب! أكمل طلبك هناك ✓');
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.cart-notification');
    existing.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = message;

    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#28A745' : '#DC3545'};
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        z-index: 99999;
        animation: slideUp 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Add animation styles
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100px); opacity: 0; }
    }
`;
document.head.appendChild(cartStyles);

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.closeCart = closeCart;
window.sendOrderToWhatsApp = sendOrderToWhatsApp;
window.clearCart = clearCart;

console.log('نظام السلة تم تحميله بنجاح!');
