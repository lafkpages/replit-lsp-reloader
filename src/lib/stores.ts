import { writable } from 'svelte/store';

import type { FileHandlerPathStore } from '$lib/types';

export const fileHandlerPath: FileHandlerPathStore = writable(null);
