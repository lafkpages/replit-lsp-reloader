{ pkgs }: {
	deps = [
		pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
		pkgs.nodePackages.svelte-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
	];
}