import {PathConfig} from "../configs/PathConfig";
import {WebConfig} from "../configs/WebConfig";

let projectsPath = '/home/rarex/www';
let dockersPath = '/home/rarex/www/docker';
let domain = 'dev.rarex';
let sharedTemplatesPath = '/home/rarex/www/_tools/generarex-start-shared-templates';

function getDefaultPathConfig() {
    return new PathConfig().set({
        projectsPath,
        dockersPath,
        sharedTemplatesPath,
    });
}

function getDefaultWebConfig() {
    return new WebConfig().set({
        domain,
    });
}

const DefaultConfigs = {
    getDefaultPathConfig,
    getDefaultWebConfig
}

export {
    DefaultConfigs
}