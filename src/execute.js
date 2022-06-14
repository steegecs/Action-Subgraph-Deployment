import { exec } from 'child_process';
const fs = require('fs');

/**
 * @param {string[]} array - Protocol that is being deployed
 * @param {string} callback 
*/
export async function runCommands(array, dependenciesLength, callback) {

    var index = 0;
    var deploymentResults = "";
    var allResults

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
                console.log(array[index - 1])
                const path = array[index - 1].split(" ")[2];
                console.log(path)
                const data = fs.readFile(path + 'results.txt');
                console.log(data)
                allResults += data
            }
            next();
           });
       } else {
            // format reuslts output
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
            console.log("RESULTS:\n" + deployments + "END")
            callback(deployments);
       }
    }
    // start the first iteration
    next();
}