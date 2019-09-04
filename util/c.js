const fs = require('fs').promises;
const exec = require('./promise-exec');
const cuid = require('cuid');

exports.compile = async (code, input, fn, langCode) => {
    //Writing code to a temporary file
    let baseFilename = cuid.slug();
    let filename = baseFilename + ".c";
    await fs.writeFile("./tmpcode/" + filename, code)
    
    //Compiling the code
    let command = langCode == 1 ? `gcc ${filename} -o ${baseFilename} -lm` : `g++ ${filename} -o ${baseFilename}`;

    try{
        let { stdout, stderr } = await exec(command, {cwd: './tmpcode', timeout: 5000});
    } catch(err) {
        let feedback = {
            stdout: null,
            stderr: err.stderr
        }
        fn(feedback);
        await fs.unlink('./tmpcode/' + filename)
        return;
    }


    //Running the code
    command = `./${baseFilename}`;
    try{
        let { stdout, stderr } = await exec(command, {cwd: './tmpcode', timeout: 5000},input==""? null:input)
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

    await fs.unlink('./tmpcode/' + filename)
    await fs.unlink('./tmpcode/' + baseFilename)
}