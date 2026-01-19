#!/usr/bin/env node

/**
 * API Testing Script
 * Tests Auth, Product, and Cart APIs
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

let accessToken = '';
let userId = '';
let productId = '';
let cartItemId = '';

// Helper function for API requests
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test suite
async function runTests() {
  console.log('\n========================================');
  console.log('🧪 StyleHub eCommerce API Test Suite');
  console.log('========================================\n');

  try {
    // 1. Test Health Check
    console.log('📍 Testing Health Check...');
    let res = await makeRequest('GET', '/api/health');
    console.log(`   ✅ Status: ${res.status}`);
    console.log(`   Response:`, JSON.stringify(res.data, null, 2));

    // 2. Test Signup
    console.log('\n📍 Testing User Signup...');
    res = await makeRequest('POST', '/api/auth/signup', {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    });
    console.log(`   ✅ Status: ${res.status}`);
    if (res.data.data) {
      accessToken = res.data.data.accessToken;
      userId = res.data.data.user.id;
      console.log(`   ✅ User created: ${res.data.data.user.name}`);
      console.log(`   ✅ Token received: ${accessToken.slice(0, 20)}...`);
    } else {
      console.log(`   ℹ️  Response:`, res.data.message);
    }

    // 3. Test Login
    console.log('\n📍 Testing User Login...');
    res = await makeRequest('POST', '/api/auth/login', {
      email: 'john@example.com',
      password: 'password123',
    });
    console.log(`   ✅ Status: ${res.status}`);
    if (res.data.data) {
      accessToken = res.data.data.accessToken;
      userId = res.data.data.user.id;
      console.log(`   ✅ Login successful for: ${res.data.data.user.name}`);
    } else {
      console.log(`   ❌ Error:`, res.data.message);
    }

    // 4. Test Get User Profile
    console.log('\n📍 Testing Get User Profile...');
    res = await makeRequest('GET', '/api/auth/me', null, {
      Authorization: `Bearer ${accessToken}`,
    });
    console.log(`   ✅ Status: ${res.status}`);
    if (res.data.data) {
      console.log(
        `   ✅ User: ${res.data.data.user.name} (${res.data.data.user.email})`
      );
    }

    // 5. Test Get All Products
    console.log('\n📍 Testing Get All Products...');
    res = await makeRequest('GET', '/api/products');
    console.log(`   ✅ Status: ${res.status}`);
    if (res.data.data && res.data.data.length > 0) {
      productId = res.data.data[0]._id;
      console.log(`   ✅ Found ${res.data.data.length} products`);
      console.log(`   ✅ First product: ${res.data.data[0].name}`);
    }

    // 6. Test Get Product by ID
    console.log('\n📍 Testing Get Product by ID...');
    res = await makeRequest('GET', `/api/products/${productId}`);
    console.log(`   ✅ Status: ${res.status}`);
    if (res.data.data) {
      console.log(
        `   ✅ Product: ${res.data.data.name} - $${res.data.data.price}`
      );
    }

    // 7. Test Add to Cart
    console.log('\n📍 Testing Add to Cart...');
    res = await makeRequest(
      'POST',
      '/api/cart/add',
      {
        productId: productId,
        quantity: 2,
        size: 'M',
      },
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    console.log(`   ✅ Status: ${res.status}`);
    if (res.data.data && res.data.data.items.length > 0) {
      cartItemId = res.data.data.items[0]._id;
      console.log(`   ✅ Added to cart`);
      console.log(`   ✅ Cart items: ${res.data.data.itemCount}`);
      console.log(`   ✅ Cart total: $${res.data.data.total.toFixed(2)}`);
    } else {
      console.log(`   Response:`, res.data);
    }

    // 8. Test Get Cart
    console.log('\n📍 Testing Get Cart...');
    res = await makeRequest('GET', '/api/cart', null, {
      Authorization: `Bearer ${accessToken}`,
    });
    console.log(`   ✅ Status: ${res.status}`);
    if (res.data.data) {
      console.log(`   ✅ Cart items: ${res.data.data.itemCount}`);
      console.log(`   ✅ Total: $${res.data.data.total.toFixed(2)}`);
    }

    // 9. Test Update Cart Item
    if (cartItemId) {
      console.log('\n📍 Testing Update Cart Item...');
      res = await makeRequest(
        'PUT',
        `/api/cart/update/${cartItemId}`,
        { quantity: 3 },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
      console.log(`   ✅ Status: ${res.status}`);
      if (res.data.data) {
        console.log(`   ✅ Updated quantity`);
        console.log(`   ✅ New total: $${res.data.data.total.toFixed(2)}`);
      }
    }

    // 10. Test Clear Cart
    console.log('\n📍 Testing Clear Cart...');
    res = await makeRequest('DELETE', '/api/cart/clear', null, {
      Authorization: `Bearer ${accessToken}`,
    });
    console.log(`   ✅ Status: ${res.status}`);
    if (res.data.data) {
      console.log(`   ✅ Cart cleared`);
      console.log(`   ✅ Items: ${res.data.data.itemCount}`);
    }

    console.log('\n========================================');
    console.log('✅ All tests completed successfully!');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
  }
}

// Run tests
runTests();
