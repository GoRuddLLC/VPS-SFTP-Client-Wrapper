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

async function getCPUUsage(server) {
    return new Promise((resolve, reject) => {
        executeCommand(server, 'top -bn1 | grep "Cpu(s)"', cpuOutput => {
            const cpuUsage = cpuOutput.match(/(\d+\.\d+)%? id/);
            const cpuUsagePercentage = cpuUsage ? 100 - parseFloat(cpuUsage[1]) : Infinity;
            resolve(cpuUsagePercentage);
        });
    });
}

async function findLeastLoadedServer() {
    let leastLoadedServer = null;
    let minCPU = Infinity;
    
    for (const server of servers) {
        const cpuUsage = await getCPUUsage(server);
        if (cpuUsage < minCPU) {
            minCPU = cpuUsage;
            leastLoadedServer = server;
        }
    }
    
    return leastLoadedServer;
}



module.exports = findLeastLoadedServer