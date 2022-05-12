# Render-GFM

Render (GitHub Flavoured with syntax highlighting) Markdown, and generate CSS for each of GitHub’s themes.

# Install

```bash
npm install -g render-gfm
```

The --global option (-g) is required to globally use the CLI.

>✅ This package was written using other packages which were written as ES Modules, causing this to be in ESM as well. See [this gist](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) by [@sindresorhus](https://github.com/sindresorhus) for more info.

# Usage

Render-GFM can be used programmatically with Javascript, or it can be used at the command line.

## API

Import (ESM)
```javascript
import render from 'render-gfm';

// Using functions other than `render()`:
import { returnRenderedMarkdown(), generateCSS(), writeMarkdown(), writeCSS() } from 'render-gfm';
```

Usage
```javascript
/* Examples */

const html = await returnRenderedMarkdown({ file: '../src/README.md', mode: 'gfm' });
// => <Promise<string>> Returns the rendered Markdown in HTML

const themes = await generateCSS();
// => <Promise<Object<string>>> Returns the CSS for each theme, inside an object

await writeMarkdown({ file: 'C:/Users/Owner/Desktop/Project/README.md', mode: 'gfm', output_dir: 'C:/Users/Owner/Desktop/Project/dist' });
// => <Promise<string>> Renders a Markdown file and writes it to an HTML file, then returns directory path to it

await writeCSS({ output_dir: 'C:/Users/Owner/Desktop/Project/assets/css' });
// => <Promise<string>> Generates and writes the CSS for each of GitHub's themes, then returns the path to the CSS files

await render({ file: 'C:/Users/Owner/Desktop/Project/README.md', mode: 'gfm', output_dir: 'C:/Users/Owner/Desktop/Project/dist' });
// => <Promise<string>> Generates CSS and renders Markdown, then writes everything to an output directory
```

## CLI

Assuming Render-GFM was installed globally with `npm install -g render-gfm`, you should now be able to use it from anywhere with your command line.

```bash
gfm --help
```

## Website

> To-do

I'll also put this renderer up as a website, to quickly and easily render your Markdown.

## License

Copyright © 2022 [Shaun Bharat](https://github.com/ShaunB56).

This project is licensed with the [MIT](https://github.com/ShaunB56/GoogleMeetAPI/blob/main/LICENSE) license.
