declare module 'generate-github-markdown-css' {
    export default function getCSS({ light: string = 'light', dark: string = 'dark', list: boolean = false, preserveVariables: boolean = false, onlyVariables: boolean = false, onlyStyles: boolean = false, rootSelector: string = '.markdown-body' }): string;
}
