import type { WordMap } from "../types";

/**
 * Maps text into a list of words with time offsets for UI highlighting.
 */
export function mapWordsForHighlighting(text: string): WordMap[] {
    const rawWords = text.match(/[\w\u00C0-\u017F]+|\s+|[^\w\s\u00C0-\u017F]+/g) || [];
    let currentPos = 0;
    const totalChars = text.length;

    return rawWords.map(w => {
        const start = currentPos;
        const end = currentPos + w.length;
        currentPos = end;

        return {
            text: w,
            start,
            end,
            timeOffset: totalChars > 0 ? start / totalChars : 0
        };
    });
}

/**
 * Splits text into chunks suitable for TTS processing.
 */
export function splitTextIntoChunks(text: string, maxLength: number = 200): string[] {
    const chunks: string[] = [];
    let currentPos = 0;

    while (currentPos < text.length) {
        const end = currentPos + maxLength;

        if (end >= text.length) {
            chunks.push(text.slice(currentPos));
            break;
        }

        let splitAt = text.lastIndexOf('.', end);
        if (splitAt <= currentPos || splitAt > end) {
            splitAt = text.lastIndexOf(' ', end);
        }

        if (splitAt <= currentPos || splitAt > end) {
            splitAt = end;
        } else {
            splitAt += 1;
        }

        chunks.push(text.slice(currentPos, splitAt).trim());
        currentPos = splitAt;
    }

    return chunks.filter(c => c.length > 0);
}
