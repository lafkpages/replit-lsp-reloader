import { fs } from '@replit/extensions';
import { parse } from 'ion-parser';

export async function parseDotReplit() {
  const dotReplitRaw = (await fs.readFile('.replit')).content;
  const dotReplit = parse(dotReplitRaw);

  console.debug('[LSP Reloader] dotReplit:', dotReplit);

  return dotReplit;
}
