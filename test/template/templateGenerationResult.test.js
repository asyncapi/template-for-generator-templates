const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.join(path.resolve(__dirname, '../../'), 'test/fixtures/dummy.yml');
//you always want to generate to new directory to make sure test runs in clear environment
const outputDir = path.resolve('test/temp/templateGenerationResult', Math.random().toString(36).substring(7));

describe('templateGenerationResult()', () => {
  jest.setTimeout(100000);

  it('generated correct index.html with diagram source', async () => {
    const generator = new Generator(path.resolve(__dirname, '../../'), outputDir, { forceWrite: true, debug: true });
    await generator.generateFromFile(dummySpecPath);
    
    const index = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(index).toMatchSnapshot();
  });
});
