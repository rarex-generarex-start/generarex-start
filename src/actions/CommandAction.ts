import {execSync, StdioOptions} from "child_process";
import {Action} from "./Action.js";

class CommandAction extends Action {
    stdio: StdioOptions = 'inherit';

    constructor(
        public dirPath: string,
        public command: string,
    ) {
        super();
    }

    getDefaultNotes(): string {
        return `Execute command: "${this.dirPath}/${this.command}"`;
    }

    run(): void {
        execSync(this.command, {
            stdio: 'inherit',
            cwd: this.dirPath
        });
    }
}

export {
    CommandAction
}