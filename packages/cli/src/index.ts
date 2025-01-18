#!/usr/bin/env node
import { Command } from 'commander';
import { create } from './create';
import { setup } from './setup';

declare let PACKAGE_VERSION: string;

export function createProgram() {
    const program = new Command();

    program
        .name('onlook')
        .description('The Astral Command Line Interface')
        .version(typeof PACKAGE_VERSION !== 'undefined' ? PACKAGE_VERSION : '0.0.0');

    program
        .command('create <project-name>')
        .description('Create a new Astral project from scratch')
        .action(create);

    program.command('setup').description('Set up the current project with Astral').action(setup);

    return program;
}

if (process.env.NODE_ENV !== 'test') {
    const program = createProgram();
    program.parse(process.argv);
}
