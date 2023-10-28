#!/usr/bin/env bash

cd "$REPL_HOME"

mkdir -p ".config/bin"

# Symlink scripts into .config/bin, which should be in PATH
cd scripts
for file in *; do
  dest="$REPL_HOME/.config/bin/${file:0:-3}"
  if [ ! -f "$dest" ]; then
    ln -s "../../scripts/$file" "$dest"
  fi
done
cd ..

# Remove temp. Vite files
rm vite.config.js.timestamp-*

# On fork
if [ ! "$REPL_ID" = "a8014928-cebd-467c-8357-285415275aba" ]; then
  onForkScript="$REPL_HOME/scripts/onFork.sh"
  if [ -f "$onForkScript" ]; then
    # Run the onFork script, and if it is
    # successful, remove it
    "$onForkScript" yesplease && rm "$onForkScript"
  fi
fi
