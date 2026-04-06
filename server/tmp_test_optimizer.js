const routeOptimizationController = require('./controllers/routeOptimizationController');

const req = {
    body: {
        locations: [
            { id: 'hub_restaurant', lat: 17.3850, lon: 78.4867 },       // Origin
            { id: 'customer_far', lat: 17.4350, lon: 78.5267 },         // Far
            { id: 'customer_mid', lat: 17.4050, lon: 78.5067 },         // Mid
            { id: 'customer_close', lat: 17.3900, lon: 78.4900 }        // Close
        ]
    }
};

const res = {
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        console.log(`Status: ${this.statusCode}`);
        console.log('Response JSON:', JSON.stringify(data, null, 2));
    }
};

console.log("Testing Route Optimization C++ Engine Engine...");
routeOptimizationController.optimizeRoute(req, res);
