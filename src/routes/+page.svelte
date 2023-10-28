<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import { loadLsps as _loadLsps } from '$lib/lsp';
  import type { Lsp as ILsp } from '$lib/lsp';

  import Lsp from '$lib/components/Lsp.svelte';

  import Loader from '@replit-svelte/ui/icons/Loader.svelte';

  let lsps: ILsp[] | null = null;
  let timeout = 0;

  let loading = false;

  const loadLsps = async () => {
    loading = true;

    lsps = await _loadLsps();

    loading = false;
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
{:else}
  <div class="loading-indicator-initial">
    <Loader />
    Loading LSPs
  </div>
{/if}

<div class="loading-indicator">
  {#if loading && lsps}
    <Loader />
  {/if}
</div>

<style>
  ul {
    list-style-type: none;
  }

  ul li {
    margin-bottom: var(--space-12);
  }

  div.loading-indicator-initial {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  div.loading-indicator {
    position: fixed;
    bottom: var(--space-8);
    right: var(--space-8);
  }
</style>
