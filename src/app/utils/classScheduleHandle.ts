import * as fs from "fs";
import CryptoJS from "crypto-js";

export class Course {
    name: string; // 课程名
    teacher: string; // 任课老师
    classroom: string; // 上课教室
    location: any; // 上课位置
    weekday: number; // 周几上课
    weeks: number[]; // 开课周
    indexes: number[]; // 第几节上该课程

    constructor(name: string, teacher: string, classroom: string, location: any, weekday: number, weeks: number[], indexes: number[]) {
        this.name = name;
        this.teacher = teacher;
        this.classroom = classroom;
        this.location = location;
        this.weekday = weekday;
        this.weeks = weeks;
        this.indexes = indexes;
    }

    title(): string {
        return `${this.name} - ${this.classroom}`;
    }

    description(): string {
        return `任课教师：${this.teacher}`;
    }

    static week(start: number, end: number): number[] {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }

    static odd_week(start: number, end: number): number[] {
        return Array.from({ length: Math.ceil((end - start + 1) / 2) }, (_, index) => start + index * 2 - 1);
    }

    static even_week(start: number, end: number): number[] {
        return Array.from({ length: Math.floor((end - start + 1) / 2) }, (_, index) => start + index * 2);
    }
}

export class School {
    headers: string[]
    footers: string[] = ["END:VCALENDAR"];

    duration: number;
    timetable: Array<Array<number>>;
    start: Date;
    courses: Course[];
    name: string;

    constructor(
        name: string,
        duration: number = 45,
        timetable: Array<Array<number>> = [],
        start: [number, number, number] = [2023, 9, 1],
        courses: Course[] = []
    ) {
        // 断言检查可以在构造函数中进行
        if (!timetable.length) {
            throw new Error("请设置每节课的上课时间，以 24 小时制两元素元组方式输入小时、分钟");
        }
        if (start.length !== 3) {
            throw new Error("请设置为开学第一周的日期，以三元素元组方式输入年、月、日");
        }
        if (!courses.length) {
            throw new Error("请设置你的课表数组");
        }

        this.name = name
        this.duration = duration;
        this.timetable = [[], ...timetable]
        this.start = new Date(start[0], start[1] - 1, start[2]);
        while (this.start.getDay() !== 1) {
            this.start.setDate(this.start.getDate() - 1);
        }
        this.courses = courses;
        this.headers = [
            'BEGIN:VCALENDAR',
            'PRODID:-//asiones.com//WYU Class Schedule 2.0//CN',
            'VERSION:2.0',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            `X-WR-CALNAME:${this.name}`,
            "X-WR-TIMEZONE:Asia/Shanghai",
            'X-WR-CALDESC:武夷学院课程表日历calender.asioens.com',
            "BEGIN:VTIMEZONE",
            "TZID:Asia/Shanghai",
            "END:VTIMEZONE",
        ];
    }

    private time(week: number, weekday: number, index: number, plus: boolean = false): string {
        const date = new Date(this.start.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000 + (weekday - 1) * 24 * 60 * 60 * 1000);
        date.setHours(this.timetable[index][0], this.timetable[index][1], plus ? this.duration * 60 : 0, 0);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份需要加1，且保证两位数格式
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    }

    generate(): string {
        const runtime = new Date();
        const texts: string[] = [];

        for (const course of this.courses) {
            if (!course.location) {
                course.location = [];
            } else if (typeof course.location === "string") {
                course.location = [`LOCATION:${course.location}`];
            } else if (course.location instanceof Geo) {
                course.location = course.location.result();
            }

            if (!Array.isArray(course.location)) {
                throw new Error("课程定位信息类型不正确");
            }
        }
        const genUID = (title: string, week: number, weekday: number, index: number): string => {
            const inputString = `${title}${week}${weekday}${index}`;
            const md5Hash = CryptoJS.MD5(inputString).toString();
            return `UID:${md5Hash}`;
        }
        const items: string[] = this.courses
            .flatMap((course) =>
                course.weeks.flatMap((week) => [
                    "BEGIN:VEVENT",
                    `SUMMARY:${course.title()}`,
                    `DESCRIPTION:${course.description()}`,
                    `DTSTART;TZID=Asia/Shanghai:${this.time(week, course.weekday, course.indexes[0])}`,
                    `DTEND;TZID=Asia/Shanghai:${this.time(week, course.weekday, course.indexes[course.indexes.length - 1], true)}`,
                    `DTSTAMP:${runtime.toISOString().replace(/[:-]/g, "").slice(0, -5)}`,
                    genUID(course.title(),week,course.weekday,course.indexes[0]),
                    "URL;VALUE=URI:",
                    ...course.location,
                    "END:VEVENT",
                ])
            );

        for (const line of this.headers.concat(items, this.footers)) {
            let first = true;
            let remainingLine = line;
            while (remainingLine) {
                texts.push(`${first ? " " : ""}${remainingLine.slice(0, 72)}`);
                remainingLine = remainingLine.slice(72);
                first = false;
            }
        }

        return texts.join("\n");
    }
}

export class Geo {
    readonly loc: string;
    readonly geo: string;

    constructor(name: string, lat: any, lon: any) {
        this.loc = `LOCATION:${name}`;
        this.geo = `GEO:${lat};${lon}`;
    }

    result(): string[] {
        return [this.loc, this.geo];
    }
}

export class AppleMaps {
    private static keys: string[] = ["SUMMARY", "LOCATION", "X-APPLE-STRUCTURED-LOCATION"];
    private locations: { [title: string]: { [key: string]: string } } = {};

    constructor(calendar: string) {
        const c = fs.readFileSync(calendar, 'utf-8');
        for (const i of c.match(/(?<=BEGIN:VEVENT)[\s\S]*?(?=END:VEVENT)/g) || []) {
            this.generate(i);
        }
    }

    private generate(event: string): void {
        const lines = event.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (!lines[i].startsWith(" ")) continue;
            let d = i - 1;
            while (!lines[d]) {
                d -= 1;
            }
            lines[d] += lines[i].trimStart();
            lines[i] = "";
        }

        const data: { [key: string]: string } = {};
        for (const k of AppleMaps.keys) {
            const match = lines.find((line) => line.startsWith(k));
            data[k] = match ? match.substring(k.length + 1).trimStart() : "";
        }

        if (!Object.values(data).every(value => value !== "")) {
            return;
        }

        const title = data["SUMMARY"].replace("SUMMARY:", "").trim();
        const geoMatch = data["X-APPLE-STRUCTURED-LOCATION"].match(/geo:([\d.]+),([\d.]+)/);
        if (geoMatch) {
            const [_, lat, lon] = geoMatch;
            data["GEO"] = new Geo(title, lat, lon).geo;
        }

        this.locations[title] = data;
    }

    getItem(key: string): string[] | null {
        if (!(key in this.locations)) {
            // throw new Error(`没有找到 ${key} 的 Apple Maps 信息`);
            console.log(`没有找到 ${key} 的 Apple Maps 信息`);
            return null
        }

        return Object.values(this.locations[key]);
    }
}
