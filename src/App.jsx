import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, Star, Menu, X, ChevronRight, Filter, Grid, List, User } from 'lucide-react';

const EcommerceSite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const categories = [
    'All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty'
  ];

  const products = [
    {
      id: 1,
      name: 'Wireless Headphones Pro',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
      category: 'Electronics',
      rating: 4.8,
      reviews: 124,
      badge: 'Best Seller',
      description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Features Bluetooth 5.0, quick charge, and comfortable over-ear design perfect for music lovers and professionals.'
    },
    {
      id: 2,
      name: 'Premium Denim Jacket',
      price: 89.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop&crop=center',
      category: 'Fashion',
      rating: 4.6,
      reviews: 89,
      badge: 'Sale',
      description: 'Classic denim jacket made from 100% premium cotton denim. Features vintage-inspired design, multiple pockets, and durable construction. Perfect for layering and casual styling. Available in multiple washes and sizes.'
    },
    {
      id: 3,
      name: 'Smart Home Speaker',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=300&h=300&fit=crop&crop=center',
      category: 'Electronics',
      rating: 4.7,
      reviews: 203,
      badge: 'New',
      description: 'Voice-controlled smart speaker with built-in AI assistant. Features high-quality 360-degree sound, smart home integration, music streaming, and hands-free calling. Control your home with simple voice commands.'
    },
    {
      id: 4,
      name: 'Minimalist Plant Pot',
      price: 34.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop&crop=center',
      category: 'Home & Garden',
      rating: 4.5,
      reviews: 67,
      badge: '',
      description: 'Modern ceramic plant pot with drainage system and minimalist design. Perfect for indoor plants, succulents, and herbs. Features matt finish, water-resistant coating, and includes matching saucer plate.'
    },
    {
      id: 5,
      name: 'Running Shoes Elite',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center',
      category: 'Sports',
      rating: 4.9,
      reviews: 312,
      badge: 'Popular',
      description: 'Professional running shoes with advanced cushioning technology, breathable mesh upper, and responsive foam midsole. Designed for long-distance running with superior comfort, durability, and performance enhancement.'
    },
    {
      id: 6,
      name: 'Luxury Face Cream',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop&crop=center',
      category: 'Beauty',
      rating: 4.4,
      reviews: 156,
      badge: '',
      description: 'Anti-aging face cream with natural ingredients including hyaluronic acid, vitamin C, and botanical extracts. Provides deep hydration, reduces fine lines, and promotes healthy glowing skin. Suitable for all skin types.'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const handleLogin = (email) => {
    setUser({ email });
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // Login Page Component
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(email, password);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold text-2xl inline-block mb-6">
              ShopZen
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          
          <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <button type="button" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 font-medium"
              >
                Sign In
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setCurrentPage('signup')}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Signup Page Component
  const SignupPage = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      handleSignup(formData);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold text-2xl inline-block mb-6">
              ShopZen
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join our shopping community</p>
          </div>
          
          <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="First name"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a password"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <button type="button" className="text-blue-600 hover:text-blue-500">Terms and Conditions</button>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 font-medium"
              >
                Create Account
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Home Page Component
  const HomePage = () => (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                  ShopZen
                </div>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Right Icons */}
              <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:scale-110">
                  <Heart className="w-6 h-6 text-gray-600" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:scale-110">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* User Account */}
                {isLoggedIn ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-all duration-300">
                      <User className="w-6 h-6 text-gray-600" />
                      <span className="hidden md:block text-sm text-gray-700">
                        {user?.firstName || user?.email?.split('@')[0]}
                      </span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          Profile
                        </button>
                        <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          Orders
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage('login')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setCurrentPage('signup')}
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 py-4 bg-white/90 backdrop-blur-md border-t">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up">
              Summer Sale
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
              Up to 50% off on selected items
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400 shadow-lg">
              Shop Now
            </button>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/20 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/20 rounded-full animate-float animation-delay-500"></div>
        </section>

        {/* Category Navigation */}
        <section className="py-8 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedCategory === 'All' ? 'Featured Products' : selectedCategory}
                </h2>
                <p className="text-gray-600">Discover our handpicked selection</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex bg-white rounded-lg shadow-sm border p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'} transition-all duration-200`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'} transition-all duration-200`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-3 sm:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Product Badge */}
                    {product.badge && (
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                        product.badge === 'Sale' ? 'bg-red-500 text-white' :
                        product.badge === 'New' ? 'bg-green-500 text-white' :
                        product.badge === 'Best Seller' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 transform hover:scale-110"
                    >
                      <Heart 
                        className={`w-5 h-5 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                      />
                    </button>

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-center mb-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
                    </div>
                    
                    <h3 className="text-xs font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1.5 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 shadow-md"
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xl inline-block mb-4">
                  ShopZen
                </div>
                <p className="text-gray-300">Your premium shopping destination for quality products at unbeatable prices.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><button className="hover:text-white transition-colors duration-300">About Us</button></li>
                  <li><button className="hover:text-white transition-colors duration-300">Contact</button></li>
                  <li><button className="hover:text-white transition-colors duration-300">FAQ</button></li>
                  <li><button className="hover:text-white transition-colors duration-300">Shipping</button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><button className="hover:text-white transition-colors duration-300">Electronics</button></li>
                  <li><button className="hover:text-white transition-colors duration-300">Fashion</button></li>
                  <li><button className="hover:text-white transition-colors duration-300">Home & Garden</button></li>
                  <li><button className="hover:text-white transition-colors duration-300">Sports</button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                <p className="text-gray-300 mb-4">Subscribe for exclusive deals and updates</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 ShopZen. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );

  // Render current page
  if (currentPage === 'login') {
    return <LoginPage />;
  }
  
  if (currentPage === 'signup') {
    return <SignupPage />;
  }
  
  return <HomePage />;
};

export default EcommerceSite;