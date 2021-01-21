<!--   
The good readme should be easy to navigate through, therefore remember to add `markdown-toc` to devDependencies of your template and generate a table of contents by using the following script `"generate:readme:toc": "markdown-toc -i README.md"`
-->

<!-- toc -->

- [Overview](#overview)
- [Technical requirements](#technical-requirements)
- [Specification requirements](#specification-requirements)
- [Supported protocols](#supported-protocols)
- [How to use the template](#how-to-use-the-template)
  * [CLI](#cli)
  * [Docker](#docker)
- [Template configuration](#template-configuration)
- [Custom hooks that you can disable](#custom-hooks-that-you-can-disable)
- [Development](#development)
- [Contributors](#contributors)

<!-- tocstop -->

## Overview

<!--  
The overview should explain in just a few sentences the template's purpose and its most essential features.
-->

This template generates an HTML page with an overview of the data model provided in your AsyncAPI file. Its core part is the diagram showing relations between the data model. Except for HTML, you can also generate a PDF file from the HTML page or get the diagram into a separate PNG and SVG.

## Technical requirements

<!--  
Specify what version of the Generator is your template compatible with. This information should match the information provided in the template configuration under the `generator` property.
-->

- 1.1.0 =< [Generator](https://github.com/asyncapi/generator/) < 2.0.0,
- Generator specific [requirements](https://github.com/asyncapi/generator/#requirements)

## Specification requirements

<!--  
The template might need some AsyncAPI properties that normally are optional. For example code generator might require some specific binding information for a given protocol. Even though you can provide defaults or fallbacks, you should describe in the readme what is the most optimal set of properties that the user should provide in the AsyncAPI file.
-->

The table contains information on parts of the specification required by this template to generate the proper output.

Property name | Reason | Fallback | Default
---|---|---|---
`components.schemas` | This template supports only schemas that have unique and human-readable names. Such names can also be provided if schemas are described under `components.schemas` and each schema is a separate object with its unique key. | - | -

## Supported protocols

<!--  
Specify what protocols is your code generator supporting. This information should match the information provided in the template configuration under the `supportedProtocols` property. Don't put this section in your readme if your template doesn't generate code.
-->

_This template doesn't generate code and therefore is not limited to any specific protocols._

## How to use the template

<!--  
Make sure it is easy to try out the template and check what it generates. Instructions for CLI and Docker should be easy to use; just copy/paste to the terminal. In other words, you should always make sure to have ready to use docker-compose set up so the user can quickly check how generated code behaves.
-->

This template must be used with the AsyncAPI Generator. You can find all available options [here](https://github.com/asyncapi/generator/).

### CLI

```bash
npm install -g @asyncapi/generator
ag https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml https://github.com/asyncapi/template-for-generator-templates -o output
open output/index.html
```

### Docker

```bash
docker run --rm -it \
-v ${PWD}/output:/app/output \
asyncapi/generator -o /app/output https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml https://github.com/asyncapi/template-for-generator-templates --force-write
```

## Template configuration

<!--  
This information should match the information provided in the template configuration under the `parameters` property.
-->

You can configure this template by passing different parameters in the Generator CLI: `-p PARAM1_NAME=PARAM1_VALUE -p PARAM2_NAME=PARAM2_VALUE`

Name | Description | Required | Default | Allowed Values | Example
---|---|---|---|---|---
asyncapiFileDir | Custom location of the AsyncAPI file that you provided as an input in a generation. | No | The root of the output directory. | Path to the custom directory relative to the root of output directory provided as a string. | `/custom/dir`
pdf | Generates PDF from initially generated HTML file. | No | `false` | `true`/`false` | `true`
png | Generates PNG with a schemas relations diagram. | No | `false` | `true`/`false` | `true`
svg | Generates SVG with a schemas relations diagram. | No | `false` | `true`/`false` | `true`
maxTextSize | It is possible that if an AsyncAPI document is extremely large, the default mermaid recommended text size will not be enough. In such a case, you need to configure it explicitly. | No | `50000` |  A number higher than 50000 | `70000`

## Custom hooks that you can disable

<!--  
Document hooks that users can disable and template will still work as expected. Remember that a specific hook can be disabled only if it has a name. In other words, make sure your hook functions are not anonymous.
-->

The functionality of this template is extended with different hooks that you can disable like this in the Generator CLI: `-d HOOK_TYPE1=HOOK_NAME1,HOOK_NAME2 -d HOOK_TYPE2`

Type | Name | Description
---|---|---
generate:after | createAsyncapiFile | It creates AsyncAPI file with content of the spec file passed to the generator

## Development

<!--  
This section will look the same everywhere, just make sure it references your template.
-->

The most straightforward command to use this template is:
```bash
ag https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml https://github.com/asyncapi/template-for-generator-templates -o output
```

For local development, you need different variations of this command. First of all, you need to know about three important CLI flags:
- `--debug` enables the debug mode in Nunjucks engine what makes filters debugging simpler. 
- `--watch-template` enables a watcher of changes that you make in the template. It regenerates your template whenever it detects a change.
- `--install` enforces reinstallation of the template.

There are two ways you can work on template development:
- Use global Generator and template from your local sources:
  ```bash
  # assumption is that you run this command from the root of your template
  ag https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml ./ -o output
  ```
- Use Generator from sources and template also from local sources. This approach enables more debugging options with awesome `console.log` in the Generator sources or even the Parser located in `node_modules` of the Generator:
  ```bash
  # assumption is that you run this command from the root of your template
  # assumption is that generator sources are cloned on the same level as the template
  ../generator/cli.js https://raw.githubusercontent.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml ./ -o output
  ```

## Contributors

<!--  
Share who contributes to the project. Use [all-contributors](https://allcontributors.org/) specification with its Bot and CLI.
-->
