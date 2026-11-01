// FNV-1a 64-bit hash of normalized icon markup. Shared by the manifest
// generator and the test oracle so their normalization cannot drift.
const FNV_OFFSET_BASIS = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;

const normalizeIconMarkup = (markup: string) => markup.replace(/\s+/g, ' ').trim();

const geometryHash = (normalizedMarkup: string) => {
  let hash = FNV_OFFSET_BASIS;
  for (let index = 0; index < normalizedMarkup.length; index += 1) {
    hash ^= BigInt(normalizedMarkup.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * FNV_PRIME);
  }
  return hash.toString(16).padStart(16, '0');
};

export const GEOMETRY_HASH_ALGORITHM = 'fnv1a-64';

/** Hash rendered icon markup after collapsing insignificant whitespace. */
export const iconGeometryHash = (markup: string) => geometryHash(normalizeIconMarkup(markup));
