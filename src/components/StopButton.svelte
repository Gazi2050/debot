<script lang="ts">
    import { Square } from "@lucide/svelte";
    let { func, label = "Stop" } = $props();
</script>

<button
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-red-500/20 active:scale-95 cursor-pointer shadow-sm"
    onclick={func}
    title={label}
>
    {label}
    <Square size={14} fill="currentColor" strokeWidth={2.5} />
</button>
