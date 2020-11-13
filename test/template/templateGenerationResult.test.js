const os = require('os');
const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecUrl = 'https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml';

describe('generateExtraFormats()', () => {
  //you always want to generate to new directory to make sure test runs in clear environment
  const outputDir = path.resolve(os.tmpdir(), Math.random().toString(36).substring(7));
  const generator = new Generator(path.resolve(__dirname, '../../'), outputDir);

  beforeAll(async () => {
    await generator.generateFromURL(dummySpecUrl);
  });

  it('generated correct index.html with diagram source', async () => {
    const index = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(index).toMatchSnapshot();
  });
});
  