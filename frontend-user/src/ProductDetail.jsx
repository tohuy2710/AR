import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://localhost:3000/dev/api/v1/products/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProduct(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div>Đang tải thông tin...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm!</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '40px' }}>
      {/* Cột trái: Hình ảnh và 3D */}
      <div style={{ flex: 1 }}>
        <h3>Ảnh sản phẩm</h3>
        <img src={product.thumbnail_url} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
        
        <h3 style={{ marginTop: '20px' }}>Mô hình 3D (Xoay để xem)</h3>
        {product.models && product.models.length > 0 && (
          <model-viewer
            src={product.models[0].model_url}
            ar
            camera-controls
            touch-action="pan-y"
            style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}
          ></model-viewer>
        )}
        <Link to={`/products/${product.slug}/ar`}>
            <button style={{ 
                padding: '15px 30px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer'
            }}>
                Xem AR tại nhà 🏠
            </button>
        </Link>
      </div>

      {/* Cột phải: Thông tin */}
      <div style={{ flex: 1 }}>
        <h1>{product.name}</h1>
        <p style={{ color: '#666' }}>{product.description}</p>
        <h2 style={{ color: '#2ecc71' }}>${product.base_price}</h2>
        
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          <h4>Thông số:</h4>
          <ul>
            {product.options.map(opt => (
              <li key={opt.id}>{opt.name}: {opt.value}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;