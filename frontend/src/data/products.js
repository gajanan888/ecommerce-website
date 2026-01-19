export const products = [
  // T-Shirts Category
  {
    name: 'Urban Cotton Essentials T-Shirt',
    description:
      'Premium 100% cotton t-shirt with comfortable fit. Perfect for everyday wear. Made in India with sustainable practices.',
    price: 499,
    discount: 10,
    stock: 50,
    category: 'T-Shirts',
    gender: 'Men',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.5,
    sku: 'TSHIRT-UC-001',
    isNew: true,
    material: '100% Cotton',
    tags: ['casual', 'cotton', 'everyday', 'new'],
  },
  {
    name: 'Classic Navy Crew Neck',
    description:
      'Timeless navy crew neck tee with soft fabric. Great quality and durability. Ideal for layering and casual outings.',
    price: 599,
    discount: 15,
    stock: 65,
    category: 'T-Shirts',
    gender: 'Women',
    image:
      'https://images.unsplash.com/photo-1518257999-6b8db3e5d0f9?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1518257999-6b8db3e5d0f9?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.3,
    sku: 'TSHIRT-NC-001',
    isNew: false,
    material: 'Cotton Blend',
    tags: ['classic', 'navy', 'formal-casual', 'summer'],
  },
  {
    name: 'Organic Cotton Printed Tee',
    description:
      'Eco-friendly organic cotton with modern graphic design. Sustainable fashion choice. Available in multiple prints.',
    price: 699,
    discount: 20,
    stock: 40,
    category: 'T-Shirts',
    gender: 'Men',
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.7,
    sku: 'TSHIRT-OP-001',
    isNew: true,
    material: '100% Organic Cotton',
    tags: ['eco-friendly', 'printed', 'sustainable', 'new'],
  },
  {
    name: 'Striped Cotton T-Shirt',
    description:
      'Classic striped pattern cotton t-shirt. Versatile for all seasons. Machine washable and durable.',
    price: 549,
    discount: 12,
    stock: 55,
    category: 'T-Shirts',
    gender: 'Women',
    image:
      'https://images.unsplash.com/photo-1503342452862-46cff8fa8d4d?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1503342452862-46cff8fa8d4d?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 4.2,
    sku: 'TSHIRT-ST-001',
    isNew: false,
    material: 'Cotton-Polyester Blend',
    tags: ['striped', 'versatile', 'casual', 'summer'],
  },

  // Shirts Category
  {
    name: 'Premium Oxford Button-Up Shirt',
    description:
      'Elegant oxford weave shirt perfect for office and casual outings. Wrinkle-resistant fabric with classic styling.',
    price: 1299,
    discount: 25,
    stock: 35,
    category: 'Shirts',
    gender: 'Men',
    image:
      'https://images.unsplash.com/photo-1596684515989-c3e66d8dbd4e?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1596684515989-c3e66d8dbd4e?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.6,
    sku: 'SHIRT-OX-001',
    isNew: false,
    material: '100% Cotton Oxford',
    tags: ['formal', 'oxford', 'office'],
  },
  {
    name: 'Modern Fit Linen Shirt',
    description:
      'Breathable linen blend shirt ideal for summer. Comfortable and stylish with modern fit design. Perfect for tropical climate.',
    price: 1499,
    discount: 20,
    stock: 30,
    category: 'Shirts',
    gender: 'Men',
    image:
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.4,
    sku: 'SHIRT-LN-001',
    isNew: true,
    material: 'Linen-Cotton Blend',
    tags: ['summer', 'linen', 'breathable', 'new'],
  },
  {
    name: 'Classic White Formal Shirt',
    description:
      'Crisp white formal shirt with premium finish. Perfect for all occasions - weddings, business meetings, and formal events.',
    price: 1199,
    discount: 30,
    stock: 45,
    category: 'Shirts',
    gender: 'Women',
    image:
      'https://images.unsplash.com/photo-1578925078519-2d1b82d81e75?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1578925078519-2d1b82d81e75?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    sku: 'SHIRT-WH-001',
    isNew: false,
    material: '100% Cotton Poplin',
    tags: ['formal', 'white', 'premium'],
  },
  {
    name: 'Casual Check Button Shirt',
    description:
      'Colorful checkered pattern shirt for casual wear. Lightweight and comfortable. Great for weekend outings.',
    price: 899,
    discount: 15,
    stock: 50,
    category: 'Shirts',
    gender: 'Women',
    image:
      'https://images.unsplash.com/photo-1607345366716-8d6e34dd3402?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1607345366716-8d6e34dd3402?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 4.3,
    sku: 'SHIRT-CH-001',
    isNew: true,
    material: 'Cotton Blend',
    tags: ['casual', 'checkered', 'colorful', 'summer'],
  },

  // Jeans Category
  {
    name: 'Slim Fit Dark Denim Jeans',
    description:
      'Quality dark denim with slim fit silhouette. Versatile and durable for everyday wear. Premium dye used for color retention.',
    gender: 'Men',
    image:
      'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    rating: 4.7,
    sku: 'JEANS-SD-001',
    isNew: true,
    material: '100% Cotton Denim',
    tags: ['denim', 'slim-fit', 'dark', 'new'],
  },
  {
    name: 'Classic Blue Denim',
    description:
      'Timeless blue denim with comfortable regular fit. Ideal for casual style and everyday wear. Fade-resistant fabric.',
    price: 1599,
    discount: 25,
    stock: 55,
    category: 'Jeans',
    gender: 'Women',
    image:
      'https://images.unsplash.com/photo-1506629082632-ffc4a0d08f87?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1506629082632-ffc4a0d08f87?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    rating: 4.5,
    sku: 'JEANS-BC-001',
    isNew: false,
    material: '100% Cotton Denim',
    tags: ['denim', 'classic', 'blue'],
  },
  {
    name: 'Black Tapered Denim Jeans',
    description:
      'Modern tapered fit black denim for a sleek look. Perfect for both casual and semi-formal occasions.',
    price: 1899,
    discount: 20,
    stock: 35,
    category: 'Jeans',
    gender: 'Men',
    image:
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    rating: 4.6,
    sku: 'JEANS-BT-001',
    isNew: true,
    material: '98% Cotton, 2% Elastane',
    tags: ['denim', 'tapered', 'black', 'new'],
  },
  {
    name: 'Light Wash Distressed Jeans',
    description:
      'Trendy light wash with distressed details. Perfect for summer and casual outings. Comfortable and stylish.',
    price: 1699,
    discount: 15,
    stock: 45,
    category: 'Jeans',
    gender: 'Women',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['28', '30', '32', '34'],
    rating: 4.4,
    sku: 'JEANS-LD-001',
    isNew: false,
    material: '100% Cotton Denim',
    tags: ['denim', 'distressed', 'light-wash', 'summer'],
  },

  // Jackets Category
  {
    name: 'Classic Denim Jacket',
    description:
      'Timeless denim jacket in deep indigo. Perfect layering piece for all seasons. Comfortable and durable.',
    price: 2499,
    discount: 30,
    stock: 25,
    category: 'Jackets',
    gender: 'Men',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    sku: 'JACKET-DC-001',
    isNew: false,
    material: '100% Cotton Denim',
    tags: ['jacket', 'denim', 'classic'],
  },
  {
    name: 'Casual Bomber Jacket',
    description:
      'Lightweight bomber jacket perfect for spring and fall. Modern design with comfortable fit. Available in multiple colors.',
    price: 2199,
    discount: 20,
    stock: 30,
    category: 'Jackets',
    gender: 'Women',
    image:
      'https://images.unsplash.com/photo-1494804633174-766841c3dee3?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1494804633174-766841c3dee3?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.5,
    sku: 'JACKET-BC-001',
    isNew: true,
    material: 'Nylon-Cotton Blend',
    tags: ['jacket', 'bomber', 'casual', 'new'],
  },
  {
    name: 'Premium Leather Jacket',
    description:
      'Genuine leather jacket with premium finish. Perfect for a sophisticated look. Professional craftsmanship.',
    price: 3999,
    discount: 40,
    stock: 15,
    category: 'Jackets',
    gender: 'Men',
    image:
      'https://images.unsplash.com/photo-1551530820-ba20deab6c04?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551530820-ba20deab6c04?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    sku: 'JACKET-LP-001',
    isNew: true,
    material: '100% Genuine Leather',
    tags: ['jacket', 'leather', 'premium', 'new'],
  },
  {
    name: 'Windproof Lightweight Jacket',
    description:
      'Water-resistant and windproof jacket. Ideal for outdoor activities and travel. Breathable and lightweight.',
    price: 2299,
    discount: 25,
    stock: 40,
    category: 'Jackets',
    gender:
      'Women and windproof jacket. Ideal for outdoor activities and travel. Breathable and lightweight.',
    price: 2299,
    discount: 25,
    stock: 40,
    category: 'Jackets',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop&q=80',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 4.6,
    sku: 'JACKET-WL-001',
    isNew: false,
    material: 'Polyester-Nylon Blend',
    tags: ['jacket', 'windproof', 'outdoor'],
  },
];
