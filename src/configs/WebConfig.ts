import {Settable} from "../utils/Settable";
import {ProjectConfig} from "./ProjectConfig";
import {ENV_KEYS, readEnvValue} from "../utils/helpers";

class WebConfig extends Settable {
    project?: ProjectConfig;

    protocol: string = 'https';
    domain: string = 'localhost';

    projectUrl(withProtocol = true) {
        if (!this.project) {
            throw new Error('ProjectConfig required');
        }

        return `${withProtocol ? this.protocol + '://' : ''}${this.project.subDomain}.${this.domain}`;
    }

    projectHMRUrl(withProtocol = true) {
        if (!this.project) {
            throw new Error('Project config required');
        }

        return `${withProtocol ? this.protocol + '://' : ''}${this.project.subDomainHMR}.${this.domain}`;
    }
}

function createDefaultWebConfig() {
    return new WebConfig().set({
        domain: readEnvValue(ENV_KEYS.domain)
    });
}

export {
    WebConfig,
    createDefaultWebConfig,
}