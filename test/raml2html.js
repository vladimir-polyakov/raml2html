const t = require('tap');
const execa = require('execa');
const path = require('path');

const raml = path.join(__dirname, './fixtures/api.raml');
const raml2html = path.join(__dirname, '../bin/raml2html');

// Remove path from snapshot
function sanitizePrettyOutput(output) {
  return output.replace(/^\[(.+)\] /gim, '');
}

t.test('raml2html', t => {
  t.test('with validation', t => {
    t.test('json errors', t => {
      const stderr = execa.stderr(raml2html, ['-v', raml], { reject: false });

      stderr.then(output => {
        t.matchSnapshot(output, 'json output');
        t.end();
      });
    });

    t.test('json errors suppress warnings', t => {
      const stderr = execa.stderr(
        raml2html,
        ['-v', '--suppress-warnings', raml],
        { reject: false }
      );

      stderr.then(output => {
        t.matchSnapshot(output, 'without warnings json output');
        t.end();
      });
    });

    t.test('pretty print', t => {
      const stderr = execa.stderr(raml2html, ['-v', '--pretty-errors', raml], {
        reject: false,
      });

      stderr.then(output => {
        t.matchSnapshot(sanitizePrettyOutput(output), 'pretty printed output');
        t.end();
      });
    });

    t.test('pretty print without warnings', t => {
      const stderr = execa.stderr(
        raml2html,
        ['-v', '--pretty-errors', '--suppress-warnings', raml],
        { reject: false }
      );

      stderr.then(output => {
        t.matchSnapshot(sanitizePrettyOutput(output), 'pretty printed output');
        t.end();
      });
    });

    t.end();
  });

  t.end();
});
