import { generateMermaidDiagram } from '../helpers/mermaidDiagram';

/* 
 * You can use in components also normal JS function. It is important that a given function should returns a string or its derivative.
 *
 * Notice also how it is checked if schemas are provided: `asyncapi.hasComponents() && asyncapi.components().hasSchemas()`.
 * Using `asyncapi.components().schemas()` without first checking by `has*` functions is risky because components and schemas objects can still be empty.
 * Always when you see something useful could be added to the API of parsed AsyncAPI document, please create an issue 
 * https://github.com/asyncapi/parser-js/issues
 */
export function DiagramContent({ asyncapi }) {
  if (asyncapi.hasComponents() && asyncapi.components().hasSchemas()) {
    return schemasContent(asyncapi);
  }
  return fallback();
}

function schemasContent(asyncapi) {
  const schemasList = Object.keys(asyncapi.components().schemas())
    .sort()
    .map(schemaName => {
      return `<li><a href="schemas/${schemaName}.html">${schemaName}</a></li>`;
    }).join('');

  return `
<h2>Schemas</h2>
<hr>
You have the following schemas named in components section:
<div class="container mx-auto px-8">
  <ul class="list-disc">${schemasList}</ul>
</div>
<div class="mermaid">
  ${generateMermaidDiagram(asyncapi)}
</div>
`;
}

function fallback() {
  return `
You have no schemas in components sections. It most probably means that you have them directly under payload without using references. 
This is not a good practice because this way you cannot name your schemas, and we cannot generate a nice meaningfull diagram for you basing on schemas with anonymous name.
<br><br>
Sorry about that. Come back to us once you restructure your document.
<br><br>
<img src="sample.gif" alt="no go gif" width="200" height="200">  
`;
}
