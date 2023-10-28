#!/usr/bin/env bash

# Prevent .replit from restarting the LSP
sed -ri 's/^start\s*=\s*"svelteserver\s+--stdio.+$/#&/m' .replit

# Kill running LSPs
kill -15 `ps -aef | grep "[s]velteserver" | awk '{ print $2 }'`
