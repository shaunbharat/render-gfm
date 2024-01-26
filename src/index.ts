import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { Writer } from 'steno';
import { Octokit } from 'octokit';
import getCSS from 'generate-github-markdown-css';

const octokit = new Octokit();

/**
 * The theme(s) to use when rendering the Markdown.
 */
export enum Theme {
    Auto = 'auto',
    Light = 'light',
    Dark = 'dark',
    DarkDimmed = 'dark_dimmed',
    DarkHighContrast = 'dark_high_contrast',
    LightColorblind = 'light_colorblind',
    DarkColorblind = 'dark_colorblind'
}

/**
 * A dictionary of functions that return CSS for each theme.
 * Auto means that if the user's system is set to dark mode, the dark theme will be used, otherwise the light theme will be used.
 * Light means that the light theme will be used, no matter what the user's system asks for (light mode or dark mode).
 * Dark, dark_dimmed, dark_high_contrast, light_colorblind, and dark_colorblind are the same thing as light (single mode, the specific theme will be used in both cases, like the user's system requesting light mode or dark mode).
 * 
 * If you want a different combination (e.g. when the user's system/browser requests light mode, serve light_colorblind, but when the user's system/browser requests dark mode, serve dark), you can use the `getCSS` function from the `generate-github-markdown-css` package.
 * The `getCSS` function is also exported from this package for convenience.
*/
const themeToCSS = {
    auto: () => getCSS({ light: 'light', dark: 'dark' }),
    light: () => getCSS({ light: 'light', dark: 'light' }),
    dark: () => getCSS({ light: 'dark', dark: 'dark' }),
    dark_dimmed: () => getCSS({ light: 'dark_dimmed', dark: 'dark_dimmed' }),
    dark_high_contrast: () => getCSS({ light: 'dark_high_contrast', dark: 'dark_high_contrast' }),
    light_colorblind: () => getCSS({ light: 'light_colorblind', dark: 'light_colorblind' }),
    dark_colorblind: () => getCSS({ light: 'dark_colorblind', dark: 'dark_colorblind' })
};
export { getCSS };

/**
 * Writes a file with string data to the filesystem.
 * If the file does not exist, it will be created.
 * @param {string} file The file path to write to. Absolute or relative.
 * @param {string} content The string data to write to the file.
 */
async function write(file: string, content: string) {
    const fileWriter = new Writer(file);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await fileWriter.write(await content); // "await content" is needed, despite VSCode's warning. String content might be a promise, and we need to wait for it to resolve.
}

/**
 * Generates and returns CSS for each requested theme in the `themes` array, as an object
 * @param {string} outputDir The directory to write the CSS files to. If unspecified, the CSS will still be returned in an object, but not written to the filesystem.
 * @param {Theme[]} themes An array of the themes to generate CSS for. Defaults to all themes.
 * @returns {Promise<Record<string, string>>} An object containing the CSS for each theme.
 */
export async function generateCSS(outputDir: string, themes: Theme[] = [Theme.Auto, Theme.Light, Theme.Dark, Theme.DarkDimmed, Theme.DarkHighContrast, Theme.LightColorblind, Theme.DarkColorblind]): Promise<Record<string, string>> {
    let stylesheets: Record<string, string> = {};
    for (const theme of themes) {
        stylesheets[theme] = themeToCSS[theme]();
    }
    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
        for (const [name, stylesheet] of Object.entries(stylesheets)) {
            await write(path.join(outputDir, `${name}.css`), stylesheet);
        }
    }
    return stylesheets;
}

/**
 * Renders Markdown to HTML. If `outputFile` is specified, the HTML will be written to the filesystem.
 * The resulting HTML rendered will be wrapped in a default template, unless `includeDefaultTemplate` is set to false.
 * This is useful for when you want to use your own HTML template.
 * @param {string} markdown The Markdown to render.
 * @param {string} outputFile The file to write the rendered HTML to. If unspecified, the HTML will still be returned, but not written to the filesystem.
 * @param {boolean} includeDefaultTemplate Whether or not to include the default HTML template. Default: true. If false, the rendered Markdown will not be wrapped in a template.
 * @returns {Promise<string>} The rendered HTML.
 */
export default async function render(markdown: string, outputFile: string, includeDefaultTemplate: boolean = true): Promise<string> {
    const request = await octokit.request('POST /markdown', { text: markdown.toString(), mode: 'gfm' });

    let renderedMarkdown = request.data;
    if (includeDefaultTemplate) {
        // #main adds spacing so it's not right up against the edge of the screen. The margin/padding values are GitHub's defaults when rendering Markdown using GitHub Pages.
        // Good max widths: '75em' or '100em' (1012px is GitHub Page's default)
        renderedMarkdown = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>GitHub Markdown</title>
        <link id="theme" rel="stylesheet" href="css/auto.css">

        <style>
            #main {
                margin-top: 32px !important;
                margin-bottom: 32px !important;
                padding-left: 16px !important;
                padding-right: 16px !important;

                padding-top: 0 !important;
                padding-bottom: 0 !important;
            }
        </style>
    </head>

    <body class="markdown-body">

        <article id="main" class="markdown-body" style="padding: 1em; max-width: 1012px; margin: 0px auto;">

            ${request.data}

        </article>

        <select style="position: fixed; top: 1em; right: 1em; font-size: 16px; border-radius: 10px; padding: 5px;" onchange="theme.href=this.value">
            <option value="css/auto.css">auto</option>
            <option value="css/light.css">light</option>
            <option value="css/dark_dimmed.css">dark dimmed</option>
            <option value="css/dark.css">dark</option>
            <option value="css/dark_high_contrast.css">dark high contrast</option>
            <option value="css/dark_colorblind.css">dark colorblind</option>
            <option value="css/light_colorblind.css">light colorblind</option>
        </select>
    </body>
</html>
`;
    }

    const render = await prettier.format(renderedMarkdown, { parser: 'html', singleAttributePerLine: false, tabWidth: 4 });

    if (outputFile) {
        await write(outputFile, render);
    }

    return render;
}
