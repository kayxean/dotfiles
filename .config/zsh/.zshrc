for f in history opts completion prompt keymap aliases; do
  [[ -f "$ZDOTDIR/$f.zsh" ]] && source "$ZDOTDIR/$f.zsh"
done

zox_init="$XDG_CACHE_HOME/zsh/zoxide-init"
if (( $+commands[zoxide] )); then
  if [[ ! -f "$zox_init" || "$commands[zoxide]" -nt "$zox_init" ]]; then
    mkdir -p "$XDG_CACHE_HOME/zsh"
    zoxide init --cmd cd zsh > "$zox_init"
  fi
  source "$zox_init"
fi

trap 'cd "$(cat /tmp/tv-jump)" && zoxide add -- "$(pwd -P)"' SIGUSR1
