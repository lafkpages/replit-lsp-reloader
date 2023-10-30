<script lang="ts">
  import { onMount } from 'svelte';

  import { loadLsps as _loadLsps } from '$lib/lsp';
  import type { Lsp as ILsp } from '$lib/lsp';

  import Lsp from '$lib/components/Lsp.svelte';

  import Button from '@replit-svelte/ui/Button.svelte';
  import Loader from '@replit-svelte/ui/icons/Loader.svelte';

  let lsps: ILsp[] | null = null;

  let loading = false;

  const loadLsps = async () => {
    loading = true;

    lsps = await _loadLsps();

    loading = false;
  };

  onMount(loadLsps);
</script>

<svelte:head>
  <title>LSP Reloader</title>
</svelte:head>

<header>
  <h1 class="headerDefault">LSPs</h1>

  <Button
    variant="outlined"
    text="Refresh"
    disabled={loading}
    on:click={() => {
      loadLsps();
    }}
  />
</header>

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
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

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
