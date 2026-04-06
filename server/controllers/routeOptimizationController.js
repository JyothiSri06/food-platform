const { execFile } = require('child_process');
const path = require('path');
const os = require('os');
const pool = require('../config/db');

// Controller to run route optimization
exports.optimizeRoute = async (req, res) => {
    try {
        const { locations } = req.body;

        // Optionally, if locations are purely passed from DB mock them if empty
        let targetLocations = locations;

        // If no locations provided in the request, let's fetch pending orders as an example
        if (!targetLocations || targetLocations.length === 0) {
            // Note: Since we don't have lat/lon in standard order tables or user address typically 
            // has only text, we fallback to dummy coordinates for demonstration if not given.
            // Example coordinates around a central hub
            targetLocations = [
                { id: 'hub', lat: 17.3850, lon: 78.4867 },
                { id: 'order_1', lat: 17.3950, lon: 78.4967 },
                { id: 'order_2', lat: 17.3750, lon: 78.4767 },
                { id: 'order_3', lat: 17.4050, lon: 78.4667 }
            ];
        }

        if (targetLocations.length < 2) {
            return res.json({ optimized_route: targetLocations.map(l => l.id) });
        }

        // Prepare arguments for the C++ binary: id1 lat1 lon1 id2 lat2 lon2 ...
        const args = [];
        for (const loc of targetLocations) {
            args.push(loc.id.toString());
            args.push(loc.lat.toString());
            args.push(loc.lon.toString());
        }

        // Path to the compiled C++ binary
        const binaryName = os.platform() === 'win32' ? 'optimizer.exe' : 'optimizer';
        const binaryPath = path.resolve(__dirname, '..', 'cpp_engine', binaryName);

        execFile(binaryPath, args, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing C++ Optimizer: ${error.message}`);
                console.error(`stderr: ${stderr}`);
                return res.status(500).json({ success: false, message: 'Route optimization algorithm failed', error: stderr.trim() });
            }

            try {
                // The C++ engine strictly outputs the JSON result to stdout
                const result = JSON.parse(stdout);
                return res.status(200).json({ success: true, data: result });
            } catch (parseError) {
                console.error('Failed to parse optimizer output:', stdout);
                return res.status(500).json({ success: false, message: 'Invalid output from optimization engine' });
            }
        });
    } catch (error) {
        console.error('Route optimization controller error:', error);
        res.status(500).json({ success: false, message: 'Server error during optimization' });
    }
};
