'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var _s = require('underscore.string');
var glob = require('glob');
var async = require('async');

//TODO: this is (quite ironically) untested

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    var self = this;

    var libPath = path.resolve(process.cwd(), 'lib');
    var testPath = path.resolve(process.cwd(), 'test');

    async.parallel([
        function (cb) {
          glob('**/*.js', {cwd: libPath}, cb);
        },
        function (cb) {
          glob('**/*.js', {cwd: testPath}, cb);
        }
      ],
      handleGlobs
    );

    function handleGlobs(err, result) {
      console.log(err, result);
      if (err) {
        return done(err);
      }
      var libFiles = result[0];
      var testFiles = result[1];

      var untestedLibs = libFiles.filter(hasTest).map(prefixWithLib);

      self.prompt(
        [
          {
            type: 'checkbox',
            name: 'filesToTest',
            message: 'What files should I create tests for?',
            choices: untestedLibs
          }
        ],
        function (answers) {
          self.filesToTest = answers.filesToTest;
          done();
        }
      );

      function prefixWithLib(file) {
        return path.join('lib', file);
      }

      function hasTest(file) {
        var suffixedFile = file.replace(/\.js$/, '-test.js');
        for (var i = 0; i < testFiles.length; i++) {
          var testFile = testFiles[i];

          if (
            testFile === file ||
            testFile === suffixedFile ||
            testFile === 'lib/' + file ||
            testFile === 'lib/' + suffixedFile
          ) {
            return false;
          }
        }
        return true;
      }
    }
  },

  writing: {
    app: function () {
      this.filesToTest.forEach(function (file) {
        var testFile = 'test/' + file.replace(/^lib\//, '').replace(/\.js$/, '-test.js');
        var requirePath = path.relative(path.dirname(testFile), file);
        var uncamelName = path.basename(file, '.js');
        var camelName = _s.camelize(uncamelName);

        this.fs.copyTpl(
          this.templatePath('test.js'),
          this.destinationPath(testFile),
          {
            uncamelName: uncamelName,
            camelName: camelName,
            requirePath: requirePath,
            constructor: false
          }
        )
      }, this);
    }
  }
});
