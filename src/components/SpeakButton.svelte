<script lang="ts">
    import { Volume2, Play } from "@lucide/svelte";
    let { func, label = "Speak", variant = "primary" } = $props();
</script>

<button
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-sm
    {variant === 'primary'
        ? 'bg-zinc-100 text-zinc-950 hover:bg-white hover:shadow-zinc-100/10'
        : 'bg-zinc-800 text-zinc-100 border border-zinc-700/50 hover:bg-zinc-700 hover:text-white'}"
    onclick={func}
    title={label}
>
    {label}
    {#if label === "Resume" || label === "Fortsetzen"}
        <Play size={14} fill="currentColor" strokeWidth={2.5} />
    {:else}
        <Volume2 size={14} strokeWidth={2.5} />
    {/if}
</button>
