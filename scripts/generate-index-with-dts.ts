// generate-index.ts
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function collectExports(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf8');
    const exports = new Set<string>();

    // Удаляем все комментарии чтобы они не мешали анализу
    const contentWithoutComments = content
        .replace(/\/\*[\s\S]*?\*\//g, '')  // многострочные комментарии
        .replace(/\/\/.*$/gm, '');         // однострочные комментарии

    // Ищем именованные экспорты в фигурных скобках
    const namedExportMatch = contentWithoutComments.match(/export\s*{([^}]+)}/);
    if (namedExportMatch) {
        const exportItems = namedExportMatch[1].split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .map(item => {
                // Обрабатываем "something as alias"
                const parts = item.split(/\s+as\s+/);
                return parts[parts.length - 1]; // берем последнюю часть (алиас или оригинальное имя)
            });

        exportItems.forEach(item => exports.add(item));
    }

    // Ищем отдельные экспорты: export class/const/function
    const individualExportRegex = /export\s+(?:class|const|let|var|function|interface|type|enum)\s+(\w+)/g;
    let individualMatch;
    while ((individualMatch = individualExportRegex.exec(contentWithoutComments)) !== null) {
        exports.add(individualMatch[1]);
    }

    // Ищем export default с именем
    const defaultExportMatch = contentWithoutComments.match(/export\s+default\s+(\w+)/);
    if (defaultExportMatch) {
        exports.add(defaultExportMatch[1]);
    }

    return Array.from(exports).filter(item => item.length > 0).sort();
}

function generateIndexFiles(): void {
    const srcDir = path.resolve(process.cwd(), 'src');
    const indexTsPath = path.resolve(srcDir, 'index.ts');
    const indexDtsPath = path.resolve(srcDir, 'index.d.ts');

    if (!fs.existsSync(srcDir)) {
        console.error('src directory not found');
        process.exit(1);
    }

    let indexTsContent = '// Auto-generated index file\n\n';
    let indexDtsContent = '// Auto-generated type definitions\n\n';

    const tsFiles: string[] = [];

    function collectTsFiles(dir: string, relativePath: string = ''): void {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const relativeItemPath = path.join(relativePath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                collectTsFiles(fullPath, relativeItemPath);
            } else if (stat.isFile() &&
                item.endsWith('.ts') &&
                !item.endsWith('.d.ts') &&
                item !== 'index.ts') {

                tsFiles.push(relativeItemPath);
            }
        }
    }

    collectTsFiles(srcDir);

    // Сортируем файлы для consistent порядка
    tsFiles.sort();

    // Генерируем index.ts с export * from
    tsFiles.forEach(file => {
        const relativeImportPath = `./${file.replace(/\\/g, '/')}`.replace('.ts', '');
        indexTsContent += `export * from '${relativeImportPath}';\n`;
    });

    // Генерируем index.d.ts с развернутыми экспортами
    tsFiles.forEach(file => {
        const fullPath = path.join(srcDir, file);
        const relativeImportPath = `./${file.replace(/\\/g, '/')}`.replace('.ts', '');
        const exportItems = collectExports(fullPath);

        if (exportItems.length > 0) {
            const itemsString = exportItems.map(item => `${item} as ${item}`).join(',\n    ');
            indexDtsContent += `export {\n    ${itemsString}\n} from '${relativeImportPath}';\n\n`;
        }
    });

    fs.writeFileSync(indexTsPath, indexTsContent);
    fs.writeFileSync(indexDtsPath, indexDtsContent);

    console.log(`Generated ${indexTsPath}`);
    console.log(`Generated ${indexDtsPath}`);
}

generateIndexFiles();