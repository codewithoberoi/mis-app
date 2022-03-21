const Client = require('ssh2-sftp-client');
const fs = require('fs');
const Config = require('./config.json')

const sftpConfig = {
    host: Config.hostip,
    port: Config.port,
    username: Config.username,
    privateKey: fs.readFileSync('./id_rsa')
  };

let sftp = new Client;

sftp.connect(sftpConfig).then(() => {
    //Check whether destination path exists or not. this will return true if path exists.
    return sftp.exists(Config.destinationPath)
}).then((data) => {
    //Put file if path exists
    if (data === true || data === 'd') {
        let sourceFile = fs.createReadStream(Config.fileName)
        let destinationFile = `${Config.destinationPath}/${Config.fileName}`
        console.log(`Going to upload file...`);
        return sftp.put(sourceFile, destinationFile);
    } else {
        console.log(`${Config.destinationPath} does not exists.`)
        //Send mail that destination path does not exists.
    }
}).then(() => {
    console.log(`Going to close the sftp connection.`)
    sftp.end();
    //Send mail for completion
}).catch((err) => {
    console.error(err.message);
})