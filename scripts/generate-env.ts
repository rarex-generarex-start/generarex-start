import path from "path";
import {ENV_KEYS, readConfirmationFromConsole, readFromConsoleWithDefaultText, setOsEnvironmentVariable} from "../src";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({
    quiet: true
});

const args = process.argv.slice(2);
const forceGenerate = args.includes('--force');

interface EnvTemplateValues {
    projectsPath: string,
    dockersPath: string,
    sharedTemplatesPath: string,
    domain: string
}

interface EnvValue {
    key: string;
    description: string;
    value: string | ((values: EnvValue[]) => string);
}

class EnvValuesManager {
    constructor(private values: EnvValue[]) {
    }

    get(key: string, defaultValue = ''): string {
        const value = this.values.find(v => v.key === key)?.value;
        return value ? typeof value === 'function' ? value(this.values) : value : defaultValue;
    }

    async promptAll() {
        console.log('Setting up environment variables...');
        console.log('Please provide the following values (press Enter to use defaults):\n');

        for (const v of this.values) {
            const envDefaultValue = process.env[v.key];
            const computedDefaultValue = typeof v.value === 'function' ? v.value(this.values) : v.value;
            const defaultValue = envDefaultValue || computedDefaultValue;

            v.value = await readFromConsoleWithDefaultText(v.description, defaultValue);
        }
    }

    getValues(): EnvValue[] {
        return this.values;
    }

    async saveToEnvFile(projectPath: string = process.cwd()): Promise<boolean> {
        const shouldSave = await readConfirmationFromConsole(
            'Save these values to .env file?',
            true
        );

        if (!shouldSave) {
            console.log('Values were not saved to .env file');
            return false;
        }

        const envFilePath = path.join(projectPath, '.env');

        try {
            let existingContent = '';

            // Читаем существующий файл если есть
            if (fs.existsSync(envFilePath)) {
                existingContent = fs.readFileSync(envFilePath, 'utf8');
                console.log('Updating existing .env file...');
            } else {
                console.log('Creating new .env file...');
            }

            // Парсим существующие переменные
            const existingVars = new Map();
            const lines = existingContent.split('\n');

            for (const line of lines) {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    existingVars.set(match[1], match[2] || '');
                }
            }

            // Обновляем значения
            for (const v of this.values) {
                const resolvedValue = typeof v.value === 'function' ? v.value(this.values) : v.value;
                existingVars.set(v.key, resolvedValue);
            }

            // Формируем новый контент
            const newContent = Array.from(existingVars.entries())
                .map(([key, value]) => `${key}=${value}`)
                .join('\n') + '\n';

            // Записываем файл
            fs.writeFileSync(envFilePath, newContent, 'utf8');
            console.log(`Successfully saved ${this.values.length} variables to ${envFilePath}`);
            return true;

        } catch (error) {
            console.error('Error saving .env file:', error);
            return false;
        }
    }

    async saveToOsEnvironment(): Promise<boolean> {
        const shouldSave = await readConfirmationFromConsole(
            'Save these values to OS environment variables?',
            false // По умолчанию NO
        );

        if (!shouldSave) {
            console.log('Values were not saved to OS environment');
            return false;
        }

        try {
            for (const v of this.values) {
                const resolvedValue = typeof v.value === 'function' ? v.value(this.values) : v.value;
                setOsEnvironmentVariable(v.key, resolvedValue);
                console.log(`Set OS environment variable: ${v.key}`);
            }
            console.log(`Successfully set ${this.values.length} OS environment variables`);
            return true;
        } catch (error) {
            console.error('Error setting OS environment variables:', error);
            return false;
        }
    }

    isAllValuesSet(): boolean {
        for (const v of this.values) {
            const envValue = process.env[v.key];
            if (!envValue || !envValue.trim()) {
                return false;
            }
        }
        return true;
    }

    displayValues(): void {
        console.log('\n Current environment values:');
        console.log('═'.repeat(60));

        this.values.forEach((v, index) => {
            const resolvedValue = typeof v.value === 'function' ? v.value(this.values) : v.value;
            console.log(` ${index + 1}. ${v.key}`);
            console.log(`    Description: ${v.description}`);
            console.log(`    Value: ${resolvedValue}`);

            if (index < this.values.length - 1) {
                console.log('    ──────────────────────────────────────────');
            }
        });

        console.log('═'.repeat(60));
        console.log(`Total: ${this.values.length} variables\n`);
    }
}

const envManager: EnvValuesManager = new EnvValuesManager([
    {
        key: ENV_KEYS.projectsPath,
        description: 'Projects directory path',
        value: `/home/${process.env.USER || 'user'}/www`
    },
    {
        key: ENV_KEYS.dockersPath,
        description: 'Dockers directory path',
        value: (values) => path.join(envManager.get('GENERAREX_DEFAULTS_PROJECTS_PATH'), 'docker')
    },
    {
        key: ENV_KEYS.sharedTemplatesPath,
        description: 'Dockers directory path',
        value: (values) => path.join(envManager.get('GENERAREX_DEFAULTS_PROJECTS_PATH'), 'generarex-start-shared-templates')
    },
    {
        key: ENV_KEYS.domain,
        description: 'Projects directory path',
        value: `localhost`
    },
]);

if (forceGenerate || !envManager.isAllValuesSet()) {
    await envManager.promptAll();
    envManager.displayValues();
    await envManager.saveToEnvFile();
    await envManager.saveToOsEnvironment();
}
