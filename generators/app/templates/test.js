'use strict';
var assert = require('assert');
var <%= camelName %> = require('<%= requirePath %>');

describe('<%= uncamelName %>', function () {<% if (constructor) { %>
  var <%= instanceName %>;
  beforeEach(function () {
    <%= instanceName %> = new <%= camelName %>();
  });<% } %>
  it('has tests', function () {
    assert.fail('you need to write tests for <%= uncamelName %>');
  });
});
