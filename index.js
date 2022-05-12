import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { Octokit } from 'octokit';
const octokit = new Octokit();
import { Writer } from 'steno';
import getCSS from 'generate-github-markdown-css';

async function write(file, content) {

    const fileWriter = new Writer(file);
    await fileWriter.write(content);

}

// Returns rendered Markdown, GitHub Flavoured with syntax highlighting by default.
async function returnRenderedMarkdown({file, mode = 'gfm'}) {

    file = path.resolve(file);

    const markdown = fs.readFileSync(file, 'utf8', (err, data) => {
        if (err) {
            return console.error(err);
        }
    });

    const request = await octokit.request('POST /markdown', { text: markdown.toString(), mode: mode });

    // The id "marginstyle was added, to override margins from the stylesheets"
    // The styling set in the "style" block is GitHub's defaults when rendering Markdown onto GitHub Pages
    // <article id="marginstyle" class="markdown-body" style="padding: 1em; max-width: 1012px; margin: 0px auto;"> <!-- Change 'max-width' to the size you want: '75em' or '100em' is too (1012px is GitHub's default width when rendering Markdown for GitHub Pages) -->
    // <link id="theme" rel="stylesheet" href="auto.css"> <!-- Set the default to whatever theme you want, auto.css is recommended -->
    const html = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>GitHub Markdown</title>
        <link id="theme" rel="stylesheet" href="auto.css">

        <style>
            #marginstyle {
                margin-top: 32px !important;
                margin-bottom: 32px !important;
                padding: 0 !important;
            }
        </style>
    </head>

    <body class="markdown-body">

        <article id="marginstyle" class="markdown-body" style="padding: 1em; max-width: 1012px; margin: 0px auto;">

            ${request.data}

        </article>

        <select style="position: fixed; top: 1em; right: 1em; font-size: 16px; border-radius: 10px; padding: 5px;" onchange="theme.href=this.value">
            <option value="auto.css">auto</option>
            <option value="light.css">light</option>
            <option value="dark_dimmed.css">dark dimmed</option>
            <option value="dark.css">dark</option>
            <option value="dark_high_contrast.css">dark high contrast</option>
            <option value="dark_colorblind.css">dark colorblind</option>
            <option value="light_colorblind.css">light colorblind</option>
        </select>
    </body>
    
`;
    return prettier.format(html, { parser: 'html', singleAttributePerLine: false, tabWidth: 4 });

}

// Returns generated CSS for each of GitHub's themes, in an object
async function generateCSS() {

    const css = {
        auto: await getCSS(),
        light: await getCSS({ dark: 'light' }),
        dark: await getCSS({ light: 'dark' }),
        dark_dimmed: await getCSS({ light: 'dark_dimmed' }),
        dark_high_contrast: await getCSS({ light: 'dark_high_contrast' }),
        light_colorblind: await getCSS({ dark: 'light_colorblind' }),
        dark_colorblind: await getCSS({ light: 'dark_colorblind' })
    }
    return css;

}

// Writes rendered Markdown to a file, GitHub Flavoured with syntax highlighting by default.
// Returns the output directory path.
async function writeMarkdown({file, mode = 'gfm', output_dir = path.join(process.cwd(), 'dist')}) {

    output_dir = path.resolve(output_dir);
    fs.mkdirSync(output_dir, { recursive: true });

    await write(path.join(output_dir, `${path.basename(file)}.html`), await returnRenderedMarkdown({ file: file, mode: mode }));
    return output_dir;

}

// Writes generated CSS to files.
// Returns the output directory path.
async function writeCSS({output_dir = path.join(process.cwd(), 'dist')}) {

    output_dir = path.resolve(output_dir);
    fs.mkdirSync(output_dir, { recursive: true });

    const themes = await generateCSS();
    for (const theme of Object.entries(themes)) {
        await write(path.join(output_dir, `${theme[0]}.css`), theme[1]);
    }
    return output_dir;

}

// Render the Markdown file AND generate CSS for every GitHub theme, then write them to an output directory.
// Returns the output directory path.
async function render({file, mode = 'gfm', output_dir = './dist'}) {
    await writeMarkdown({file, mode, output_dir});
    await writeCSS({output_dir});
    return path.resolve(output_dir);
}

export default render;
export { returnRenderedMarkdown, generateCSS, write, writeMarkdown, writeCSS };
