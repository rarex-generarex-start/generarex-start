import open from 'open';
import {Action} from "./Action";

class NoAction extends Action {
    delay = 0;

    constructor(
        public notes: string
    ) {
        super();

        this.set({notes: notes});
    }


    run(): void {

    }

}

export {
    NoAction
}