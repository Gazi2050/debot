<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<svelte:head>
  <title>DeBot - Natural German Text to Speech & Translation</title>
  <meta
    name="description"
    content="Natural German voices and instant translation in one minimal space. High-quality text-to-speech and seamless German-English translation."
  />
  <meta
    property="og:title"
    content="De Bot - Natural German Text to Speech & Translation"
  />
  <meta
    property="og:description"
    content="Natural German voices and instant translation in one minimal space. High-quality text-to-speech and seamless German-English translation."
  />
  <meta property="og:type" content="website" />
</svelte:head>

{@render children()}
