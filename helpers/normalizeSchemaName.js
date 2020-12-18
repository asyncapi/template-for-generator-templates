export function normalizeSchemaName(schemaName) {
  return schemaName.replace(/<|>/gm, '');
}
