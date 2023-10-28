<script lang="ts">
  import { onMount } from 'svelte';

  import { extensionPort, proxy, exec } from '@replit/extensions';

  import { loadLsps } from '$lib/lsp';
  import type { Lsp as ILsp } from '$lib/lsp';

  let lsps: ILsp[] | null = null;

  onMount(async () => {
    lsps = await loadLsps();

    console.debug('[LSP Reloader] BG loaded');

    await extensionPort.internal.commands.registerCommand(
      proxy({
        data: {
          id: 'lsp-reloader',
          type: 'context',
          label: 'LSP Reloader',
          description:
            "A Replit extension that can reload LSPs when they die, so that you don't have to reboot the Repl all the time.",
          icon: 'icons/icon.png',
          contributions: ['commandbar'],
        },
        commands: async ({ active }) => {
          if (!active || !lsps) {
            return proxy([]);
          }

          return proxy(
            lsps.map((lsp) =>
              proxy({
                data: {
                  id: `lsp-reloader-${lsp.id}`,
                  type: 'action',
                  label: lsp.id,
                  description: lsp.id,
                  icon: 'icons/icon.png',
                },
                run: async () => {
                  console.debug(
                    '[LSP Reloader] Killing',
                    lsp.id,
                    'LSP with PID',
                    lsp.pid
                  );
                  await exec.exec(`kill ${JSON.stringify(lsp.pid)}`);
                },
              })
            )
          );
        },
      })
    );
  });
</script>
