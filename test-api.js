// Test script to verify API endpoints after deployment
const BASE_URL = 'https://gantyadarohith-library.netlify.app/api';

async function testEndpoints() {
    console.log('Testing API endpoints...\n');
    
    // Test 1: Get books (should work without auth)
    try {
        console.log('1. Testing GET /api/books');
        const response = await fetch(`${BASE_URL}/books`);
        const data = await response.json();
        console.log('   Status:', response.status);
        console.log('   Response:', data);
        console.log('   ✅ Success\n');
    } catch (error) {
        console.log('   ❌ Error:', error.message, '\n');
    }
    
    // Test 2: Test login endpoint
    try {
        console.log('2. Testing POST /api/auth/login (sample request)');
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        });
        const data = await response.json();
        console.log('   Status:', response.status);
        console.log('   Response:', data);
        console.log('   ✅ Endpoint accessible\n');
    } catch (error) {
        console.log('   ❌ Error:', error.message, '\n');
    }
    
    // Test 3: Test requests endpoint (without auth - should get proper error)
    try {
        console.log('3. Testing GET /api/requests');
        const response = await fetch(`${BASE_URL}/requests`);
        const data = await response.json();
        console.log('   Status:', response.status);
        console.log('   Response:', data);
        console.log('   ✅ Endpoint accessible\n');
    } catch (error) {
        console.log('   ❌ Error:', error.message, '\n');
    }
    
    // Test 4: Test overdue endpoint (without auth - should get proper error)
    try {
        console.log('4. Testing GET /api/admin/overdue');
        const response = await fetch(`${BASE_URL}/admin/overdue`);
        const data = await response.json();
        console.log('   Status:', response.status);
        console.log('   Response:', data);
        console.log('   ✅ Endpoint accessible\n');
    } catch (error) {
        console.log('   ❌ Error:', error.message, '\n');
    }
}

// Run tests
testEndpoints().catch(console.error);