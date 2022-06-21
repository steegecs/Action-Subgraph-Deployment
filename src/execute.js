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
            // format results output
            // let deploymentResultsList = deploymentResults.split("\n")
            // let deployments = ""
            // let deploymentResultsFlag = false
            // for (let i = 0; i < deploymentResultsList.length; i++) {
            //     if (deploymentResultsList[i].includes("RESULTS:")) {
            //         deploymentResultsFlag = true
            //     } else if (deploymentResultsList[i].includes("END")) {
            //         deploymentResultsFlag = false
            //     } else if (deploymentResultsFlag) {
            //         deployments += deploymentResultsList[i] + "\n"
            //     }
            // }

            callback(deploymentResults);
       }
    }
    // start the first iteration
    next();
}