import {execSync} from "child_process";
import {Action} from "./Action";

class ExtractFromTarAction extends Action {
    constructor(
        public srcPath: string,
        public destPath: string,
    ) {
        super();
    }

    getDefaultNotes(): string {
        return `Extract from ${this.srcPath} to ${this.destPath}`;
    }

    run(): void {
        this.extractTarGz(this.srcPath, this.destPath);
    }

    protected extractTarGz(archivePath: string, destPath: string): void {
        execSync(`tar -xzf "${archivePath}" -C "${destPath}" --overwrite`);
    }
}

export {
    ExtractFromTarAction
}