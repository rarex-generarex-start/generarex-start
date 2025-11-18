import {BaseConfig} from "../configs/BaseConfig";
import {Settable} from "./Settable";
import {Runnable} from "./Runnable";

abstract class BaseGenerator<C extends BaseConfig = BaseConfig, R = void> extends Settable implements Runnable<R> {
    constructor(
        public config: C
    ) {
        super();
        this.config.build();
    }

    abstract run(): R
}

export {
    BaseGenerator
}