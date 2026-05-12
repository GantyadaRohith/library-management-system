// Quick test script to debug local API issues
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
    console.log('🔍 Testing Local API Endpoints...\n');
    
    try {
        // Test 1: Check if server is running
        console.log('1. Testing server connection...');
        const healthCheck = await axios.get(`${BASE_URL}/`);
        console.log('   ✅ Server is running:', healthCheck.data);
        
        // Test 2: Try to register a test user
        console.log('\n2. Testing user registration...');
        try {
            const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
                name: 'Test Librarian',
                email: 'test@library.com',
                password: 'password123',
                role: 'librarian'
            });
            console.log('   ✅ Registration successful');
        } catch (regError) {
            if (regError.response?.status === 400 && regError.response?.data?.message?.includes('already exists')) {
                console.log('   ℹ️ User already exists (that\'s fine)');
            } else {
                console.log('   ❌ Registration error:', regError.response?.data?.message || regError.message);
            }
        }
        
        // Test 3: Try to login
        console.log('\n3. Testing login...');
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'test@library.com',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('   ✅ Login successful, got token');
        
        // Test 4: Test admin endpoints with token
        console.log('\n4. Testing admin endpoints with token...');
        const headers = { Authorization: `Bearer ${token}` };
        
        try {
            const statsResponse = await axios.get(`${BASE_URL}/api/admin/statistics`, { headers });
            console.log('   ✅ Admin statistics:', statsResponse.data);
        } catch (statsError) {
            console.log('   ❌ Admin statistics error:', statsError.response?.status, statsError.response?.data?.message || statsError.message);
        }
        
        // Test 5: Test requests endpoints
        console.log('\n5. Testing requests endpoints...');
        try {
            const overdueResponse = await axios.get(`${BASE_URL}/api/requests/overdue`, { headers });
            console.log('   ✅ Overdue books:', overdueResponse.data.length, 'books found');
        } catch (overdueError) {
            console.log('   ❌ Overdue books error:', overdueError.response?.status, overdueError.response?.data?.message || overdueError.message);
        }
        
        try {
            const dueSoonResponse = await axios.get(`${BASE_URL}/api/requests/due-soon`, { headers });
            console.log('   ✅ Due soon books:', dueSoonResponse.data.length, 'books found');
        } catch (dueSoonError) {
            console.log('   ❌ Due soon books error:', dueSoonError.response?.status, dueSoonError.response?.data?.message || dueSoonError.message);
        }
        
        try {
            const statsResponse = await axios.get(`${BASE_URL}/api/requests/statistics`, { headers });
            console.log('   ✅ Request statistics:', statsResponse.data);
        } catch (statsError) {
            console.log('   ❌ Request statistics error:', statsError.response?.status, statsError.response?.data?.message || statsError.message);
        }
        
    } catch (error) {
        console.log('❌ Server connection failed:', error.message);
        console.log('   Make sure server is running on http://localhost:5000');
    }
}

testAPI().catch(console.error);