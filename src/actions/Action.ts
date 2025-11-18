import {Settable} from "../utils/Settable";
import {Runnable} from "../utils/Runnable";

abstract class Action<R = void> extends Settable implements Runnable<R> {
    notes: string | null = null;

    getDefaultNotes(): string {
        return `${this.constructor.name}`
    }

    abstract run(): R
}

export {
    Action
}