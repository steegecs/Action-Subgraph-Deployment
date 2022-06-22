import { exec } from 'child_process';
const fs = require('fs');

/**
 * @param {string[]} array - Protocol that is being deployed
 * @param {string} callback 
*/
export async function runCommands(array, dependenciesLength, callback) {

    var index = 0;
    var deploymentResults = "";

    function next() {
        if (index < array.length) {
            exec(array[index++], function(error, stdout, stderr) {
            // console.log('stdout: ' + stdout);
            // console.log('stderr: ' + stderr);
            if (error !== null) {
                // console.log('exec error: ' + error);
                index = array.length
            }  
            // do the next iteration
            if (index >= dependenciesLength) {
                deploymentResults += stdout;
                console.log(stdout)
            }
            next();
           });
       } else {
            callback(deploymentResults);
       }
    }
    // start the first iteration
    next();
}