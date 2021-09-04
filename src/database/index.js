const { database } = require("../config")
const { promisify } = require("util")
const mysql = require("mysql")

//CREATING THE POOL OF DATABASE
const pool = mysql.createPool(database)

pool.getConnection((err, connection) => {
    
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST")
            console.error("DATABASE CONNECTION WAS CLOSED")
        
        if (err.code === "ER_CON_COUNT_ERROR")
            console.error("DATABASE HAS TO MANY CONNECTIONS")

        if (err.code === "ECONNREFUSED  ")
            console.error("DATABASE CONNECTION WAS REFUSED")
    }
    else if (connection) {

        connection.release()
        console.log("DATABASE IS CONNECTED")
    }

    return
})

//THIS WORKS TO CAN USE QUERYS WITH ASYNC/AWAIT
pool.query = promisify(pool.query)

//EXPORTING POOL
module.exports = pool



