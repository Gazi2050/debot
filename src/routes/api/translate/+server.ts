import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Handles translation requests via Google Translate's public endpoint.
 */
export const GET: RequestHandler = async ({ url }) => {
    const text = url.searchParams.get('text');
    const sl = url.searchParams.get('sl') || 'auto';
    const tl = url.searchParams.get('tl') || 'en';

    if (!text) {
        throw error(400, 'Text is required');
    }

    try {
        const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(translateUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Translation API failed: ${response.status}`);
        }

        const data = await response.json() as [[string, unknown][]];
        const translatedText = data[0].map((item) => item[0]).join('');

        return json({ translatedText });
    } catch (err: unknown) {
        console.error('Translation Error:', err);
        const message = err instanceof Error ? err.message : 'Failed to translate text';
        throw error(500, message);
    }
};
