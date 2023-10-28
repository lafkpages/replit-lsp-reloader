#!/usr/bin/env bash

# Disable LSPs to have more RAM
"$REPL_HOME/scripts/disableSvelteServer.sh"

# Run the SvelteKit build adapter
set -o pipefail
pnpm run build
set +o pipefail

# Reenable LSPs
"$REPL_HOME/scripts/enableSvelteServer.sh"