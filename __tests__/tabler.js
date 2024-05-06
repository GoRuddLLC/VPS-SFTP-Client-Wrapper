const { generateStatsTable, getStatsByIndex } = require('../serverTable');

// To generate the table of stats for all servers
generateStatsTable();

// To fetch stats for an individual server by index
const serverIndex = 0; // Example index
getStatsByIndex(serverIndex)
    .then(stats => {
        console.log('Stats for server at index', serverIndex, ':', stats);
    })
    .catch(error => {
        console.error('Error:', error);
    });
