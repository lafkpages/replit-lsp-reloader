import { exec } from '@replit/extensions';
import escapeRegex from 'escape-string-regexp';

import { parseDotReplit } from '$lib/dotReplit';

export async function psLsp(lspCmd: string) {
  const ps = (
    await exec.exec(
      'ps -ef'
    )
  ).output;

  const fullCmdRegex = new RegExp(`^\\w+\\s+(\\d+).+?${escapeRegex(lspCmd)}`, 'im');
  const fullCmdMatch = ps.match(fullCmdRegex);
  if (fullCmdMatch?.[1]) {
    return fullCmdMatch[1];
  }

  const partialCmd = lspCmd.match(/^(.+?) /)?.[1] || null;
  if (partialCmd == null) {
    return null;
  }
  const partialCmdRegex = new RegExp(`^\\w+\\s+(\\d+).+?${escapeRegex(partialCmd)}`, 'im');
  const partialCmdMatch = ps.match(partialCmdRegex);
  if (partialCmdMatch?.[1]) {
    return partialCmdMatch[1];
  }

  return null;
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
