const myExpress = require("./myexpress");

const myApp = myExpress();

myApp.get("/", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from my custom Express server!');
})

myApp.listen(3000, () => {
    console.log("app is running on the port: ", 3000);
    
})


// const express = require('./myexpress'); // Apni file ka path do
// const app = express();
// const PORT = 3000;

// app.get('/', (req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello from my custom Express server!');
// });

// app.get('/about', (req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('This is the about page.');
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });