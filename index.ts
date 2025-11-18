import * as dotenv from 'dotenv';
import {createDefaultWebConfig, setOsEnvironmentVariable} from "./src";

// dotenv.config();
//
// const v = process.env.GENERAREX_DEFAULTS_PROJECTS_PATH_TEST;
//
// setOsEnvironmentVariable('MY_TEST', 333)
// setOsEnvironmentVariable('MY_BEST', 222)
// console.log('V', v);

dotenv.config({
    quiet: true
});

createDefaultWebConfig();