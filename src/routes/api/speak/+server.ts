import { error } from '@sveltejs/kit';
import * as googleTTS from 'google-tts-api';
import type { RequestHandler } from './$types';
import { splitTextIntoChunks } from '../../../utils/text';

/**
 * Handles TTS audio requests via Google TTS.
 */
export const GET: RequestHandler = async ({ url }) => {
    const text = url.searchParams.get('text');
    const lang = url.searchParams.get('lang') || 'de';

    if (!text) {
        throw error(400, 'Text is required');
    }

    try {
        const chunks = splitTextIntoChunks(text, 200);
        const buffers: Uint8Array[] = [];

        for (const chunk of chunks) {
            const audioUrl = googleTTS.getAudioUrl(chunk, {
                lang,
                slow: false,
                host: 'https://translate.google.com',
            });

            const response = await fetch(audioUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch chunk: ${response.statusText}`);
            }

            const buffer = await response.arrayBuffer();
            buffers.push(new Uint8Array(buffer));
        }

        const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;

        for (const b of buffers) {
            combined.set(b, offset);
            offset += b.length;
        }

        return new Response(combined, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (err: unknown) {
        console.error('TTS Proxy Error:', err);
        const message = err instanceof Error ? err.message : 'Speech synthesis failed';
        throw error(500, message);
    }
};
