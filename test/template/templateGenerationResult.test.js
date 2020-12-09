const { readFile } = require('fs').promises;
const { existsSync } = require('fs');
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecUrl = 'https://rawcdn.githack.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml';
//you always want to generate to new directory to make sure test runs in clear environment
const outputDir = path.resolve('test/temp/templateGenerationResult', Math.random().toString(36).substring(7));

describe('templateGenerationResult()', () => {
  jest.setTimeout(30000);
  console.log('outputDir', outputDir);
  console.log('template path', path.resolve(__dirname, '../../'));
  console.log('read path', path.join(outputDir, 'index.html'));

  beforeAll(async() => {
    const generator = new Generator(path.resolve(__dirname, '../../'), outputDir, { 
      forceWrite: true
    });
    await generator.generateFromURL(dummySpecUrl);
  });

  it('generated correct index.html with diagram source', async () => {
    console.log('read attempt');
    const html = existsSync(path.join(outputDir, 'index.html'));
    expect(html).toBeTruthy();

    const index = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    console.log(index);
    //expect(index).toMatchSnapshot();
  });
});