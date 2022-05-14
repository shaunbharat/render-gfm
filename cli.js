const version = '1.0.0';
import render, { writeCSS, writeMarkdown } from './index.js';
import { Command } from 'commander';
const cli = new Command();

cli
    .name('gfm')
    .description('Render Markdown (GitHub Flavoured with syntax highlighting), and generate CSS for each of GitHub\'s themes')
    .version(version)
    .argument('[file]', 'The Markdown file to render, can be an absolute or relative path - also generates CSS')
    .option('-o, --output <string>', 'The output directory, defaults to the folder "dist" in the current directory')
    .option('-m, --mode <string>', 'The render mode, defaults to "gfm" (GitHub Flavoured with syntax highligting) - set to "markdown" for no syntax highlighting')
    .action(async (file, options) => {

        if (!file) return await cli.help();

        try {
            var output = await render({ file: file, mode: options.mode, output_dir: options.output });
        } catch (e) {
            return console.log('There was an error trying to render the Markdown file. Make sure the path is correct/valid!');
        }

        return console.log(`Successfully rendered Markdown file and generated CSS to ${output}`);

    });

cli.command('markdown')
    .alias('md')
    .description('Render a single Markdown file only')
    .argument('[file]', 'The Markdown file to render, can be an absolute or relative path')
    .option('-o, --output <string>', 'The output directory, defaults to the folder "dist" in the current directory')
    .option('-m, --mode <string>', 'The render mode, defaults to "gfm" (GitHub Flavoured with syntax highligting) - set to "markdown" for no syntax highlighting')
    .action(async (file, options) => {

        try {
            var output = await writeMarkdown({ file: file, mode: options.mode, output_dir: options.output })
        } catch (e) {
            return console.log('There was an error trying to render the Markdown file. Make sure the path is correct/valid! Use the flag \'-h\' or \'--help\' for help.');
        }

        return console.log(`Successfully rendered Markdown file to ${output}`);

    });

cli.command('themes')
    .description('Generate the CSS for each of GitHub\'s themes only')
    .requiredOption('-o, --output <string>', 'The output directory, defaults to \'dist\' in the current working directory')
    .action(async () => {

        try {
           var output = await writeCSS({ output_dir: options.output })
        } catch (e) {
            return console.log('There was an error trying to generate the CSS files. Use the flag \'-h\' or \'--help\' for help.');
        }
        
        return console.log(`Successfully generated CSS files to ${output}`)

    });

cli.parse();
