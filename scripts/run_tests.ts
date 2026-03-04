import axios from 'axios';

const API_URL = 'http://localhost:3000';

async function testIdentify() {
    console.log('🚀 Starting Bitespeed Identity Reconciliation Tests...\n');

    try {
        // 1. Create first primary contact
        console.log('Test 1: New customer (m@g.com, 123456)');
        const res1 = await axios.post(`${API_URL}/identify`, {
            email: 'm@g.com',
            phoneNumber: '123456'
        });
        console.log('Response:', JSON.stringify(res1.data, null, 2));

        // 2. Add new phone for existing email
        console.log('\nTest 2: New phone for existing email (m@g.com, 789012)');
        const res2 = await axios.post(`${API_URL}/identify`, {
            email: 'm@g.com',
            phoneNumber: '789012'
        });
        console.log('Response:', JSON.stringify(res2.data, null, 2));

        // 3. Add new email for existing phone
        console.log('\nTest 3: New email for existing phone (k@g.com, 789012)');
        const res3 = await axios.post(`${API_URL}/identify`, {
            email: 'k@g.com',
            phoneNumber: '789012'
        });
        console.log('Response:', JSON.stringify(res3.data, null, 2));

        // 4. Merge two primary groups
        console.log('\nTest 4: Merging two primary groups');
        // First create a new independent primary
        console.log('Creating another primary (l@g.com, 000000)');
        await axios.post(`${API_URL}/identify`, {
            email: 'l@g.com',
            phoneNumber: '000000'
        });

        // Now trigger merge (m@g.com is linked to 123456, l@g.com is linked to 000000)
        // Connecting m@g.com and 000000 should merge clusters
        console.log('Triggering merge (m@g.com, 000000)');
        const res4 = await axios.post(`${API_URL}/identify`, {
            email: 'm@g.com',
            phoneNumber: '000000'
        });
        console.log('Response:', JSON.stringify(res4.data, null, 2));

    } catch (error: any) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testIdentify();
