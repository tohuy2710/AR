// src/handlers/product.js
const { getProducts, getProductDetailBySlug } = require('../controllers/productController');

module.exports.listProducts = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const category = queryParams.category || null;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 12;

    const result = await getProducts(category, page, limit);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        pagination: result.pagination,
        data: result.data
      })
    };
  } catch (error) {
    console.error("List Products Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' })
    };
  }
};

module.exports.getProductDetail = async (event) => {
  try {
    const slug = event.pathParameters.slug;

    const productData = await getProductDetailBySlug(slug);

    if (!productData) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          message: 'Product not found or inactive'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: productData
      })
    };
  } catch (error) {
    console.error("Get Product Detail Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' })
    };
  }
};