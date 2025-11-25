import {Action} from "../actions/Action";

class ActionRunner {
    constructor(
        protected actions: Action<any>[] = []
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
            const startTime = performance.now();
            try {
                const result = await action.run();
                const durationTime = ((performance.now() - startTime) / 1000).toFixed(4);
                console.log(`RESULT: `, typeof result === 'undefined' ? 'Done' : result, ` (${durationTime}s)`);
                console.log(``);
            }catch (e){
                (e as any).action = action;
                throw e;
            }
        }
    }

    static runAction(action: Action<any>){
        return new ActionRunner([action]).run();
    }
}

export {
    ActionRunner
}