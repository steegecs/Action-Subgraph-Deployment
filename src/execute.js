import { exec } from 'child_process';
const core = require('@actions/core')
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
                // console.log(stdout)
            }
            next();
           });
       } else {
            let deploymentResultsList = deploymentResults.split("\n")
            let deployments = ""
            let deploymentResultsFlag = false
            for (let i = 0; i < deploymentResultsList.length; i++) {
                if (deploymentResultsList[i].includes("RESULTS:")) {
                    deploymentResultsFlag = true
                } else if (deploymentResultsList[i].includes("END")) {
                    deploymentResultsFlag = false
                } else if (deploymentResultsFlag) {
                    deployments += deploymentResultsList[i] + "\n"
                }
            }

            if (deployments.includes("Deployment Failed:")) {
                core.setFailed("One or more deployments failed");
            }
            if (deployments == "") {
                core.setFailed("Error in execution of deployments. See logs below. If empty post an issue in the Messari repo.");
            }
            console.log("\nRESULTS:\n" + deployments + "END\n")
            console.log(deploymentResults)
            callback();
       }
    }
    // start the first iteration
    next();
}