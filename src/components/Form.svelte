<script lang="ts">
    import CopyButton from "./CopyButton.svelte";
    import Toggle from "./Toggle.svelte";
</script>

<div class="flex justify-center items-center max-w-[700px] mx-auto h-screen">
    <div class="w-full">
        <p class="text-4xl text-center font-bold mb-10">De Bot</p>
        <div
            class="flex justify-between items-center bg-zinc-600 px-5 py-1 text-white rounded-t-lg"
        >
            <div>
                <p>German</p>
            </div>
            <div class="flex gap-1">
                <CopyButton />
                <Toggle />
            </div>
        </div>
        <textarea
            class="w-full h-40 resize-none border p-5 rounded-b-lg focus:outline-0"
            placeholder="type here..."
        ></textarea>
    </div>
</div>
