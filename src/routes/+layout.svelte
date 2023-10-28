<script lang="ts">
  import '@replit-svelte/ui/index.css';
  import ModalProvider from '@replit-svelte/ui/ModalProvider.svelte';
  import ToastProvider from '@replit-svelte/ui/ToastProvider.svelte';
  import Loader from '@replit-svelte/ui/icons/Loader.svelte';

  import { init, me, themes, HandshakeStatus } from '@replit/extensions';
  import type { ReplitInitOutput, DisposerFunction } from '@replit/extensions';

  import { onMount, onDestroy, setContext } from 'svelte';

  import { applyThemeValues } from '$lib/themes';
  import { fileHandlerPath } from '$lib/stores';

  let handshakeResult: ReplitInitOutput | null = null;

  let onThemeChangeValuesDisposer: DisposerFunction | null = null;

  onMount(() => {
    init()
      .then((res) => {
        handshakeResult = res;

        me.filePath()
          .then((file) => {
            $fileHandlerPath = file;
          })
          .catch(console.error);

        themes.getCurrentThemeValues().then(applyThemeValues);
        themes.onThemeChangeValues(applyThemeValues).then((disposer) => {
          onThemeChangeValuesDisposer = disposer;
        });
      })
      .catch((err) => {
        console.error('Error init()ing the Replit Extensions API:', err);
      });
  });

  onDestroy(() => {
    handshakeResult?.dispose();
    onThemeChangeValuesDisposer?.();
  });
</script>

<ModalProvider>
  <ToastProvider>
    <main>
      {#if handshakeResult?.status == HandshakeStatus.Error || $fileHandlerPath === undefined}
        <h1 class="headerBig">Handshake Error</h1>
        <p>
          We couldn't connect to the Replit workspace. Make sure you're running
          this as an extension.
        </p>
      {:else if handshakeResult?.status == HandshakeStatus.Ready && $fileHandlerPath !== undefined}
        <slot />
      {:else}
        <div class="handshakeLoading">
          <Loader />
        </div>
      {/if}
    </main>

    <!--
      If you want to allow the extension to run as a
      normal website, outside of the Replit IDE,
      replace the above <main> tag with the following:

      <main>
        <slot />
      </main>
    -->
  </ToastProvider>
</ModalProvider>

<style>
  :global(:root),
  :global(body) {
    background-color: var(--background-default) !important;
  }

  main {
    padding: var(--space-32);
    display: flex;
    flex-direction: column;
    gap: var(--space-16);
    width: 100%;
    height: 100%;
  }

  .handshakeLoading {
    margin: auto;
  }
</style>
