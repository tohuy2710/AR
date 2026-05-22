import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card" style={{ 
      border: '1px solid #ddd', 
      padding: '15px', 
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img 
          src={product.thumbnail_url} // URL là "/images/image.png" -> khớp với public/images/image.png
          alt={product.name} 
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover', 
            borderRadius: '8px' 
          }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }} // Ảnh dự phòng nếu lỗi
        />
        <h3 style={{ margin: '15px 0 10px' }}>{product.name}</h3>
        <p style={{ fontWeight: 'bold', color: '#2ecc71' }}>${product.base_price}</p>
        <span style={{ 
          fontSize: '0.8rem', 
          background: '#f1f1f1', 
          padding: '4px 8px', 
          borderRadius: '4px' 
        }}>
          {product.category}
        </span>
      </Link>
    </div>
  );
};

export default ProductCard;