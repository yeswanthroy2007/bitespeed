import axios from 'axios';

const REMOTE_URL = 'https://bitespeed-production-75b3.up.railway.app';

async function testRemote() {
    try {
        console.log('Testing Health...');
        const health = await axios.get(`${REMOTE_URL}/health`);
        console.log('Health Response:', health.data);

        console.log('\nTesting Identify...');
        const identify = await axios.post(`${REMOTE_URL}/identify`, {
            email: 'venkatayeswanthroybhatraju.com',
            phoneNumber: '7207187022'
        });
        console.log('Identify Response:', JSON.stringify(identify.data, null, 2));

        console.log('\n--- Running Additional Tests ---');
        
        console.log('\nTest 1: doc@hillvalley.edu, 123456');
        const res1 = await axios.post(`${REMOTE_URL}/identify`, {
            email: 'doc@hillvalley.edu',
            phoneNumber: '123456'
        });
        console.log('Response:', JSON.stringify(res1.data, null, 2));

        console.log('\nTest 2: doc@hillvalley.edu only');
        const res2 = await axios.post(`${REMOTE_URL}/identify`, {
            email: 'doc@hillvalley.edu'
        });
        console.log('Response:', JSON.stringify(res2.data, null, 2));

        console.log('\nTest 3: 123456 only');
        const res3 = await axios.post(`${REMOTE_URL}/identify`, {
            phoneNumber: '123456'
        });
        console.log('Response:', JSON.stringify(res3.data, null, 2));

    } catch (error: any) {
        console.error('❌ Error testing remote:', error.response?.data || error.message);
    }
}

testRemote();
