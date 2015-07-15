'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('new-lib:app', function () {

  function run(prompts, done){
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts(prompts)
      .on('end', done);
  }

  it('in lib folder', function (done) {
    run({ dir: 'lib', camelName:'myModule' }, function() {
      assert.file([
        'lib/my-module.js',
        'test/my-module-test.js'
      ]);
      assert.fileContent('test/my-module-test.js', "require('../lib/my-module.js')");
      done();
    });
  });

  it('in root folder', function (done) {
    run({ dir: '.', camelName:'rootModule' }, function() {
      assert.file([
        'root-module.js',
        'test/root-module-test.js'
      ]);
      assert.fileContent('test/root-module-test.js', "require('../root-module.js')");
      done();
    });
  });

  it('in sub-lib folder', function(done) {
    run({dir:'lib/sublib/', camelName:'subLibModule'}, function() {
      assert.file([
        'lib/sublib/sub-lib-module.js',
        'test/sublib/sub-lib-module-test.js'
      ]);
      assert.fileContent(
        'test/sublib/sub-lib-module-test.js',
        "require('../../lib/sublib/sub-lib-module.js')"
      );
      assert.noFileContent('test/sublib/sub-lib-module-test.js', 'new');
      done();
    });
  });

  it('in non-lib folder', function(done) {
    run({dir:'non-lib', camelName:'nonLib'}, function() {
      assert.file([
        'non-lib/non-lib.js',
        'test/non-lib/non-lib-test.js'
      ]);
      assert.fileContent(
        'test/non-lib/non-lib-test.js',
        "require('../../non-lib/non-lib.js')"
      );
      assert.noFileContent('test/non-lib/non-lib-test.js', 'new');
      done();
    });
  });

  it('constructor', function(done) {
    run({dir:'lib/', camelName:'MyConstructor'}, function() {
      assert.file([
        'lib/my-constructor.js',
        'test/my-constructor-test.js'
      ]);
      assert.fileContent(
        'test/my-constructor-test.js',
        'myConstructor = new MyConstructor()'
      );
      done();
    });
  });

});
