'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var caseCamel = require('case-camel');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    var prompts = [
      {
        name: 'camelName',
        message: 'What is the Module name?'
      },
      {
        name: 'dir',
        default: 'lib',
        message: 'What subdirectory?'
      }
    ];

    this.prompt(prompts, function (props) {
      var camelName = props.camelName;
      var firstChar = props.camelName.charAt(0);
      var constructor = firstChar === firstChar.toUpperCase();
      var instanceName = firstChar.toLowerCase() + camelName.slice(1);
      var uncamelName = caseCamel.parse(camelName).join('-');
      var libPath, testPath, requirePath;


      if (props.dir === 'lib') {
        libPath = 'lib' + path.sep + uncamelName + '.js';
        testPath = 'test' + path.sep + uncamelName + '-test.js';
      } else {
        var start = 'lib' + path.sep;
        libPath = props.dir + path.sep + uncamelName + '.js';
        if (props.dir.indexOf(start) === 0) {
          testPath = 'test' + props.dir.substr(3) + path.sep + uncamelName + '-test.js';
        } else {
          testPath = 'test' + path.sep + props.dir + path.sep + uncamelName + '-test.js';
        }
      }

      requirePath = path.relative(path.dirname(testPath), libPath);

      this.templateContext = {
        camelName: camelName,
        uncamelName: uncamelName,
        libPath: libPath,
        testPath: testPath,
        requirePath: requirePath,
        constructor: constructor,
        instanceName: instanceName
      };

      done();

    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('test.js'),
        this.destinationPath(this.templateContext.testPath),
        this.templateContext
      );
      this.fs.copyTpl(
        this.templatePath('lib.js'),
        this.destinationPath(this.templateContext.libPath),
        this.templateContext
      );
    }
  }
});
