import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Heart, ShoppingCart, User, Star, Grid, List, SlidersHorizontal, Plus, Minus, Trash2, ArrowLeft, ChevronRight, X, Check, AlertCircle, Package, Truck, CreditCard, Gift, Percent, Clock, ShoppingBag } from 'lucide-react';

export default function ShopZen() {
  // State management
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const [addToCartAnimations, setAddToCartAnimations] = useState(new Set());
  const [cartNotifications, setCartNotifications] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [savedForLater, setSavedForLater] = useState([]);
  const [quickBuyItem, setQuickBuyItem] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [cartSummaryExpanded, setCartSummaryExpanded] = useState(true);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Enhanced Cart State
  const [couponCode, setCouponCode] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [showCartSummary, setShowCartSummary] = useState(false);
  const [cartStep, setCartStep] = useState('cart'); // cart, shipping, payment, confirmation
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  // Login/Signup forms state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Available coupons for demonstration
  const availableCoupons = [
    { code: 'SAVE10', discount: 10, type: 'percentage', description: '10% off your order' },
    { code: 'WELCOME20', discount: 20, type: 'fixed', description: '$20 off orders over $100' },
    { code: 'FREESHIP', discount: 0, type: 'shipping', description: 'Free shipping on any order' }
  ];

  // Shipping options
  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 9.99, days: '5-7', description: 'Delivery in 5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 19.99, days: '2-3', description: 'Delivery in 2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 29.99, days: '1', description: 'Next business day delivery' }
  ];

  // Categories
  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys'];

  // Sample products data
  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      category: 'Electronics',
      brand: 'TechPro',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
      rating: 4.5,
      reviews: 128,
      badge: 'Sale',
      inStock: true,
      stockCount: 45,
      weight: 0.5
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: 'Electronics',
      brand: 'FitTech',
      description: 'Advanced fitness tracking with heart rate monitor, GPS, and smartphone integration.',
      rating: 4.7,
      reviews: 89,
      badge: 'Best Seller',
      inStock: true,
      stockCount: 23,
      weight: 0.3
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      category: 'Fashion',
      brand: 'EcoWear',
      description: 'Comfortable, sustainable fashion made from 100% organic cotton.',
      rating: 4.3,
      reviews: 156,
      badge: 'New',
      inStock: true,
      stockCount: 78,
      weight: 0.2
    },
    {
      id: 4,
      name: 'Professional Chef Knife',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&h=500&fit=crop',
      category: 'Home & Garden',
      brand: 'ChefMaster',
      description: 'High-carbon stainless steel knife perfect for professional and home cooking.',
      rating: 4.8,
      reviews: 67,
      badge: 'Sale',
      inStock: false,
      stockCount: 0,
      weight: 0.8
    },
    {
      id: 5,
      name: 'Yoga Mat Premium',
      price: 39.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
      category: 'Sports',
      brand: 'YogaLife',
      description: 'Non-slip, eco-friendly yoga mat with superior cushioning and durability.',
      rating: 4.4,
      reviews: 203,
      badge: null,
      inStock: true,
      stockCount: 34,
      weight: 1.2
    },
    {
      id: 6,
      name: 'Skincare Routine Kit',
      price: 59.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
      category: 'Beauty',
      brand: 'GlowUp',
      description: 'Complete skincare set with cleanser, toner, serum, and moisturizer for radiant skin.',
      rating: 4.6,
      reviews: 94,
      badge: 'Best Seller',
      inStock: true,
      stockCount: 56,
      weight: 0.6
    }
  ];

  // Get unique brands for filter
  const brands = [...new Set(products.map(product => product.brand))];

  // Enhanced cart calculations
  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = getCartSubtotal();
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      return Math.min(appliedCoupon.discount, subtotal);
    }
    return 0;
  };

  const getShippingCost = () => {
    if (appliedCoupon && appliedCoupon.type === 'shipping') return 0;
    const subtotal = getCartSubtotal();
    if (subtotal > 100) return 0; // Free shipping over $100
    
    const selectedOption = shippingOptions.find(option => option.id === selectedShipping);
    return selectedOption ? selectedOption.price : 9.99;
  };

  const getTaxAmount = () => {
    const taxableAmount = getCartSubtotal() - getCouponDiscount();
    return taxableAmount * 0.08; // 8% tax
  };

  const getCartTotal = () => {
    return getCartSubtotal() - getCouponDiscount() + getShippingCost() + getTaxAmount();
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Apply coupon function
  const applyCoupon = (code) => {
    const coupon = availableCoupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (coupon) {
      // Check minimum order requirements
      if (coupon.code === 'WELCOME20' && getCartSubtotal() < 100) {
        showNotification('Coupon requires minimum order of $100', 'error');
        return;
      }
      
      setAppliedCoupon(coupon);
      setCouponCode('');
      showNotification(`Coupon applied: ${coupon.description}`, 'success');
    } else {
      showNotification('Invalid coupon code', 'error');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Coupon removed', 'info');
  };

  // Enhanced notification system
  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type
    };
    
    setCartNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setCartNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 4000);
  };

  // Save for later functionality
  const saveForLater = (productId) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      setSavedForLater(prev => [...prev.filter(saved => saved.id !== productId), item]);
      setCart(prev => prev.filter(item => item.id !== productId));
      showNotification(`${item.name} saved for later`, 'info');
    }
  };

  const moveToCart = (savedItem) => {
    setSavedForLater(prev => prev.filter(item => item.id !== savedItem.id));
    setCart(prev => [...prev, savedItem]);
    showNotification(`${savedItem.name} moved to cart`, 'success');
  };

  const removeFromSaved = (productId) => {
    const item = savedForLater.find(item => item.id === productId);
    setSavedForLater(prev => prev.filter(item => item.id !== productId));
    showNotification(`${item?.name} removed from saved items`, 'info');
  };

  // Calculate estimated delivery
  useEffect(() => {
    const selectedOption = shippingOptions.find(option => option.id === selectedShipping);
    if (selectedOption) {
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + parseInt(selectedOption.days.split('-')[1] || selectedOption.days));
      setEstimatedDelivery(deliveryDate.toLocaleDateString());
    }
  }, [selectedShipping]);

  // Enhanced filtering and sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesRating = product.rating >= minRating;
      
      return matchesCategory && matchesSearch && matchesPrice && matchesBrand && matchesRating;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
        case 'reviews':
          comparison = b.reviews - a.reviews;
          break;
        case 'name':
        default:
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [products, selectedCategory, searchTerm, priceRange, selectedBrands, minRating, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  // Fixed: Debounced animation helper function
  const triggerAnimation = useCallback((productId, action) => {
    if (animatingItems.has(productId)) return; // Prevent duplicate animations
    
    setAnimatingItems(prev => new Set([...prev, productId]));
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300); // Reduced from 600ms
  }, [animatingItems]);

  // Fixed: Single animation state for add to cart
  const triggerAddToCartAnimation = useCallback((productId) => {
    if (addToCartAnimations.has(productId)) return; // Prevent duplicate animations
    
    setAddToCartAnimations(prev => new Set([...prev, productId]));
    setTimeout(() => {
      setAddToCartAnimations(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 800); // Slightly reduced timing
  }, [addToCartAnimations]);

  const addToCart = useCallback((product, quantity = 1) => {
  if (addToCartAnimations.has(product.id)) return;

  if (product.stockCount < quantity) {
    showNotification(`Only ${product.stockCount} items available in stock`, 'error');
    return;
  }

  triggerAddToCartAnimation(product.id);

  let message = '';
  let type = 'success';

  setCart(prevCart => {
    const existingItem = prevCart.find(item => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stockCount) {
        message = `Cannot add more than ${product.stockCount} items`;
        type = 'error';
        updatedCart = prevCart;
      } else {
        message = `Updated ${product.name} quantity in cart`;
        updatedCart = prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
    } else {
      message = `${product.name} added to cart`;
      updatedCart = [...prevCart, { ...product, quantity }];
    }

    // ❌ Don't show notification here
    return updatedCart;
  });

  // ✅ Trigger it after state update, runs only once
  if (message) {
    showNotification(message, type);
  }
}, [addToCartAnimations, triggerAddToCartAnimation]);


  const removeFromCart = (productId) => {
    const item = cart.find(item => item.id === productId);
    setCart(cart.filter(item => item.id !== productId));
    if (item) {
      showNotification(`${item.name} removed from cart`, 'info');
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity > product.stockCount) {
      showNotification(`Only ${product.stockCount} items available`, 'error');
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
    showNotification('Cart cleared', 'info');
  };

  // Fixed: Optimized toggleWishlist function
  const toggleWishlist = useCallback((productId) => {
    // Prevent rapid successive calls
    if (animatingItems.has(productId)) return;
    
    triggerAnimation(productId, 'toggleWishlist');
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, [animatingItems, triggerAnimation]);

  const handleBrandFilter = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
    setCurrentPageNum(1);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setMinRating(0);
    setSearchTerm('');
    setSelectedCategory('All');
    setCurrentPageNum(1);
  };

  const handleLogin = (email, password) => {
    if (email && password) {
      setUser({ email });
      setIsLoggedIn(true);
      setCurrentPage('home');
      showNotification('Successfully logged in!', 'success');
    } else {
      showNotification('Please enter valid credentials', 'error');
    }
  };

  const handleSignup = (userData) => {
    if (userData.email && userData.password && userData.firstName) {
      if (userData.password !== userData.confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
      }
      setUser(userData);
      setIsLoggedIn(true);
      setCurrentPage('home');
      showNotification('Account created successfully!', 'success');
    } else {
      showNotification('Please fill in all required fields', 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
    showNotification('Successfully logged out', 'info');
  };

  // Helper function to render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Fixed: Optimized ProductCard Component
  const ProductCard = React.memo(({ product, viewMode }) => {
    const isInWishlist = wishlist.includes(product.id);
    const isInCart = cart.some(item => item.id === product.id);
    const isAnimating = animatingItems.has(product.id);
    const isAddToCartAnimating = addToCartAnimations.has(product.id);

    return (
      <div className={`bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden ${
        isAnimating ? 'scale-105' : ''
      }`}>
        <div className="relative group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-105"
          />
          
          {product.badge && (
            <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full shadow-lg ${
              product.badge === 'Sale' ? 'bg-red-500 text-white' :
              product.badge === 'New' ? 'bg-green-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              {product.badge}
            </span>
          )}
          
          {product.stockCount < 10 && product.inStock && (
            <span className="absolute top-3 right-12 bg-orange-500 text-white px-2 py-1 text-xs font-medium rounded-full shadow-lg">
              Only {product.stockCount} left
            </span>
          )}
          
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
              isInWishlist 
                ? 'bg-red-100 text-red-600' 
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-100 hover:text-red-600'
            }`}
            disabled={isAnimating}
          >
            <Heart className={`w-5 h-5 transition-all duration-300 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center space-x-1 mb-3">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.brand}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock || isAddToCartAnimating}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 transform ${
              product.inStock 
                ? isInCart && !isAddToCartAnimating
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : isAddToCartAnimating
                    ? 'bg-blue-500 text-white cursor-wait'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              {!product.inStock ? (
                <span>Out of Stock</span>
              ) : isAddToCartAnimating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : isInCart ? (
                <span>✓ In Cart</span>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    );
  });

  // Enhanced Cart Notifications Component
  const CartNotifications = () => {
    if (cartNotifications.length === 0) return null;
    
    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {cartNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg transform transition-all duration-500 max-w-sm ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'info' ? 'bg-blue-500 text-white' :
              'bg-gray-800 text-white'
            }`}
          >
            <div className="flex items-start space-x-2">
              {notification.type === 'success' && <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
              {notification.type === 'info' && <Package className="w-5 h-5 mt-0.5 flex-shrink-0" />}
              <span className="text-sm">{notification.message}</span>
              <button
                onClick={() => setCartNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="ml-auto hover:bg-white/20 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Enhanced Cart Summary Component
  const CartSummary = ({ className = "" }) => (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <ShoppingBag className="w-5 h-5 mr-2" />
        Order Summary
      </h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal ({getCartItemCount()} items)</span>
          <span>${getCartSubtotal().toFixed(2)}</span>
        </div>
        
        {appliedCoupon && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount ({appliedCoupon.code})</span>
            <span>-${getCouponDiscount().toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span>{getShippingCost() === 0 ? 'FREE' : `$${getShippingCost().toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Tax</span>
          <span>${getTaxAmount().toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {estimatedDelivery && (
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <div className="flex items-center text-sm text-blue-800">
            <Truck className="w-4 h-4 mr-2" />
            <span>Estimated delivery: {estimatedDelivery}</span>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        <p>• Free shipping on orders over $100</p>
        <p>• 30-day return policy</p>
        <p>• Secure checkout guaranteed</p>
      </div>
    </div>
  );

  // Home Page Component with Hero Section
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-3xl transform transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl">
              ShopZen
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search amazing products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPageNum(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                />
                <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('wishlist')}
                className="relative p-3 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-7 h-7 text-gray-600" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center animate-bounce font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button onClick={() => setCurrentPage('cart')} className="relative p-3 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="w-7 h-7 text-gray-600" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center animate-bounce font-bold">
                    {getCartItemCount()}
                  </span>
                )}
              </button>

              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-full transition-colors">
                    <User className="w-7 h-7 text-gray-600" />
                    <span className="hidden md:block text-sm text-gray-700 font-medium">
                      {user?.firstName || user?.email?.split('@')[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button onClick={() => setCurrentPage('login')} className="px-6 py-3 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">Login</button>
                  <button onClick={() => setCurrentPage('signup')} className="px-6 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg">Sign Up</button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPageNum(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">ShopZen</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover amazing products at unbeatable prices. Your one-stop shop for everything you need!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12" id="products-section">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPageNum(1);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <button onClick={clearFilters} className="text-blue-600 text-sm hover:text-blue-800 transition-colors font-medium">
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-800">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([0, parseInt(e.target.value)]);
                      setCurrentPageNum(1);
                    }}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-800">Brands</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center cursor-pointer hover:bg-blue-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandFilter(brand)}
                        className="mr-2 accent-blue-600"
                      />
                      <span className="text-sm font-medium">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-800">Minimum Rating</h4>
                <select
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(parseFloat(e.target.value));
                    setCurrentPageNum(1);
                  }}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                <span className="text-gray-700 font-bold text-lg">
                  {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setSortBy(sort);
                    setSortOrder(order);
                    setCurrentPageNum(1);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low-High</option>
                  <option value="price-desc">Price High-Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="reviews-desc">Most Reviews</option>
                </select>

                <div className="flex border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* No Results Message */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <div className="transform transition-all duration-500 hover:scale-105">
                  <Search className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8">
                  {paginatedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="opacity-0 animate-fade-in"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 space-x-2">
                    <button
                      onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                      disabled={currentPageNum === 1}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-100 flex items-center space-x-2 font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPageNum - 2)) + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPageNum(pageNum)}
                          className={`px-4 py-3 border-2 rounded-lg transition-all font-medium ${
                            currentPageNum === pageNum 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                      disabled={currentPageNum === totalPages}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-100 flex items-center space-x-2 font-medium"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>

      <CartNotifications />
    </div>
  );

  // Enhanced Cart Page Component
  const CartPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Continue Shopping</span>
                </button>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-3xl shadow-xl">
                  ShopZen
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('wishlist')}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Heart className="w-6 h-6 text-gray-600" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {isLoggedIn ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <User className="w-6 h-6 text-gray-600" />
                      <span className="hidden md:block text-sm text-gray-700">
                        {user?.firstName || user?.email?.split('@')[0]}
                      </span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentPage('login')} className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">Login</button>
                    <button onClick={() => setCurrentPage('signup')} className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">Sign Up</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">Review your items and proceed to checkout</p>
          </div>
          
          {cart.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-8">Discover amazing products and start shopping now!</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Items List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Cart Items ({getCartItemCount()})</h2>
                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear Cart</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0" 
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.brand}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium text-center min-w-[3rem]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => saveForLater(item.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                          >
                            <Clock className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Percent className="w-5 h-5 mr-2" />
                    Promo Code
                  </h3>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                          <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={() => applyCoupon(couponCode)}
                          disabled={!couponCode.trim()}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          Apply
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">Available coupons:</p>
                        <div className="space-y-1">
                          {availableCoupons.map((coupon) => (
                            <button
                              key={coupon.code}
                              onClick={() => applyCoupon(coupon.code)}
                              className="block text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {coupon.code} - {coupon.description}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Saved for Later Section */}
                {savedForLater.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Saved for Later ({savedForLater.length})
                    </h3>
                    
                    <div className="space-y-4">
                      {savedForLater.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
                          />
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => moveToCart(item)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Move to Cart
                            </button>
                            <button
                              onClick={() => removeFromSaved(item.id)}
                              className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary />
                
                <button
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>

        <CartNotifications />
      </div>
    );
  };

  // Wishlist Page Component
  const WishlistPage = () => {
    const wishlistProducts = products.filter(product => wishlist.includes(product.id));

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Shop</span>
                </button>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-3xl shadow-xl">
                  ShopZen
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button onClick={() => setCurrentPage('cart')} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Save items you love to view them later</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          )}
        </div>
        
        <CartNotifications />
      </div>
    );
  };

  // Login Page
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-3xl inline-block mb-6 shadow-xl">
              ShopZen
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          </div>
          
          <form className="bg-white p-8 rounded-xl shadow-lg space-y-6" onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, password);
          }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </button>
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setCurrentPage('signup')}
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                Don't have an account? Sign up
              </button>
              <br />
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </form>
        </div>
        
        <CartNotifications />
      </div>
    );
  };

  // Signup Page
  const SignupPage = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-3xl inline-block mb-6 shadow-xl">
              ShopZen
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          </div>
          
          <form className="bg-white p-8 rounded-xl shadow-lg space-y-4" onSubmit={(e) => {
            e.preventDefault();
            if (formData.password !== formData.confirmPassword) {
              showNotification('Passwords do not match', 'error');
              return;
            }
            handleSignup(formData);
          }}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Create Account
            </button>
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                Already have an account? Sign in
              </button>
              <br />
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </form>
        </div>
        
        <CartNotifications />
      </div>
    );
  };

  // Main render logic
  switch (currentPage) {
    case 'cart':
      return <CartPage />;
    case 'wishlist':
      return <WishlistPage />;
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    case 'home':
    default:
      return <HomePage />;
  }
}