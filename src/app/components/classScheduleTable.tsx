import React from "react";


interface ClassScheduleTableProps {
    document: Document | undefined
}
export const ClassScheduleTable: React.FC<ClassScheduleTableProps> = ({document}) => {

    return (
        <div dangerouslySetInnerHTML={{__html: document?.documentElement.outerHTML || ''}}/>
    )
}
