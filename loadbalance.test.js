const findLeastLoadedServer = require('./loadBalance'); 
async function testFindLeastLoadedServer() {
    try {
        const leastLoadedServer = await findLeastLoadedServer('./serverData.json');
        console.log('Least loaded server:', leastLoadedServer);
    } catch (error) {
        console.error('Error finding least loaded server:', error);
    }
}

// Call the test function
testFindLeastLoadedServer();
