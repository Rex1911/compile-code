const exec = require('./promise-exec')
const fs = require('fs').promises;
const cuid = require('cuid');

exports.compile =  async (code, input, fn, langCode) => {
    //Writing code to a temporary file
    let baseFilename = cuid.slug();
    let filename = baseFilename + ".py";
    await fs.writeFile("./tmpcode/" + filename, code)

    //Running the code
    let command;
    if(langCode == 1) {
        command = `python3 ${filename}`
    } else if(langCode == 2) {
        command = `python ${filename}`
    }
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

    //Deleting the files which were created
    await fs.unlink('./tmpcode/' + filename);
}