const { existsSync } = require('fs');
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.join(path.resolve(__dirname, '../../'), 'test/fixtures/dummy.yml');
//you always want to generate to new directory to make sure test runs in clear environment
const outputDir = path.resolve('test/temp/generateExtraFormats', Math.random().toString(36).substring(7));

describe('generateExtraFormats()', () => {
  jest.setTimeout(30000);

  beforeAll(async() => {
    const generator = new Generator(path.resolve(__dirname, '../../'), outputDir, { 
      forceWrite: true,
      templateParams: {
        svg: 'true',
        png: 'true',
        pdf: 'true'
      }
    });
    await generator.generateFromFile(dummySpecPath);
  });
  
  it('svg diagram file is generated', async () => {
    const svg = existsSync(path.join(outputDir, 'index.svg'));
    expect(svg).toBeTruthy();
  });

  it('png diagram file is generated', async () => {
    const png = existsSync(path.join(outputDir, 'index.png'));
    expect(png).toBeTruthy();
  });

  it('pdf diagram file is generated', async () => {
    const pdf = existsSync(path.join(outputDir, 'index.pdf'));
    expect(pdf).toBeTruthy();
  });
});
  