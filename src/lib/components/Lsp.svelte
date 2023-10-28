<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { exec, messages } from '@replit/extensions';

  import Button from '@replit-svelte/ui/Button.svelte';
  import Card from '@replit-svelte/ui/Card.svelte';

  import type { Lsp } from '$lib/lsp';

  export let lsp: Lsp;

  let reloading = false;

  const dispatch = createEventDispatcher<{
    reload: Lsp;
  }>();
</script>

<Card height="higher">
  <div>
    {lsp.id}

    <Button
      variant="primary"
      disabled={!lsp.pid || reloading}
      on:click={() => {
        reloading = true;

        exec
          .exec(`kill ${JSON.stringify(lsp.pid)}`)
          .then(() => {
            delete lsp.pid;

            dispatch('reload', lsp);
          })
          .catch((err) => {
            messages.showError(`[LSP Reloader] Error reloading LSP: ${err}`);
          })
          .finally(() => {
            reloading = false;
          });
      }}
    >
      Reload
    </Button>
  </div>

  <code>PID: {lsp.pid || 'unknown'}</code>
  <br />
  <code>Command: {lsp.cmd}</code>
</Card>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
