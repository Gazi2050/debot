<script lang="ts">
    import { Pause } from "@lucide/svelte";
    let { func, label = "Pause" } = $props();
</script>

<button
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700/50 font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-zinc-700 hover:text-white active:scale-95 cursor-pointer shadow-sm"
    onclick={func}
    title={label}
>
    {label}
    <Pause size={14} fill="currentColor" strokeWidth={2.5} />
</button>
