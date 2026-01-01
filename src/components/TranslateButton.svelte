<script lang="ts">
    import { Languages } from "@lucide/svelte";
    import Button from "./ui/Button.svelte";

    interface Props {
        func: () => void;
        targetLang?: string;
        loading?: boolean;
        disabled?: boolean;
    }

    let {
        func,
        targetLang = "EN",
        loading = false,
        disabled = false,
    }: Props = $props();
</script>

<Button
    onclick={func}
    label={targetLang}
    variant="secondary"
    icon={Languages}
    {loading}
    {disabled}
    title={`Translate to ${targetLang}`}
    class="min-w-[3.5rem]"
/>
