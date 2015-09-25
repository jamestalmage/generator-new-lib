# generator-new-lib [![Build Status](https://secure.travis-ci.org/jamestalmage/generator-new-lib.png?branch=master)](https://travis-ci.org/jamestalmage/generator-new-lib)

> [Yeoman](http://yeoman.io) generator for adding a new module to your project 
> (i.e. in the `lib` dir)


## Getting Started

```bash
npm install -g yo
npm install -g generator-new-lib
yo new-lib

? What is the Module name? myModule
? What subdirectory? (lib) lib 
```

Creates two files `lib/my-module.js`, and `test/my-module-test.js`.
  Note how the file names have been converted from the camel case above.
The test file will be setup as a Mocha/Jasmine test, 
  and already have the appropriate require statement for the lib module.
If you supply a capitalized module name (`MyModule`), 
  it will assume the module returns a constructor and add an instance instantiation to the test:
  
```js
describe('my-module', function() {
  var assert = require('assert');
  var MyModule = require('../lib/my-module.js');
  
  // and if it's a constructor, the following is also added                  
  var myModule;
  beforeEach(function() {
    myModule = new MyModule();
  });
});
```

## new-lib:test generator

Scans your `lib` folder for files that do not have matching files in the `test` folder.
Lets you pick which files to generate tests for.

### Getting To Know Yeoman

Check out the [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

## License

MIT
