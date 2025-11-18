import readline from "readline";
import os from "os";
import {execSync} from "child_process";
import path from "node:path";
import fs from "fs";

async function readFromConsole(question: string, defaultValue: string = ''): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim() || defaultValue);
        });
    });
}

async function readFromConsoleWithDefaultText(question: string, defaultValue: string = ''): Promise<string> {
    return readFromConsole(`${question} (default: ${defaultValue}):`, defaultValue)
}

async function readConfirmationFromConsole(question: string, defaultValue: boolean = true): Promise<boolean> {
    const defaultText = defaultValue ? 'Y/n' : 'y/N';
    const answer = await readFromConsole(`${question} (${defaultText}): `, '');

    if (answer === '') return defaultValue;
    return answer.toLowerCase().startsWith('y');
}

function setOsEnvironmentVariable(key: string, value: string | number): void {
    const stringValue = String(value);

    if (os.platform() === 'win32') {
        execSync(`setx ${key} "${stringValue}"`, {stdio: 'inherit'});
    } else {
        const shell = os.userInfo().shell || '/bin/bash';
        const profilePath = shell.includes('zsh') ?
            path.join(os.homedir(), '.zshrc') :
            path.join(os.homedir(), '.bashrc');

        let content = '';
        if (fs.existsSync(profilePath)) {
            content = fs.readFileSync(profilePath, 'utf8');
        }

        const lines = content.split('\n');
        const newLines = lines.filter(line =>
            !line.trim().startsWith(`export ${key}=`)
        );

        newLines.push(`export ${key}="${stringValue}"`);
        fs.writeFileSync(profilePath, newLines.join('\n'));
    }
}

const ENV_KEYS = {
    projectsPath: 'GENERAREX_DEFAULTS_PROJECTS_PATH',
    dockersPath: 'GENERAREX_DEFAULTS_DOCKERS_PATH',
    sharedTemplatesPath: 'GENERAREX_DEFAULTS_SHARED_TEMPLATES_PATH',
    domain: 'GENERAREX_DEFAULTS_DOMAIN'
} as const;

function readEnvValue(key: string, throwError = true) {
    const value = process.env[key];

    if (typeof value === 'undefined') {
        throw new Error(`${key} env value not set`);
    }

    return value
}

export {
    readFromConsole,
    readFromConsoleWithDefaultText,
    readConfirmationFromConsole,
    readEnvValue,
    ENV_KEYS,
    setOsEnvironmentVariable
}