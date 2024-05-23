const axios = require('axios');

axios.post('http://localhost/login', {
    username: 'admin',
    password: 'admin'
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error);
});
