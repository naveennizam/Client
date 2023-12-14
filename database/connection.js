const { Client } = require('pg')
let clientdb= undefined;
 async function connectToDatabase(){

    if(clientdb)
    return clientdb;
 clientdb = await new Client({
    user: process.env.DB_USER,   
    host: process.env.DB_HOST,
    database: process.env.DB,   
    password: process.env.DB_PWD,
    port: process.env.DB_PORT, 
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
})
clientdb.connect()

return clientdb
}

module.exports = {connectToDatabase}
