const { Client } = require('ssh2');
const fs = require('fs');

const servers = require('./serverData.json');

function executeCommand(server, command, callback) {
    const conn = new Client();
    conn.on('ready', () => {
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            let output = '';
            stream.on('data', data => {
                output += data.toString();
            });
            stream.on('close', () => {
                conn.end();
                callback(output.trim());
            });
        });
    }).connect({
        host: server.host,
        username: server.creds.user,
        privateKey: fs.readFileSync(server.creds.privateKey)
    });
}

function fetchStats(server) {
    return new Promise((resolve, reject) => {
        executeCommand(server, 'free -m', memoryOutput => {
            executeCommand(server, 'df -h', diskOutput => {
                executeCommand(server, 'top -bn1 | grep "Cpu(s)"', cpuOutput => {
                    const memoryStats = memoryOutput.split(/\s+/);
                    const diskStats = diskOutput.split('\n')[1].split(/\s+/);
                    const cpuUsage = cpuOutput.match(/(\d+\.\d+)%? id/);
                    const cpuUsagePercentage = cpuUsage ? (100 - parseFloat(cpuUsage[1])).toFixed(2) + '%' : 'N/A';

                    const serverStats = {
                        memoryTotal: memoryStats[7],
                        memoryUsed: memoryStats[8],
                        memoryFree: memoryStats[9],
                        diskTotal: diskStats[1],
                        diskUsed: diskStats[2],
                        diskAvailable: diskStats[3],
                        cpuUsage: cpuUsagePercentage
                    };

                    resolve(serverStats);
                });
            });
        });
    });
}

async function generateStatsTable() {
    console.log('Server Statistics:');
    for (const server of servers) {
        const stats = await fetchStats(server);
        console.log(`Statistics for ${server.server_name}:`);
        console.table([stats]);
        console.log('\n-----------------------------\n');
    }
}

async function getStatsByIndex(index) {
    if (index < 0 || index >= servers.length) {
        throw new Error('Invalid index');
    }

    const server = servers[index];
    const stats = await fetchStats(server);
    return stats;
}

module.exports = {
    generateStatsTable,
    getStatsByIndex
};
