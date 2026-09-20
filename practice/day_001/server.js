// 1. Creating a server with Node.js
/*
const http = require('http');   

const server = http.createServer((req, res) => {
    console.log("Incoming request aaya hai");
    switch(req.method) {
        case 'GET':
            {
                if (req.url === '/') return res.end('Home page');
                if (req.url === '/about') return res.end('About page');
                if (req.url === '/contact') return res.end('Contact page');
            }
            break;
        case 'POST':
            {

            }
            break;
    }
    res.end('Ye log ji response hai');
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
*/


/*
// 2. How express.js improves the node.js server creation process
const http = require('http');   
const express = require('express');

// yaha pe ye express ne hamara halderFunction ko handle kar liya ye bolta hai ki handlerFunction create karne ki zarurat nahi hai tum mujhe use karlo mai khud handle kar lunga
const handlerFunctionV2 = express();

// yaha pe bhi express ne ye bol diya ki tum mujhe use karlo taki tumhe conditional statements likhne ki zarurat na pade mai khud handle kar lunga

handlerFunctionV2.get('/', (req, res) => res.send('Home page'));
handlerFunctionV2.get('/about', (req, res) => res.send('About page'));
handlerFunctionV2.get('/contact', (req, res) => res.send('Contact page'));

// remove this function because express is handling the requests now
function handlerFunction (req, res) {
    console.log("Incoming request aaya hai");
    switch(req.method) {
        case 'GET':
            {
                if (req.url === '/') return res.end('Home page');
                if (req.url === '/about') return res.end('About page');
                if (req.url === '/contact') return res.end('Contact page');
            }
            break;
        case 'POST':
            {

            }
            break;
    }
    res.end('Ye log ji response hai');
}

// remove this server because express is handling this now
//const server2 = http.createServer(handlerFunctionV2);

// remove this line because express is creating the server and listening on the port now
// server2.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

handlerFunctionV2.listen(3000, () => {
    console.log("Server is running on port 3000");
});
*/


/*
// 3 Now i am changing a hadlerFuntion name to app because express is handling the requests now 
const http = require('http');
const express = require('express');

// yaha pe ye express ne hamara halderFunction ko handle kar liya ye bolta hai ki handlerFunction create karne ki zarurat nahi hai tum mujhe use karlo mai khud handle kar lunga
const app = express();

// yaha pe bhi express ne ye bol diya ki tum mujhe use karlo taki tumhe conditional statements likhne ki zarurat na pade mai khud handle kar lunga
app.get('/', (req, res) => res.send('Home page'));
app.get('/about', (req, res) => res.send('About page'));
app.get('/contact', (req, res) => res.send('Contact page'));

// remove this function because express is handling the requests now
function handlerFunction(req, res) {
    console.log("Incoming request aaya hai");
    switch (req.method) {
        case 'GET':
            {
                if (req.url === '/') return res.end('Home page');
                if (req.url === '/about') return res.end('About page');
                if (req.url === '/contact') return res.end('Contact page');
            }
            break;
        case 'POST':
            {

            }
            break;
    }
    res.end('Ye log ji response hai');
}

// remove this server because express is handling the requests now
//const server2 = http.createServer(app);

// remove this line because express is creating the server and listening on the port now
// server2.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

*/



const { log } = require("console");
const http = require("http");
const server = http.createServer((req, res) => {
    console.log(req.method, req.url);
    
})

server.listen(3000);


const myExpress = require("./myExpress");

const myApp = myExpress();

myApp.get("/", (req, res) => {res.send("hello")});

myApp.listen(3000, () => {
    console.log("app is running on the port", 3000);
})