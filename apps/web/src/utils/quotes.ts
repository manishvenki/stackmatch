/**
 * StackMatch Encouraging Quotes Collection
 * A curated collection of short, professional, and reassuring quotes that rotate
 * between modal appearances to reassure users when encountering setbacks.
 */

export const ENCOURAGING_QUOTES = [
  "Great ideas are built one step at a time.",
  "Every great product starts with a clear plan.",
  "Progress is a process, not a single moment.",
  "A small setback is not the end of the journey.",
  "Good things are worth building carefully.",
  "Keep the idea. We'll help you find the next step.",
  "Every great idea deserves another attempt.",
  "Thank you for your patience while we work through this.",
  "Build thoughtfully. Improve continuously.",
  "Great things take time. Thank you for being part of the journey."
] as const;

export type EncouragingQuote = typeof ENCOURAGING_QUOTES[number];

let lastQuoteIndex = -1;

/**
 * Returns an encouraging quote, rotating through the collection so the same quote
 * is not presented consecutively.
 */
export function getRotatingQuote(preferredContext?: 'offline' | 'ai' | 'general'): string {
  if (preferredContext === 'offline') {
    return "Every great idea deserves another attempt.";
  }
  if (preferredContext === 'ai') {
    return "Great things take time. Thank you for being part of the journey.";
  }

  const availableIndices = ENCOURAGING_QUOTES
    .map((_, i) => i)
    .filter(i => i !== lastQuoteIndex);

  const nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  lastQuoteIndex = nextIndex;
  return ENCOURAGING_QUOTES[nextIndex];
}
