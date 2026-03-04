import axios from 'axios';
const uri = 'https://bitespeed-production-75b3.up.railway.app/identify';

async function runTests() {
    const tests = [
        { email: "doc@hillvalley.edu", phoneNumber: "123456" },
        { email: "doc@hillvalley.edu" },
        { phoneNumber: "123456" }
    ];

    for (const [index, body] of tests.entries()) {
        console.log(`\n--- Test ${index + 1} ---`);
        console.log('Request:', JSON.stringify(body));
        try {
            const res = await axios.post(uri, body);
            console.log('Response:', JSON.stringify(res.data, null, 2));
        } catch (e: any) {
            console.error('Error:', JSON.stringify(e.response?.data || e.message, null, 2));
        }
    }
}

runTests();
