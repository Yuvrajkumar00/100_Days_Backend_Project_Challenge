const http = require("http");


function createApplication() {
    const routes = [];

    const myExpress = function (req, res) {
        const { url, method } = req;

        const mathchRoute = routes.find(
            route => route.path === url && route.method === method
        )
        console.log("mathchRoute", mathchRoute);

        if (mathchRoute) {
            return mathchRoute.handler(req, res);
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("404 Nof Found");
    }

    myExpress.get = function (path, callbackFun) {
        routes.push({ path, method: 'GET', handler: callbackFun });
    }

    myExpress.post = function (path, callbackFun) {
        routes.push({ path, method: 'POST', handler: callbackFun });
    }

    myExpress.listen = function (port, callbackFun) {
        const server = http.createServer(myExpress);
        server.listen(port, callbackFun);
    }

    return myExpress;
}

module.exports = createApplication;