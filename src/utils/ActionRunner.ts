import {Action} from "../actions/Action";

class ActionRunner {
    constructor(
        public actions: Action<any>[] = []
    ) {

    }


    add(action: Action<any>) {

        this.actions.push(action);

        return this;
    }

    async run() {
        for (let idx in this.actions) {
            let action = this.actions[idx];
            const notes = action.notes || action.getDefaultNotes()
            console.log(`START: `, notes);
            const result = await action.run();
            console.log(`RESULT: `, typeof result === 'undefined' ? 'Done' : result);
            console.log(``);
        }
        // this.actions.forEach(async (action:Action<any>) => {
        //     const result = await action.run();
        //
        //     console.log(`✔ `, action.notes || action.getDefaultNotes(), typeof result === 'undefined' ? '' : `. Result: ${result}`);
        // })
    }
}

export {
    ActionRunner
}