# Cloudinary & Multer Integration Guide

## Setup Steps

### 1. **Get Cloudinary Credentials**

- Go to [Cloudinary Dashboard](https://cloudinary.com/console)
- Sign up/Login
- Copy your credentials:
  - Cloud Name
  - API Key
  - API Secret

### 2. **Configure Environment Variables**

Update your `.env` file in the `backend/` directory:

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_KEY=your_cloudinary_api_key
CLOUD_SECRET=your_cloudinary_api_secret
```

### 3. **File Structure**

```
backend/
├── src/
│   ├── middleware/
│   │   └── upload.js          # Multer configuration
│   ├── utils/
│   │   └── cloudinary.js      # Cloudinary functions
│   └── routes/
│       └── products.js        # Example usage
└── temp/                       # Temporary file storage (auto-created)
```

---

## How to Use

### **In Your Routes/Controllers**

#### 1. **Single Image Upload**

```javascript
const express = require('express');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.path, 'products');

    if (!result) {
      return res.status(400).json({ message: 'Upload failed' });
    }

    res.json({
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### 2. **Multiple Images Upload**

```javascript
router.post('/upload-gallery', upload.array('images', 5), async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.path, 'products/gallery')
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      images: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### 3. **Delete Image**

```javascript
const { deleteFromCloudinary } = require('../utils/cloudinary');

router.delete('/image/:publicId', async (req, res) => {
  try {
    await deleteFromCloudinary(req.params.publicId);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## Frontend Usage (React)

### **Upload Image Form**

```javascript
import { useState } from 'react';

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload successful:', data.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}

export default ImageUpload;
```

---

## Configuration Details

### **Multer Configuration** (`middleware/upload.js`)

- **File Size Limit**: 10MB
- **Allowed Types**: Images (JPEG, PNG, GIF, WebP), Documents (PDF, DOC)
- **Storage**: Temporary directory (auto-deleted after Cloudinary upload)

### **Cloudinary Configuration** (`utils/cloudinary.js`)

- **Auto Folder Organization**: Files stored in folders by type
- **Resource Type**: Auto-detect (images, documents, etc.)
- **Returns**: Secure URL, Public ID, Format

---

## Best Practices

1. **Always validate file types** before upload
2. **Delete old images** when updating products
3. **Use public IDs** to manage image deletion
4. **Set appropriate file size limits**
5. **Handle errors gracefully**
6. **Clean up temp files** (automatic in this setup)

---

## Troubleshooting

| Issue                  | Solution                                     |
| ---------------------- | -------------------------------------------- |
| "Repository not found" | Check Cloudinary credentials in `.env`       |
| "File too large"       | Adjust limits in `upload.js`                 |
| "Invalid file type"    | Add MIME type to `fileFilter` in `upload.js` |
| "Temp directory error" | Ensure `backend/temp/` directory exists      |

---

## See Also

- [CLOUDINARY_INTEGRATION_EXAMPLE.js](./CLOUDINARY_INTEGRATION_EXAMPLE.js) - Complete route examples
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Multer Documentation](https://github.com/expressjs/multer)
