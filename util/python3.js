const { execSync } = require('child_process');
const fs = require('fs');
const cuid = require('cuid');

exports.compile = (code, input, fn) => {
    //Writing code to a temporary file
    let baseFilename = cuid.slug();
    let filename = baseFilename + ".py";
    fs.writeFileSync("./tmpcode/" + filename, code)

    //Running the code
    command = `python3 ${filename}`;
    try{
        let run;
        if(input == "") {
            run = execSync(command, {cwd:"./tmpcode",timeout: 5000, stdio: ['pipe','pipe','pipe']});
        } else {
            run = execSync(command, {cwd:"./tmpcode",input: input,timeout: 5000, stdio: ['pipe','pipe','pipe']});
        }
        let feedback = {
            stdout: run.toString(),
            stderr: null
        }
        fn(feedback)
    } catch(err) {
        if(err.code == 'ETIMEDOUT') { // If the code goes beyond the timeout period
            let feedback = {
                stdout: null,
                stderr: err.stderr.toString() || "Code timedout (possibly went into a never-ending loop)"
            }
            fn(feedback);
        } else {
            let feedback = {
                stdout: null,
                stderr: err.stderr.toString()
            }
            fn(feedback);
        }
    }

    //Deleting the files which were created
    fs.unlink('./tmpcode/' + filename, (err) => {
        if (err) throw err;
    });
}