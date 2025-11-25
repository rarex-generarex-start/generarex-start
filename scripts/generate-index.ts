import {readdirSync, statSync, writeFileSync} from 'fs';
import {join, relative, dirname} from 'path';
import {fileURLToPath} from "url";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = join(__dirname, '../src');
const files: string[] = [];

function findFiles(dir: string): void {
    const items = readdirSync(dir);

    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            findFiles(fullPath);
        } else if (item.endsWith('.ts') && !item.includes('.test.') && item !== 'index.ts') {
            const relPath = relative(srcDir, fullPath).replace(/\.ts$/, '');
            files.push(`export * from './${relPath.replace(/\\/g, '/')}';`);
        }
    }
}

findFiles(srcDir);
files.sort();

const content = `// Auto-generated index file\n\n${files.join('\n')}\n`;
writeFileSync(join(srcDir, 'index.ts'), content);

console.log(`Generated index.ts with ${files.length} exports`);