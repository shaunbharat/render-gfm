# render-gfm

Render (GitHub Flavoured with syntax highlighting) Markdown, and generate CSS for each of GitHub’s themes.

- [GitHub Repository](https://github.com/ShaunB56/render-gfm)
- [npm Package](https://www.npmjs.com/package/render-gfm)
- [Documentation](https://shaunb56.github.io/render-gfm/render-gfm)

# See Example

[This version is rendered Markdown, through GitHub Pages alone.](https://shaunb56.github.io/render-gfm/pages)

[This version is rendered Markdown, using render-gfm.](https://shaunb56.github.io/render-gfm/render-gfm)

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
# Render Markdown and generate CSS
gfm --help

# Only render a Markdown file
gfm markdown --help

# Only generate the CSS
gfm themes --help

# Example - Render a Markdown file and generate CSS, to the output folder "dist" in the current directory
gfm README.md -o dist
# or another example (both relative and absolute paths are allowed)
gfm C:/Users/Owner/Desktop/Project/README.md -o ../dist
```

## Website

> To-do

I'll also put this renderer up as a website, to quickly and easily render your Markdown.

## License

Copyright © 2022 [Shaun Bharat](https://github.com/ShaunB56).

This project is licensed with the [MIT](https://github.com/ShaunB56/render-gfm/blob/main/LICENSE) license.
