const { existsSync } = require('fs');
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecUrl = 'https://rawcdn.githack.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml';
//you always want to generate to new directory to make sure test runs in clear environment
const outputDir = path.resolve('test/temp', Math.random().toString(36).substring(7));
const generator = new Generator(path.resolve(__dirname, '../../'), outputDir, { 
  forceWrite: true,
  templateParams: {
    svg: 'true',
    png: 'true',
    pdf: 'true'
  }
});

describe('generateExtraFormats()', () => {
  jest.setTimeout(30000);

  it('svg diagram file is generated', async () => {
    await generator.generateFromURL(dummySpecUrl);
    const svg = existsSync(path.join(outputDir, 'index.svg'));
    expect(svg).toBeTruthy();
  });

  it('png diagram file is generated', async () => {
    await generator.generateFromURL(dummySpecUrl);
    const png = existsSync(path.join(outputDir, 'index.png'));
    expect(png).toBeTruthy();
  });

  it('pdf diagram file is generated', async () => {
    await generator.generateFromURL(dummySpecUrl);
    const pdf = existsSync(path.join(outputDir, 'index.pdf'));
    expect(pdf).toBeTruthy();
  });
});
  