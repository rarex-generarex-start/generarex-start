import {Settable} from "../utils/Settable";
import {existsSync} from "node:fs";
import {join, resolve} from "path";
import path from "node:path";
import {ProjectConfig} from "./ProjectConfig";
import {ENV_KEYS, readEnvValue} from "../utils/helpers";

class PathConfig extends Settable {
    project?: ProjectConfig;

    projectsPath: string = '~/www';
    dockersPath: string = '~/docker';
    sharedTemplatesPath: string = '~/www/generarex-start-shared-templates';

    currentProjectPath(addPath = '') {
        let rootDir = process.cwd();
        while (rootDir !== '/' && !existsSync(join(rootDir, 'package.json'))) {
            rootDir = resolve(rootDir, '..');
        }

        return addPath ? join(rootDir, addPath) : rootDir;
    }

    currentProjectTemplatePath(name = '') {
        return this.currentProjectPath(join('templates', name))
    }

    sharedTemplatePath(templateDir = '') {
        return join(this.sharedTemplatesPath, templateDir);
    }

    projectPath(addPath = '') {
        if (!this.project) {
            throw new Error('ProjectConfig required.');
        }

        return path.join(this.projectsPath, this.project.projectDirName, addPath);
    }

    projectDockerPath(addPath = '') {
        if (!this.project) {
            throw new Error('ProjectConfig required.');
        }

        return path.join(this.dockersPath, this.project.dockerDirName, addPath);
    }
}

function createDefaultPathConfig() {
    return new PathConfig().set({
        projectsPath: readEnvValue(ENV_KEYS.projectsPath),
        dockersPath: readEnvValue(ENV_KEYS.dockersPath),
        sharedTemplatesPath: readEnvValue(ENV_KEYS.sharedTemplatesPath)
    });
}


export {
    PathConfig,
    createDefaultPathConfig
}