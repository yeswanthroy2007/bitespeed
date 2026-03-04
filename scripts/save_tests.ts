import axios from 'axios';
import fs from 'fs';
const uri = 'https://bitespeed-production-75b3.up.railway.app/identify';

async function runAndSaveTests() {
    const tests = [
        { email: "doc@hillvalley.edu", phoneNumber: "123456" },
        { email: "doc@hillvalley.edu" },
        { phoneNumber: "123456" }
    ];

    let output = "";
    for (const [index, body] of tests.entries()) {
        output += `--- Test ${index + 1} ---\n`;
        output += `Request: ${JSON.stringify(body)}\n`;
        try {
            const res = await axios.post(uri, body);
            output += `Response: ${JSON.stringify(res.data, null, 2)}\n\n`;
        } catch (e: any) {
            output += `Error: ${JSON.stringify(e.response?.data || e.message, null, 2)}\n\n`;
        }
    }
    fs.writeFileSync('test_results.txt', output);
}

runAndSaveTests();
