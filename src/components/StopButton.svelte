<script lang="ts">
    import { Square } from "@lucide/svelte";
    import Button from "./ui/Button.svelte";

    interface Props {
        func: () => void;
        label?: string;
    }

    let { func, label = "Stop" }: Props = $props();
</script>

<Button onclick={func} {label} variant="danger" icon={Square} title={label} />
