const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAdminLogin() {
  try {
    console.log('Testing admin login and dashboard access...\n');
    
    // Try to login with the existing admin account
    console.log('1. Attempting login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'rohithjinwoo@gmail.com',
      password: 'admin123' // Try default password first
    });
    
    console.log('✅ Login successful!');
    const token = loginResponse.data.token;
    console.log('Token received:', token.substring(0, 20) + '...\n');
    
    // Test admin statistics endpoint
    console.log('2. Testing admin statistics...');
    const statsResponse = await axios.get(`${API_BASE}/admin/statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Statistics retrieved successfully:');
    console.log(JSON.stringify(statsResponse.data, null, 2));
    
    // Test books endpoint
    console.log('\n3. Testing books endpoint...');
    const booksResponse = await axios.get(`${API_BASE}/books`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Books retrieved successfully!');
    console.log('Total books found:', booksResponse.data.books?.length || 0);
    
    // Test overdue requests
    console.log('\n4. Testing overdue requests...');
    const overdueResponse = await axios.get(`${API_BASE}/requests/overdue`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Overdue requests retrieved successfully!');
    console.log('Overdue requests found:', overdueResponse.data.length || 0);
    
  } catch (error) {
    console.error('❌ Error occurred:');
    console.error('Error type:', error.constructor.name);
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data || error.message);
    console.error('Stack:', error.stack);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔍 Connection refused - server might not be running on port 5000');
    } else if (error.response?.status === 401) {
      console.log('\n🔍 Authentication failed - password might be wrong');
    }
  }
}

testAdminLogin();