// Enhanced JavaScript for Nusantara Eceng Marketplace with Bootstrap

// Shopping Cart Class
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('nusantara-cart')) || [];
    this.updateCartUI();
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    
    this.saveCart();
    this.updateCartUI();
    this.showToast('Produk berhasil ditambahkan ke keranjang!', 'success');
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
    this.showToast('Produk dihapus dari keranjang', 'info');
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartUI();
      }
    }
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  saveCart() {
    localStorage.setItem('nusantara-cart', JSON.stringify(this.items));
  }

  updateCartUI() {
    this.updateCartBadge();
    this.updateCartModal();
  }

  updateCartBadge() {
    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
      const totalItems = this.getTotalItems();
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
  }

  updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartTotal) {
      cartTotal.textContent = this.formatPrice(this.getTotalPrice());
    }
    
    if (cartItems) {
      this.renderCartItems();
    }
  }

  renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    
    if (this.items.length === 0) {
      cartItems.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-cart-x display-4 text-muted"></i>
          <p class="text-muted mt-2">Keranjang Anda masih kosong</p>
          <button class="btn btn-primary" data-bs-dismiss="modal">Mulai Belanja</button>
        </div>
      `;
      return;
    }
    
    cartItems.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="row align-items-center">
          <div class="col-3">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          </div>
          <div class="col-6">
            <h6 class="mb-1">${item.name}</h6>
            <small class="text-muted">${item.artisan}</small>
            <div class="text-success fw-semibold">Rp ${this.formatPrice(item.price)}</div>
          </div>
          <div class="col-3">
            <div class="d-flex align-items-center justify-content-end">
              <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                <i class="bi bi-dash"></i>
              </button>
              <span class="mx-2 fw-semibold">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                <i class="bi bi-plus"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger ms-2" onclick="cart.removeItem('${item.id}')">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
  }

  showToast(message, type = 'success') {
    const toastContainer = this.getToastContainer();
    const toastId = 'toast-' + Date.now();
    
    const toastHTML = `
      <div class="toast align-items-center text-bg-${type} border-0" role="alert" id="${toastId}">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-check-circle me-2"></i>${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }

  getToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
    return container;
  }

  clear() {
    this.items = [];
    this.saveCart();
    this.updateCartUI();
  }
}

// Product Data
const products = [
  {
    id: 'bag-1',
    name: 'Tas Anyam Premium',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    category: 'bags',
    artisan: 'Ibu Sari - Yogyakarta',
    rating: 4.8
  },
  {
    id: 'hat-1',
    name: 'Topi Anyam Tradisional',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=300&h=300&fit=crop',
    category: 'hats',
    artisan: 'Pak Budi - Jawa Tengah',
    rating: 4.9
  },
  {
    id: 'basket-1',
    name: 'Keranjang Serbaguna',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    category: 'baskets',
    artisan: 'Ibu Tini - Kalimantan',
    rating: 4.7
  },
  {
    id: 'decor-1',
    name: 'Vas Dekorasi Modern',
    price: 200000,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    category: 'decor',
    artisan: 'Ibu Maya - Bali',
    rating: 4.8
  }
];

// Initialize Cart
const cart = new ShoppingCart();

// Loading Manager
class LoadingManager {
  static show() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
      spinner.classList.remove('d-none');
    }
  }

  static hide() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
      spinner.classList.add('d-none');
    }
  }
}

// Smooth Scrolling Function
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 80; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// Product Filtering
function setupProductFiltering() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const productCards = document.querySelectorAll('[data-category]');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.dataset.category;

      // Filter products with animation
      productCards.forEach((card, index) => {
        const cardCategory = card.dataset.category;
        const shouldShow = category === 'all' || cardCategory === category;
        
        setTimeout(() => {
          if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        }, index * 50);
      });
    });
  });
}

// Add to Cart Setup
function setupAddToCart() {
  document.querySelectorAll('.add-to-cart').forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const product = products[index];
      if (product) {
        cart.addItem(product);
        
        // Button animation
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i>';
        button.classList.add('btn-success');
        button.disabled = true;
        
        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.classList.remove('btn-success');
          button.disabled = false;
        }, 1500);
      }
    });
  });
}

// Checkout Process
async function setupCheckout() {
  const checkoutBtn = document.getElementById('checkout');
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (cart.items.length === 0) {
        cart.showToast('Keranjang Anda masih kosong!', 'warning');
        return;
      }

      // Show loading
      LoadingManager.show();
      
      try {
        // Simulate QRIS payment process
        await simulateQRISPayment();
        LoadingManager.hide();
        
        // Close cart modal
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        cartModal.hide();
        
        // Show success modal
        showPaymentSuccess();
        
      } catch (error) {
        LoadingManager.hide();
        cart.showToast('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.', 'danger');
      }
    });
  }
}

// Simulate QRIS Payment
async function simulateQRISPayment() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

// Payment Success Modal
function showPaymentSuccess() {
  const modalHTML = `
    <div class="modal fade" id="successModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center">
          <div class="modal-body p-5">
            <div class="mb-4">
              <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
            </div>
            <h3 class="mb-3">Pembayaran Berhasil!</h3>
            <p class="text-muted mb-4">Terima kasih atas pembelian Anda!<br>Pesanan akan segera diproses dan dikirim.</p>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" onclick="closeSuccessModal()">Kembali Berbelanja</button>
              <button class="btn btn-outline-secondary" onclick="closeSuccessModal()">Lihat Status Pesanan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();
  
  // Clear cart
  cart.clear();
  
  // Auto close after 8 seconds
  setTimeout(() => {
    closeSuccessModal();
  }, 8000);
}

function closeSuccessModal() {
  const successModal = bootstrap.Modal.getInstance(document.getElementById('successModal'));
  if (successModal) {
    successModal.hide();
  }
  document.getElementById('successModal')?.remove();
}

// Navbar Scroll Effect
function setupNavbarScrollEffect() {
  const navbar = document.querySelector('.navbar-custom');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// Smooth scroll for navigation links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        scrollToSection(target.id);
      }
    });
  });
}

// Image Lazy Loading
function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('loading-skeleton');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    img.classList.add('loading-skeleton');
    imageObserver.observe(img);
  });
}

// Search Functionality
function setupSearch() {
  const searchBtn = document.querySelector('.btn-outline-primary');
  
  if (searchBtn && searchBtn.querySelector('.bi-search')) {
    searchBtn.addEventListener('click', () => {
      const searchQuery = prompt('Cari produk:');
      if (searchQuery) {
        // Simulate search - in real app, this would filter products
        cart.showToast(`Mencari "${searchQuery}"...`, 'info');
        setTimeout(() => {
          cart.showToast('Hasil pencarian akan ditampilkan di sini', 'info');
        }, 1000);
      }
    });
  }
}

// Performance Monitoring
function setupPerformanceMonitoring() {
  // Monitor page load time
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Show performance warning if load time is too high
    if (loadTime > 3000) {
      console.warn('Page load time is higher than expected');
    }
  });
}

// Error Handling
function setupErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    cart.showToast('Terjadi kesalahan tak terduga. Halaman akan dimuat ulang.', 'danger');
    
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    cart.showToast('Terjadi kesalahan saat memproses permintaan.', 'warning');
  });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌿 Nusantara Eceng Marketplace with Bootstrap loaded!');
  
  // Initialize all functionality
  setupProductFiltering();
  setupAddToCart();
  setupCheckout();
  setupNavbarScrollEffect();
  setupSmoothScrolling();
  setupLazyLoading();
  setupSearch();
  setupPerformanceMonitoring();
  setupErrorHandling();
  
  // Initialize Bootstrap tooltips and popovers
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
  
  // Add fade-in animation to sections
  const sections = document.querySelectorAll('section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
  });
});

// Export for global access
window.cart = cart;
window.scrollToSection = scrollToSection;
window.closeSuccessModal = closeSuccessModal;

// Service Worker Registration (for future PWA support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
