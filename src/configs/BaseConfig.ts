import {Settable} from "../utils/Settable";
import {ProjectConfig} from "./ProjectConfig";
import {PathConfig} from "./PathConfig";
import {WebConfig} from "./WebConfig";
import {TechConfig} from "./TechConfig";


class BaseConfig extends Settable {
    public project?: ProjectConfig;
    public path?: PathConfig;
    public web?: WebConfig;
    public tech?: TechConfig;

    build() {
        if (this.project) {
            if (this.path) {
                this.path.project = this.project;
            }

            if (this.web) {
                this.web.project = this.project;
            }
        }
    }
}

export {
    BaseConfig
}