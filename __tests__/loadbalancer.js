const findLeastLoadedServer = require("../loadbalancer");

(async () => {
    try {
        const leastLoadedServer = await findLeastLoadedServer();
        console.log('Least loaded server:', leastLoadedServer);
    } catch (error) {
        console.error('Error:', error);
    }
})();
