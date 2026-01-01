import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as googleTTS from 'google-tts-api';

export const GET: RequestHandler = async ({ url }) => {
    const text = url.searchParams.get('text');
    const lang = url.searchParams.get('lang') || 'de';

    if (!text) {
        throw error(400, 'Text is required');
    }

    try {
        // Manually split text into 200 character chunks
        // This is more robust than relying on the library's internal splitter for nonsensical strings
        const chunks: string[] = [];
        for (let i = 0; i < text.length; i += 200) {
            chunks.push(text.substring(i, i + 200));
        }

        console.log(`Processing ${chunks.length} chunks for text of length ${text.length}`);

        // Fetch all chunks
        const buffers: ArrayBuffer[] = [];
        for (const chunk of chunks) {
            const chunkUrl = googleTTS.getAudioUrl(chunk, {
                lang,
                slow: false,
                host: 'https://translate.google.com',
            });

            const response = await fetch(chunkUrl);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Google TTS error for chunk: "${chunk}":`, errorText);
                throw new Error(`Google TTS failed: ${response.status} ${response.statusText}`);
            }
            buffers.push(await response.arrayBuffer());
        }

        // Concatenate all buffers
        const totalLength = buffers.reduce((acc, buf) => acc + buf.byteLength, 0);
        const combinedBuffer = new Uint8Array(totalLength);
        let offset = 0;
        for (const buf of buffers) {
            combinedBuffer.set(new Uint8Array(buf), offset);
            offset += buf.byteLength;
        }

        return new Response(combinedBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (err: any) {
        console.error('TTS Error:', err);
        throw error(500, err.message || 'Failed to generate speech');
    }
};
