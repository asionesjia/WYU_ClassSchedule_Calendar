import {v4 as uuidv4} from 'uuid';
import {dbAllAsync, dbRunAsync} from '@/app/utils/db';
import {NextRequest, NextResponse} from "next/server";
import {School} from "@/app/utils/classScheduleHandle";
import * as fs from "fs";
import {jsonClassScheduleToCourseObj} from "@/app/utils/jsonClassScheduleToCourseObj";
import {tableToJson} from "@/app/utils/tableElementToJson";
import jsdom from "jsdom";

const { JSDOM } = jsdom;

const path = require('path');
const icsPath = path.resolve('public/ics');

export async function GET() {
    try {
        const rows = await dbAllAsync('SELECT * FROM class_schedules');
        return NextResponse.json({ data: rows }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ data: err }, { status: 200 });
    }
}
export async function POST(req: NextRequest) {
    const data = await req.json();
    console.log(data)
    const { name, description, stringTable } = data;
    const courses = () => {
        const { window } = new JSDOM();
        const document = window.document;
        const container = document.createElement('div');
        container.innerHTML = stringTable;
        console.log(stringTable)
        return jsonClassScheduleToCourseObj(tableToJson(container.firstChild as HTMLTableElement))
    }
    const createAt = new Date();
    const uuid = uuidv4();
    const school = new School(
            name,
        45,
        [
            [8, 0],
            [8, 55],
            [10, 0],
            [10, 55],
            [14, 30],
            [15, 25],
            [16, 30],
            [17, 25],
            [19, 0],
            [19, 55],
            [21, 0],
            [21, 55]
        ],
        [2023,9,4],
        courses()
    )

    const filePath = `${icsPath}/${uuid}.ics`;
    function normalizeLineEndings(str: string, desiredLineEnding: any) {
        // Replace all occurrences of existing line endings with the desired one
        return str.replace(/\r\n|\r|\n/g, desiredLineEnding);
    }
    const checkFileExistence = (filePath: fs.PathLike) => {
        return new Promise((resolve) => {
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // 文件不存在
                    resolve(false);
                } else {
                    // 文件存在
                    resolve(true);
                }
            });
        });
    };

// 将字符串写入文件

    try {
        const fileExists = await checkFileExistence(filePath);

        if (!fileExists) {
            // 文件不存在，创建并写入内容
            await fs.promises.writeFile(filePath, normalizeLineEndings(school.generate().replace(/[^\S\n]+/g, ''), '\r\n'), {
                encoding: 'utf-8',
                flag: 'w',
            });
            console.log('文件已经成功创建并写入。');
        } else {
            // 文件已存在，抛出错误
            console.error('文件已经存在，请不要非法操作。');
            throw new Error('文件已经存在，请不要非法操作。');
        }

        // 其他操作，例如数据库插入等
        await dbRunAsync('INSERT INTO class_schedules (uuid, name, createAt, description, stringTable) VALUES (?, ?, ?, ?, ?)', [
            uuid,
            name,
            createAt.toISOString(),
            description,
            stringTable,
        ]);

        return NextResponse.json({ data: { name, description, uuid, stringTable, createAt } }, { status: 200 });
    } catch (err: any) {
        console.error('处理错误:', err);
        return NextResponse.json({ error: err.message}, { status: 500 });
    }
}
