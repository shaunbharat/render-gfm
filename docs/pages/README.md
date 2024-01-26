# render-gfm

Render GitHub Flavoured Markdown, with CSS for each of GitHub's themes.

- [GitHub Repository](https://github.com/shaunbharat/render-gfm)
- [npm Package](https://www.npmjs.com/package/render-gfm)
- [Documentation](https://shaunbharat.github.io/render-gfm/render-gfm)

## See Example

[This version is rendered Markdown, through GitHub Pages alone.](https://shaunbharat.github.io/render-gfm/pages)

[This version is rendered Markdown, using render-gfm.](https://shaunbharat.github.io/render-gfm/render-gfm)

## CLI

### Install (Globally)

```bash
# Install render-gfm with the --global option (-g) to use the CLI.
npm install -g render-gfm
```

### Usage (Commands)

> Use the help option (`--help` or `-h`) to see the usage information for each command.

```bash
render-gfm --help

# Render Markdown files
render-gfm markdown --help

# Generate CSS
render-gfm themes --help
```

> Examples of the `markdown` command

```bash
# Example - Render "README.md" and "test.md" Markdown files to the output folder "docs" in the current directory
render-gfm markdown  -o ./docs README.md test.md

# or another example (both relative and absolute paths are allowed)
render-gfm markdown -o ../dist C:/Users/Owner/Desktop/Project/README.md
```

> Examples of the `themes` command

```bash
# Example - Generate and write the CSS files to the output folder "css" in the current directory
render-gfm themes -o ./css
```

### Usage (Functions)

> The CLI commands are just wrappers around some functions. These functions have been written specifically for the CLI, but are exported and can be used in your code directly.

```javascript
/**
 * Render Markdown files (looks in the current working directory by default, if relative paths are specified) to the specified output directory.
 * @param {string[]} files An array of the Markdown file paths to render. Can be absolute or relative paths.
 * @param {string} outputDir The directory to write the rendered HTML to. If unspecified, the default is the folder "dist" in the current working directory.
 */
export async function markdown(files: string[], outputDir: string = './dist');

/**
 * Generate CSS files for each of GitHub's themes to the specified output directory.
 * @param {string} outputDir The directory to write the CSS files to. If unspecified, the default is the folder "dist/css" in the current working directory.
 */
export async function themes(outputDir: string = './dist/css');
```

## API

### Install

```bash
# Install render-gfm to your JavaScript project.
npm install render-gfm
```

### Usage

```javascript
import render, { generateCSS } from 'render-gfm';

/**
 * Generates and returns CSS for each requested theme in the `themes` array, as an object
 * @param {string} outputDir The directory to write the CSS files to. If unspecified, the CSS will still be returned in an object, but not written to the filesystem.
 * @param {Theme[]} themes An array of the themes to generate CSS for. Defaults to all themes.
 * @returns {Promise<Record<string, string>>} An object containing the CSS for each theme.
 */
export async function generateCSS(outputDir: string, themes: Theme[] = [Theme.Auto, Theme.Light, Theme.Dark, Theme.DarkDimmed, Theme.DarkHighContrast, Theme.LightColorblind, Theme.DarkColorblind]): Promise<Record<string, string>>;

/**
 * Renders Markdown to HTML. If `outputFile` is specified, the HTML will be written to the filesystem.
 * The resulting HTML rendered will be wrapped in a default template, unless `includeDefaultTemplate` is set to false.
 * This is useful for when you want to use your own HTML template.
 * @param {string} markdown The Markdown to render.
 * @param {string} outputFile The file to write the rendered HTML to. If unspecified, the HTML will still be returned, but not written to the filesystem.
 * @param {boolean} includeDefaultTemplate Whether or not to include the default HTML template. Default: true. If false, the rendered Markdown will not be wrapped in a template.
 * @returns {Promise<string>} The rendered HTML.
 */
export default async function render(markdown: string, outputFile: string, includeDefaultTemplate: boolean = true): Promise<string>;
```

## License

Copyright © 2022 [Shaun Bharat](https://github.com/shaunbharat).

This project is licensed with the [MIT](https://github.com/shaunbharat/render-gfm/blob/main/LICENSE) license.
