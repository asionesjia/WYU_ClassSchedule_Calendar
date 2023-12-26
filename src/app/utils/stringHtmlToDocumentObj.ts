export const stringHtmlToDocumentObj = (htmlString: string) => {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html');
};
