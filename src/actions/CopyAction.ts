import {execSync} from "child_process";
import {Action} from "./Action";

class CopyAction extends Action {
    constructor(
        public srcPath: string,
        public destPath: string,
    ) {
        super()
    }

    getDefaultNotes(): string {
        return `Copy from ${this.srcPath} to ${this.destPath}`;
    }

    run(): void {
        this.copy(this.srcPath, this.destPath);
    }

    protected copy(srcPath: string, destPath: string): void {
        if (process.platform === 'win32') {
            execSync(`xcopy "${srcPath}" "${destPath}" /E /I /H /Y`);
        } else {
            execSync(`cp -R "${srcPath}" "${destPath}"`);
        }
    }
}

export {
    CopyAction
}