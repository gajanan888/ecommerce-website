const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Product = require('./models/Product');
const { connectDB } = require('./config/database');

const sampleProducts = [
  // Women's Collection
  {
    name: 'Elegant Black Blazer',
    sku: 'BLAZER-BLACK-001',
    description:
      'Professional black blazer perfect for office and formal occasions. Premium quality with excellent fit.',
    price: 189,
    discount: 20,
    stock: 45,
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop',
    ],
    rating: 4.7,
    reviews: [],
    isFeatured: true,
  },
  {
    name: 'Premium Silk Dress',
    sku: 'DRESS-SILK-001',
    description:
      'Luxurious silk cocktail dress in a sophisticated navy blue. Perfect for evening events.',
    price: 249,
    discount: 25,
    stock: 32,
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1595777707802-e506e1b11c20?w=500&h=500&fit=crop',
    ],
    rating: 4.8,
    reviews: [],
    isFeatured: true,
  },
  {
    name: 'Casual Linen Shirt',
    sku: 'SHIRT-LINEN-001',
    description:
      'Breathable linen shirt in cream color. Ideal for summer outings and casual wear.',
    price: 79,
    discount: 30,
    stock: 67,
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1507466119613-cf54a17e7f87?w=500&h=500&fit=crop',
    ],
    rating: 4.5,
    reviews: [],
  },
  {
    name: 'Denim Skinny Jeans',
    sku: 'JEANS-SKINNY-001',
    description:
      'Classic dark blue skinny jeans with stretch fabric for ultimate comfort. Available in sizes XS-XL.',
    price: 89,
    discount: 35,
    stock: 98,
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop',
    ],
    rating: 4.6,
    reviews: [],
  },
  {
    name: 'Floral Summer Dress',
    sku: 'DRESS-FLORAL-001',
    description:
      'Vibrant floral print maxi dress perfect for summer vacations and beach days.',
    price: 129,
    discount: 28,
    stock: 45,
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1575992308768-eac4d13f631e?w=500&h=500&fit=crop',
    ],
    rating: 4.7,
    reviews: [],
  },
  {
    name: 'Wool Winter Coat',
    sku: 'COAT-WOOL-001',
    description:
      'Premium wool winter coat in classic black. Insulated and stylish for cold weather.',
    price: 349,
    discount: 15,
    stock: 28,
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1539533057092-45eb0165597a?w=500&h=500&fit=crop',
    ],
    rating: 4.8,
    reviews: [],
  },

  // Men's Collection
  {
    name: 'Slim Fit Oxford Shirt',
    sku: 'SHIRT-OXFORD-001',
    description:
      'Classic white oxford shirt with slim fit. Perfect for business and casual occasions.',
    price: 99,
    discount: 25,
    stock: 67,
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1519376874399-fd95b50266f8?w=500&h=500&fit=crop',
    ],
    rating: 4.6,
    reviews: [],
    isFeatured: true,
  },
  {
    name: 'Premium Cotton T-Shirt',
    sku: 'TSHIRT-COTTON-001',
    description:
      '100% cotton t-shirt available in multiple colors. Comfortable and durable for everyday wear.',
    price: 45,
    discount: 30,
    stock: 156,
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    ],
    rating: 4.5,
    reviews: [],
  },
  {
    name: 'Tailored Chino Pants',
    sku: 'PANTS-CHINO-001',
    description:
      'Versatile tailored chino pants in khaki. Perfect for business casual and weekend outings.',
    price: 119,
    discount: 22,
    stock: 87,
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1473080169858-d76287b66038?w=500&h=500&fit=crop',
    ],
    rating: 4.6,
    reviews: [],
  },
  {
    name: 'Denim Straight Jeans',
    sku: 'JEANS-STRAIGHT-001',
    description:
      'Classic dark wash straight-fit jeans. Durable and timeless piece for any wardrobe.',
    price: 99,
    discount: 32,
    stock: 112,
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop',
    ],
    rating: 4.5,
    reviews: [],
  },
  {
    name: 'Wool Blend Sweater',
    sku: 'SWEATER-WOOL-001',
    description:
      'Cozy wool blend v-neck sweater in charcoal gray. Perfect for layering in colder months.',
    price: 149,
    discount: 18,
    stock: 56,
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1535529387789-4c1017266635?w=500&h=500&fit=crop',
    ],
    rating: 4.7,
    reviews: [],
  },
  {
    name: 'Leather Casual Jacket',
    sku: 'JACKET-LEATHER-001',
    description:
      'Stylish genuine leather jacket in brown. A timeless piece that works with any outfit.',
    price: 299,
    discount: 20,
    stock: 34,
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
    ],
    rating: 4.8,
    reviews: [],
  },

  // Accessories
  {
    name: 'Designer Leather Handbag',
    sku: 'HANDBAG-LEATHER-001',
    description:
      'Elegant black leather handbag with multiple compartments. Perfect for daily use and special occasions.',
    price: 349,
    discount: 25,
    stock: 34,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
    ],
    rating: 4.7,
    reviews: [],
    isFeatured: true,
  },
  {
    name: 'Classic Silk Scarf',
    sku: 'SCARF-SILK-001',
    description:
      'Premium silk scarf with a beautiful paisley pattern. Versatile accessory for any season.',
    price: 79,
    discount: 28,
    stock: 89,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop',
    ],
    rating: 4.6,
    reviews: [],
  },
  {
    name: 'Stainless Steel Watch',
    sku: 'WATCH-STEEL-001',
    description:
      'Elegant stainless steel watch with leather strap. Suitable for any occasion.',
    price: 199,
    discount: 30,
    stock: 45,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1523170335684-f1b5aaa3e3a5?w=500&h=500&fit=crop',
    ],
    rating: 4.7,
    reviews: [],
  },
  {
    name: 'Designer Sunglasses',
    sku: 'SUNGLASSES-DESIGN-001',
    description:
      'UV-protected designer sunglasses with premium frame. Perfect for summer and style.',
    price: 159,
    discount: 35,
    stock: 67,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    ],
    rating: 4.5,
    reviews: [],
  },
  {
    name: 'Leather Belt',
    sku: 'BELT-LEATHER-001',
    description:
      'Genuine leather belt with gold buckle. A classic accessory for both casual and formal wear.',
    price: 69,
    discount: 25,
    stock: 98,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    ],
    rating: 4.6,
    reviews: [],
  },
  {
    name: 'Wool Knit Beanie',
    sku: 'BEANIE-WOOL-001',
    description:
      'Cozy wool knit beanie in multiple colors. Perfect for winter warmth and style.',
    price: 35,
    discount: 32,
    stock: 124,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1529969529979-88a03b59dac1?w=500&h=500&fit=crop',
    ],
    rating: 4.5,
    reviews: [],
  },

  // Kids
  {
    name: 'Colorful Kids T-Shirt',
    sku: 'KIDS-TSHIRT-001',
    description:
      'Fun and colorful cotton t-shirt for kids. Available in sizes 2-14 years.',
    price: 25,
    discount: 30,
    stock: 145,
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
    ],
    rating: 4.5,
    reviews: [],
  },
  {
    name: 'Kids Denim Jacket',
    sku: 'KIDS-JACKET-001',
    description:
      'Adorable denim jacket for kids with fun patches. Comfortable and durable for playtime.',
    price: 79,
    discount: 25,
    stock: 67,
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1519381305325-278a50622d4d?w=500&h=500&fit=crop',
    ],
    rating: 4.6,
    reviews: [],
  },
  {
    name: 'Kids Casual Pants',
    sku: 'KIDS-PANTS-001',
    description:
      'Comfortable casual pants for kids. Easy to move and play in. Perfect for school or outdoor activities.',
    price: 45,
    discount: 28,
    stock: 98,
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1475529587266-dc9d19ba830f?w=500&h=500&fit=crop',
    ],
    rating: 4.5,
    reviews: [],
  },
  {
    name: 'Kids Summer Dress',
    sku: 'KIDS-DRESS-001',
    description:
      'Cute summer dress for girls with fun patterns. Perfect for warm weather and special occasions.',
    price: 55,
    discount: 32,
    stock: 76,
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1519689373319-308bcda56ccd?w=500&h=500&fit=crop',
    ],
    rating: 4.6,
    reviews: [],
  },
  {
    name: 'Kids Sports Shoes',
    sku: 'KIDS-SHOES-001',
    description:
      'Lightweight and comfortable sports shoes for kids. Great for running and playing.',
    price: 59,
    discount: 35,
    stock: 112,
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    ],
    rating: 4.5,
    reviews: [],
  },
];

async function seedProducts() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(
      `✅ Successfully added ${insertedProducts.length} fashion products to database`
    );

    // Show summary
    const stats = {};
    insertedProducts.forEach((product) => {
      stats[product.category] = (stats[product.category] || 0) + 1;
    });

    console.log('\n📊 Fashion Products by Category:');
    Object.entries(stats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    console.log('\n🎉 Fashion database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts();
