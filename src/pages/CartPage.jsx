import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const mockProduct = {
  id: 1,
  name: "Smart Fitness Watch",
  price: 199.99,
  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
  stockCount: 5,
};

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [summaryVisible, setSummaryVisible] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('demo-cart'));
    if (saved) setCart(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('demo-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = () => {
    const existing = cart.find(item => item.id === mockProduct.id);
    if (existing) {
      updateQuantity(mockProduct.id, existing.quantity + 1);
    } else {
      setCart([...cart, { ...mockProduct, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, qty) => {
    const product = cart.find(item => item.id === id);
    if (qty <= 0) return removeFromCart(id);
    if (qty > 10) return showMessage('Max 10 units allowed');
    if (qty > product.stockCount) return showMessage(`Only ${product.stockCount} left in stock`);
    setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
  }; // Removed 'zxc'

  const removeFromCart = (id) => {
    const removed = cart.find(item => item.id === id);
    setCart(cart.filter(item => item.id !== id));
    setNotification({
      message: 'Item removed',
      undo: () => setCart(prev => [...prev, removed])
    });
  };
SVGDefsElement
  const showMessage = (msg) => {
    setNotification({ message: msg });
    setTimeout(() => setNotification(null), 2000);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <button
        onClick={addToCart}
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow"
      >
        Add Smart Watch to Cart
      </button>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>${item.price}</p>
                {item.stockCount <= 5 && (
                  <p className="text-sm text-red-500">Only {item.stockCount} left!</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus />
                </button>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              onClick={() => setSummaryVisible(v => !v)}
              className="text-blue-600 underline mb-2"
            >
              {summaryVisible ? 'Hide Summary' : 'Show Summary'}
            </button>
            <>
            </>

            {summaryVisible && (
              <div className="text-right space-y-1">
                <p>Total: ${total.toFixed(2)}</p> {/* Fixed typo: 'pasd' to 'p' */}
                <p className="text-sm text-gray-500">
                  Estimated delivery: {new Date(Date.now() + 5 * 86400000).toDateString()}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex gap-4 items-center">
          <span>{notification.message}</span>
          {notification.undo && (
            <button onClick={() => {
              notification.undo();
              setNotification(null);
            }} className="underline text-blue-300">
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
