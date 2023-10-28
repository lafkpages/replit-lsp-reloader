#!/usr/bin/env bash

# Allow .replit to restart the LSP
sed -ri 's/^#(start\s*=\s*"svelteserver\s+--stdio.+)$/\1/m' .replit
