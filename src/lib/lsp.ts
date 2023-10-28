import { exec } from '@replit/extensions';

import { parseDotReplit } from '$lib/dotReplit';

export async function psLsp(lspCmd: string) {
  const ps = (
    await exec.exec(
      'ps -ef | grep ' + JSON.stringify(lspCmd.replace(/([a-z])/i, '[$1]'))
    )
  ).output;

  return ps.match(/^(\w+)\s+(\d+)/i)[2];
}

export interface Lsp {
  id: string;
  cmd: string;
  pid?: string;
}

export function getLspsFromDotReplit(dotReplit) {
  const lsps: Lsp[] = [];

  for (const [langId, lang] of Object.entries(dotReplit.languages)) {
    if (!lang?.languageServer?.start) {
      continue;
    }

    lsps.push({
      id: langId,
      cmd: lang.languageServer.start,
    });
  }

  if (lsps.length) {
    console.groupCollapsed(
      '[LSP Reloader] Found',
      lsps.length,
      'configured LSPs'
    );
    for (const lsp of lsps) {
      console.debug(lsp);
    }
    console.groupEnd();
  } else {
    console.debug('[LSP Reloader] Found no configured LSPs');
  }

  return lsps;
}

export async function loadLsps() {
  const dotReplit = await parseDotReplit();
  const lsps = getLspsFromDotReplit(dotReplit);

  for (const i in lsps) {
    try {
      const pid = await psLsp(lsps[i].cmd);

      lsps[i].pid = pid;
    } catch {}
  }

  return lsps;
}
