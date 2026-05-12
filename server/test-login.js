const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with reset credentials...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'rohithjinwoo@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('User role:', response.data.user.role);
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    
    // Test a protected endpoint
    const token = response.data.token;
    const statsResponse = await axios.get('http://localhost:5000/api/admin/statistics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Admin dashboard access successful!');
    console.log('Statistics:', statsResponse.data);
    
  } catch (error) {
    console.error('❌ Login test failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
  }
}

testLogin();