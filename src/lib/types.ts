import type { Writable } from 'svelte/store';

export type FileHandlerPath = string | null | undefined;
export type FileHandlerPathStore = Writable<FileHandlerPath>;
