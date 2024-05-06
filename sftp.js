const fs = require('fs');
const { Client } = require('ssh2');
const findLeastLoadedServer = require("./loadbalancer");

async function uploadZipFile(localFilePath, remoteFilePath) {
    try {
        const leastLoadedServer = await findLeastLoadedServer();
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

// Usage example
const localFilePath = 'D:\\GoRudd\\git\\VPS-SFTP-Client-Wrapper\\__tests__\\test2.zip';
const remoteFilePath = '/home/admin/SFTP/file.zip';

uploadZipFile(localFilePath, remoteFilePath);
