const { generateStatsTable, getStatsByIndex } = require('./serverTable'); // Replace 'yourModule' with the actual path to your module
async function testGenerateStatsTable() {
    try {
        await generateStatsTable('./serverData.json');
    } catch (error) {
        console.error('Error generating stats table:', error);
    }
}

async function testGetStatsByIndex() {
    try {
        const index = 0; // Replace with the index of the server you want to get stats for
        const stats = await getStatsByIndex('./serverData.json', index);
        console.log('Statistics for server at index', index, ':', stats);
    } catch (error) {
        console.error('Error getting stats by index:', error);
    }
}

// Call the test functions
testGenerateStatsTable();
testGetStatsByIndex();
