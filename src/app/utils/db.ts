import sqlite3 from 'sqlite3';
import {promisify} from "util";

const db = new sqlite3.Database('src/database/database.db');
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
