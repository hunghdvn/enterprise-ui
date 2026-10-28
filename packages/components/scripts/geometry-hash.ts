// FNV-1a 64-bit hash of normalized icon markup. Shared by the manifest
// generator and the test oracle so their normalization cannot drift.
export const normalizeIconMarkup = (markup: string) => markup.replace(/\s+/g, ' ').trim();

export const geometryHash = (normalizedMarkup: string) => {
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < normalizedMarkup.length; index += 1) {
    hash ^= BigInt(normalizedMarkup.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, '0');
};

/** Hash rendered icon markup after collapsing insignificant whitespace. */
export const iconGeometryHash = (markup: string) => geometryHash(normalizeIconMarkup(markup));
