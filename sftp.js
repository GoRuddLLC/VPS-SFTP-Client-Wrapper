const fs = require('fs');
const { Client } = require('ssh2');
const findLeastLoadedServer = require("./loadBalance");

async function uploadZipFile(localFilePath, remoteFilePath, serverDataFilePath) {
    try {
        const leastLoadedServer = await findLeastLoadedServer(serverDataFilePath);
        const conn = new Client();
        
        conn.on('ready', () => {
            conn.sftp((err, sftp) => {
                if (err) throw err;
                
                const readStream = fs.createReadStream(localFilePath);
                const writeStream = sftp.createWriteStream(remoteFilePath);

                readStream.pipe(writeStream);

                writeStream.on('close', () => {
                    console.log(`File uploaded successfully to ${leastLoadedServer.server_name}: ${remoteFilePath}`);
                    conn.end();
                });

                writeStream.on('error', (error) => {
                    console.error(`Error uploading file to ${leastLoadedServer.server_name}: ${error}`);
                    conn.end();
                });
            });
        }).connect({
            host: leastLoadedServer.host,
            username: leastLoadedServer.creds.user,
            privateKey: fs.readFileSync(leastLoadedServer.creds.privateKey)
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = uploadZipFile;
