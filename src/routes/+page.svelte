<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import { loadLsps as _loadLsps } from '$lib/lsp';
  import type { Lsp as ILsp } from '$lib/lsp';

  import Lsp from '$lib/components/Lsp.svelte';

  let lsps: ILsp[] | null = null;
  let timeout = 0;

  const loadLsps = async () => {
    lsps = await _loadLsps();

    timeout = setTimeout(loadLsps, 5000);
  };

  onMount(loadLsps);
  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

<svelte:head>
  <title>LSP Reloader</title>
</svelte:head>

<h1 class="headerDefault">LSPs</h1>

{#if lsps}
  <ul>
    {#each lsps as lsp}
      <li>
        <Lsp {lsp} on:reload={loadLsps} />
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    list-style-type: none;
  }

  ul li {
    margin-bottom: var(--space-12);
  }
</style>
