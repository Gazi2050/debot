<script lang="ts">
    let isChecked = $state(false);
</script>

<div class="flex justify-center items-center p-[6px] select-none">
    <label
        for="AcceptConditions"
        class="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500"
    >
        <input
            type="checkbox"
            id="AcceptConditions"
            class="peer sr-only"
            bind:checked={isChecked}
        />

        <span
            class="absolute inset-y-0 start-0 z-10 m-1 inline-flex size-6 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600"
        >
            {#if isChecked}
                <!-- <Check class="text-green-600" /> -->
                <p class="text-sm font-bold text-black">EN</p>
            {:else}
                <!-- <X class="text-gray-400" /> -->
                <p class="text-sm font-bold text-black">DE</p>
            {/if}
        </span>
    </label>
</div>
