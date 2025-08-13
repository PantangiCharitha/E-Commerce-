import React, { useState, useMemo, useCallback } from 'react';
import { Search, Heart, ShoppingCart, User, Star, Grid, List, SlidersHorizontal, Plus, Minus, Trash2, ArrowLeft, ChevronRight, CreditCard, Lock, CheckCircle, Package, Truck, MapPin, Phone, Mail, Calendar, Download } from 'lucide-react';

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

  // New Razorpay specific states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  // Login/Signup states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

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
      stockCount: 45
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
      stockCount: 23
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
      stockCount: 78
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
      stockCount: 0
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
      stockCount: 34
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
      stockCount: 56
    }
  ];

  // Get unique brands for filter
  const brands = [...new Set(products.map(product => product.brand))];

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

  // Animation helper function
  const triggerAnimation = useCallback((productId, action) => {
    if (animatingItems.has(productId)) return;
    
    setAnimatingItems(prev => new Set([...prev, productId]));
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300);
  }, [animatingItems]);

  // Add to cart animation
  const triggerAddToCartAnimation = useCallback((productId) => {
    if (addToCartAnimations.has(productId)) return;
    
    setAddToCartAnimations(prev => new Set([...prev, productId]));
    setTimeout(() => {
      setAddToCartAnimations(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 800);
  }, [addToCartAnimations]);

  // Add to cart function
  const addToCart = useCallback((product) => {
    if (addToCartAnimations.has(product.id)) return;
    
    triggerAddToCartAnimation(product.id);
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    // Add success notification
    setCartNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      message: `${product.name} added to cart!`
    }]);

    setTimeout(() => {
      setCartNotifications(prev => prev.slice(0, -1));
    }, 3000);
  }, [addToCartAnimations, triggerAddToCartAnimation]);

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleWishlist = useCallback((productId) => {
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      setUser({ email: loginForm.email });
      setIsLoggedIn(true);
      setCurrentPage('home');
      setLoginForm({ email: '', password: '' });
    } else {
      alert('Please enter valid credentials');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupForm.email && signupForm.password && signupForm.firstName && signupForm.password === signupForm.confirmPassword) {
      setUser(signupForm);
      setIsLoggedIn(true);
      setCurrentPage('home');
      setSignupForm({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    } else {
      alert('Please fill in all required fields and ensure passwords match');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // Razorpay Integration Functions
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const generateOrderId = () => {
    return 'order_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const processRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();
    
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    // Convert USD to INR (approximate conversion rate: 1 USD = 83 INR)
    const amountInINR = Math.round(orderData.amount * 83 * 100); // Razorpay expects amount in paise

    const options = {
      key: 'rzp_test_9999999999', // Replace with your actual Razorpay key ID
      amount: amountInINR,
      currency: 'INR',
      name: 'ShopZen',
      description: `Order for ${cart.length} item(s)`,
      order_id: orderData.orderId,
      handler: function (response) {
        handlePaymentSuccess(response, orderData);
      },
      prefill: {
        name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
        email: shippingDetails.email,
        contact: shippingDetails.phone,
      },
      notes: {
        address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.pincode}`,
      },
      theme: {
        color: '#3B82F6',
      },
      modal: {
        ondismiss: function() {
          setIsProcessingPayment(false);
          alert('Payment cancelled. You can try again when ready.');
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handlePaymentSuccess = (paymentResponse, orderData) => {
    setIsProcessingPayment(false);
    setPaymentSuccess(true);
    
    // Store order details
    const order = {
      ...orderData,
      paymentId: paymentResponse.razorpay_payment_id,
      signature: paymentResponse.razorpay_signature,
      status: 'Paid',
      paymentMethod: 'Razorpay',
      paidAt: new Date().toISOString(),
    };
    
    setOrderDetails(order);
    
    // Clear cart after successful payment
    setCart([]);
    
    // Show success notification
    setCartNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      message: 'Payment successful! Order placed successfully.'
    }]);

    // Redirect to order success page
    setTimeout(() => {
      setCurrentPage('orderSuccess');
    }, 1000);
  };

  const initiateCheckout = () => {
    if (!isLoggedIn) {
      alert('Please login to proceed with checkout');
      setCurrentPage('login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setCurrentPage('checkout');
  };

  const processPayment = async () => {
    // Validate shipping details
    if (!shippingDetails.firstName || !shippingDetails.lastName || !shippingDetails.email || 
        !shippingDetails.phone || !shippingDetails.address || !shippingDetails.city || 
        !shippingDetails.state || !shippingDetails.pincode) {
      alert('Please fill in all shipping details');
      return;
    }

    setIsProcessingPayment(true);

    const cartTotal = getCartTotal();
    const shipping = cartTotal > 100 ? 0 : 9.99;
    const tax = cartTotal * 0.08;
    const finalTotal = cartTotal + shipping + tax;

    const orderData = {
      orderId: generateOrderId(),
      amount: finalTotal,
      items: cart,
      shipping: shipping,
      tax: tax,
      total: finalTotal,
      shippingDetails: shippingDetails,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      await processRazorpayPayment(orderData);
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessingPayment(false);
      alert('Payment failed. Please try again.');
    }
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

  // Product Card Component
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

  // Cart Notifications Component
  const CartNotifications = () => {
    if (cartNotifications.length === 0) return null;
    
    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {cartNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg transform transition-all duration-500 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'info' ? 'bg-blue-500 text-white' :
              'bg-gray-800 text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
              <span>{notification.message}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-2xl mx-auto w-fit shadow-lg">
              ShopZen
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Signup Page Component
  const SignupPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-2xl mx-auto w-fit shadow-lg">
              ShopZen
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">Create Account</h2>
            <p className="text-gray-600 mt-2">Join ShopZen today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={signupForm.firstName}
                onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={signupForm.lastName}
                onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
              value={signupForm.email}
              onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={signupForm.confirmPassword}
              onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Cart Page Component
  const CartPage = () => {
    const cartTotal = getCartTotal();
    const shipping = cartTotal > 100 ? 0 : 9.99;
    const tax = cartTotal * 0.08;
    const finalTotal = cartTotal + shipping + tax;

    if (cart.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {renderStars(item.rating)}
                        <span className="text-sm text-gray-500">({item.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full border hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full border hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${item.price} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({getCartItemCount()} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              <button
                onClick={initiateCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Checkout Page Component
  const CheckoutPage = () => {
    const cartTotal = getCartTotal();
    const shipping = cartTotal > 100 ? 0 : 9.99;
    const tax = cartTotal * 0.08;
    const finalTotal = cartTotal + shipping + tax;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <button
              onClick={() => setCurrentPage('cart')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={shippingDetails.firstName}
                    onChange={(e) => setShippingDetails({...shippingDetails, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={shippingDetails.lastName}
                    onChange={(e) => setShippingDetails({...shippingDetails, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={shippingDetails.state}
                    onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={shippingDetails.pincode}
                    onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={shippingDetails.country}
                    onChange={(e) => setShippingDetails({...shippingDetails, country: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-100"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Secure Payment with Razorpay</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your payment information is secure and encrypted. Supports UPI, Cards, Net Banking, and Wallets.
                    </p>
                  </div>
                </div>

                <button
                  onClick={processPayment}
                  disabled={isProcessingPayment}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform ${
                    isProcessingPayment
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg'
                  }`}
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Pay ₹{Math.round(finalTotal * 83)}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Order Success Page Component
  const OrderSuccessPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>

          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order ID</p>
                  <p className="font-medium">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment ID</p>
                  <p className="font-medium">{orderDetails.paymentId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-medium">${orderDetails.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Status</p>
                  <p className="font-medium text-green-600">{orderDetails.status}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => {
                // In a real app, this would download/generate a proper invoice
                alert('Download functionality would be implemented here');
              }}
              className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              ShopZen
            </button>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden sm:block">
                    {user?.firstName || user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  // Filters Component
  const FiltersPanel = () => (
    <div className={`bg-white border-r transition-all duration-300 ${showFilters ? 'w-80' : 'w-0 overflow-hidden'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPageNum(1);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">${priceRange[0]}</span>
              <span className="text-sm text-gray-600">${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => {
                setPriceRange([priceRange[0], parseInt(e.target.value)]);
                setCurrentPageNum(1);
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Brands</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandFilter(brand)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Minimum Rating</h4>
          <div className="space-y-2">
            {[4, 3, 2, 1, 0].map((rating) => (
              <button
                key={rating}
                onClick={() => {
                  setMinRating(rating);
                  setCurrentPageNum(1);
                }}
                className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  minRating === rating
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  {renderStars(rating)}
                  <span className="ml-2 text-sm">& up</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Main Product Grid Component
  const ProductGrid = () => (
    <div className="flex-1">
      {/* Controls */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="reviews">Reviews</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPageNum(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {((currentPageNum - 1) * itemsPerPage) + 1} to {Math.min(currentPageNum * itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} results
        </div>
      </div>

      {/* Products */}
      <div className="p-6">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                  disabled={currentPageNum === 1}
                  className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPageNum(page)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      currentPageNum === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                  disabled={currentPageNum === totalPages}
                  className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // Main Home Page Component
  const HomePage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <FiltersPanel />
        <ProductGrid />
      </div>
      <CartNotifications />
    </div>
  );

  // Main render logic
  switch (currentPage) {
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    case 'cart':
      return (
        <>
          <Header />
          <CartPage />
          <CartNotifications />
        </>
      );
    case 'checkout':
      return (
        <>
          <Header />
          <CheckoutPage />
          <CartNotifications />
        </>
      );
    case 'orderSuccess':
      return (
        <>
          <Header />
          <OrderSuccessPage />
          <CartNotifications />
        </>
      );
    case 'home':
    default:
      return <HomePage />;
  }
}