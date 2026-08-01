# shellcheck shell=zsh
for f in history opts completion prompt keymap aliases; do
  [[ -f "${ZDOTDIR:-$HOME}/$f.zsh" ]] && source "${ZDOTDIR:-$HOME}/$f.zsh"
done

zox_init="${XDG_CACHE_HOME:-$HOME/.cache}/zsh/zoxide-init"
if ((${+commands[zoxide]})); then
  if [[ ! -f "$zox_init" || "${commands[zoxide]}" -nt "$zox_init" ]]; then
    mkdir -p "${zox_init:h}"
    zoxide init --cmd cd zsh >"$zox_init"
  fi
  source "$zox_init"
fi

export PNPM_HOME="/home/dev/.local/share/pnpm"
case ":$PATH:" in
*":$PNPM_HOME/bin:"*) ;;
*) export PATH="$PNPM_HOME/bin:$PATH" ;;
esac
