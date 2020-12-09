const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecUrl = 'https://rawcdn.githack.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml';
//you always want to generate to new directory to make sure test runs in clear environment
const outputDir = path.resolve('test/temp/generateExtraFormats', Math.random().toString(36).substring(7));
const generator = new Generator(path.resolve(__dirname, '../../'), outputDir, { 
  forceWrite: true
});
describe('templateGenerationResult()', () => {
  jest.setTimeout(30000);

  it('generated correct index.html with diagram source', async () => {
    await generator.generateFromURL(dummySpecUrl);
    const index = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(index).toMatchSnapshot();
  });
});
  