import {TableData} from "@/app/utils/tableElementToJson";
import {Course} from "@/app/utils/classScheduleHandle";
import {wyu} from "@/app/utils/classScheduleInit";

export const jsonClassScheduleToCourseObj = (tableData: TableData) => {
    const course: Course[] = []
    for(let r = 0; r < tableData.rows.length; r++) {
        const row = tableData.rows[r]
        if(!row.cells.length) continue;
        for(let c = 0; c < row.cells.length; c++) {
            const cell = row.cells[c]
            if(!cell.content.length) continue;
            for(let i = 0; i < cell.content.length; i++) {
                const currentCourse = cell.content[i]
                if(!currentCourse.length) continue;
                const name = currentCourse[0]
                const teacher = currentCourse[1]
                const classroom = currentCourse[3]
                const location = null
                const weekday = c + 1
                const weeksFunc = () => {
                    const a = currentCourse[2].replace(/[()]/g, '').split(',')
                    const d = {
                        default: [] as string[][],
                        '周': [] as number[],
                        '单周': [] as number[],
                        '双周': [] as number[],
                    } // 周，单周，双周
                    const b = a.map((value) => {
                        const c = value.match(/周|单周|双周/g)
                        const e = value.replace(/周|单周|双周/g, '').split('-')
                        if(!c?.[0]) {
                            d.default.push(e)
                        }else {
                            switch (c[0]) {
                                case '周':
                                    d['周'].push(...Course.week(Number(e[0]),Number(e[1])))
                                    break;
                                case '单周':
                                    d['单周'].push(...Course.odd_week(Number(e[0]),Number(e[1])))
                                    break;
                                case '双周':
                                    d['单周'].push(...Course.even_week(Number(e[0]),Number(e[1])))
                                    break;
                            }
                        }
                    })
                    if(!d.default.length) return [...d['周'], ...d['单周'], ...d['双周']]
                    switch (false) {
                        case !d['周'].length:
                            d['default'].map((f) => {
                                d['周'].push(...Course.week(Number(f[0]),Number(f[1])))
                            })
                            break;
                        case !d['单周'].length:
                            d['default'].map((f) => {
                                d['单周'].push(...Course.week(Number(f[0]),Number(f[1])))
                            })
                            break;
                        case !d['双周'].length:
                            d['default'].map((f) => {
                                d['双周'].push(...Course.week(Number(f[0]),Number(f[1])))
                            })
                            break;
                    }
                    return [...d['周'], ...d['单周'], ...d['双周']]
                }
                const weeks = weeksFunc()
                const index = () => {
                    const g = [[1,2],[3,4],[5,6],[7,8],[9,10]]
                    return g[r]
                }
                if(!weeks) continue;
                course.push(new Course(
                    name,
                    teacher,
                    classroom,
                    location,
                    weekday,
                    weeks,
                    index()
                ))
            }
        }
    }
    return course
}
