import sqlite3 from 'sqlite3';
import {promisify} from "util";

const path = require('path');
const dbPath = path.resolve('public/database/database.db');
const db = new sqlite3.Database(dbPath);
const dbAllAsync = promisify(db.all.bind(db))
const dbRunAsync  = (sql: string, params: any[]) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this);
        });
    });
};

const getDataByUuid = async (uuid: string) => {
    try {
        // SQL query to select data based on uuid
        const sql: string = `SELECT * FROM class_schedules WHERE uuid = '${uuid}'`;

        // Execute the query with the provided uuid
        return await dbAllAsync(sql);
    } catch (error) {
        // Handle any errors that might occur during the database query
        console.error('Error retrieving data by uuid:', error);
        throw error;
    }
};

export default db;
export { dbAllAsync, dbRunAsync, getDataByUuid }
