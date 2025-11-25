import {Settable} from "../utils/Settable";
import {ProjectConfig} from "./ProjectConfig";
import {PathConfig} from "./PathConfig";
import {WebConfig} from "./WebConfig";
import {TechConfig} from "./TechConfig";
import { randomBytes } from 'crypto';


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

    utils = {
        generateLaravelApiKey(){
            return `base64:${this.generateRandomKey(32, 'base64')}`;
        },

        generateRandomKey: (length: number = 32, format: 'base64' | 'hex' | 'buffer' = 'base64'): string | Buffer => {
            const keyBytes = randomBytes(length);

            switch (format) {
                case 'base64':
                    return keyBytes.toString('base64');
                case 'hex':
                    return keyBytes.toString('hex');
                case 'buffer':
                    return keyBytes;
                default:
                    return keyBytes.toString('base64');
            }
        }
    }
}

export {
    BaseConfig
}