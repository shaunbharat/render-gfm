#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { Command } from 'commander';
import render, { generateCSS } from './index.js';

const cli = new Command();

cli
    .name('render-gfm')
    .description("Render GitHub Flavoured Markdown, with CSS for each of GitHub's themes")
    .helpOption('-h, --help', 'Display help for the command')
    .addHelpCommand(false);

cli.command('markdown')
    .description("Render Markdown files only")
    .argument('[files...]', 'The Markdown file(s) to render. Can be absolute or relative paths.')
    .option("-o, --output-dir <string>", "The output directory. Defaults to 'dist' in the current working directory")
    .option('-d, --debug', 'Show debug logs')
    .action(async (files: string[], options) => {
        if (files.length === 0) return cli.outputHelp();

        try {
            await markdown(files, options.outputDir || './dist');
        } catch (e) {
            console.log('There was an error rendering the Markdown file(s).');
            if (options.debug) console.error(e);
            return;
        }

        return console.log(`Successfully rendered Markdown file(s) to '${path.resolve(options.outputDir || './dist') || path.resolve('./dist')}'!`);

    });

cli.command('themes')
    .description("Generate the CSS for each of GitHub's themes only")
    .option("-o, --output-dir <string>", "The output directory. Defaults to 'dist' in the current working directory")
    .option('-d, --debug', 'Show debug logs')
    .action(async (options) => {

        try {
            await themes(options.outputDir || './dist/css');
        } catch (e) {
            console.log('There was an error generating the CSS file(s).');
            if (options.debug) console.error(e);
            return;
        }

        return console.log(`Successfully generated CSS file(s) to '${path.resolve(options.outputDir || './dist/css') || path.resolve('./dist')}'!`);

    });

cli.parse();

/**
 * Render Markdown files (looks in the current working directory by default, if relative paths are specified) to the specified output directory.
 * @param {string[]} files An array of the Markdown file paths to render. Can be absolute or relative paths.
 * @param {string} outputDir The directory to write the rendered HTML to. If unspecified, the default is the folder "dist" in the current working directory.
 */
export async function markdown(files: string[], outputDir: string = './dist') {
    for (const file of files) {
        const markdown = fs.readFileSync(file, { encoding: 'utf8' });
        await render(markdown, path.join(outputDir, `${path.basename(file, '.md')}.html`));
    }
}

/**
 * Generate CSS files for each of GitHub's themes to the specified output directory.
 * @param {string} outputDir The directory to write the CSS files to. If unspecified, the default is the folder "dist/css" in the current working directory.
 */
export async function themes(outputDir: string = './dist/css') {
    await generateCSS(outputDir);
}
