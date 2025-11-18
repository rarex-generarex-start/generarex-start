import * as fs from 'fs';
import * as path from 'path';
import ejs from 'ejs';
import {Action} from "./Action";

class CopyWithTemplatingAction extends Action {
    skip: string[] = []; // ['.git', '.idea', 'node_modules', 'vendor', '.env'];
    skipTemplatingExtensions = ['.db', '.sqlite', '.sqlite3', '.png', '.jpg', '.jpeg', '.webp'];

    constructor(
        public srcPath: string,
        public destPath: string,
        public data: any,
    ) {
        super();
    }

    getDefaultNotes(): string {
        return `Copy with templating from ${this.srcPath} to ${this.destPath}`;
    }

    run(): void {
        this.copy(this.srcPath, this.destPath);
    }

    protected copy(srcPath: string, destPath: string): void {
        if (this.isSkipCopy(srcPath)) {
            return
        }

        const isDirectory = fs.statSync(srcPath).isDirectory();
        if (isDirectory) {
            const items = fs.readdirSync(srcPath);
            fs.mkdirSync(destPath, {recursive: true});
            for (const item of items) {
                this.copy(path.join(srcPath, item), path.join(destPath, item))
            }
        } else {
            if (this.isSkipTemplating(srcPath)) {
                fs.copyFileSync(srcPath, destPath);
            } else {
                fs.writeFileSync(destPath, this.processTemplateContent(srcPath));
            }
        }
    }

    protected processTemplateContent(srcPath: string) {
        const content = fs.readFileSync(srcPath, 'utf-8');
        return ejs.render(content, this.data);
    }

    protected isSkipCopy(itemPath: string) {
        return this.skip.includes(path.basename(itemPath))
    }

    protected isSkipTemplating(itemPath: string) {
        const ext = path.extname(itemPath).toLowerCase();
        return this.skipTemplatingExtensions.includes(ext);
    }
}

export {
    CopyWithTemplatingAction
}