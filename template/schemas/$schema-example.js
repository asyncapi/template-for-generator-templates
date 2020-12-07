import React from "react";
import { File } from "@asyncapi/generator-react-sdk";
import { generateExample } from "@asyncapi/generator-filters";

import { HTML, Head, Body, convertMapToObject, normalizeSchemaName } from "../../partials/common";

/*
 * You can also return an array containing unique File components as the result of the template.
 * Then the generator will reprocess each component and write the contents to a file.
 * Note that you can conditionally name each file or return null, then the generator will skip the component.
 */
export default function({ asyncapi }) {
  const schemasMap = convertMapToObject(asyncapi.allSchemas());
  return Object.entries(schemasMap).map(([schemaName, schema]) => {
    const name = normalizeSchemaName(schemaName);
    return (
      <File name={`${name}.html`}>
        <SchemaFile schemaName={schemaName} schema={schema} />
      </File>
    );
  });
}

/*
 * Here you can see an example of using 3rd party functions (there from `@asyncapi/generator-filters` package) 
 * inside the template - `generateExample` function.
 */
function SchemaFile({ schemaName, schema }) {
  const content = `
<div class="container mx-auto px-4">       
  This is an example for ${schemaName} schema:
  <pre class="hljs mb-4 border border-grey-darkest rounded">
    <code>${generateExample(schema.json())}</code>
  </pre>
</div>  
`;

  return (
    <HTML>
      <Head cssLinks={['https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css']} />
      <Body>
        {content}
      </Body>
    </HTML>
  );
}
