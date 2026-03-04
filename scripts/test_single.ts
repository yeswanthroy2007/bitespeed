import axios from 'axios';
const uri = 'https://bitespeed-production-75b3.up.railway.app/identify';
const body = {
    "email": "venkatayeswanthroybhatraju.com",
    "phoneNumber": "7207187022"
};

axios.post(uri, body).then(res => {
    console.log(JSON.stringify(res.data, null, 2));
}).catch(e => {
    console.error(e.response?.data || e.message);
});
