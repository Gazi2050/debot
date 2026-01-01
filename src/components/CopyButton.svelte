<script lang="ts">
    import { Copy, Check } from "@lucide/svelte";
    import Button from "./ui/Button.svelte";

    interface Props {
        text: string;
        label?: string;
        copiedLabel?: string;
    }

    let { text, label = "Copy", copiedLabel = "Copied" }: Props = $props();
    let copied = $state(false);

    /**
     * Copies text to the clipboard.
     */
    async function copyToClipboard(): Promise<void> {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            copied = true;
            setTimeout(() => (copied = false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }
</script>

<Button
    onclick={copyToClipboard}
    label={copied ? copiedLabel : label}
    variant="secondary"
    icon={copied ? Check : Copy}
    title={label}
    class={copied ? "text-green-400" : ""}
/>
