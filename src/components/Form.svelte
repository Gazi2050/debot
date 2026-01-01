<script lang="ts">
    import Toggle from "./Toggle.svelte";
    import SpeakButton from "./SpeakButton.svelte";
    import CopyButton from "./CopyButton.svelte";
    import PauseButton from "./PauseButton.svelte";
    import StopButton from "./StopButton.svelte";
    import TranslateButton from "./TranslateButton.svelte";

    let textInput = $state("");
    let isEnglish = $state(false);
    let isSpeaking = $state(false);
    let isPaused = $state(false);
    let isTranslating = $state(false);
    let audio: HTMLAudioElement | null = null;
    let textareaRef: HTMLTextAreaElement;

    interface WordMap {
        text: string;
        start: number;
        end: number;
        timeOffset: number;
    }

    let words: WordMap[] = [];

    function prepareWords() {
        const rawWords =
            textInput.match(/[\w\u00C0-\u017F]+|\s+|[^\w\s\u00C0-\u017F]+/g) ||
            [];
        let currentPos = 0;
        words = rawWords.map((w) => {
            const start = currentPos;
            const end = currentPos + w.length;
            currentPos = end;
            return { text: w, start, end, timeOffset: 0 };
        });

        const totalChars = textInput.length;
        if (totalChars === 0) return;

        // Calculate time offsets based on relative position in text
        words.forEach((w) => {
            w.timeOffset = w.start / totalChars;
        });
    }

    function updateHighlight() {
        if (!audio || !isSpeaking || !textareaRef) return;

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
        } else if (currentWord) {
            // If it's a space or punctuation, don't clear the range yet to avoid flickering
            // unless the next word has started.
        }

        if (isSpeaking) {
            requestAnimationFrame(updateHighlight);
        }
    }

    async function translate() {
        if (!textInput || isTranslating) return;

        isTranslating = true;
        try {
            const sl = isEnglish ? "en" : "de";
            const tl = isEnglish ? "de" : "en";
            const translateUrl = `/api/translate?text=${encodeURIComponent(textInput)}&sl=${sl}&tl=${tl}`;

            const response = await fetch(translateUrl);
            if (!response.ok) throw new Error("Translation failed");

            const data = await response.json();
            textInput = data.translatedText;

            // Flip the language toggle after translation
            isEnglish = !isEnglish;
        } catch (err) {
            console.error("Translation error:", err);
        } finally {
            isTranslating = false;
        }
    }

    async function speak() {
        if (!textInput) return;

        if (isPaused && audio) {
            audio.play();
            isPaused = false;
            isSpeaking = true;
            requestAnimationFrame(updateHighlight);
            return;
        }

        if (isSpeaking) return;

        prepareWords();
        isSpeaking = true;
        try {
            if (audio) {
                audio.pause();
                audio = null;
            }

            const lang = isEnglish ? "en" : "de";
            const speakUrl = `/api/speak?text=${encodeURIComponent(textInput)}&lang=${lang}`;

            audio = new Audio(speakUrl);

            audio.onplay = () => {
                isSpeaking = true;
                isPaused = false;
                requestAnimationFrame(updateHighlight);
            };

            audio.onpause = () => {
                if (audio && audio.currentTime > 0 && !audio.ended) {
                    isPaused = true;
                    isSpeaking = false;
                }
            };

            audio.onended = () => {
                isSpeaking = false;
                isPaused = false;
                audio = null;
                textareaRef.setSelectionRange(0, 0);
            };

            audio.onerror = (e) => {
                console.error("Audio playback error:", e);
                isSpeaking = false;
                isPaused = false;
                audio = null;
            };

            await audio.play();
        } catch (err) {
            console.error("Speech error:", err);
            isSpeaking = false;
            isPaused = false;
        }
    }

    function pauseAudio() {
        if (audio && isSpeaking) {
            audio.pause();
        }
    }

    function stopAudio() {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio = null;
        }
        isSpeaking = false;
        isPaused = false;
        if (textareaRef) {
            textareaRef.setSelectionRange(0, 0);
        }
    }
</script>

<div
    class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-12 overflow-x-hidden"
>
    <header class="mb-8 sm:mb-14 text-center relative w-full px-4">
        <!-- Subtle background glow -->
        <div
            class="absolute -inset-10 bg-zinc-400/5 blur-3xl rounded-full -z-10"
        ></div>

        <h1
            class="text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500 mb-2 drop-shadow-sm"
        >
            De Bot
        </h1>
        <div class="flex items-center justify-center gap-2 sm:gap-3">
            <div class="h-px w-6 sm:w-8 bg-zinc-800"></div>
            <p
                class="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-zinc-500 font-bold"
            >
                minimal german text to speech
            </p>
            <div class="h-px w-6 sm:w-8 bg-zinc-800"></div>
        </div>
    </header>

    <main class="w-full max-w-3xl px-2 sm:px-0">
        <div
            class="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
        >
            <div
                class="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-zinc-900/80 border-b border-zinc-800/50 gap-4 sm:gap-0"
            >
                <Toggle
                    bind:checked={isEnglish}
                    disabled={isSpeaking || isPaused}
                />
                <div class="flex flex-wrap items-center justify-center gap-2">
                    <TranslateButton
                        func={translate}
                        targetLang={isEnglish ? "DE" : "EN"}
                        loading={isTranslating}
                    />

                    {#if isSpeaking}
                        <PauseButton
                            func={pauseAudio}
                            label={isEnglish ? "Pause" : "Pause"}
                        />
                        <StopButton
                            func={stopAudio}
                            label={isEnglish ? "Stop" : "Stopp"}
                        />
                    {:else if isPaused}
                        <SpeakButton
                            func={speak}
                            label={isEnglish ? "Resume" : "Fortsetzen"}
                            variant="secondary"
                        />
                        <StopButton
                            func={stopAudio}
                            label={isEnglish ? "Stop" : "Stopp"}
                        />
                    {:else}
                        <SpeakButton
                            func={speak}
                            label={isEnglish ? "Speak" : "Sprechen"}
                        />
                    {/if}

                    <CopyButton
                        text={textInput}
                        label={isEnglish ? "Copy" : "Kopieren"}
                        copiedLabel={isEnglish ? "Copied" : "Kopiert"}
                    />
                </div>
            </div>

            <textarea
                bind:this={textareaRef}
                bind:value={textInput}
                readonly={isSpeaking || isPaused}
                class="w-full h-64 sm:h-80 p-5 sm:p-8 bg-transparent text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none text-lg sm:text-xl leading-relaxed transition-colors duration-200"
                placeholder={isEnglish
                    ? "Type your English text here..."
                    : "Geben Sie hier Ihren deutschen Text ein..."}
            ></textarea>

            <div
                class="px-6 py-3 flex justify-end text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-600 font-bold border-t border-zinc-800/30"
            >
                {textInput.length}
                {isEnglish ? "characters" : "zeichen"}
            </div>
        </div>
    </main>
</div>
