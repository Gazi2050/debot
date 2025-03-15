<script lang="ts">
    import { onMount } from "svelte";
    import CopyButton from "./CopyButton.svelte";
    import SpeakButton from "./SpeakButton.svelte";
    import Toggle from "./Toggle.svelte";

    let textInput = "";

    function speakGerman() {
        const text = textInput;
        const speechRequest = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        speechRequest.voice =
            voices.find((voice) => voice.lang === "de-DE") || null;

        speechSynthesis.speak(speechRequest);
    }

    onMount(() => {
        window.speechSynthesis.onvoiceschanged = () => {};
    });
</script>

<div
    class="flex justify-center items-center max-w-[700px] md:mx-auto md:h-screen mx-[6px] mt-36 md:mt-0"
>
    <div class="w-full">
        <p class="text-4xl text-center font-bold mb-10">De Bot</p>
        <div
            class="flex justify-between items-center bg-zinc-600 px-2 py-1 text-white rounded-t-lg"
        >
            <Toggle />
            <div class="flex justify-center items-center gap-1">
                <SpeakButton func={speakGerman} />
                <CopyButton />
            </div>
        </div>
        <textarea
            bind:value={textInput}
            class="w-full h-40 resize-none border p-5 rounded-b-lg focus:outline-0"
            placeholder="type here..."
        ></textarea>
    </div>
</div>
