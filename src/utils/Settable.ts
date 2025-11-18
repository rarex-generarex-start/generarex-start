import {ExcludeMethods} from "./types";
import capitalize from 'lodash/capitalize';

class Settable {
    set(config: Partial<ExcludeMethods<this>> | Record<string, any>): this {
        const validKeys = Object.getOwnPropertyNames(this);

        for (const key in config) {
            if (config.hasOwnProperty(key) && validKeys.includes(key)) {
                let setterFnName = `set${capitalize(key)}`;
                if ((this as any)[setterFnName]) {
                    (this as any)[setterFnName].call(this, (config as any)[key])
                } else {
                    (this as any)[key] = (config as any)[key];
                }
            }
        }

        return this;
    }
}

export {
    Settable
}