interface TableCell {
    content: string[][];
}

interface TableRow {
    cells: TableCell[];
}

export interface TableData {
    rows: TableRow[];
}

export const tableToJson = (tableElement: HTMLTableElement): TableData => {
    const tableData: TableData = { rows: [] };

    // 遍历表格的行
    for (let i = 0; i < tableElement.rows.length; i++) {
        if(i < 2) continue;
        const row = tableElement.rows[i];
        const tableRow: TableRow = { cells: [] };

        // 遍历行中的单元格
        for (let j = 0; j < row.cells.length; j++) {
            if(j < 1) continue
            const cell = row.cells[j];
            const cellContent = cell.getElementsByTagName('div');
            if(!cellContent) continue;
            let cellArrayContent = []
            for(let c = 0; c < cellContent.length; c++) {
                const htmlContent = cellContent[c].innerHTML.split(/<br>|\n/).filter(item => item !== '')
                cellArrayContent.push(htmlContent)
            }
            tableRow.cells.push({content: cellArrayContent})
            console.log(cellContent)
        }

        // 将行添加到表格数据中
        tableData.rows.push(tableRow);
    }

    return tableData;
};
