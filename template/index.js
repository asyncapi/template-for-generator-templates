/*
 * In every file when you use JSX you must import `react` package. 
 * More info here https://medium.com/@Zwenza/why-do-you-need-to-import-react-in-functional-components-7385e4329ffb
 */
import React from "react";
import { File, render } from "@asyncapi/generator-react-sdk";

import { HTML, Head, Body } from "../partials/common";
import { ListChannels } from "../partials/ListChannels";
import { DiagramContent } from "../partials/DiagramContent";

/*
 * Below you can see how reusable chunks (components) could be called.
 * Just write a new component (or import it) and place it inside the File component.
 * 
 * Notice that you can pass parameters to components. In fact, underneath, each component is a pure Javascript function.
 * 
 * Very importants: Each template to be rendered must have as a root component a File component or an array of File components,
 * otherwise it will be skipped.
 */
export default function({ asyncapi, params }) {
  const cssLinks = [
    'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css',
    'style.css',
  ];

  return (
    <File name="index.html">
      <HTML>
        <Head cssLinks={cssLinks} />
        <Body>
          <BodyContent asyncapi={asyncapi} />
          <Scripts params={params} />
        </Body>
      </HTML>
    </File>
  )
}

/*
 * Below you can see how reusable chunks could be called in another way.
 * If you need process the React component to string you should use `render` function from `@asyncapi/generator-react-sdk` package.
 * This function transforms given component (and its children) and return pure string.
 * 
 * Notice how to retrieve passed properties to component, by the destruction of the first argument.
 */
function BodyContent({ asyncapi }) {
  const apiName = asyncapi.info().title();
  const channels = asyncapi.channels();

  return `
<div class="container mx-auto px-4">        
  <p> 
    <h1>${apiName}</h1>
    ${render(<ListChannels channels={channels} operationType='subscribe' />)}
    ${render(<ListChannels channels={channels} operationType='publish' />)}
    ${render(<DiagramContent asyncapi={asyncapi} />)}
    ${render(<Extension asyncapi={asyncapi} />)}
    ${render(<ExternalDocs asyncapi={asyncapi} />)}
  </p> 
</div>  
`;
}

/*
 * This is an example how you can access values from AsyncAPI file from its extensions
 */
function Extension({ asyncapi }) {
  if (!asyncapi.info().hasExt('x-twitter')) return '';
  return `Share your feedback with us on <a href="http://twitter.com/${asyncapi.info().ext('x-twitter')}">Twitter</a>.`
}

function ExternalDocs({ asyncapi }) {
  if (!asyncapi.hasExternalDocs()) return '';
  return `Don't forget to visit our website ${asyncapi.externalDocs().url()}.`
}

/*
 * You can access "maxTextSide" parameter value without any conditions in case user didn't provide such a parameter. 
 * It is possible thanks to the functionality that makes it possible for template developer to specify default values for parameters.
 * Check out package.json file and look for `generator.parameters.maxTextSize` and its description and default value.
 */
function Scripts({ params }) {
  return `
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    maxTextSize: ${params.maxTextSize},
  });
</script>
`;
}
