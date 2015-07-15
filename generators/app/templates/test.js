describe('<%= uncamelName %>', function() {
  var assert = require('assert');
  var <%= camelName %> = require('<%= requirePath %>');
<% if (constructor) { %>
  var <%= instanceName %>;
  beforeEach(function(){
    <%= instanceName %> = new <%= camelName %>();
  })
<% } %>

  it('has tests', function() {
    assert.fail('you need to write tests for <%= uncamelName %>');
  });
});
