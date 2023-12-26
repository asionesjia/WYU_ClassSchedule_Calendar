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

export default db;
export { dbAllAsync, dbRunAsync }
