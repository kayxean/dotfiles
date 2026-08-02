#!/usr/bin/env zsh
set -euo pipefail

R=$(tput setaf 1)
G=$(tput setaf 2)
Y=$(tput setaf 3)
B=$(tput setaf 4)
M=$(tput setaf 5)
C=$(tput setaf 6)
W=$(tput setaf 7)
A=$(tput setaf 8)
N=$(tput sgr0)

zdotdir="${ZDOTDIR:-$HOME/.config/zsh}"
zcompdump="${XDG_CACHE_HOME:-$HOME/.cache}/zsh/zcompdump"

for f in "$zdotdir"/*.zsh "$zdotdir"/.zshrc "$zdotdir"/.zshenv "$zdotdir"/.zprofile; do
  [[ -f "$f" ]] || continue
  [[ "$f" == "$zdotdir/compile.zsh" ]] && continue
  dst="${f}.zwc"
  [[ -f "$dst" && "$dst" -nt "$f" ]] && continue
  echo "  ${G}compiling${N}: ${B}$f${N}"
  zcompile "$f" && echo "  ${C}ok${N}" || echo "  ${R}FAIL${N}" >&2
done

if [[ -f "$zcompdump" ]]; then
  dst="${zcompdump}.zwc"
  if [[ ! -f "$dst" || "$zcompdump" -nt "$dst" ]]; then
    echo "  ${G}compiling${N}: ${B}$zcompdump${N}"
    zcompile "$zcompdump" && echo "  ${C}ok${N}" || echo "  ${R}FAIL${N}" >&2
  fi
fi
