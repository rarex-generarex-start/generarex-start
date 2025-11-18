import {Action} from "./Action";
import {CommandAction} from "./CommandAction";

class DockerComposeAction extends Action {

    profileCreate = '"*"'
    profileInstall = 'install'
    profileApp = 'app'

    build = true;
    create = true;
    install = true;
    up = true;

    constructor(
        public dockerDirName: string,
    ) {
        super();
    }

    getDefaultNotes(): string {
        return `Start docker-compose from ${this.dockerDirName}`;
    }

    run(): void {
        if (this.build) {
            new CommandAction(this.dockerDirName, 'docker-compose build --pull')
                .set({notes: `Build Docker Images for ${this.dockerDirName}`})
                .run();
        }

        if (this.create) {
            new CommandAction(this.dockerDirName, `docker-compose --profile ${this.profileCreate || "*"} create`)
                .set({notes: `Create Docker Containers for ${this.dockerDirName}`})
                .run()
        }

        if (this.install) {
            new CommandAction(this.dockerDirName, `docker-compose --profile ${this.profileInstall || "*"} up`)
                .set({notes: `Run Docker Install Containers for ${this.dockerDirName}`})
                .run()
        }

        if (this.up) {
            new CommandAction(this.dockerDirName, `docker-compose --profile ${this.profileApp || "*"} up -d`)
                .set({notes: `Run Docker App Containers for ${this.dockerDirName}`})
                .run()
        }
    }
}

export {
    DockerComposeAction
}