export function stringToChineseDate(isoString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const dateObject = new Date(isoString);
    return dateObject.toLocaleDateString('zh-CN', options);
}
