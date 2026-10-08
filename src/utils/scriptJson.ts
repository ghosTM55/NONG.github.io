/**
 * Serializes data for an inline `<script type="application/json">` block.
 * Unlike a data-* attribute, the payload is not entity-escaped, and escaping
 * `<` keeps the content from closing the script element early.
 * Read it back with `JSON.parse(element.textContent)`; client scripts parse it
 * inline rather than importing a helper, which would become a shared chunk.
 */
export function scriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
