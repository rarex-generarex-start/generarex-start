import * as fs from 'fs';
import {Action} from "./Action";

class CreateDirectoryAction extends Action {
    dirShouldBeEmpty = false;

    constructor(
        public dirPath: string,
    ) {
        super();
    }

    getDefaultNotes(): string {
        return `Create directory ${this.dirPath}`;
    }

    run() {
        const isDirExists = fs.existsSync(this.dirPath);

        if (isDirExists && this.dirShouldBeEmpty) {
            const isDirEmpty = fs.readdirSync(this.dirPath).length == 0;
            if (!isDirEmpty) {
                throw new Error(`Directory already exists and not empty: ${this.dirPath}`);
            }
        } else {
            fs.mkdirSync(this.dirPath, {recursive: true});
        }
    }
}

export {
    CreateDirectoryAction
}