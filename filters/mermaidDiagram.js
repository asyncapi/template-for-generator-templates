const filter = module.exports;
const OPERATIONS = ['publish', 'subscribe'];

/* eslint-disable sonarjs/cognitive-complexity */
/**
 * Disabled the rule for this function as there is no way to make it shorter in a meaningfull way
 */
/**
 * Generate Mermaid Class Diagram from payload schemas with non-anonymous id's
 * 
 * @param {AsyncAPIDocument} asyncapi parsed AsyncAPI document 
 */
function generateMermaidDiagram(asyncapi) {
  if (!asyncapi || typeof asyncapi.version !== 'function') throw new Error('You need to pass entire parsed AsyncAPI document as an argument. Try this "{{ asyncapi | generateMermaidDiagram }}"');

  let diagram = '';
  //we need to store information about processed schemas, to later make sure we do not duplicate schema classes in the diagram
  const seenSchema = [];

  const generateDiagram = (schema) => {
    const schemaId = schema.uid();
    if (isAnonymousSchema(schemaId)) return;

    let classContent = '';
    let relations = '';

    switch (schema.type()) {
    //in case of object we need to traverse through all properties to list them in the class box
    case 'object':
      for (const [propName, propValueMap] of Object.entries(schema.properties())) {
        const circularProp = schema.circularProps() && schema.circularProps().includes(propName);
        classContent += circularProp ? `${propName} [CIRCULAR] ${propValueMap.type()}\n` : `${propName} ${propValueMap.type()}\n`;
        const propSchemaId = propValueMap.uid();
        //if the schema id is not anonymous, this is how we figure out that it for sure has an individually defined model that we can set a relation too
        if (!isAnonymousSchema(propSchemaId)) relations += `${schemaId} --|> ${propSchemaId}\n`;
      }
      break;
      //in case of array we only want to indicate the type of the array items. So far support for object in items is supported
    case 'array':
      classContent = schema.type();
      if (Array.isArray(schema.items())) return;
      
      const itemSchemaId = schema.items().uid();
      if (!isAnonymousSchema(itemSchemaId)) relations += `${schema.uid()} --|> ${itemSchemaId}\n`;
      break;
    default:
      classContent = schema.type();
    }

    //we add class to the diagram only if it is seen for the first time
    if (!seenSchema.includes(schemaId)) {
      diagram += `class ${schemaId} {
          ${classContent}}
          ${relations}\n`;
    }
    seenSchema.push(schemaId);
  };

  traversePayloadSchemas(asyncapi, generateDiagram);
  return diagram ? `classDiagram\n${  diagram}` : '';
};
filter.generateMermaidDiagram = generateMermaidDiagram;

/**
 * Check if schema has anonymous id assigned during parsing of the asyncapi document
 * 
 * @private
 * @param {Schema} schema schema model
 * @param {Function} callback
 */
function isAnonymousSchema(schemaId) {
  return schemaId.startsWith('<anonymous-');
}

/**
 * Find all schemas from payloads provided directly under a message and execute callback
 * 
 * @private
 * @param {AsyncAPIDocument} asyncapi parsed AsyncAPI document 
 * @param {Function} callback
 */
function traversePayloadSchemas(asyncapi, callback) {
  if (asyncapi.hasChannels()) {
    asyncapi.channelNames().forEach(channelName => {
      const channel = asyncapi.channel(channelName);

      OPERATIONS.map((opName) => {
        const op = channel[opName]();
        if (!op) return;
        
        op.messages().forEach(m => {
          recursiveSchema(m.payload(), callback);
        });
      });
    });
  }
}

/**
 * Recursively go through each schema and execute callback.
 * 
 * @param {Schema} schema found.
 * @param {Function} callback(schema)
 *         the function that is called foreach schema found.
 *         schema {Schema}: the found schema.
 * @param {String} propName name of the property owning the schema.
 */
function recursiveSchema(schema, callback, propName) {
  if (schema === null) return;
  callback(schema);

  if (schema.type() !== undefined) {
    switch (schema.type()) {
    case 'object':
      recursiveSchemaObject(schema, callback, propName);
      break;
    case 'array':
      recursiveSchemaArray(schema, callback);
      break;
    }
  } else {
    //check for allOf, oneOf, anyOf
    const checkCombiningSchemas = (combineArray) => {
      if (combineArray !== null && combineArray.length > 0) {
        combineArray.forEach(combineSchema => {
          recursiveSchema(combineSchema, callback); ;
        });
      }
    };
    checkCombiningSchemas(schema.allOf());
    checkCombiningSchemas(schema.anyOf());
    checkCombiningSchemas(schema.oneOf());
  }
}

/**
 * Traverse through the schema model of object type
 * 
 * @private
 * @param {Schema} schema schema model
 * @param {Function} callback
 */
function recursiveSchemaObject(schema, callback, propName) {
  if (schema.additionalProperties() !== undefined && typeof schema.additionalProperties() !== 'boolean') {
    const additionalSchema = schema.additionalProperties();
    recursiveSchema(additionalSchema, callback);
  }
  if (schema.properties() !== null) {
    const props = schema.properties();
    for (const [prop, propertySchema] of Object.entries(props)) {
      if (propertySchema.circularProps() && propertySchema.circularProps().includes(propName)) return;
      recursiveSchema(propertySchema, callback, prop);
    }
  }
}

/**
 * Traverse through the schema model of array type
 * 
 * @private
 * @param {Schema} schema schema model
 * @param {Function} callback
 */
function recursiveSchemaArray(schema, callback) {
  if (schema.additionalItems() !== undefined) {
    const additionalArrayItems = schema.additionalItems();
    recursiveSchema(additionalArrayItems, callback);
  }
  
  if (schema.items() !== null) {
    if (Array.isArray(schema.items())) {
      schema.items().forEach(arraySchema => {
        recursiveSchema(arraySchema, callback);
      });
    } else recursiveSchema(schema.items(), callback);
  }
}