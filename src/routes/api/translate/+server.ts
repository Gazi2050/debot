import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const text = url.searchParams.get('text');
    const sl = url.searchParams.get('sl') || 'auto'; // source lang
    const tl = url.searchParams.get('tl') || 'en';   // target lang

    if (!text) {
        throw error(400, 'Text is required');
    }

    try {
        const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(translateUrl);

        if (!response.ok) {
            throw new Error(`Translation API failed: ${response.status}`);
        }

        const data = await response.json();

        // Google Translate single-t syntax returns nested arrays: [[["translated", "source", ...]]]
        const translatedText = data[0].map((item: any) => item[0]).join('');

        return json({ translatedText });
    } catch (err: any) {
        console.error('Translation Error:', err);
        throw error(500, err.message || 'Failed to translate text');
    }
};
