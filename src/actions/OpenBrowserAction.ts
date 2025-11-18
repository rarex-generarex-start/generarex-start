import open from 'open';
import {Action} from "./Action";

class OpenBrowserAction extends Action {
    delay = 0;

    constructor(
        public url: string
    ) {
        super();
    }

    getDefaultNotes(): string {
        return `Open: ${this.url}. ${this.delay ? `Delay: ${this.delay}ms` : ''}`;
    }

    run(): Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => {
                open(this.url);
                resolve();
            }, this.delay)
        })
    }

}

export {
    OpenBrowserAction
}