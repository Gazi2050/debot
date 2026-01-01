<script lang="ts">
    import { Volume2, Play } from "@lucide/svelte";
    import Button from "./ui/Button.svelte";

    interface Props {
        func: () => void;
        label?: string;
        variant?: "primary" | "secondary";
        loading?: boolean;
    }

    let {
        func,
        label = "Sprechen",
        variant = "primary",
        loading = false,
    }: Props = $props();
</script>

<Button
    onclick={func}
    {label}
    {variant}
    icon={variant === "primary" ? Volume2 : Play}
    {loading}
/>
