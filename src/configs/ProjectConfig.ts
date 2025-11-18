import {Settable} from "../utils/Settable";
import kebabCase from 'lodash/kebabCase';

class ProjectConfig extends Settable {
    subDomain: string = '';
    subDomainHMR: string = '';
    projectDirName: string = '';
    dockerDirName: string = '';

    constructor(
        public name: string
    ) {
        super();
        const kebabName = kebabCase(name);

        this.set({
            subDomain: kebabName,
            subDomainHMR: 'vite-' + kebabName,
            projectDirName: kebabName,
            dockerDirName: kebabName,
        });
    }
}

export {
    ProjectConfig
}