export const FLATCONTENT_VERSION = 1;

// Keep the on-disk JSON stable.
// If you change shape, bump version and document migration strategy.
export function makeEnvelope({ generatedAtISO, collections }) {
  return {
    generated_at: generatedAtISO,
    version: FLATCONTENT_VERSION,
    collections
  };
}
