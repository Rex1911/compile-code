# compile-code
A Node module to compile code from different languages using NodeJS. Useful for making online compilers

Currently supported languages:
```
- C
- C++
- Python3
- Java
```

If you want a open-source online API service which compiles your code, checkout my other project [compile-code-docker](https://github.com/Rex1911/compile-code-docker) which takes this module and creates a ExpressJS API server inside a docker container where you can send your code to get compiled and get back the output. 

# Getting started
Download the module from npm

>npm i compile-code

Include the module into your code as
```javascript
const compiler = require('compile-code');
```

# Documentation
The module provides two functions:

* **compiler.init()**
  - This function must be run, before using the ```compile()``` function. It creates a folder named ```tmpcode``` where the code is stored and compiled.

* **compiler.compile(code, source, input, callback)**
  - Parameters:
    - code (Integer): Enter the code of the language you want to compile in. 
    
      | Language | Code |
      |----------|------|
      | C        | 1    |
      | C++      | 2    |
      | Python3  | 3    |
      | Java     | 4    |
    
    - source (String): Enter the source code which you want to compile
    
    - input (String): Enter the input which you want to give to the code. Pass a blank string if there is no input
    
    - callback (Function): The callback function to handle the result. The callback function takes these parametes
      - **data** (Object)
        - stdout: Contains the output. Empty if there is a error.
        - stderr: Contains the error message if there are any
      
# Example
A example program to print Hello World in C:
```C
const compiler = require('compile-code');

compiler.init()

compiler.compile(1, '#include<stdio.h>\n int main() {printf("Hello Wolrd"); return 0;}', "", (data) => {
    console.log(data);
})
```

Output: 
```
{ 
  stdout: 'Hello Wolrd', 
  stderr: null 
 }
```
