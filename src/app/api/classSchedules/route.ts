import {v4 as uuidv4} from 'uuid';
import {dbAllAsync, dbRunAsync, getDataByUuid} from '@/app/utils/db';
import {NextRequest, NextResponse} from "next/server";
import {School} from "@/app/utils/classScheduleHandle";
import {jsonClassScheduleToCourseObj} from "@/app/utils/jsonClassScheduleToCourseObj";
import {tableToJson} from "@/app/utils/tableElementToJson";
import jsdom from "jsdom";
import {ClassScheduleMetadata} from "@/app/page";
import {mongodb} from "@/app/utils/mongodb";

const { JSDOM } = jsdom;


const uuidRegex = /^[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}$/;
function isUUID(str: string) {
    return uuidRegex.test(str);
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const uuid = searchParams.get('uuid')
    const db = await mongodb()
    if(uuid && isUUID(uuid)) {
        const dbClassScheduleMetadata = await db.findOne({uuid: uuid}) as ClassScheduleMetadata
        if(dbClassScheduleMetadata) {
            const classScheduleMetadata = dbClassScheduleMetadata
            const courses = () => {
                const { window } = new JSDOM();
                const document = window.document;
                const container = document.createElement('div');
                container.innerHTML = classScheduleMetadata.stringTable || '';
                return jsonClassScheduleToCourseObj(tableToJson(container.firstChild as HTMLTableElement))
            }
            const school = new School(
                classScheduleMetadata.name || '班级课表',
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
            const normalizeLineEndings = (str: string, desiredLineEnding: any) => {
                // Replace all occurrences of existing line endings with the desired one
                return str.replace(/\r\n|\r|\n/g, desiredLineEnding);
            }
            return new Response(normalizeLineEndings(school.generate().replace(/[^\S\n]+/g, ''), '\r\n'), {
                headers: {
                    'Content-Type': 'text/calendar',
                    'Content-Disposition': `attachment; filename="${classScheduleMetadata.name}.ics"`
                }
            })
        }
    } else {
        if(uuid && !isUUID(uuid)) {
            return NextResponse.json({ err: {error: '非法请求！'} }, { status: 500 });
        }
        try {
            const rows = await db.find({}).toArray() as ClassScheduleMetadata[];
            return NextResponse.json({ data: rows }, { status: 200 });
        } catch (err) {
            return NextResponse.json({ data: err }, { status: 200 });
        }
    }
}
export async function POST(req: NextRequest) {
    const data = await req.json();
    const { name, description, stringTable } = data;
    const createAt = new Date();
    const uuid = uuidv4();

    try {
        const db = await mongodb()
        await db.insertOne({
            uuid: uuid,
            name: name,
            description: description,
            createAt: createAt
        })
        return NextResponse.json({ data: { name, description, uuid, stringTable, createAt } }, { status: 200 });
    } catch (err: any) {
        console.error('处理错误:', err);
        return NextResponse.json({ error: err.message}, { status: 500 });
    }
}
