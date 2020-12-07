import React from "react";
import { Indent, IndentationTypes, Text, withIndendation } from "@asyncapi/generator-react-sdk";

/*
 * Below you can see how to create reusable chunks/components/helpers.
 * Check the files in the `template` folder to see how to import and use them within a template.
 */

 /*
  * Each component has a `childrenContent` property.
  * It is the processed children content of a component into a pure string. You can use it for compositions in your component.
  * 
  * Example:
  * function CustomComponent({ childrenContent }) {
  *   return `some text at the beginning: ${childrenContent}`
  * }
  * 
  * function RootComponent() {
  *   return (
  *     <CustomComponent>
  *       some text at the end.
  *     </CustomComponent>
  *   );
  * }
  * 
  * then output from RootComponent will be `some text at the beginning: some text at the end.`.
  */
export function HTML({ childrenContent }) {
  return `
<!DOCTYPE html>
<html lang="en">
${childrenContent}
</html>
`;
}

/*
 * If you need indent content inside template you can use `withIndendation` function or wrap content between `Indent` component.
 * The mentioned helper and component can be imported from `@asyncapi/generator-react-sdk` package.
 */
export function Head({ cssLinks = [] }) {
  const links = cssLinks.map(link => `<link rel="stylesheet" href="${link}">\n`).join('');

  const content = `
<head>
  <meta charset="utf-8">
${withIndendation(links, 2, IndentationTypes.SPACES)}
</head>  
`;

  return (
    <Indent size={2} type={IndentationTypes.SPACES}>
      {content}
    </Indent>
  );
}

export function Body({ childrenContent }) {
  const content = `
<body>
${withIndendation(childrenContent, 2, IndentationTypes.SPACES)}
</body>
`;

  return (
    <Indent size={2} type={IndentationTypes.SPACES}>
      {content}
    </Indent>
  );
}

/*
 * Below you can see how to create components using composition.
 * You can use another component with the given parameters for the given use-case.
 */
export function Line({ childrenContent }) {
  return (
    <Text newLines={1}>
      {childrenContent}
    </Text>
  );
}

export function normalizeSchemaName(schemaName) {
  return schemaName.replace(/\<|\>/gm, '');
}

export function convertMapToObject(map) {
  const tempObject = {};
  for (const [key, value] of map.entries()) {
    tempObject[key] = value;
  }
  return tempObject;
}
