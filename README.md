<h5 align="center">
  <br>
  <a href="https://www.asyncapi.org"><img src="https://github.com/asyncapi/parser-nodejs/raw/master/assets/logo.png" alt="AsyncAPI logo" width="200"></a>
  <br>
  Template for Generator Templates
</h5>
<p align="center">
  <em>This repository is a template for generator templates to make it much easier to start writing your own generator template.</em>
</p>

Now, wait a minute. First, what is the Generator? Second, what is the generator template?
A generator is a tool that you can use to generate whatever you want to base on the AsyncAPI specification file as an input.
Generator knows what to generate because you supplement it with a generator template. The Template is a project where you provide all the files that must be generated using available generator features.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Minimum For Your Template](#minimum-for-your-template)
- [How To Reuse This Template](#how-to-reuse-this-template)
- [Technical Requirements](#technical-requirements)
- [Template Development Hints](#template-development-hints)
- [Template render engine](#template-render-engine)
- [Learning Resources](#learning-resources)
- [How To Use This Template Without Modifications](#how-to-use-this-template-without-modifications)
- [What You Get With This Template](#what-you-get-with-this-template)
  * [Sample Template That Presents Generator Features And Best Practices In Using Them](#sample-template-that-presents-generator-features-and-best-practices-in-using-them)
    + [React](#react)
      - [Template](#template)
        * [File component](#file-component)
        * [Template Context](#template-context)
          + [AsyncAPI Document](#asyncapi-document)
          + [Parameters Passed To Generator By The User](#parameters-passed-to-generator-by-the-user)
      - [Custom (reusable) components](#custom-reusable-components)
      - [Using JS in template](#using-js-in-template)
      - [Retrieve rendered content from children](#retrieve-rendered-content-from-children)
      - [Render component to string](#render-component-to-string)
      - [File Templates](#file-templates)
    + [Nunjucks](#nunjucks)
      - [Template](#template-1)
        * [Template Context](#template-context-1)
          + [AsyncAPI Document](#asyncapi-document-1)
          + [Parameters Passed To Generator By The User](#parameters-passed-to-generator-by-the-user-1)
        * [Using Filters](#using-filters)
          + [Nunjucks Built-In Filters](#nunjucks-built-in-filters)
          + [Official AsyncAPI Filters](#official-asyncapi-filters)
          + [Chaining Filters](#chaining-filters)
          + [Template Custom Filters](#template-custom-filters)
      - [Template Specific Filters](#template-specific-filters)
        * [What Else I Can Do?](#what-else-i-can-do)
      - [Partials](#partials)
        * [Includes](#includes)
        * [Macros](#macros)
      - [File Templates](#file-templates-1)
    + [Hooks](#hooks)
      - [Custom Template Hooks](#custom-template-hooks)
      - [Official AsyncAPI Hooks](#official-asyncapi-hooks)
    + [Configuration](#configuration)
      - [`renderer`](#renderer)
      - [`parameters`](#parameters)
      - [`nonRenderableFiles`](#nonrenderablefiles)
      - [`generator`](#generator)
      - [`filters`](#filters)
      - [`hooks`](#hooks)
  * [Handling Circular References](#handling-circular-references)
  * [Documenting The Template](#documenting-the-template)
  * [(Optional) Tests For Each Feature Of The Template](#optional-tests-for-each-feature-of-the-template)
  * [(Optional) Release Pipeline Based On GitHub Actions And Conventional Commits Specification](#optional-release-pipeline-based-on-github-actions-and-conventional-commits-specification)
  * [(Optional) Quality Assurance](#optional-quality-assurance)
  * [What About The `package.json` and `package-lock.json` Files](#what-about-the-packagejson-and-package-lockjson-files)
- [Contributors](#contributors)

<!-- tocstop -->

# Minimum For Your Template

Most basic Template must have the following:

- `template` directory where you keep files that at the end are ending up in the result of generation. In other words, the Generator processes all the files stored in this directory.
- `package.json` file that is necessary even if your Template doesn't need any external dependencies. Before the generation process, the Generator must install the Template in its dependencies, and `package.json` is necessary to identify the template name.

Why this Template has so many additional directories and files? It is because the purpose of this Template is to provide you with an example that has all the best practices included, generator features presented, plus the extra stuff that is needed to provide a production-ready template. In the next section, you learn what features are included and which ones are optional.

# How To Reuse This Template

This repository is a GitHub template repository. Use it by just clicking the **Use this template** button visible on this repository's home page or check the [official documentation](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).

There is nothing :sunglasses: here, no :fireworks: after creating a repository using it as a template. It is not going to scaffold a project for you with some custom values (like, for example, [Yeoman](https://yeoman.io/) works). It is a boilerplate with all the features included that you can manually modify or remove. It just makes it easier to start a new project from a template. In case you are not using GitHub or simply do not want to show that your Generator template comes from a GitHub template, clone this repository and push manually to your desired Git hosting service.

# Technical Requirements

The Generator is a Node.js application. Therefore, template features also depend on Node.js and generator technical requirements:

- Node.js v12.16+
- npm v6.13.7+

Install both using [official installer](https://nodejs.org/en/download/).

Now install the [AsyncAPI Generator](https://github.com/asyncapi/generator) globally to use it as CLI:

```bash
npm install -g @asyncapi/generator
```

# Template Development Hints

The most straightforward command to use this Template is:

```bash
ag https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml https://github.com/asyncapi/template-for-generator-templates -o output
```

For local development, you need different variations of this command. First of all, you need to know about three important CLI flags:

- `--debug` enables the debug mode in Nunjucks engine what makes filters debugging simpler, 
- `--watch-template` enables a watcher of changes that you make in the Template. It regenerates your Template whenever it detects a change,
- `--install` enforces reinstallation of the Template

There are two ways you can work on template development:

- Use global Generator and Template from your local sources:

  ```bash
  # assumption is that you run this command from the root of your Template
  ag https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml ./ -o output
  ```

- Use Generator from sources and Template also from local sources. This approach enables more debugging options with awesome `console.log` in the Generator sources or even the Parser located in `node_modules` of the Generator:
  
  ```bash
  # assumption is that you run this command from the root of your Template
  # assumption is that generator sources are cloned on the same level as the Template
  ../generator/cli.js https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml ./ -o output
  ```

# Template render engine

The [Generator](https://github.com/asyncapi/generator) supports feature called templating engine. You can write template using tool which you prefer more. The template engine at the moment can be either [React](https://github.com/asyncapi/generator-react-sdk) (recommended) or [Nunjucks](https://mozilla.github.io/nunjucks/) (default). This can be controlled with the `renderer` property in the [template configuration](#renderer).

# Learning Resources

Alwasy during template development consult for this documentation:

- [Generator documentation](https://github.com/asyncapi/generator/blob/master/docs/authoring.md)
- [AsyncAPI JavaScript Parser API reference](https://github.com/asyncapi/parser-js/blob/master/API.md)

Additional resources for the React:

- [React SDK documentation](https://github.com/asyncapi/generator-react-sdk)
- [React documentation](https://en.reactjs.org/docs/getting-started.html)

Additional resources for the Nunjucks:

- [Nunjucks documentation](https://mozilla.github.io/nunjucks/getting-started.html)

Also, remember that you can join us in [Slack](https://www.asyncapi.com/slack-invite/)

# How To Use This Template Without Modifications

To run templates, you need to [install](https://github.com/asyncapi/generator/#install-the-cli) the Generator.

```bash
# This repo has a special AsyncAPI example with complex schema dependencies to get a more complex Mermaid diagram as a sample
ag https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml https://github.com/asyncapi/template-for-generator-templates -o output
open output/index.html
```

# What You Get With This Template

Every resource in this repository is essential for the overall template setup. Nevertheless, not all the resources are necessary, and in case you are not interested in everything, you can remove or modify certain parts. Every resource in this repo is part of the Template, except for the `.gitignore` file that is just standard for Git repositories. This is why you should first check the next sections to understand the meaning of a given resource and what you lose if you remove it or do not configure correctly.

## Sample Template That Presents Generator Features And Best Practices In Using Them

Generator depends on [React](https://github.com/asyncapi/generator-react-sdk) or [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine. You can choose the one you prefer. Each render engine has a different way of working and a different set of features. Keep that in mind when familiarizing with the Generator functionality.

Templates are highly configurable. This Template also showcases most of the configuration options used in action. Configurations are stored in the `package.json` file in the [`generator`](#configuration) section.

Both React and Nunjucks template has `hooks` directory. It's a place where you keep hooks that are special JavaScript functions. The [Hooks](#hooks) is a native Generator feature, not related to React or Nunjucks. It allows you to plug into different stages of the generation process with some custom logic.

This Template contains an example implementation of all features includes in the Generator, both in React and in Nunjucks.

### React

The list of resources that are relevant for this Template using React:

- `template` is a directory where you keep all the files that will be processed by the Generator using React. Only files with the `.js`, `.jsx` and `.cjs` extensions are taken and processed by the Generator. The rest are skipped.
- `partials` is a directory where you keep reusable parts (called also components) of the templates. You can also put there helper functions to handle perform actions on AsyncAPI data inside components.

> **NOTE**: `partials` directory is recommended place to split reusable chunks/helpers. The reusable parts can be located both in the `template` folder as in another named folder. The only exception is the `hooks` folder, it is reserved for the Generator.

> **NOTE**: If you are using React as a rendering engine, you should delete the given folders which are related to Nunjucks: `filters`, `template_njk`, `partials_njk`.

#### Template

Checkout [`template`](template) directory to see how different features of the generator are presented.

##### File component

For the generator to render a file with React certain conditions are required:

1. The file should export a default function (example see the [`template/index.js`](template/index.js) file).
2. That function should return a `<File>` component as root component which contains the necessary metadata for the Generator to render the file. Returning `null`, `undefined` or another negative value forces the Generator to not create the file. Metadata contains:
  - `name` describes the filename for which should be used when generating the file. If none is specified the filename for the template are used.
  - `permissions` describes the permissions the file should be created with. This is interpreted as an octal number such as .

```js
/*
 * Each template to be rendered must have as a root component a File component or an array of File components,
 * otherwise it will be skipped.
 * 
 * If you don't want to render anything, you can return `null` and the Generator will skip the given template.
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

##### Template Context

Generator passes to render engine extra context that you can access in templates:

- `originalAsyncAPI` is a String of original AsyncAPI document that the user passed to the Generator.
- `asyncapi` is a parsed AsyncAPI document with all additional functions and properties. You should use it to access document contents.
- `params` is an Object with all the parameters passed to the Generator by the user.
- ...and other parameters related to the [`File templates`](https://github.com/asyncapi/generator/blob/master/docs/authoring.md#file-templates) feature.

###### AsyncAPI Document

Check out [template/index.js](template/index.js) file to see an example of how you can access the contents of the AsyncAPI document:

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

When accessing AsyncAPI document contents, use Parser's [API documentation](https://github.com/asyncapi/parser-js/blob/master/API.md).

###### Parameters Passed To Generator By The User

Check out [template/index.js](template/index.js) file to see an example of how you can access custom parameters passed by the user:

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

Check out [template/index.js](template/index.js) file to see an example how you can create reusable components and use them inside template:

```js
// Import custom components from file 
import { HTML, Head, Body } from "../partials/common";

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

Recommended place to create reusable chunks is the `partials` folder. The reusable parts can be located both in the `template` folder as in another named folder. The only exception is the `hooks` folder, it is reserved for the Generator.

#### Using JS in template

When you use React, you are actually using JS, so you can apply conditions to rendering, split functionality into separate/reusable functions, create compisition, extend/mix functions etc.

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

If you need to process the React component to string you should use `render` function from `@asyncapi/generator-react-sdk` package. This function transforms a given component (and its children) and returns the pure string representation. You can check the [template/index.js](template/index.js) to see how it could by done:

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

#### File Templates

The Generator has a feature called [`file templates`](https://github.com/asyncapi/generator/blob/master/docs/authoring.md#file-templates) that allows you to create a template file with special that has `$$` markers, like `$$schema$$`. There are multiple different file templates available. In this Template, during generation, `$$schema$$` is replaced with a schema name, and Template gets the following variables in the context:

- `schema` that is a Schema object map
- `schemaName` that is the name of the schema

Template file [template/schemas/$$schema$$.js](template/schemas/$$schema$$.js) is an example of such a file template:

```js
export default function({ schemaName, schema }) {
  const name = normalizeSchemaName(schemaName);
  return (
    <File name={`${name}-example.html`}>
      <SchemaFile schemaName={schemaName} schema={schema} />
    </File>
  );
}

function SchemaFile({ schemaName, schema }) {
  // implementation...
}
```

This one template file results in multiple HTML files, one per schema.

### Nunjucks

The list of resources that are relevant for this Template using Nunjucks:

- `template_njk` is a directory where you keep all the files that will be processed by the Generator using Nunjucks. 
- `partials_njk` is a directory where you keep [reusable parts](https://mozilla.github.io/nunjucks/templating.html#include) of the templates. You can also put there [Nunjucks macros](https://mozilla.github.io/nunjucks/templating.html#macro) that are like includes but customizable as you can pass custom arguments to them like to functions.
- `filters` is a directory where you keep filters later used in files from the `template_njk` directory. Filters are normal JavaScript functions that you can apply to Nunjucks variables in the template files. It is [native Nunjucks functionality](https://mozilla.github.io/nunjucks/templating.html#filters), and we are just making it easier to provide them.

> **NOTE**: If you are using Nunjucks as a rendering engine, you should delete the given folders which are related to React: `template`, `partials`. You should also change names of folders: `template_njk` -> `template` and `partials_njk` -> `partials`, remove the `renderer` field from [`generator`](#configuration) section and remove `react`, `@asyncapi/generator-react-sdk` and `source-map-support` dependencies in the `package.json` file under `dependencies` field.

#### Template

Checkout [`template_njk`](template_njk) directory to see how different features of the generator are presented.

##### Template Context

Generator passes to render engine extra context that you can access in templates:

- `originalAsyncAPI` is a String of original AsyncAPI document that the user passed to the Generator.
- `asyncapi` is a parsed AsyncAPI document with all additional functions and properties. You should use it to access document contents.
- `params` is an Object with all the parameters passed to the Generator by the user.
- ...and other parameters related to the [`File templates`](https://github.com/asyncapi/generator/blob/master/docs/authoring.md#file-templates) feature.

###### AsyncAPI Document

Check out [template_njk/index.html](template_njk/index.html) file to see an example of how you can access the contents of the AsyncAPI document:

```njk
<!-- If you have some information that you want to use in the Template more than once, you can set a variable and reuse it
Important to notice here is how the title of the AsyncAPI document is accessed. It is not protected from the situation that "info" or "title" 
are not provided in the document because there are not many required fields. 
To read more about Nunjucks Tag called set go to https://mozilla.github.io/nunjucks/templating.html#set -->
{% set apiName = asyncapi.info().title() %}

<!-- Below you can see how you access variable's value with double curly braces -->
<h1>{{ apiName }}</h1>
```

Accessing document data is made easier thanks to what AsyncAPI JavaScript Parser is doing to the AsyncAPI document. Have a look at [template_njk/index.html](template_njk/index.html) and this part of the Template:

```njk
Share your feedback with us on <a href="http://twitter.com/{{ asyncapi.info().extension('x-twitter') }}">Twitter</a>
```

When accessing AsyncAPI document contents, use Parser's [API documentation](https://github.com/asyncapi/parser-js/blob/master/API.md).

###### Parameters Passed To Generator By The User

Check out [template_njk/index.html](template_njk/index.html) file to see an example of how you can access custom parameters passed by the user:

```njk
/*
 * You can access "maxTextSide" parameter value without any conditions in case the user did not provide such a parameter. 
 * It is possible thanks to the functionality that makes it possible for template developers to specify default values for parameters.
 * Check out package.json file and look for generator.parameters.maxTextSize and its description and default value.
 */
maxTextSize: {{ params.maxTextSize }}
```

##### Using Filters

We can differentiate three types of filters in the Generator:

- default filters that are part of the Nunjucks templating engine
- generic filters provided by AsyncAPI Initiative
- your custom template filters

###### Nunjucks Built-In Filters

All built-in filters are listed [here](https://mozilla.github.io/nunjucks/templating.html#builtin-filters).

The most commonly used filter during template development is `dump` that internally calls `JSON.stringify` and allows you to render in your template file the entire object. Very useful during debugging. 

In [partials_njk/diagramContent.html](partials_njk/diagramContent.html) file there is a use case for `dictsort` filter:

```njk
<!-- Usage of build-in "dictsort" Nunjucks filter for sorting items alphabetically 
and how it works in a for loop -->
{% for schemaName in asyncapi.components().schemas() | dictsort %}
  <li>{{ schemaName[0] }}</li>
{% endfor %}
```

###### Official AsyncAPI Filters

AsyncAPI Initiative provides a library of filters. You can also create such a library for your templates. You add such a library to `dependencies` in the `package.json` file and configure in the `generator.filters` section like:

```json
{
  ...
  "generator": {
    ...
    "filters": [
      "@asyncapi/generator-filters"
    ]
  }
}
```

What you get in exchange:

- Access to all the filters listed [here](https://github.com/asyncapi/generator-filters/blob/master/docs/api.md#functions) like super useful `log` filter that works similar to Nunjucks `dump` filter but instead of dumping information in the template file, it logs it to the terminal.
- Access to all [Lodash](https://lodash.com/docs/4.17.15) functions that are made available as filters.

Check [partials_njk/diagramContent.html](partials_njk/diagramContent.html) to see how `log` filter is used. As you can see, it works like any other Nunjucks filter:

```njk
{{ "Template cannot generate proper diagram because you have no schemas defined in components section" | log }}
```

Also have a look at [template_njk/schemas/$$schema$$-example.html](template_njk/schemas/$$schema$$-example.html) file to see `generateExample` filter in action:

```html
<pre class="hljs mb-4 border border-grey-darkest rounded">
  <code>
    <!-- Here you can see an example of chaining filters and also usage of a filter provided by @asyncapi/generator-filters package -->
    {{ schema.json() | generateExample | safe }}
  </code>
</pre>
```

###### Chaining Filters

You can use more than one filter on values passed by Nunjucks. It is called chaining and is done using pipe `|` as you can in [template_njk/schemas/$$schema$$-example.html](template_njk/schemas/$$schema$$-example.html) file:

```html
<pre class="hljs mb-4 border border-grey-darkest rounded">
  <code>
    <!-- Here you can see an example of chaining filters and also usage of a filter provided by @asyncapi/generator-filters package -->
    {{ schema.json() | generateExample | safe }}
  </code>
</pre>
```

Also have a look at the [template_njk/index.html](template_njk/index.html) file to see how using chaining and Nunjucks built-in filters you can get a HTML link out of the link represented as a string:

```html
{% if asyncapi.hasExternalDocs() %}
  <!-- You can see chaining of filters here, where one value is processed by two filters, one after another -->
  Don't forget to visit our website {{ asyncapi.externalDocs().url() | urlize | safe }}.
{% endif %}
```

###### Template Custom Filters

Template custom filters are the ones attached to your Template. Check [Template specific filters](#template-specific-filters) section to understand how they work.

Custom filters do not have to be part of the Template, they can be released as a separate package. You do it when you have more than one Template that uses the same filter. There is, for example, an official library of filters provided by the AsyncAPI Initiative. Check [Official AsyncAPI Filters](#official-asyncapi-filters) section for more details.

#### Template Specific Filters

Check out [filters/mermaidDiagram.js](filters/mermaidDiagram.js) file to see an example of the custom filter that template developers can write for their template files. It exports a JavaScript function called `generateMermaidDiagram` that accepts parsed AsyncAPI document as an argument and returns a [Mermaid class diagram](https://mermaid-js.github.io/mermaid/#/) that visualizes the data model basing on schemas provided in the document.

Important things to notice:

- The file contains multiple functions, but only one is exported. It means you can also have private functions and use them in your filter function to better structure your code.
- It is good to properly validate the input passed to the filter and throw a clear error.

  ```js
   if (!asyncapi || typeof asyncapi.version !== 'function') throw new Error('You need to pass entire parsed AsyncAPI document as an argument. Try this "{{ asyncapi | generateMermaidDiagram }}"');
  ```
  As a result, you get a helpful error during template development like:

  ```js
  Error: You need to pass the AsyncAPI document as an argument. Try this "{{ asyncapi | generateMermaidDiagram }}"
  ```

  Instead of:
  
  ```js
  TypeError: asyncapi.hasChannels is not a function
  ```

  It is crucial because, by default, errors that are generated from Nunjucks do not tell you where exactly you have an error in your filter. You can try to use `--debug` flag when running generation during development, but it is helpful only in some instances.

- Parsed AsyncAPI document that you can access in the filter comes from the AsyncAPI JavaScript Parser. It provides you with extensive [API](https://github.com/asyncapi/parser-js/blob/master/API.md) that you can use to navigate through the document to extract certain parts from it, like for example:
  
  ```js
  const OPERATIONS = ['publish', 'subscribe'];

  asyncapi.channelNames().forEach(channelName => {
    const channel = asyncapi.channel(channelName);

    OPERATIONS.map((opName) => {
      const op = channel[opName]();
      if (!op) return;
        
      op.messages().forEach(m => {
        //logic responsible for processing every message in every operation
      });
    });
  });
  ```

- Example filter is used in [template_njk/index.html](template_njk/index.html) using Nunjucks syntax `{{ asyncapi | generateMermaidDiagram }}`

##### What Else I Can Do?

You can for example have conditions like in [partials_njk/diagramContent.html](partials_njk/diagramContent.html) file:

```html
{% if asyncapi.hasComponents() and asyncapi.components().schemas() %}
...
{% else %}
...
{% endif %}
```

Nunjucks templating engine is very powerful with many different options. Whenever you develop a template, always consult not only with Generator docs but also [Nunjucks docs](https://mozilla.github.io/nunjucks/templating.html).

#### Partials

In the `partials_njk` directory, you can find two files, one is an example of Nunjucks [include](https://mozilla.github.io/nunjucks/templating.html#include), and another one is a [macro](https://mozilla.github.io/nunjucks/templating.html#macro). Use this feature to partition your Template into smaller chunks that make future maintenance of the Template easier.

##### Includes

Check our [partials_njk/diagramContent.html](partials_njk/diagramContent.html) file to see how `includes` work. It is just a simple file with content that can be included in another file. Have a look at [partials_njk/index.html](partials_njk/index.html) file to understand how to use include:

```njk
{% include "partials/diagramContent.html" %}
```

##### Macros

Macros are like dynamic includes that change depending on the input that you pass to the macro. It is like a function with arguments. Check out [partials_njk/listChannels.html](partials_njk/listChannels.html) file to see an example macro called `listChannels`:

```html
{% macro listChannels(channels, operationType) %}
<h2>
  Channels that you can {{ operationType }} to
</h2>
<hr />
<br />
<div class="container mx-auto px-8">
  <ul class="list-disc"></ul>
    {% for channelName, channel in channels %}
      {% if operationType === 'publish' %} 
          {% if channel.hasPublish() %} 
              <li><strong>{{ channelName }}</strong></li>
          {% endif %}
      {% elif operationType === 'subscribe' %}
          {% if channel.hasSubscribe() %} 
              <li><strong>{{ channelName }}</strong></li>
          {% endif %}
      {% endif %}
    {% endfor %}
  </ul>
</div>
{% endmacro %}
```

This macro is used in the [template_njk/index.html](template_njk/index.html) file:

```njk
{% from "partials/listChannels.html" import listChannels %}
...
{{ listChannels(asyncapi.channels(), 'subscribe') }}
{{ listChannels(asyncapi.channels(), 'publish') }}
```

#### File Templates

The Generator has a feature called [`file templates`](https://github.com/asyncapi/generator/blob/master/docs/authoring.md#file-templates) that allows you to create a template file with special that has `$$` markers, like `$$schema$$`. There are multiple different file templates available. In this Template, during generation, `$$schema$$` is replaced with a schema name, and Template gets the following variables in the context:

- `schema` that is a Schema object map
- `schemaName` that is the name of the schema

Template file [template_njk/schemas/$$schema$$-example.html](template_njk/schemas/$$schema$$-example.html) is an example of such a file template:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container mx-auto px-4">       
      This is an example for {{schemaName}} schema:
      <pre class="hljs mb-4 border border-grey-darkest rounded">
        <code>
          <!-- Here you can see an example of chaining filters and also usage of a filter provided by @asyncapi/generator-filters package -->
          {{ schema.json() | generateExample | safe }}
        </code>
      </pre>
    </div>
  </body>
</html>
```

This one HTML template file results in multiple HTML files, one per schema.

### Hooks

Hooks are functions called by the generator on a specific moment in the generation process. For more details, read about [hooks](https://github.com/asyncapi/generator/blob/master/docs/authoring.md#hooks).

#### Custom Template Hooks

Check out [hooks/generateExtraFormats.js](hooks/generateExtraFormats.js) file to see an example of the hook. It is a hook that is invoked by the Generator after the template generation process is completed. Generator passes its context to hooks, which means you have access to data like `targetDir` that is a path to the directory where Template is generated, or `templateParams` with information about custom parameters passed by the user. This example hook provides optional features to the Template, like PNG/PDF/SVG generation, that the user decides on with custom parameters. That is not the only use case for the hook. There are more use cases like, for example, template cleanup operations after generation or modifications of the AsyncAPI document right before the generation.

Important things to notice:

- Hooks, like in the case of the filter, is a regular JavaScript function that can have its dependencies like `const puppeteer = require('puppeteer');` that you need to add to your `package.json` file.
- Remember to specify what hook type your hook function belongs to:
  
  ```js
  module.exports = {
    'generate:after': yourFunction
  }
  ```

- Generator is a library that also has a CLI. Parameters passed to the Template using CLI are always of String type. This means that even if your parameter accepts Boolean values like true/false, you still need to check them like a String value:
  
  ```js
  const parameters = generator.templateParams;
  if (parameters['pdf'] === 'true') await page.pdf({ format: 'A4', path: `${targetDir}/index.pdf` });
  ```

#### Official AsyncAPI Hooks

Hooks are reusable between templates. AsyncAPI Initiative provides a library of hooks. You can also create such a library for your templates. You add such a library to `dependencies` in the `package.json` file and configure in `generator.hooks` section like:

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

Notice that you can specify one or many hooks you want to reuse from the library instead of all the hooks. In this Template, we use `createAsyncapiFile` responsible for creating the `asyncapi.yaml` file in the directory where template files get generated. This hook also supports custom parameter that I can specify in my configuration:

```json
"generator": {
  "parameters": {
    "asyncapiFileDir": {
      "description": "Custom location of the AsyncAPI file that you provided as an input into generation. By default, it is located in the root of the output directory."
    }
  }
}
```

Using, for example, the Generator CLI, you can, for example, pass `-p asyncapiFileDir=nested/dir`, and as a result, you get `asyncapi.yaml` file in `nested/dir` directory.

### Configuration

Put configuration of the Generator in the `package.json` file in the `generator` section. This Template covers most of the configuration options.

#### `renderer`

You can write template using tool which you prefer more. The template engine can be either `react` (recommended) or `nunjucks` (default). This can be controlled with the `renderer` property.

```json
"generator": {
  "renderer": "react"
}
```

#### `parameters`

Templates can be customizable using parameters. Parameters allow you to create more flexible templates. They can be required and also have default values that make their usage in template code less complicated. In this Template, you have:

- `asyncapiFileDir` parameter is used in a reusable hook. For more details, read [Official AsyncAPI hooks](#official-asyncapi-hooks).
- `pdf`, `png` and `svg` parameters are used in custom template filter. For more details read [Template specific filters](#template-specific-filters).
- `maxTextSize` parameter is used in a template file. For more details read [Parameters passed to generator by the user](#parameters-passed-to-generator-by-the-user).

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

This Template has a binary and `.css` files that should not be rendered by the Generator to avoid generation errors.

```json
"generator": {
  "nonRenderableFiles": [
    "style.css",
    "sample.gif"
  ]
}
```

> **NOTE**: All mentioned files in the `nonRenderableFiles` field are copied to the output folder.

#### `generator`

The `generator` property is used to specify the Generator's versions is your Template compatible with. The Template depends on the Generator filters. In case of new major releases of the Generator, you want to make sure your Template will not fail because of possible breaking changes.

```json
"generator": {
  "generator": ">=1.0.0 <2.0.0"
}
```

#### `filters`

This Template uses filters from the official AsyncAPI Generator Filters library. For more details, read [Official AsyncAPI filters](#official-asyncapi-filters).

```json
"generator": {
  "filters": [
    "@asyncapi/generator-filters"
  ]
}
```

#### `hooks`

This template uses hooks from the official AsyncAPI Generator Filters library. For more details, read [Official AsyncAPI hooks](#official-asyncapi-hooks).

```json
"generator": {
  "hooks": {
    "@asyncapi/generator-hooks": "createAsyncapiFile"
  }
}
```

## Handling Circular References

Schemas provided in the AsyncAPI document may contain circular references. It is not an error; circular references in the data model can happen. The Generator doesn't provide any features to handle circular references. Inside the Template, the Generator gives you access to parsed AsyncAPI document with all the functions provided by AsyncAPI JavaScript Parser. This way, indirectly, you get access to special helpers for circular references. For more details read [this](https://github.com/asyncapi/parser-js/#circular-references) paragraph.

This Template showcases situation when you want to provide support for handling circular refs in objects and their properties. 

In the `generateMermaidDiagram` filter in [filters/mermaidDiagram.js](filters/mermaidDiagram.js) you see usage of `circularProps()` function, where you check if the property that you want to add to the diagram, is a property that introduces a circle:

```js
const circularProp = schema.circularProps() && schema.circularProps().includes(propName);
classContent += circularProp ? `${propName} [CIRCULAR] ${propValueMap.type()}\n` : `${propName} ${propValueMap.type()}\n`;
```

Later in the same file you see how recursive traversing is stopped in case circular reference is spotted:

```js
if (propertySchema.circularProps() && propertySchema.circularProps().includes(propName)) return;
recursiveSchema(propertySchema, callback, prop);
```

The great thing is that if you are at an early stage of template development and do not have time to handle circular references, you can easily spot that given AsyncAPI document contains circular references. You just call this `asyncapi.hasCircular()` and drop a proper error message to the user. It is always better than `RangeError: Maximum call stack size exceeded`.

## Documenting The Template

[This](_README.md) is a sample readme provided for this template that others should also use as a template for other readmes.

## (Optional) Tests For Each Feature Of The Template

This is the list of resources that are relevant for this part, and you can remove them if you do not want to use it:
- `test` directory with all the tests

You should also remove `@asyncapi/parser`, `@asyncapi/generator`, and `jest` from `devDependencies` in the `package.json` file and test-related configuration from the `jest` section.

This Template is tested using [Jest](https://jestjs.io/) framework. You can find here tests for all integral template parts, filters, hooks, and the template generation result itself. Jest-related configuration from the `package.json` file is there only because of the code coverage tool conflicts with [puppeeteer](https://github.com/puppeteer/puppeteer) library. It is possible that you do not need it in your Template.

These are the contents of the `test` director:

- `docs` where you can find a sample AsyncAPI file used for tests
- `filters` where you can discover Unit tests for the filter that generates a diagram
- `hooks` where you can find a snapshot test of the hook generating PNG and SVG files. In other words, a test that generates extra files, check their content and compares to the previous successful result of the test
- `template` where you can find a snapshot tests of template generation result.

This template generates static files, so you cannot find here examples of integration tests that would, for example, start a generated application to test if it works with a real broker.
  
## (Optional) Release Pipeline Based On GitHub Actions And Conventional Commits Specification

Release pipeline is based on [GitHub Actions](https://github.com/features/actions) and [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. In case you are using a different CI/CD solution or do not like to have commit messages prefixed with text like `fix: ` or `feat: ` then you should read the rest of this section carefully to understand what files should be removed.

If you want to keep this pipeline, make sure that you modify not only proper files but also put valid [secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) in your repository settings:

- `NPM_TOKEN` is a token you need to take from [npm](https://www.npmjs.com/) to make it possible to publish Template to the package manager in the name of your user. In case you do not want to publish to any package manager and just use the Template directly from the Git repository, then only make sure to clean up the release pipeline.
- `GITHUB_TOKEN` doesn't have to be provided in repository secrets. It is always there in the context of GitHub action and represents the `github-actions` user.

This is the list of resources that are relevant for this part, and you can remove them if you do not want to use it:

- [.github/workflows/pull-request-testing.yml](.github/workflows/pull-request-testing.yml) workflow handles automated testing of changes introduces in a pull request.
- [.github/workflows/automerge.yml](.github/workflows/automerge.yml) workflow handless automated merging of a pull request created by the bot to bump the template version in the `package.json` file. The best approach is always to create a separate bot user that handles automation, but you can also use `github-actions` bot.
- [.github/workflows/update-docs-on-docs-commits.yml](.github/workflows/update-docs-on-docs-commits.yml) workflow is responsible for updating the table of contents in the `README.md` file. You need to modify GitHub logins and emails by following comments from the file. In the `package.json` file, you can find the `markdown-toc` package in `devDependencies` and a corresponding script `gen-readme-toc`. In case you do not want to have a table of contents and related dependencies and automation, you need to remove all those resources and the `npm run gen-readme-toc` step from the `.github/workflows/release.yml` document
- [.github/workflows/release.yml](.github/workflows/release.yml) workflow is responsible for releasing the package to [npm](https://www.npmjs.com/) and creating a pull request with version change in the `package.json` file. In the `package.json` file, you can find the following `devDependencies` related to the release process:

  - @semantic-release/commit-analyzer
  - @semantic-release/github
  - @semantic-release/npm
  - @semantic-release/release-notes-generator
  - conventional-changelog-conventionalcommits

  These dependencies are configured in the `package.json` file in the `release` section. In case you are not interested in such a workflow, remember to remove this file and remove not needed parts from the `package.json` file, including `release` and `get-version` scripts.

## (Optional) Quality Assurance

This is the list of resources that are relevant for this part, and you can remove them if you do not want to use it:

- `.eslintignore` is a file where you can specify resources that should not be validated.
- `.eslintrc` is a file where you keep the configuration of [ESLint](https://eslint.org/) and related plugins. This Template, by default, uses plugins for:
  - [Jest](https://jestjs.io/) that is used in this template as a testing framework
  - [eslint-plugin-security](https://github.com/nodesecurity/eslint-plugin-security) that is used for security validation of the code
  - [SonarJS ruleset](https://github.com/SonarSource/eslint-plugin-sonarjs) that is an official plugin from [SonarSource](https://www.sonarsource.com/). We recommend integrating [SonarCloud](https://sonarcloud.io/) with the Template, as we do for all our AsyncAPI projects.

You can remove both files in case you do not want to use ESLint. Keep in mind, though, that after removing them, you should also remove related packages from the `package.json` from the `devDependencies` section:

- `eslint`
- `eslint-plugin-jest`
- `eslint-plugin-security`
- `eslint-plugin-sonarjs`

You should also remove the `lint` script from the `scripts` section of the `package.json` file.

## What About The `package.json` and `package-lock.json` Files

The `package.json` is the central part of the Template. You cannot remove it. You can only modify it by following instructions from previous sections.

Whenever you make a change to `package.json` make sure you perform an update with `npm install` to synchronize with `package-lock.json` and validate if the file is not broken after your changes

# Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://dev.to/derberg"><img src="https://avatars1.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="https://github.com/asyncapi/Template for Generator Templates/commits?author=derberg" title="Code">💻</a> <a href="https://github.com/asyncapi/Template for Generator Templates/commits?author=derberg" title="Documentation">📖</a> <a href="#design-derberg" title="Design">🎨</a> <a href="#ideas-derberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-derberg" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/bszwarc"><img src="https://avatars1.githubusercontent.com/u/17266942?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Barbara Szwarc</b></sub></a><br /><a href="https://github.com/asyncapi/Template for Generator Templates/pulls?q=is%3Apr+reviewed-by%3Abszwarc" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!