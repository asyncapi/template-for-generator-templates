import React from "react";
import { File } from "@asyncapi/generator-react-sdk";
import { generateExample } from "@asyncapi/generator-filters";

import { HTML, Head, Body, normalizeSchemaName } from "../../partials/common";

/*
 * Generator has a feature called "file templates" that allows you to create a template file with special name with $$ markers,
 * like $$schema$$ (other types of file templates are available).
 * In case of this example, generator creates as many files as schemas you have in the components section of your AsyncAPI document.
 * $$schema$$ is replaced with the name of the schema
 * More info is here https://github.com/asyncapi/generator/blob/master/docs/authoring.md#file-templates
 */
export default function({ schemaName, schema }) {
  const name = normalizeSchemaName(schemaName);
  return (
    <File name={`${name}-example.html`}>
      <SchemaFile schemaName={schemaName} schema={schema} />
    </File>
  );
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
