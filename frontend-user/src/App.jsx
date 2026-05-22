import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import ProductDetail from './ProductDetail';
import ARView from './ARView';

// Component con cho Trang Chủ
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://localhost:3000/dev/api/v1/products')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProducts(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch API:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Đang tải sản phẩm...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Trang chủ Sản phẩm</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
      {products.length === 0 && <p>Không có sản phẩm nào để hiển thị.</p>}
    </div>
  );
};

// Component App chính điều hướng các trang
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/products/:slug/ar" element={<ARView />} />
    </Routes>
  );
}

export default App;