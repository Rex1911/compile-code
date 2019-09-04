const { exec } = require('child_process');

module.exports = (command, options, input = null) => {
    return new Promise((resolve,reject) => {
        let process = exec(command, options, (err, stdout, stderr) => {
            if(err) {
                reject({err,stdout,stderr})
                return;
            } else {
                resolve({stdout,stderr});
                return;
            }
        })

        if(input) {
            process.stdin.write(input);
            process.stdin.end();
        }
    })
}