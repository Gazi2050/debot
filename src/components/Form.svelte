<script lang="ts">
    import Toggle from "./Toggle.svelte";
    import Header from "./Header.svelte";
    import SpeakButton from "./SpeakButton.svelte";
    import CopyButton from "./CopyButton.svelte";
    import PauseButton from "./PauseButton.svelte";
    import StopButton from "./StopButton.svelte";
    import TranslateButton from "./TranslateButton.svelte";
    import { mapWordsForHighlighting } from "../utils/text";
    import type { WordMap, TranslationResult } from "../types";

    import { appState } from "../store/app.svelte";

    let audio: HTMLAudioElement | null = null;
    let textareaRef: HTMLTextAreaElement;
    let words: WordMap[] = [];

    /**
     * Updates word highlighting in the textarea based on audio progress.
     */
    function updateHighlight(): void {
        if (!audio || !appState.isSpeaking || !textareaRef) return;

        const duration = audio.duration;
        if (!duration || isNaN(duration)) {
            requestAnimationFrame(updateHighlight);
            return;
        }

        const currentTime = audio.currentTime;
        const progress = currentTime / duration;

        const currentWord = words.find((w, i) => {
            const nextWord = words[i + 1];
            return (
                progress >= w.timeOffset &&
                (!nextWord || progress < nextWord.timeOffset)
            );
        });

        if (currentWord && !/\s+/.test(currentWord.text)) {
            textareaRef.setSelectionRange(currentWord.start, currentWord.end);
            textareaRef.focus();
        }

        if (appState.isSpeaking) {
            requestAnimationFrame(updateHighlight);
        }
    }

    /**
     * Translates input text and updates UI.
     */
    async function translate(): Promise<void> {
        if (!appState.textInput || appState.isTranslating) return;

        appState.isTranslating = true;
        try {
            const sl = appState.isEnglish ? "en" : "de";
            const tl = appState.isEnglish ? "de" : "en";
            const translateUrl = `/api/translate?text=${encodeURIComponent(appState.textInput)}&sl=${sl}&tl=${tl}`;

            const response = await fetch(translateUrl);
            if (!response.ok) throw new Error("Translation failed");

            const data: TranslationResult = await response.json();
            appState.textInput = data.translatedText;
            appState.isEnglish = !appState.isEnglish;
        } catch (err) {
            console.error("Translation error:", err);
        } finally {
            appState.isTranslating = false;
        }
    }

    /**
     * Starts or resumes TTS playback.
     */
    async function speak(): Promise<void> {
        if (!appState.textInput) return;

        if (appState.isPaused && audio) {
            audio.play();
            appState.isPaused = false;
            appState.isSpeaking = true;
            if (audio.duration && !isNaN(audio.duration)) {
                requestAnimationFrame(updateHighlight);
            }
            return;
        }

        if (appState.isSpeaking || appState.isLoadingAudio) return;

        words = mapWordsForHighlighting(appState.textInput);
        appState.isLoadingAudio = true;

        try {
            if (audio) {
                audio.pause();
                audio = null;
            }

            const lang = appState.isEnglish ? "en" : "de";
            const speakUrl = `/api/speak?text=${encodeURIComponent(appState.textInput)}&lang=${lang}`;

            // Fetch audio as blob to ensure we have the full content and duration
            const response = await fetch(speakUrl);
            if (!response.ok) throw new Error("Audio fetch failed");

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);

            audio = new Audio(audioUrl);

            // Wait for metadata to ensure duration is available
            await new Promise((resolve, reject) => {
                if (!audio) return reject("Audio not initialized");

                audio.onloadedmetadata = () => {
                    if (audio && audio.duration === Infinity) {
                        // Fallback for infinity duration (rare with blob)
                        audio.currentTime = 1e101;
                        audio.ontimeupdate = () => {
                            if (!audio) return;
                            audio.currentTime = 0;
                            audio.ontimeupdate = null;
                            appState.isLoadingAudio = false;
                            resolve(true);
                        };
                    } else {
                        appState.isLoadingAudio = false;
                        resolve(true);
                    }
                };

                audio.onerror = (e) => {
                    appState.isLoadingAudio = false;
                    reject(e);
                };
            });

            if (!audio) return;

            audio.onplay = () => {
                appState.isSpeaking = true;
                appState.isPaused = false;
                requestAnimationFrame(updateHighlight);
            };

            audio.onpause = () => {
                if (audio && audio.currentTime > 0 && !audio.ended) {
                    appState.isPaused = true;
                    appState.isSpeaking = false;
                }
            };

            audio.onended = () => {
                appState.isSpeaking = false;
                appState.isPaused = false;
                audio = null;
                URL.revokeObjectURL(audioUrl); // Clean up
                textareaRef.setSelectionRange(0, 0);
            };

            await audio.play();
        } catch (err) {
            console.error("Speech error:", err);
            appState.isSpeaking = false;
            appState.isPaused = false;
            appState.isLoadingAudio = false;
            audio = null;
        }
    }

    /**
     * Pauses audio playback.
     */
    function pauseAudio(): void {
        if (audio && appState.isSpeaking) {
            audio.pause();
        }
    }

    /**
     * Stops audio and resets UI.
     */
    function stopAudio(): void {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio = null;
        }
        appState.isSpeaking = false;
        appState.isPaused = false;
        if (textareaRef) {
            textareaRef.setSelectionRange(0, 0);
        }
    }
</script>

<div
    class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-12 overflow-x-hidden"
>
    <Header />

    <main class="w-full max-w-3xl px-2 sm:px-0">
        <div
            class="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
        >
            <div
                class="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-zinc-900/80 border-b border-zinc-800/50 gap-4 sm:gap-0"
            >
                <Toggle
                    bind:checked={appState.isEnglish}
                    disabled={appState.isSpeaking || appState.isPaused}
                />

                <div class="flex flex-wrap items-center justify-center gap-2">
                    <TranslateButton
                        func={translate}
                        targetLang={appState.isEnglish ? "DE" : "EN"}
                        loading={appState.isTranslating}
                        disabled={appState.isSpeaking || appState.isPaused}
                    />

                    {#if appState.isSpeaking}
                        <PauseButton
                            func={pauseAudio}
                            label={appState.isEnglish ? "Pause" : "Pause"}
                        />
                        <StopButton
                            func={stopAudio}
                            label={appState.isEnglish ? "Stop" : "Stop"}
                        />
                    {:else if appState.isPaused}
                        <SpeakButton
                            func={speak}
                            label={appState.isEnglish ? "Resume" : "Fortsetzen"}
                            variant="secondary"
                        />
                        <StopButton
                            func={stopAudio}
                            label={appState.isEnglish ? "Stop" : "Stop"}
                        />
                    {:else}
                        <SpeakButton
                            func={speak}
                            label={appState.isEnglish ? "Speak" : "Sprechen"}
                            loading={appState.isLoadingAudio}
                        />
                    {/if}

                    <CopyButton
                        text={appState.textInput}
                        label={appState.isEnglish ? "Copy" : "Kopieren"}
                        copiedLabel={appState.isEnglish ? "Copied" : "Kopiert"}
                    />
                </div>
            </div>

            <textarea
                bind:this={textareaRef}
                bind:value={appState.textInput}
                readonly={appState.isSpeaking || appState.isPaused}
                class="w-full h-64 sm:h-80 p-5 sm:p-8 bg-transparent text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none text-lg sm:text-xl leading-relaxed transition-colors duration-200"
                placeholder={appState.isEnglish
                    ? "Type your English text here..."
                    : "Geben Sie hier Ihren deutschen Text ein..."}
            ></textarea>

            <div
                class="px-6 py-3 flex justify-end text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-600 font-bold border-t border-zinc-800/30"
            >
                {appState.textInput.length}
                {appState.isEnglish ? "characters" : "zeichen"}
            </div>
        </div>
    </main>
</div>
