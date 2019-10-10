const fs = require('fs');
const c = require('./util/c.js');
const python3 = require('./util/python3.js');
const java = require('./util/java.js');

exports.init = () => {
    try{
        fs.accessSync('./tmpcode')
    } catch(err) {
        fs.mkdirSync('./tmpcode');
    }
}

exports.compile = (code,source,input,fn) => {
    switch(code) {
        case 1: 
            c.compile(source,input,fn,1); // Compiling C
            break;
        case 2:
            c.compile(source,input,fn,2); // Compiling C++
            break;
        case 3: 
            python3.compile(source,input,fn,1); // Python 3
            break;          
        case 4:
            java.compile(source,input,fn);
            break;
        case 5:
            python3.compile(source,input,fn,2) // Python 2 
    }
}
