// src/controllers/productController.js
const db = require('../config/database');

const getProducts = async (category, page = 1, limit = 12) => {
  const offset = (page - 1) * limit;
  const queryParams = [];
  const countParams = [];

  let whereClause = "WHERE p.status = 'ACTIVE'";
  
  if (category) {
    whereClause += " AND p.category = ?";
    queryParams.push(category);
    countParams.push(category);
  }

  // 1. Đếm tổng số lượng record để phân trang
  const countQuery = `SELECT COUNT(id) as total FROM products p ${whereClause}`;
  const [[{ total }]] = await db.query(countQuery, countParams);

  // 2. Lấy danh sách sản phẩm cùng ảnh hover (ảnh phụ đầu tiên)
  queryParams.push(Number(limit), Number(offset));
  const dataQuery = `
    SELECT 
      p.id, p.name, p.slug, p.base_price, p.thumbnail_url, p.category, p.stock_quantity,
      (
        SELECT image_url 
        FROM product_images pi 
        WHERE pi.product_id = p.id 
        ORDER BY pi.sort_order ASC 
        LIMIT 1
      ) as hover_image_url
    FROM products p
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  const [rows] = await db.query(dataQuery, queryParams);

  return {
    pagination: {
      total_records: total,
      current_page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(total / limit)
    },
    data: rows.map(row => ({
      ...row,
      base_price: parseFloat(row.base_price) // Đảm bảo format số
    }))
  };
};

const getProductDetailBySlug = async (slug) => {
  // 1. Lấy thông tin cơ bản của sản phẩm
  const productQuery = `
    SELECT id, name, slug, description, base_price, thumbnail_url, category, stock_quantity 
    FROM products 
    WHERE slug = ? AND status = 'ACTIVE' 
    LIMIT 1
  `;
  const [products] = await db.query(productQuery, [slug]);

  if (products.length === 0) {
    return null; // Controller trả về null để Handler tự throw 404
  }

  const product = products[0];
  const productId = product.id;

  // 2. Chạy query song song (Parallel) để lấy ảnh, option và 3D model
  const [
    [images],
    [options],
    [models]
  ] = await Promise.all([
    db.query('SELECT id, image_url, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC', [productId]),
    db.query('SELECT id, name, value, extra_price FROM product_options WHERE product_id = ?', [productId]),
    db.query('SELECT id, type, model_url FROM product_models WHERE product_id = ?', [productId])
  ]);

  // 3. Gom dữ liệu trả về
  return {
    ...product,
    base_price: parseFloat(product.base_price),
    images: images,
    options: options.map(opt => ({
      ...opt,
      extra_price: parseFloat(opt.extra_price)
    })),
    models: models
  };
};

module.exports = {
  getProducts,
  getProductDetailBySlug
};