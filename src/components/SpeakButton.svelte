<script lang="ts">
    export let func;
</script>

<div
    class="bg-zinc-700 flex justify-center items-center gap-[6px] p-[6px] rounded-lg m-1"
>
    <button class="text-lg font-semibold cursor-pointer" on:click={func}>
        speak 🔊</button
    >
</div>
