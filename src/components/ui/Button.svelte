<script lang="ts">
    import { Loader2 } from "@lucide/svelte";
    import type { Component } from "svelte";

    interface Props {
        onclick: () => void;
        variant?: "primary" | "secondary" | "danger" | "ghost";
        label?: string;
        icon?: Component<Record<string, unknown>>;
        loading?: boolean;
        disabled?: boolean;
        title?: string;
        class?: string;
    }

    let {
        onclick,
        variant = "secondary",
        label = "",
        icon: Icon,
        loading = false,
        disabled = false,
        title = "",
        class: className = "",
    }: Props = $props();

    const variants = {
        primary:
            "bg-zinc-100 text-zinc-900 hover:bg-white hover:shadow-zinc-100/10 shadow-lg",
        secondary:
            "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700/50",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/30",
        ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50",
    };
</script>

<button
    class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50 disabled:grayscale disabled:pointer-events-none {variants[
        variant
    ]} {className}"
    {onclick}
    {title}
    disabled={disabled || loading}
>
    {#if loading}
        <Loader2 size={16} class="animate-spin" />
    {:else}
        {#if label}
            {label}
        {/if}
        {#if Icon}
            <Icon size={16} strokeWidth={2.5} />
        {/if}
    {/if}
</button>
