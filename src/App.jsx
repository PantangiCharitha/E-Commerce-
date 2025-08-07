import React, { useState, useMemo } from 'react';
import { Search, Heart, ShoppingCart, User, Star, Grid, List, SlidersHorizontal, X } from 'lucide-react';

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
    },
    {
      id: 7,
      name: 'Mystery Novel Collection',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      category: 'Books',
      brand: 'BookWorld',
      description: 'Bestselling mystery novels bundle featuring 5 thrilling page-turners.',
      rating: 4.2,
      reviews: 145,
      badge: 'Sale',
      inStock: true,
      stockCount: 89
    },
    {
      id: 8,
      name: 'Building Blocks Set',
      price: 49.99,
      originalPrice: 64.99,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop',
      category: 'Toys',
      brand: 'PlayTime',
      description: 'Creative building set with 500+ pieces for endless imagination and learning.',
      rating: 4.7,
      reviews: 78,
      badge: 'New',
      inStock: true,
      stockCount: 25
    },
    {
      id: 9,
      name: 'Wireless Phone Charger',
      price: 34.99,
      originalPrice: 44.99,
      image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=500&h=500&fit=crop',
      category: 'Electronics',
      brand: 'TechPro',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
      rating: 4.1,
      reviews: 112,
      badge: null,
      inStock: true,
      stockCount: 67
    },
    {
      id: 10,
      name: 'Designer Sunglasses',
      price: 129.99,
      originalPrice: 179.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
      category: 'Fashion',
      brand: 'StyleMax',
      description: 'Premium UV protection sunglasses with polarized lenses and titanium frame.',
      rating: 4.5,
      reviews: 43,
      badge: 'Sale',
      inStock: true,
      stockCount: 18
    },
    {
      id: 11,
      name: 'Indoor Plant Set',
      price: 44.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop',
      category: 'Home & Garden',
      brand: 'GreenHome',
      description: 'Collection of 3 easy-care indoor plants perfect for beginners.',
      rating: 4.3,
      reviews: 87,
      badge: 'New',
      inStock: true,
      stockCount: 41
    },
    {
      id: 12,
      name: 'Running Shoes',
      price: 119.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      category: 'Sports',
      brand: 'RunFast',
      description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper.',
      rating: 4.6,
      reviews: 167,
      badge: 'Best Seller',
      inStock: true,
      stockCount: 52
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

    // Sort products
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold text-2xl inline-block mb-6">
              ShopZen
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          </div>
          
          <form className="bg-white p-8 rounded-xl shadow-lg space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Email address"
              />
            </div>
            
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Sign In
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setCurrentPage('signup')}
                className="text-blue-600 hover:text-blue-500"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-blue-600 hover:text-blue-800"
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
      password: ''
    });

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSignup(formData);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold text-2xl inline-block mb-6">
              ShopZen
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          </div>
          
          <form className="bg-white p-8 rounded-xl shadow-lg space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="First name"
              />
              <input
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Last name"
              />
            </div>
            
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Email address"
            />
            
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Create Account
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="text-blue-600 hover:text-blue-500"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-blue-600 hover:text-blue-800"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              ShopZen
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300">
                <Heart className="w-6 h-6 text-gray-600" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* User Account */}
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full">
                    <User className="w-6 h-6 text-gray-600" />
                    <span className="hidden md:block text-sm text-gray-700">
                      {user?.firstName || user?.email?.split('@')[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Profile</button>
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Orders</button>
                      <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button onClick={() => setCurrentPage('login')} className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600">Login</button>
                  <button onClick={() => setCurrentPage('signup')} className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-xl opacity-90">Shop from our curated collection</p>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-6 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPageNum(1);
                }}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Brands</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandFilter(brand)}
                        className="mr-2"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="mr-2"
                      />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-1 text-sm">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Products Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <p className="text-gray-600">
                  Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="px-4 py-2 bg-white rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="reviews-desc">Most Reviews</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-lg shadow-sm border p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Items per page */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPageNum(1);
                  }}
                  className="px-3 py-2 bg-white rounded-lg shadow-sm border text-sm"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedBrands.length > 0 || minRating > 0 || priceRange[1] < 500 || searchTerm) && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {selectedBrands.map(brand => (
                    <span key={brand} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {brand}
                      <button
                        onClick={() => handleBrandFilter(brand)}
                        className="ml-1 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  
                  {minRating > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      {minRating}+ stars
                      <button
                        onClick={() => setMinRating(0)}
                        className="ml-1 hover:text-yellow-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {priceRange[1] < 500 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Under ${priceRange[1]}
                      <button
                        onClick={() => setPriceRange([0, 500])}
                        className="ml-1 hover:text-green-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      } ${!product.inStock ? 'opacity-75' : ''}`}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                            viewMode === 'list' ? 'w-full h-48' : 'w-full h-64'
                          }`}
                        />
                        
                        {/* Product Badge */}
                        {product.badge && (
                          <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                            product.badge === 'Sale' ? 'bg-red-500 text-white' :
                            product.badge === 'New' ? 'bg-green-500 text-white' :
                            product.badge === 'Best Seller' ? 'bg-blue-500 text-white' :
                            'bg-yellow-500 text-white'
                          }`}>
                            {product.badge}
                          </span>
                        )}

                        {/* Stock Status */}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300"
                        >
                          <Heart 
                            className={`w-4 h-4 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                          />
                        </button>

                        {/* Quick Add to Cart (Grid View) */}
                        {viewMode === 'grid' && product.inStock && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                            >
                              Add to Cart
                            </button>
                          </div>
                        )}
                      </div>

                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        {/* Rating and Reviews */}
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                        
                        {/* Product Info */}
                        <div className={viewMode === 'list' ? 'flex justify-between items-start' : ''}>
                          <div className={viewMode === 'list' ? 'flex-1 pr-4' : ''}>
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            
                            <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                            
                            <p className={`text-sm text-gray-600 mb-3 ${
                              viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'
                            }`}>
                              {product.description}
                            </p>

                            {/* Stock Info */}
                            {product.inStock && (
                              <p className="text-xs text-green-600 mb-2">
                                {product.stockCount} in stock
                              </p>
                            )}
                          </div>
                          
                          <div className={`${viewMode === 'list' ? 'text-right' : ''}`}>
                            {/* Price */}
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                {product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.originalPrice}
                                  </span>
                                )}
                                {product.originalPrice > product.price && (
                                  <span className="text-sm text-green-600 ml-2">
                                    Save ${(product.originalPrice - product.price).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Add to Cart Button */}
                            {viewMode === 'list' && (
                              <button
                                onClick={() => addToCart(product)}
                                disabled={!product.inStock}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                  product.inStock
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                      onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                      disabled={currentPageNum === 1}
                      className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPageNum - 2 && page <= currentPageNum + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPageNum(page)}
                            className={`px-3 py-2 rounded-lg ${
                              currentPageNum === page
                                ? 'bg-blue-600 text-white'
                                : 'border hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPageNum - 3 || 
                        page === currentPageNum + 3
                      ) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                      disabled={currentPageNum === totalPages}
                      className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
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