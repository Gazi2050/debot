<script lang="ts">
    import { Copy, Check } from "@lucide/svelte";

    let { text, label = "Copy", copiedLabel = "Copied" } = $props();
    let copied = $state(false);

    async function copyToClipboard() {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            copied = true;
            setTimeout(() => (copied = false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }
</script>

<button
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-100 font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-zinc-700 hover:text-white active:scale-95 cursor-pointer border border-zinc-700/50"
    onclick={copyToClipboard}
    title={label}
>
    {copied ? copiedLabel : label}
    {#if copied}
        <Check size={14} class="text-green-400" strokeWidth={3} />
    {:else}
        <Copy size={14} strokeWidth={2.5} />
    {/if}
</button>
