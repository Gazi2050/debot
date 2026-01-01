/**
 * Represents a single word and its metadata during speech synthesis and highlighting.
 */
export interface WordMap {
    text: string;
    start: number;
    end: number;
    timeOffset: number;
}

/**
 * Result of a translation request.
 */
export interface TranslationResult {
    translatedText: string;
}

/**
 * Options for the TTS speech synthesis.
 */
export interface SpeechOptions {
    text: string;
    lang: string;
}
