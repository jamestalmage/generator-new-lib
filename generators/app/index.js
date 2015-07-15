'use strict';
var yeoman = require('yeoman-generator');
var decamelize = require('decamelize');
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
      var instanceName = firstChar.toLowerCase() + camelName.substr(1);
      var uncamelName = decamelize(camelName, '-');
      var libPath, testPath, requirePath;

      if (!/[\\\/]$/.test(props.dir)) {
        props.dir += path.sep;
      }

      libPath = props.dir + path.sep + uncamelName + '.js';
      if (/^lib[\\\/]/.test(props.dir)) {
        testPath = 'test' + props.dir.substr(3) + uncamelName + '-test.js';
      } else {
        testPath = 'test' + path.sep + props.dir +  uncamelName + '-test.js';
      }

      requirePath = path.relative(path.dirname(testPath), libPath);

      this.libPath = libPath;
      this.testPath = testPath;
      this.templateContext = {
        camelName: camelName,
        uncamelName: uncamelName,
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
        this.destinationPath(this.testPath),
        this.templateContext
      );
      this.fs.copyTpl(
        this.templatePath('lib.js'),
        this.destinationPath(this.libPath),
        this.templateContext
      );
    }
  }
});
