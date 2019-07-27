const { execSync } = require('child_process');
const fs = require('fs');
const cuid = require('cuid');

exports.compile = (code, input, fn) => {
    //Writing code to a temporary file
    let baseFilename = cuid.slug();
    let filename = baseFilename + ".cpp";
    fs.writeFileSync("./tmpcode/" + filename, code)
    
    //Compiling the code
    let command = `g++ ${filename} -o ${baseFilename}.exe`;
    try{//                                                     stdin  stdout  stderr
        let gcc = execSync(command, {cwd: './tmpcode', stdio: ['pipe','pipe','pipe']});
    } catch(err) {
        let feedback = {
            stdout: null,
            stderr: err.stderr.toString()
        }
        fn(feedback);
        fs.unlink('./tmpcode/' + filename, (err) => {
            if (err) throw err;
        });
        return;
    }

    //Running the code
    command = `./${baseFilename}.exe`;
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
                stderr: 'Code timedout (possibly went into a never-ending loop)'
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
    fs.unlink('./tmpcode/' + baseFilename + ".exe", (err) => {
        if (err) throw err;
    });
}