import { exec } from 'child_process';

/**
 * @param {string[]} array - Protocol that is being deployed
 * @param {string} callback 
*/
export async function runCommands(array, dependenciesLength, callback) {

    var index = 0;
    var results = "";

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
                results += stdout;
            }
            next();
           });
       } else {
            // format reuslts output
            let resultsList = results.split("\n")
            let deployments = ""
            let resultsFlag = false
            for (let i = 0; i < resultsList.length; i++) {
                if (resultsList[i].includes("RESULTS:")) {
                    resultsFlag = true
                } else if (resultsList[i].includes("END")) {
                    resultsFlag = false
                } else if (resultsFlag) {
                    deployments += resultsList[i] + "\n"
                }
            }
            console.log("RESULTS:\n" + deployments + "END")
            callback(deployments);
       }
    }
    // start the first iteration
    next();
}