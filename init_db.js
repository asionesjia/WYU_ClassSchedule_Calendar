var sqlite3 = require('sqlite3');
console.log('正在初始化数据库...')
let db= new sqlite3.Database('public/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('正在创建数据库...')
        createDatabase();
        return;
    } else if (err) {
        console.log("Getting error " + err);
        exit(1);
    }
    console.log('数据库初始化成功！')
});

function createDatabase() {
    let newdb = new sqlite3.Database('public/database/database.db', (err) => {
        if (err) {
            console.log(err.message);
            exit(1);
        }
        console.log('成功创建数据库，正在创建数据表...')
        createTables(newdb);
    });
}

function createTables(newdb) {
    newdb.exec(`
            CREATE TABLE IF NOT EXISTS class_schedules (
                uuid TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                createAt TEXT NOT NULL,
                description TEXT,
                stringTable TEXT
            )`, (err)  => {
        if(err) {
            console.log('创建数据表失败：', err)
            exit(1);
        }
        console.log('成功创建数据表，正在关闭连接...')
        newdb.close((err) => {
            if (err) {
                console.error("数据库关闭发生错误：" + err);
            }
            console.log('成功关闭数据库。')
        })
    });
}
