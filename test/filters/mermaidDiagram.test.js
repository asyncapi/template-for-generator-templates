const parser = require('@asyncapi/parser');
const { generateMermaidDiagram } = require('../../filters/mermaidDiagram.js');
const dummySpecUrl = 'https://raw.githubusercontent.com/asyncapi/generator/master/test/docs/dummy.yml';

describe('generateMermaidDiagram()', () => {
  it('generates correct diagram', async () => {
    const expectedDiagram = 'classDiagramclass dummyCreated {          prop1 integerprop2 stringsentAt stringdummyArray arraydummyObject object}          dummyCreated --|> sentAtdummyCreated --|> dummyArraydummyCreated --|> dummyObjectclass sentAt {          string}          class dummyArray {          array}          dummyArray --|> dummyInfoclass dummyInfo {          prop1 stringsentAt string}          dummyInfo --|> sentAtclass dummyObject {          dummyObjectProp1 stringdummyObjectProp2 object}          dummyObject --|> sentAtdummyObject --|> dummyRecursiveObjectclass dummyRecursiveObject {          dummyRecursiveProp1 [CIRCULAR] objectdummyRecursiveProp2 string}          dummyRecursiveObject --|> dummyObject';
    const parsedAsyncapiDoc = await parser.parseFromUrl(dummySpecUrl);
    const diagram = generateMermaidDiagram(parsedAsyncapiDoc);
    //regex is for removign new lines and other stuff to get diagram in one line for easier testing with expectedDiagram
    expect(diagram.replace(/(\r\n|\n|\r)/gm, '')).toEqual(expectedDiagram);
  });

  it('generation fails as parsed asyncapi file is not passed to the function', () => {
    expect(() => generateMermaidDiagram('test')).toThrow('You need to pass entire parsed AsyncAPI document as an argument. Try this \"{{ asyncapi | generateMermaidDiagram }}\"');
  });

  it('generation fails as no argument is passed to the function', () => {
    expect(() => generateMermaidDiagram()).toThrow('You need to pass entire parsed AsyncAPI document as an argument. Try this \"{{ asyncapi | generateMermaidDiagram }}\"');
  });
});

