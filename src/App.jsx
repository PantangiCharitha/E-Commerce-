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

  // Order tracking states
  const [orders, setOrders] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

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

  const generateTrackingNumber = () => {
    return 'TRK' + Math.random().toString(36).substr(2, 6).toUpperCase() + Date.now().toString(36).toUpperCase();
  };

  // Order tracking statuses
  const orderStatuses = [
    { status: 'Order Placed', description: 'Your order has been confirmed', icon: CheckCircle },
    { status: 'Processing', description: 'We are preparing your order', icon: Package },
    { status: 'Shipped', description: 'Your order is on the way', icon: Truck },
    { status: 'Out for Delivery', description: 'Order is out for delivery', icon: MapPin },
    { status: 'Delivered', description: 'Order has been delivered', icon: CheckCircle }
  ];

  // Function to simulate order progress
  const simulateOrderProgress = (orderId) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.orderId === orderId) {
          const currentStatusIndex = orderStatuses.findIndex(s => s.status === order.currentStatus);
          const nextStatusIndex = Math.min(currentStatusIndex + 1, orderStatuses.length - 1);
          
          if (nextStatusIndex > currentStatusIndex) {
            const newStatus = orderStatuses[nextStatusIndex].status;
            const newTrackingHistory = [
              ...order.trackingHistory,
              {
                status: newStatus,
                description: orderStatuses[nextStatusIndex].description,
                timestamp: new Date().toISOString(),
                location: getRandomLocation()
              }
            ];

            return {
              ...order,
              currentStatus: newStatus,
              trackingHistory: newTrackingHistory,
              lastUpdated: new Date().toISOString()
            };
          }
        }
        return order;
      });
    });
  };

  const getRandomLocation = () => {
    const locations = [
      'Mumbai Sorting Center',
      'Delhi Processing Hub',
      'Hyderabad Distribution Center',
      'Bangalore Transit Hub',
      'Chennai Local Facility',
      'Pune Delivery Station',
      'Kolkata Regional Center'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  // Track order function
  const trackOrder = () => {
    if (!trackingNumber.trim()) {
      alert('Please enter a tracking number');
      return;
    }

    const order = orders.find(order => 
      order.trackingNumber === trackingNumber.trim() || 
      order.orderId === trackingNumber.trim()
    );

    if (order) {
      setTrackingResult(order);
      setCurrentPage('tracking');
    } else {
      alert('Order not found. Please check your tracking number or order ID.');
      setTrackingResult(null);
    }
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
    
    const trackingNumber = generateTrackingNumber();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 5) + 3); // 3-7 days
    
    // Store order details
    const order = {
      ...orderData,
      paymentId: paymentResponse.razorpay_payment_id,
      signature: paymentResponse.razorpay_signature,
      status: 'Paid',
      paymentMethod: 'Razorpay',
      paidAt: new Date().toISOString(),
      trackingNumber: trackingNumber,
      currentStatus: 'Order Placed',
      estimatedDelivery: estimatedDelivery.toISOString(),
      lastUpdated: new Date().toISOString(),
      trackingHistory: [
        {
          status: 'Order Placed',
          description: 'Your order has been confirmed and payment received',
          timestamp: new Date().toISOString(),
          location: 'ShopZen Warehouse'
        }
      ]
    };
    
    setOrderDetails(order);
    
    // Add to orders list for tracking
    setOrders(prevOrders => [...prevOrders, order]);
    
    // Clear cart after successful payment
    setCart([]);
    
    // Show success notification
    setCartNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      message: 'Payment successful! Order placed successfully.'
    }]);

    // Simulate order processing after some time
    setTimeout(() => {
      simulateOrderProgress(order.orderId);
    }, 10000); // Start processing after 10 seconds

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
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-gray-500 hover:text-gray-700"
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
            <p className="text-gray-600 mt-2">Join us today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
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
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-gray-500 hover:text-gray-700"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Header Component
  const Header = () => (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              ShopZen
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Order Tracking */}
            <button
              onClick={() => setCurrentPage('orderTracking')}
              className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>Track Order</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentPage('wishlist')}
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            {/* User Account */}
            <div className="relative">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Hello, {user?.firstName || user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Category Filter Component
  const CategoryFilter = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex space-x-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPageNum(1);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Filters Sidebar Component
  const FiltersSidebar = () => (
    <div className={`bg-white rounded-lg shadow-lg border p-6 ${showFilters ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandFilter(brand)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
        <select
          value={minRating}
          onChange={(e) => setMinRating(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={0}>All Ratings</option>
          <option value={4}>4+ Stars</option>
          <option value={3}>3+ Stars</option>
          <option value={2}>2+ Stars</option>
          <option value={1}>1+ Stars</option>
        </select>
      </div>
    </div>
  );

  // Products Grid Component
  const ProductsGrid = () => (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sorting and View Options */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Showing {filteredAndSortedProducts.length} products
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="reviews-desc">Most Reviews</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <FiltersSidebar />
          </div>

          {/* Products */}
          <div className="flex-1">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <button
                      onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                      disabled={currentPageNum === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + Math.max(1, currentPageNum - 2);
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPageNum(pageNum)}
                          className={`px-3 py-2 border rounded-lg transition-colors ${
                            currentPageNum === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                      disabled={currentPageNum === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
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

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.brand}</p>
                      <p className="text-blue-600 font-bold">${item.price}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {cartTotal < 100 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Add ${(100 - cartTotal).toFixed(2)} more for FREE shipping!
                    </p>
                  </div>
                )}

                <button
                  onClick={initiateCheckout}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <button
              onClick={() => setCurrentPage('cart')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Cart</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shipping Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={shippingDetails.firstName}
                    onChange={(e) => setShippingDetails({...shippingDetails, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={shippingDetails.lastName}
                    onChange={(e) => setShippingDetails({...shippingDetails, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={shippingDetails.state}
                    onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                  <input
                    type="text"
                    value={shippingDetails.pincode}
                    onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={shippingDetails.country}
                    onChange={(e) => setShippingDetails({...shippingDetails, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={processPayment}
                disabled={isProcessingPayment}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Pay with Razorpay</span>
                  </div>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Secure payment powered by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Order Success Page Component
  const OrderSuccessPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order ID:</span>
                  <span className="text-sm font-medium">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tracking Number:</span>
                  <span className="text-sm font-medium">{orderDetails.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="text-sm font-medium">₹{(orderDetails.total * 83).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <span className="text-sm font-medium">Razorpay</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => {
                if (orderDetails) {
                  setTrackingNumber(orderDetails.trackingNumber);
                  trackOrder();
                }
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Your Order
            </button>
            
            <button
              onClick={() => setCurrentPage('home')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Order Tracking Page Component
  const OrderTrackingPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Search Order */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Tracking Number or Order ID</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="e.g., TRK123456 or order_abc123"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={trackOrder}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Order
            </button>
          </div>
        </div>

        {/* My Orders */}
        {isLoggedIn && orders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Recent Orders</h2>
            <div className="space-y-4">
              {orders.slice(-5).reverse().map((order) => (
                <div key={order.orderId} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                     onClick={() => {
                       setTrackingResult(order);
                       setCurrentPage('tracking');
                     }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Order #{order.orderId}</h3>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item(s) • ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.currentStatus === 'Order Placed' ? 'bg-blue-100 text-blue-800' :
                        order.currentStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.currentStatus === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        order.currentStatus === 'Out for Delivery' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.currentStatus}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">#{order.trackingNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Order Tracking Results Page Component
  const OrderTrackingResultsPage = () => {
    if (!trackingResult) return <OrderTrackingPage />;

    const currentStatusIndex = orderStatuses.findIndex(status => status.status === trackingResult.currentStatus);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <button
              onClick={() => {
                setCurrentPage('orderTracking');
                setTrackingResult(null);
              }}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Search</span>
            </button>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{trackingResult.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking Number:</span>
                    <span className="font-medium">{trackingResult.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {new Date(trackingResult.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{trackingResult.items.length}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Info</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                      trackingResult.currentStatus === 'Order Placed' ? 'bg-blue-100 text-blue-800' :
                      trackingResult.currentStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      trackingResult.currentStatus === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      trackingResult.currentStatus === 'Out for Delivery' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {trackingResult.currentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(trackingResult.lastUpdated).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Delivery:</span>
                    <span className="font-medium">
                      {new Date(trackingResult.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h2>
            <div className="relative">
              {orderStatuses.map((status, index) => {
                const IconComponent = status.icon;
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={status.status} className="flex items-center mb-6 last:mb-0">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? isCurrent 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {status.status}
                      </h3>
                      <p className="text-sm text-gray-600">{status.description}</p>
                    </div>

                    {index < orderStatuses.length - 1 && (
                      <div className={`absolute left-5 mt-10 w-px h-6 ${
                        index < currentStatusIndex ? 'bg-green-600' : 'bg-gray-200'
                      }`} style={{ top: `${index * 88 + 40}px` }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking History */}
          {trackingResult.trackingHistory && trackingResult.trackingHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking History</h2>
              <div className="space-y-4">
                {trackingResult.trackingHistory.reverse().map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{event.status}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      {event.location && (
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {trackingResult.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulate Progress Button (for demo purposes) */}
          {trackingResult.currentStatus !== 'Delivered' && (
            <div className="mt-8 text-center">
              <button
                onClick={() => simulateOrderProgress(trackingResult.orderId)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Simulate Next Status (Demo)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Wishlist Page Component
  const WishlistPage = () => {
    const wishlistProducts = products.filter(product => wishlist.includes(product.id));

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Add some products you love</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main render function
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'orderSuccess':
        return <OrderSuccessPage />;
      case 'orderTracking':
        return <OrderTrackingPage />;
      case 'tracking':
        return <OrderTrackingResultsPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'home':
      default:
        return (
          <>
            <CategoryFilter />
            <ProductsGrid />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Show on all pages except login/signup */}
      {!['login', 'signup'].includes(currentPage) && <Header />}
      
      {/* Cart Notifications */}
      <CartNotifications />
      
      {/* Main Content */}
      {renderPage()}
    </div>
  );
}