const exec = require('./promise-exec');
const fs = require('fs').promises;
const cuid = require('cuid');

exports.compile = async (code, input, fn) => {
    //Writing code to a temporary file
    let baseFilename = cuid.slug();
    let filename = baseFilename + ".java";
    
    await fs.mkdir(`./tmpcode/${baseFilename}`) 
    await fs.writeFile(`./tmpcode/${baseFilename}/${filename}`, code)
    
    //Compiling the code
    let command = `javac ${filename}`;
    try{
        let { stdout, stderr } = await exec(command, {cwd: `./tmpcode/${baseFilename}`, timeout: 5000})
    } catch(err) {
        let feedback = {
            stdout: null,
            stderr: err.stderr
        }
        fn(feedback);
        await fs.unlink(`./tmpcode/${baseFilename}/${filename}`);
        await fs.rmdir(`./tmpcode/${baseFilename}`);
        return;
    }


    //Running the code
    command = `java Main`;
    try{
        let { stdout, stderr } = await exec(command, {cwd: `./tmpcode/${baseFilename}`, timeout: 5000},input==""? null:input)
        let feedback = {
            stdout, 
            stderr
        }
        fn(feedback)
    } catch(err) {
        if(err.err.killed || err.stderr == "") {
            let feedback = {
                stdout: null,
                stderr: 'Code timed out (possibly went into a never-ending loop)'
            }
            fn(feedback);
        } else {
            let feedback = {
                stdout: null,
                stderr: err.stderr
            }
            fn(feedback);
        }
    }

    let files = await fs.readdir(`./tmpcode/${baseFilename}`);
    files.forEach( async (file) => {
        await fs.unlink(`./tmpcode/${baseFilename}/${file}`);
    })
    await fs.rmdir(`./tmpcode/${baseFilename}`)  
}