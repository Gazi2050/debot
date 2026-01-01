<script lang="ts">
    import { Pause } from "@lucide/svelte";
    import Button from "./ui/Button.svelte";

    interface Props {
        func: () => void;
        label?: string;
    }

    let { func, label = "Pause" }: Props = $props();
</script>

<Button onclick={func} {label} variant="secondary" icon={Pause} title={label} />
