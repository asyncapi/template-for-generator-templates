const { readFile } = require('fs').promises;
const { existsSync } = require('fs');
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.join(path.resolve(__dirname, '../../'), 'test/fixtures/dummy.yml');
//you always want to generate to new directory to make sure test runs in clear environment
const outputDir = path.resolve('test/temp/templateGenerationResult', Math.random().toString(36).substring(7));

describe('templateGenerationResult()', () => {
  jest.setTimeout(100000);

  beforeAll(async() => {
    console.log('output dir', outputDir)
    console.log('template path', path.resolve(__dirname, '../../'))
    console.log('dummy path', dummySpecPath)
    console.log('dummy is exists', existsSync(dummySpecPath))
    const generator = new Generator(path.resolve(__dirname, '../../'), outputDir, { forceWrite: true });
    await generator.generateFromFile(dummySpecPath);
    console.log('index.html location', path.join(outputDir, 'index.html'))
    console.log('index.html is exists', existsSync(path.join(outputDir, 'index.html')))
  });

  it('generated correct index.html with diagram source', async () => {
    const index = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(index).toMatchSnapshot();
  });
});
