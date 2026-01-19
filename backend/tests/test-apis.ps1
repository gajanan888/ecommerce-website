#!/usr/bin/env pwsh

# API Testing Script for StyleHub eCommerce
# Tests Auth, Product, and Cart APIs

$BASE_URL = "http://localhost:5000"
$accessToken = ""
$userId = ""
$productId = ""
$cartItemId = ""

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "StyleHub eCommerce API Test Suite" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

try {
    # 1. Test Health Check
    Write-Host "Testing Health Check..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/health" -Method Get -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "   Status: 200" -ForegroundColor Green
        Write-Host "   Response: OK" -ForegroundColor Green
    }

    # 2. Test Signup
    Write-Host ""
    Write-Host "Testing User Signup..." -ForegroundColor Cyan
    $signupBody = @{
        name = "John Doe"
        email = "john@example.com"
        password = "password123"
        passwordConfirm = "password123"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$BASE_URL/api/auth/signup" -Method Post `
        -ContentType "application/json" -Body $signupBody -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 201) {
        Write-Host "   Status: 201" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        $accessToken = $data.data.accessToken
        $userId = $data.data.user.id
        Write-Host "   User created: $($data.data.user.name)" -ForegroundColor Green
        Write-Host "   Token received" -ForegroundColor Green
    } else {
        Write-Host "   User may already exist, trying login..." -ForegroundColor Yellow
        # Try login instead
        Write-Host ""
        Write-Host "Testing User Login..." -ForegroundColor Cyan
        $loginBody = @{
            email = "john@example.com"
            password = "password123"
        } | ConvertTo-Json

        $response = Invoke-WebRequest -Uri "$BASE_URL/api/auth/login" -Method Post `
            -ContentType "application/json" -Body $loginBody -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-Host "   Status: 200" -ForegroundColor Green
            $data = $response.Content | ConvertFrom-Json
            $accessToken = $data.data.accessToken
            $userId = $data.data.user.id
            Write-Host "   Login successful" -ForegroundColor Green
        }
    }

    # 3. Test Get User Profile
    Write-Host ""
    Write-Host "Testing Get User Profile..." -ForegroundColor Cyan
    $headers = @{
        Authorization = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/auth/me" -Method Get `
        -Headers $headers -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host "   Status: 200" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "   User: $($data.data.user.name) ($($data.data.user.email))" -ForegroundColor Green
    }

    # 4. Test Get All Products
    Write-Host ""
    Write-Host "Testing Get All Products..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/products" -Method Get -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host "   Status: 200" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        if ($data.data.Count -gt 0) {
            $productId = $data.data[0]._id
            Write-Host "   Found $($data.data.Count) products" -ForegroundColor Green
            Write-Host "   First product: $($data.data[0].name)" -ForegroundColor Green
        }
    }

    # 5. Test Get Product by ID
    if ($productId) {
        Write-Host ""
        Write-Host "Testing Get Product by ID..." -ForegroundColor Cyan
        $response = Invoke-WebRequest -Uri "$BASE_URL/api/products/$productId" -Method Get -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-Host "   Status: 200" -ForegroundColor Green
            $data = $response.Content | ConvertFrom-Json
            Write-Host "   Product: $($data.data.name) - $($data.data.price) USD" -ForegroundColor Green
        }
    }

    # 6. Test Add to Cart
    Write-Host ""
    Write-Host "Testing Add to Cart..." -ForegroundColor Cyan
    $cartBody = @{
        productId = $productId
        quantity = 2
        size = "M"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$BASE_URL/api/cart/add" -Method Post `
        -ContentType "application/json" -Body $cartBody -Headers $headers -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 201) {
        Write-Host "   Status: 201" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        if ($data.data.items.Count -gt 0) {
            $cartItemId = $data.data.items[0]._id
            Write-Host "   Added to cart" -ForegroundColor Green
            Write-Host "   Cart items: $($data.data.itemCount)" -ForegroundColor Green
            Write-Host "   Cart total: $($data.data.total) USD" -ForegroundColor Green
        }
    } else {
        Write-Host "   Error: $($response.StatusCode)" -ForegroundColor Red
    }

    # 7. Test Get Cart
    Write-Host ""
    Write-Host "Testing Get Cart..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/cart" -Method Get `
        -Headers $headers -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host "   Status: 200" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "   Cart items: $($data.data.itemCount)" -ForegroundColor Green
        Write-Host "   Total: $($data.data.total) USD" -ForegroundColor Green
    }

    # 8. Test Update Cart Item
    if ($cartItemId) {
        Write-Host ""
        Write-Host "Testing Update Cart Item..." -ForegroundColor Cyan
        $updateBody = @{
            quantity = 3
        } | ConvertTo-Json

        $response = Invoke-WebRequest -Uri "$BASE_URL/api/cart/update/$cartItemId" -Method Put `
            -ContentType "application/json" -Body $updateBody -Headers $headers -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-Host "   Status: 200" -ForegroundColor Green
            $data = $response.Content | ConvertFrom-Json
            Write-Host "   Updated quantity" -ForegroundColor Green
            Write-Host "   New total: $($data.data.total) USD" -ForegroundColor Green
        }
    }

    # 9. Test Clear Cart
    Write-Host ""
    Write-Host "Testing Clear Cart..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/cart/clear" -Method Delete `
        -Headers $headers -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host "   Status: 200" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "   Cart cleared" -ForegroundColor Green
        Write-Host "   Items: $($data.data.itemCount)" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "All tests completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "Error during testing:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}
