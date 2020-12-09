const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecUrl = 'https://rawcdn.githack.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml';
//you always want to generate to new directory to make sure test runs in clear environment
const outputDir = path.resolve('test/temp', Math.random().toString(36).substring(7));
const generator = new Generator(path.resolve(__dirname, '../../'), outputDir, { 
  forceWrite: true,
  templateParams: {
    svg: 'true',
    png: 'true'
  }
});

describe('generateExtraFormats()', () => {
  it('generates correct svg diagram', async () => {
    await generator.generateFromURL(dummySpecUrl);
    const svg = await readFile(path.join(outputDir, 'index.svg'), 'utf8');
    expect(svg).toMatchSnapshot();
  });

  it('generates correct png diagram', async () => {
    await generator.generateFromURL(dummySpecUrl);
    const png = await readFile(path.join(outputDir, 'index.png'), 'utf8');
    expect(png).toMatchSnapshot();
  });
});
  