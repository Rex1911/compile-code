const { execSync } = require('child_process');
const fs = require('fs');
const cuid = require('cuid');

exports.compile = (code, input, fn) => {
    //Writing code to a temporary file
    let baseFilename = cuid.slug();
    let filename = baseFilename + ".java";
    
    fs.mkdirSync(`./tmpcode/${baseFilename}`)
    
    fs.writeFileSync(`./tmpcode/${baseFilename}/${filename}`, code)
    
    //Compiling the code
    let command = `javac ${filename}`;
    try{//                                                     stdin  stdout  stderr
        let java = execSync(command, {cwd: `./tmpcode/${baseFilename}`, stdio: ['pipe','pipe','pipe']});
    } catch(err) {
        let feedback = {
            stdout: null,
            stderr: err.stderr.toString()
        }
        fn(feedback);
        try{
            fs.unlinkSync(`./tmpcode/${baseFilename}/${filename}`);
            fs.rmdirSync(`./tmpcode/${baseFilename}`)
        } catch (err) {
            console.log(err);
        }
        return;
    }

    //Running the code
    command = `java Main`;
    try{
        let run;
        if(input == "") {
            run = execSync(command, {cwd:`./tmpcode/${baseFilename}`,timeout: 5000, stdio: ['pipe','pipe','pipe']});
        } else {
            run = execSync(command, {cwd:`./tmpcode/${baseFilename}`,input: input,timeout: 5000, stdio: ['pipe','pipe','pipe']});
        }
        let feedback = {
            stdout: run.toString(),
            stderr: null
        }
        fn(feedback)
    } catch(err) {
        if(err.code == 'ETIMEDOUT') {
            let feedback = {
                stdout: null,
                stderr: 'Code timed-out (possibly went into a never-ending loop)'
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

    fs.readdir(`./tmpcode/${baseFilename}`, (err,files) => {
        files.forEach(file => {
            fs.unlinkSync(`./tmpcode/${baseFilename}/${file}`);
        })

        fs.rmdirSync(`./tmpcode/${baseFilename}`)
    })
    
}