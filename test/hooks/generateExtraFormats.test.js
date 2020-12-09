const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecUrl = 'https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml';

describe('generateExtraFormats()', () => {
  //you always want to generate to new directory to make sure test runs in clear environment
  const outputDir = path.resolve('test/temp', Math.random().toString(36).substring(7));
  console.log('__dirname', __dirname);
  const generator = new Generator(path.resolve(__dirname, '../../'), outputDir, { 
    forceWrite: true,
    templateParams: {
      svg: 'true',
      png: 'true'
    }
  });
  beforeAll(async () => {
    console.log('before generation');
    await generator.generateFromURL(dummySpecUrl);
    console.log('after generation');
  });

  it('generates correct svg diagram', async () => {
    const svg = await readFile(path.join(outputDir, 'index.svg'), 'utf8');
    expect(svg).toMatchSnapshot();
  });

  it('generates correct png diagram', async () => {
    const png = await readFile(path.join(outputDir, 'index.png'), 'utf8');
    expect(png).toMatchSnapshot();
  });
});
  