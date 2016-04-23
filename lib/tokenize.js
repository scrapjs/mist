'use strict';

var EOL = require('os').EOL;

module.exports = function tokenize(input, opts, recurse) {
  opts = opts || {};
  recurse = recurse || {output: [], index: 0};
  var output = recurse.output;
  var index = recurse.index;
  var subject = input.slice(index).toString();
  var test;

  if (index >= input.length) {
    return output;
  }

  var indent = opts.indent || '  ';
  if (!(input.indexOf(indent, index) - index)) {
    recurse.index += indent.length;
    output.push({
      type: 'indent',
      value: indent
    });

    return tokenize(input, opts, recurse);
  }

  var declare = opts.declare || '-';
  if (!(input.indexOf(declare, index) - index)) {
    recurse.index += declare.length;
    output.push({
      type: 'declare',
      value: declare
    });

    return tokenize(input, opts, recurse);
  }

  var linebreak = opts.EOL || EOL || '\n';
  if (!(input.indexOf(linebreak, index) - index)) {
    recurse.index += linebreak.length;
    output.push({
      type: 'linebreak',
      value: linebreak
    });

    return tokenize(input, opts, recurse);
  }

  var whitespace = opts.whitespace || ' ';
  if (!(input.indexOf(whitespace, index) - index)) {
    recurse.index += linebreak.length;
    output.push({
      type: 'whitespace',
      value: whitespace
    });

    return tokenize(input, opts, recurse);
  }

  var text = opts.text || /^(.+)$/m;
  test = subject.match(text);
  if (test) {
    recurse.index += test[1].length;
    output.push({
      type: 'text',
      value: test[1]
    });

    return tokenize(input, opts, recurse);
  }
};