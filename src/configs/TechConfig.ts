import {Settable} from "../utils/Settable";

class TechConfig extends Settable {
    php = false;
    laravel = false;
    nginx = false;
    node = false;
    vite = false;
}

export {
    TechConfig
}