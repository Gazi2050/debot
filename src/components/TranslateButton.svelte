<script lang="ts">
    import { Languages, Loader2 } from "@lucide/svelte";
    let { func, targetLang = "EN", loading = false } = $props();
</script>

<button
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-100 font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-zinc-700 hover:text-white active:scale-95 cursor-pointer border border-zinc-700/50 min-w-[3.5rem] justify-center"
    onclick={func}
    title={`Translate to ${targetLang}`}
    disabled={loading}
>
    {#if loading}
        <Loader2 size={14} class="animate-spin" />
    {:else}
        {targetLang}
        <Languages size={14} strokeWidth={2.5} />
    {/if}
</button>
