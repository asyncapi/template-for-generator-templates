[![AsyncAPI logo](./assets/github-repobanner-generic.png)](https://www.asyncapi.com)  

_This repository is a template for generator templates to make it much easier to start writing your own generator template._

Now, wait a minute. First, what is the Generator? Second, what is the generator template?
A generator is a tool that you can use to generate whatever you want to base on the AsyncAPI specification file as an input.
Generator knows what to generate because you supplement it with a generator template. The template is a project where you provide all the files that must be generated using available generator features.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Minimum for your template](#minimum-for-your-template)
- [How to reuse this template](#how-to-reuse-this-template)
- [Technical Requirements](#technical-requirements)
- [Template development hints](#template-development-hints)
- [Learning Resources](#learning-resources)
- [How to use this template without modifications](#how-to-use-this-template-without-modifications)
- [What you get with this template](#what-you-get-with-this-template)
  * [Sample template that presents generator features and best practices in using them](#sample-template-that-presents-generator-features-and-best-practices-in-using-them)
    + [Template](#template)
      - [File component](#file-component)
      - [Template Context](#template-context)
        * [AsyncAPI Document](#asyncapi-document)
        * [Parameters Passed To Generator By The User](#parameters-passed-to-generator-by-the-user)
      - [Custom (reusable) components](#custom-reusable-components)
      - [Using JS in template](#using-js-in-template)
      - [Retrieve rendered content from children](#retrieve-rendered-content-from-children)
      - [Render component to string](#render-component-to-string)
    + [Render multiple files](#render-multiple-files)
    + [Hooks](#hooks)
      - [Custom template hooks](#custom-template-hooks)
      - [Official AsyncAPI hooks](#official-asyncapi-hooks)
    + [Configuration](#configuration)
      - [`renderer`](#renderer)
      - [`parameters`](#parameters)
      - [`nonRenderableFiles`](#nonrenderablefiles)
      - [`generator`](#generator)
      - [`hooks`](#hooks)
  * [Handling circular references](#handling-circular-references)
  * [Documenting the template](#documenting-the-template)
  * [(Optional) Tests for each feature of the template](#optional-tests-for-each-feature-of-the-template)
  * [(Optional) Release pipeline based on GitHub Actions and Conventional Commits specification](#optional-release-pipeline-based-on-github-actions-and-conventional-commits-specification)
  * [(Optional) Quality assurance](#optional-quality-assurance)
  * [What about the `package.json` and `package-lock.json` files](#what-about-the-packagejson-and-package-lockjson-files)
- [Contributors](#contributors)

<!-- tocstop -->

# Minimum for your template

The most basic template must have the following:

- `template` directory, this is where you keep the files that determine the output that will be generated. In other words, the Generator processes all the files stored in this directory.
- `package.json` this file is necessary even if your template doesn't need any external dependencies. Before the generation process runs, the Generator must install the template into its dependencies, and `package.json` is necessary to identify the template name.

What are all the other directories and files? This template provides an example that includes: all of the best practices; a demonstration of the generator features; and anything else needed to provide a production-ready template. In the next section, we will cover which features are required and which features are optional.

# How to reuse this template

This repository is a GitHub template repository. Use it by just clicking the **Use this template** button visible on this repository's home page or check the [official documentation](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).

There is nothing :sunglasses: here, there are no :fireworks: after creating a repository using this template. It is not going to scaffold a project for you with some custom values (like, for example, [Yeoman](https://yeoman.io/)). It just creates a boilerplate repository that includes all the features, which you then manually modify or remove. It is just simplifies starting a new project to use a template. Alternatively, if you are not using GitHub, or simply do not want to expose your Generator templates origin as a GitHub template, you can just clone this repository locally and then push to your Git hosting service.

# Technical Requirements

The Generator is a Node.js application. Therefore, the template also depends on Node.js. The generator's technical requirements are:

- Node.js v12.16+
- npm v6.13.7+

Install both using [official installer](https://nodejs.org/en/download/).

After that you can install the [AsyncAPI Generator](https://github.com/asyncapi/generator) globally to use its CLI:

```bash
npm install -g @asyncapi/generator
```

# Template development hints

The most straightforward command to use this template is:

```bash
ag https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml https://github.com/asyncapi/template-for-generator-templates -o output
```

For local development, you will need variations of this command. 

There are three important CLI flags:

- `--debug` enables the debug mode in Nunjucks engine what makes filters debugging simpler, 
- `--watch-template` enables a watcher of changes that you make in a template. It regenerates your template whenever it detects a change,
- `--install` enforces reinstallation of the template

There are two ways you can work on template development:

- Use the global Generator and the local template source directory:

  ```bash
  # assumption is that you run this command from the root of your template
  ag https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml ./ -o output
  ```

- Use both the Generator and the template from a local source directory. This approach provides more options when debugging such as the awesome `console.log` in the Generator sources or even the Parser located in `node_modules` of the Generator:
  
  ```bash
  # assumption is that you run this command from the root of your template
  # assumption is that generator sources are cloned on the same level as the template
  ../generator/cli.js https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml ./ -o output
  ```

# Learning Resources

WHen developing a new template, please refer to the following documentation:

- [Generator documentation](https://github.com/asyncapi/generator/blob/master/docs)
- [React SDK documentation](https://github.com/asyncapi/generator-react-sdk)
- [React documentation](https://en.reactjs.org/docs/getting-started.html)
- [AsyncAPI JavaScript Parser API reference](https://github.com/asyncapi/parser-js/blob/master/API.md)

Also, remember that you can join us in [Slack](https://www.asyncapi.com/slack-invite/)

# How to use this template without modifications

To run templates, you need to [install](https://github.com/asyncapi/generator/#install-the-cli) the Generator.

```bash
# This repo has a special AsyncAPI example with complex schema dependencies to get a more complex Mermaid diagram as a sample
ag https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml https://github.com/asyncapi/template-for-generator-templates -o output
open output/index.html
```

# What you get with this template

Every resource in this repository is essential for the overall template setup. Nevertheless, not all the resources are necessary, and if you are not interested in everything, you can remove or modify certain parts. Every resource in this repo is part of the template, except for the `.gitignore` file that is just standard for Git repositories. Check the next sections to understand the meaning of a given resource and what you will lose if you remove it or do not configure it correctly.

## Sample template that presents generator features and best practices in using them

The Generator depends on either the [React](https://github.com/asyncapi/generator-react-sdk) (if you're using React) or [Nunjucks](https://mozilla.github.io/nunjucks/) (if you're using Nunjucks) templating engine. You can choose whichever one you prefer. Each rendering engine has a different way of working and a different set of features. Keep the template engine choice in mind when you are familiarizing yourself with the Generator functionality. This repository is focused on `React` renderer. If you want to use `Nunjucks`, check old [`nunjucks`](https://github.com/asyncapi/template-for-generator-templates/tree/nunjucks) branch.

The list of resources that are relevant for this template:

- `template` is a directory where you keep all the files that will be processed by the Generator using React. Only files with the `.js`, `.jsx` and `.cjs` extensions are taken and processed by the Generator. The rest are skipped.
- `hooks` is a directory containing [**hooks**](#hooks), which are special JavaScript functions. Hooks are a native generator feature, and not related to the render engine. It allows you to plug into different stages of the generation process with some custom logic.

> **NOTE**: The reusable parts (components/helpers) can be located both in the `template` folder or in another named folder. The only exception is the `hooks` folder, it is reserved solely for the Generator.

Templates are highly configurable. This template also showcases most of the configuration options. Configurations are stored in the `package.json` file in the [`generator`](#configuration) section.

This template contains an example implementation of all those features.

### Template

Checkout the [`template`](template) directory to see how the different features of the generator are presented.

#### File component

For the generator to render a file with React certain conditions are required:

1. The file should export a default function (example see the [`template/index.js`](template/index.js) file).
2. That function should return a `<File>` component as root component which contains the necessary metadata for the Generator to render the file. Returning `null`, `undefined` or another negative value forces the Generator to not create the file. Metadata contains:
  - `name` describes the filename for which should be used when generating the file. If none is specified the filename for the template are used.
  - `permissions` describes the permissions the file should be created with. This is interpreted as an octal number such as `0o777`.

```js
/*
 * Each template to be rendered must have as a root component a File component,
 * otherwise it will be skipped.
 * 
 * If you don't want to render anything, you can return `null` or `undefined` and then Generator will skip the given template.
 */
export default function({ asyncapi, params }) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  // Notice that root component is the `File` component.
  return (
    <File name="index.html">
      <HTML>
        ...
      </HTML>
    </File>
  )
}
```

#### Template Context

The Generator passes to the render engine extra context, which you can access in templates:

- `originalAsyncAPI` is a String of original AsyncAPI document that the user passed to the Generator.
- `asyncapi` is a parsed AsyncAPI document with all additional functions and properties. You should use it to access document contents.
- `params` is an Object with all the parameters passed to the Generator by the user.

##### AsyncAPI Document

Check out the [template/index.js](template/index.js) file to see an example of how you can access the contents of the AsyncAPI document:

```js
/*
 * Notice also how to retrieve passed properties to custom component, by the destruction of the first argument.
 * Accessing document data is made easier thanks to the AsyncAPI JavaScript Parser - https://github.com/asyncapi/parser-js.
 */
function BodyContent({ asyncapi }) {
  const apiName = asyncapi.info().title();
  const channels = asyncapi.channels();

  // rest of implementation...
}
```

When accessing AsyncAPI document contents, use the Parser's [API documentation](https://github.com/asyncapi/parser-js/blob/master/API.md).

##### Parameters Passed To Generator By The User

Check out the [template/index.js](template/index.js) file to see an example of how you can access custom parameters passed by the user:

```js
export default function({ asyncapi, params }) {
  return (
    <File name="index.html">
      ...
      <Scripts params={params} />
      ...
    </File>
  );
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
```

#### Custom (reusable) components

Check out the [template/index.js](template/index.js) file to see an example how you can create reusable components and use them inside template:

```js
// Import custom components from file 
import { HTML, Head, Body } from "../components/common";

/* 
 * Below you can see how reusable chunks (components) could be called.
 * Just write a new component (or import it) and place it inside the File or another component.
 * 
 * Notice that you can pass parameters to components. In fact, underneath, each component is a pure Javascript function.
 */
export default function({ asyncapi, params }) {
  ...
  const cssLinks = [
    'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css',
    'style.css',
  ];

  // Notice that root component is the `File` component.
  return (
    <File name="index.html">
      <HTML>
        <Head cssLinks={cssLinks} />
        <Body>
          <BodyContent asyncapi={asyncapi} />
          ...
        </Body>
      </HTML>
    </File>
  );
}

// Custom component inside template file
function BodyContent({ asyncapi }) {
  // implemntation...
}
```

Each custom component must returns as output pure `string`, another custom component, `null` or `undefined`. Nothing will be rendered for the last two.

The recommended place to create reusable chunks is the `components` folder, for helper functions it is the `helpers` folder. The reusable parts (components/helpers) can be located both in the `template` folder and in another named folder. The only exception is the `hooks` folder, it is reserved for the Generator.

#### Using JS in template

When you use React, you are actually using JS, so you can apply conditions to rendering, split functionality into separate/reusable functions, create a composition, extend/mix functions etc.

```js
/* 
 * If asyncapi has `externalDocs` property then the Generator will return appropriate string,
 * otherwise it won't render anything.
 */
function ExternalDocs({ asyncapi }) {
  if (!asyncapi.hasExternalDocs()) return null;
  return `Don't forget to visit our website ${asyncapi.externalDocs().url()}.`
}
```

#### Retrieve rendered content from children

Each component has a `childrenContent` property. It is the processed children content of a component into a pure string. You can use it for compositions in your component.

```js
function CustomComponent({ childrenContent }) {
  return `some text at the beginning: ${childrenContent}`
}

function RootComponent() {
  return (
    <CustomComponent>
      some text at the end.
    </CustomComponent>
  );
}
```

Then output from `RootComponent` will be `some text at the beginning: some text at the end.`.

#### Render component to string

If you need to process the React component to string you should use `render` function from `@asyncapi/generator-react-sdk` package. This function transforms a given component (and its children) and returns the pure string representation. Look in [template/index.js](template/index.js) to see an example usage:

```js
import { render } from "@asyncapi/generator-react-sdk";

function BodyContent({ asyncapi }) {
  ...
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
```

### Render multiple files

To render multiple files, it is enough to return an array of `File` components in the rendering component. Template file [template/schemas/schema.js](template/schemas/schema.js) is an example of such a case:

```js
export default function({ asyncapi }) {
  const schemas = asyncapi.allSchemas();
  // schemas is an instance of the Map
  return Array.from(schemas).map(([schemaName, schema]) => {
    const name = normalizeSchemaName(schemaName);
    return (
      <File name={`${name}.html`}>
        <SchemaFile schemaName={schemaName} schema={schema} />
      </File>
    );
  });
}

function SchemaFile({ schemaName, schema }) {
  // implementation...
}
```

This one template file results in multiple HTML files, one per schema.

### Hooks

Hooks are functions called by the generator on a specific moment in the generation process. For more details, read about [hooks](https://github.com/asyncapi/generator/blob/master/docs/hooks.md).

#### Custom template hooks

Check out the [hooks/generateExtraFormats.js](hooks/generateExtraFormats.js) file to see an example of a hook. The hook is invoked by the Generator once the template generation process completes. The Generator passes its context to hooks, which mean that you have access to data like `targetDir` (a path to the directory where the template is generated), or `templateParams` (information about custom parameters passed by the user). This example hook provides optional features to the template, like PNG/PDF/SVG generation, that the user decides on with custom parameters. That is not the only use case for a hook. There are many more use cases such as template cleanup operations after generation or modifications of the AsyncAPI document right before the generation.

Important things to notice:

- Hooks, like the filter, are regular JavaScript functions that can have dependencies, for example: `const puppeteer = require('puppeteer');` that you will need to add to your `package.json` file.
- Remember to specify the hook type for your function:
  
  ```js
  module.exports = {
    'generate:after': yourFunction
  }
  ```

- The Generator is a library that also has a CLI. Parameters passed to the template using the CLI are always of String type. This means that even if your parameter accepts Boolean values like true/false, you still need to treat them as a String value:
  
  ```js
  const parameters = generator.templateParams;
  if (parameters['pdf'] === 'true') await page.pdf({ format: 'A4', path: `${targetDir}/index.pdf` });
  ```

#### Official AsyncAPI hooks

Hooks are reusable between templates. The AsyncAPI Initiative provides a library of hooks. You can also create a library for your own templates; you will need to add the library to `dependencies` in the `package.json` file and configure in `generator.hooks` section like this:

```json
{
  ...
  "generator": {
    ...
    "hooks": [
      "@asyncapi/generator-hooks": "createAsyncapiFile"
    ]
  }
}
```

Notice that you can specify one or many hooks that you want to reuse from the library instead of all the hooks. In this template, we use `createAsyncapiFile` responsible for creating the `asyncapi.yaml` file in the directory where template files get generated. This hook also supports custom parameters that I can specify in my configuration:

```json
"generator": {
  "parameters": {
    "asyncapiFileDir": {
      "description": "Custom location of the AsyncAPI file that you provided as an input into generation. By default, it is located in the root of the output directory."
    }
  }
}
```

Using, for example, the Generator CLI, you can, for example, pass `-p asyncapiFileDir=nested/dir`, and as a result, you will get `asyncapi.yaml` file in `nested/dir` directory.

### Configuration

Put the configuration of the Generator in the `package.json` file in the `generator` section. This template covers most of the configuration options.

#### `renderer`

You can write template using tool which you prefer more. The template engine can be either `react` (recommended) or `nunjucks` (default). This can be controlled with the `renderer` property.

```json
"generator": {
  "renderer": "react"
}
```

#### `parameters`

Templates can be customized using parameters. Parameters allow you to create more flexible templates. They can be required and also have default values that make their usage in template code less complicated. In this template, you have:

- `asyncapiFileDir` parameter is used in a reusable hook. For more details, see [Official AsyncAPI hooks](#official-asyncapi-hooks).
- `pdf`, `png` and `svg` parameters are used in custom hook. For more details see [Custom template hooks](#custom-template-hooks).
- `maxTextSize` parameter is used in a template file. For more details see [Parameters passed to generator by the user](#parameters-passed-to-generator-by-the-user).

```json
"generator": {
  "parameters": {
    "asyncapiFileDir": {
      "description": "Custom location of the AsyncAPI file that you provided as an input to generation. By default, it is located in the root of the output directory."
    },
    "pdf": {
      "description": "Set to `true` to get index.pdf generated next to your index.html",
      "default": false
    },
    "png": {
      "description": "Set to `true` to get index.png generated next to your index.html",
      "default": false
    },
    "svg": {
      "description": "Set to `true` to get index.svg generated next to your index.html",
      "default": false
    },
    "maxTextSize": {
      "description": "It is possible that in case of huge AsyncAPI document default mermaid recommended text size will not be enough. Then you need to make it larger explicitly",
      "default": 50000
    }
  }
}
```

#### `nonRenderableFiles`

This template has the binary and `.css` files that should not be rendered by the Generator to avoid generation errors.

```json
"generator": {
  "nonRenderableFiles": [
    "style.css"
  ]
}
```

> **NOTE**: All mentioned files in the `nonRenderableFiles` field are copied to the output folder.

#### `generator`

The `generator` property is used to specify the Generator's versions which your template is compatible with. The template depends on the Generator version. In case of new major releases of the Generator, this ensures that your template will not fail due to any breaking changes.

```json
"generator": {
  "generator": ">=1.1.0 <2.0.0"
}
```

#### `hooks`

This template uses hooks from the official AsyncAPI Generator hooks library. For more details, read [Official AsyncAPI hooks](#official-asyncapi-hooks).

```json
"generator": {
  "hooks": {
    "@asyncapi/generator-hooks": "createAsyncapiFile"
  }
}
```

## Handling circular references

Schemas provided in the AsyncAPI document may contain circular references. This is not an error; circular references in the data model can happen. The Generator doesn't provide any features to handle circular references. Inside the template, the Generator gives you access to parsed AsyncAPI document with all the functions provided by AsyncAPI JavaScript Parser. In this way, indirectly, you get access to helpers for circular references. For more details see [this](https://github.com/asyncapi/parser-js/#circular-references) paragraph.

This template demonstrates providing support for handling circular refs in objects and their properties. 

In the `generateMermaidDiagram` function in [helpers/mermaidDiagram.js](helpers/mermaidDiagram.js) note the usage of the `circularProps()` function, where we check if the property that you want to add to the diagram, introduces a circlular reference:

```js
const circularProp = schema.circularProps() && schema.circularProps().includes(propName);
classContent += circularProp ? `${propName} [CIRCULAR] ${propValueMap.type()}\n` : `${propName} ${propValueMap.type()}\n`;
```

Later in the same file there is an example of how to recursive traversing in the case of a circular reference:

```js
if (propertySchema.circularProps() && propertySchema.circularProps().includes(propName)) return;
recursiveSchema(propertySchema, callback, prop);
```

If you are at an early stage of template development and do not have time to handle circular references, you can still confirm whether a given AsyncAPI document contains circular references by calling `asyncapi.hasCircular()` and provide a helpful error message to the user. This is always better than the less informative `RangeError: Maximum call stack size exceeded`.

## Documenting the template

[The](_README.md) file is a sample readme provided for this template. Use it as a guideline for writing your own template readmes.

## (Optional) Tests for each feature of the template

This is the list of resources that are relevant, and you can remove them if you do not want to use this feature:
- `test` directory with all the tests

If you remove them, you should also remove `@asyncapi/parser`, `@asyncapi/generator`, `jest`, `@babel/preset-env` and `@babel/preset-react` from `devDependencies` in the `package.json` file and test-related configuration from the `jest` and `babel` sections.

This template is tested using the [Jest](https://jestjs.io/) framework. There are tests for all integral template parts, filters, hooks, and the template generation result itself. Jest-related configuration from the `package.json` file are there only because the code coverage tool conflicts with the [puppeeteer](https://github.com/puppeteer/puppeteer) library. It is possible that you do not need it in your template.

These are the contents of the `test` directory:

- `components` where you can find unit tests for the custom components
- `hooks` where you can find a snapshot test of the hook generating PNG and SVG files. In other words, a test that generates extra files, check their content and compares to the previous successful result of the test
- `helpers` where you can find unit tests for the function that generates a diagram
- `template` where you can find aa snapshot test of template generation result.

This template generates static files, so there are no examples of integration tests that would, for example, start a generated application to test if it works with a real broker.

> NOTE:  The`@babel/preset-env` dependency is needed to transform your code to the appropriate version of NodeJS that you're using.  The `@babel/preset-react` dependency is needed to transform JSX expressions into normal JS functions.  The `babel` section in the `package.json` applies the [BabelJS](https://babeljs.io/) configuration to the `jest`.
  
## (Optional) Release pipeline based on GitHub Actions and Conventional Commits specification

The release pipeline is based on [GitHub Actions](https://github.com/features/actions) and [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. In case you are using a different CI/CD solution or do not like to have commit messages prefixed with text like `fix: ` or `feat: ` then you should read the rest of this section carefully to understand what files should be removed.

If you want to keep this pipeline, make sure that you modify not only proper files but also put valid [secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) in your repository settings:

- `NPM_TOKEN` is a token you need to take from [npm](https://www.npmjs.com/) to make it possible to publish template to the package manager in the name of your user. In case you do not want to publish to any package manager and just use the template directly from the Git repository, then only make sure to clean up the release pipeline.
- `GITHUB_TOKEN` doesn't have to be provided in repository secrets. It is always there in the context of GitHub action and represents the `github-actions` user.

This is the list of resources that are relevant for this part, and you can remove them if you do not want to use it:

- [.github/workflows/pull-request-testing.yml](.github/workflows/pull-request-testing.yml) workflow handles automated testing of changes introduces in a pull request.
- [.github/workflows/automerge.yml](.github/workflows/automerge.yml) workflow handless automated merging of a pull request created by the bot to bump the template version in the `package.json` file. The best approach is always to create a separate bot user that handles automation, but you can also use `github-actions` bot.
- [.github/workflows/update-docs-on-docs-commits.yml](.github/workflows/update-docs-on-docs-commits.yml) workflow is responsible for updating the table of contents in the `README.md` file. You need to modify GitHub logins and emails by following comments from the file. In the `package.json` file, you can find the `markdown-toc` package in `devDependencies` and a corresponding script `generate:readme:toc`. In case you do not want to have a table of contents and related dependencies and automation, you need to remove all those resources and the `npm run generate:readme:toc` step from the `.github/workflows/release.yml` document
- [.github/workflows/release.yml](.github/workflows/release.yml) workflow is responsible for releasing the package to [npm](https://www.npmjs.com/) and creating a pull request with version change in the `package.json` file. 
- [.github/workflows/.releaserc](.github/workflows/.releaserc) is a config needed for `semantic-release`

## (Optional) Quality assurance

This is the list of resources that are relevant for this part, and you can remove them if you do not want to use this feature:

- `.eslintignore` is a file where you can specify resources that should not be validated.
- `.eslintrc` is a file where you keep the configuration of [ESLint](https://eslint.org/) and related plugins. This template, by default, uses plugins for:
  - [Jest](https://jestjs.io/) that is used in this template as a testing framework
  - [eslint-plugin-security](https://github.com/nodesecurity/eslint-plugin-security) that is used for security validation of the code
  - [SonarJS ruleset](https://github.com/SonarSource/eslint-plugin-sonarjs) that is an official plugin from [SonarSource](https://www.sonarsource.com/). We recommend integrating [SonarCloud](https://sonarcloud.io/) with the template, as we do for all our AsyncAPI projects
  - [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) that is used for validation and linting React components in the code.

You can remove both files in case you do not want to use ESLint. Keep in mind, though, that after removing them, you should also remove related packages from the `package.json` from the `devDependencies` section:

- `eslint`
- `eslint-plugin-jest`
- `eslint-plugin-security`
- `eslint-plugin-sonarjs`
- `eslint-plugin-react`

You should also remove the `lint` script from the `scripts` section of the `package.json` file.

## What about the `package.json` and `package-lock.json` files

The `package.json` is the central part of the template. You cannot remove it. You can only modify it by following instructions from previous sections.

Whenever you make a change to `package.json` make sure you perform an update with `npm install` to synchronize with `package-lock.json` and validate if the file is not broken after your changes

# Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://dev.to/derberg"><img src="https://avatars1.githubusercontent.com/u/6995927?v=4" width="100px;" alt=""/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="https://github.com/asyncapi/template-for-generator-templates/commits?author=derberg" title="Code">💻</a> <a href="https://github.com/asyncapi/template-for-generator-templates/commits?author=derberg" title="Documentation">📖</a> <a href="#design-derberg" title="Design">🎨</a> <a href="#ideas-derberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-derberg" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/bszwarc"><img src="https://avatars1.githubusercontent.com/u/17266942?v=4" width="100px;" alt=""/><br /><sub><b>Barbara Szwarc</b></sub></a><br /><a href="https://github.com/asyncapi/template-for-generator-templates/pulls?q=is%3Apr+reviewed-by%3Abszwarc" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/magicmatatjahu"><img src="https://avatars2.githubusercontent.com/u/20404945?v=4" width="100px;" alt=""/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="https://github.com/asyncapi/template-for-generator-templates/commits?author=magicmatatjahu" title="Documentation">📖</a> <a href="https://github.com/asyncapi/template-for-generator-templates/commits?author=magicmatatjahu" title="Code">💻</a> <a href="#ideas-magicmatatjahu" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
