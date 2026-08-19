/**
 * Turning an event's description into something a page can lay out.
 *
 * The backend stores the description as a single text field, so what arrives is
 * anything from a couple of tidy paragraphs to four hundred words in one run-on
 * block. Neither can be dropped on the page as-is: the first has no structure to
 * alternate against, the second is the wall of text we are trying to avoid.
 *
 * Nothing here invents copy. Text is only ever regrouped — split on the breaks
 * the author wrote, and, failing those, on sentence boundaries — so the page can
 * interleave it with photographs.
 */

/** Beyond this many characters a single paragraph is too long to read as one. */
const LONG_PARAGRAPH = 480;

/** Sentences per block when a long paragraph has to be broken up. */
const SENTENCES_PER_BLOCK = 3;

/** Split on sentence endings, keeping the punctuation with its sentence. */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"'“'(])/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** The author's own paragraphs, trimmed and with empties dropped. */
function authored(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n|\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * The description as readable paragraphs.
 *
 * A paragraph the author kept short is left exactly as written; only one long
 * enough to read as a wall is regrouped into blocks of a few sentences.
 */
export function storyParagraphs(text: string | null | undefined): string[] {
  if (!text?.trim()) return [];

  return authored(text).flatMap((paragraph) => {
    if (paragraph.length <= LONG_PARAGRAPH) return [paragraph];

    const parts = sentences(paragraph);
    if (parts.length < 2) return [paragraph];

    const blocks: string[] = [];
    for (let i = 0; i < parts.length; i += SENTENCES_PER_BLOCK) {
      blocks.push(parts.slice(i, i + SENTENCES_PER_BLOCK).join(" "));
    }
    return blocks;
  });
}

export type StoryBlock = {
  /** The paragraphs belonging to this block. */
  paragraphs: string[];
};

/**
 * Group paragraphs into the sections the page alternates photographs against.
 *
 * `slots` is how many photographs are available to pair with — there is no
 * point cutting the text into more sections than there are pictures, and a
 * section with two or three paragraphs reads better than a run of single ones.
 */
export function storyBlocks(
  paragraphs: string[],
  slots: number,
): StoryBlock[] {
  if (paragraphs.length === 0) return [];
  if (slots < 1) return [{ paragraphs }];

  const sections = Math.min(slots, Math.ceil(paragraphs.length / 2));
  const perSection = Math.ceil(paragraphs.length / sections);

  const blocks: StoryBlock[] = [];
  for (let i = 0; i < paragraphs.length; i += perSection) {
    blocks.push({ paragraphs: paragraphs.slice(i, i + perSection) });
  }
  return blocks;
}

/**
 * A short line to set over a full-width photograph.
 *
 * Only the author's own summary is used. Lifting a sentence out of the body
 * would put the same words on the page twice, and picking one to feature is an
 * editorial decision this has no basis to make.
 */
export function overlayStatement(
  shortDescription: string | null | undefined,
): string | null {
  const text = shortDescription?.trim();
  if (!text || text.length > 220) return null;
  return text;
}
