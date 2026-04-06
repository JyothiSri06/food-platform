#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <limits>

struct Location {
    std::string id;
    double lat;
    double lon;
    bool visited;
};

// Calculate 2D Euclidean distance
double calculateDistance(const Location* a, const Location* b) {
    double dx = a->lat - b->lat;
    double dy = a->lon - b->lon;
    return std::sqrt(dx * dx + dy * dy);
}

int main(int argc, char* argv[]) {
    // Parse arguments: id lat lon id lat lon ...
    // argc should be 1 + 3 * N
    if ((argc - 1) % 3 != 0) {
        std::cerr << "{\"error\": \"Invalid number of arguments. Expected triples of id, lat, lon.\"}" << std::endl;
        return 1;
    }

    int numLocations = (argc - 1) / 3;
    if (numLocations == 0) {
        std::cout << "{\"optimized_route\": []}" << std::endl;
        return 0;
    }

    std::vector<Location> locations;
    locations.reserve(numLocations);

    for (int i = 1; i < argc; i += 3) {
        Location loc;
        loc.id = argv[i];
        
        try {
            loc.lat = std::stod(argv[i + 1]);
            loc.lon = std::stod(argv[i + 2]);
        } catch (...) {
            std::cerr << "{\"error\": \"Invalid coordinate format for ID: " << loc.id << "\"}" << std::endl;
            return 1;
        }
        
        loc.visited = false;
        locations.push_back(loc);
    }

    std::vector<std::string> route;
    route.reserve(numLocations);

    // Greedy Nearest Neighbor
    // We assume the first location passed is the starting point (e.g., restaurant/hub)
    Location* current = &locations[0];
    current->visited = true;
    route.push_back(current->id);

    int visitedCount = 1;

    while (visitedCount < numLocations) {
        double minDistance = std::numeric_limits<double>::max();
        Location* nextNode = nullptr;

        for (int i = 0; i < numLocations; ++i) {
            if (!locations[i].visited) {
                double dist = calculateDistance(current, &locations[i]);
                if (dist < minDistance) {
                    minDistance = dist;
                    nextNode = &locations[i];
                }
            }
        }

        if (nextNode != nullptr) {
            nextNode->visited = true;
            route.push_back(nextNode->id);
            current = nextNode;
            visitedCount++;
        }
    }

    // Output JSON strictly to stdout
    std::string jsonStr = "{\"optimized_route\": [";
    for (size_t i = 0; i < route.size(); ++i) {
        jsonStr += "\"" + route[i] + "\"";
        if (i < route.size() - 1) {
            jsonStr += ", ";
        }
    }
    jsonStr += "]}";

    std::cout << jsonStr << std::endl;

    return 0;
}
