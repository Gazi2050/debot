<script lang="ts">
    let { checked = $bindable(), disabled = false } = $props();

    function toggle() {
        if (disabled) return;
        checked = !checked;
    }
</script>

<div
    class="flex items-center select-none bg-zinc-950/50 p-1.5 rounded-xl border border-zinc-800/50 shadow-inner transition-opacity duration-300
    {disabled ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}"
>
    <button
        onclick={toggle}
        class="relative flex items-center w-28 h-9 cursor-pointer group"
        aria-checked={checked}
        role="checkbox"
        {disabled}
    >
        <!-- Background track labels -->
        <div
            class="absolute inset-0 flex items-center justify-between px-3.5 z-0"
        >
            <span
                class="text-xs font-black tracking-widest text-zinc-500 transition-colors uppercase"
                >DE</span
            >
            <span
                class="text-xs font-black tracking-widest text-zinc-500 transition-colors uppercase"
                >EN</span
            >
        </div>

        <!-- Sliding thumb -->
        <div
            class="absolute top-0 h-full w-1/2 flex items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 shadow-lg transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10"
            style:left={checked ? "50%" : "0%"}
        >
            <span class="text-[11px] font-black uppercase tracking-wider">
                {checked ? "EN" : "DE"}
            </span>
        </div>
    </button>
</div>
