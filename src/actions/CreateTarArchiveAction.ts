import {Action} from "./Action";
import fs from "node:fs";
import {readConfirmationFromConsole} from "../utils/helpers";
import {execSync} from "node:child_process";
import path from "node:path";

class CreateTarArchiveAction extends Action<Promise<void>>{

    constructor(
        public archivePath: string,
        public srcPath: string,
        public filesToArchive: string|string[],
    ) {
        super();
    }

    getDefaultNotes(): string {
        return `Creating archive: ${this.archivePath}`;
    }

    async run(): Promise<void> {
        const toArchive = [this.filesToArchive].flat();
        for (const item of toArchive) {
            const fullPath = path.join(this.srcPath, item);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`File or directory not found: ${item}`);
            }
        }

        if (fs.existsSync(this.archivePath)) {
            const confirmed = await readConfirmationFromConsole(`Archive already exists (${this.archivePath}). Overwrite?`, false);
            if (!confirmed) {
                throw new Error('Operation cancelled by user');
            }
            fs.unlinkSync(this.archivePath);
        }

        console.log(`tar -czf "${this.archivePath}" -C "${this.srcPath}" ${toArchive.join(' ')}`);
        execSync(`tar -czf "${this.archivePath}" -C "${this.srcPath}" ${toArchive.join(' ')}`);
    }

}

export {
    CreateTarArchiveAction
}