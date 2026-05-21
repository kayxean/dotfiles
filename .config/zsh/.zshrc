[[ -f "$ZDOTDIR/prompt.zsh" ]] && source "$ZDOTDIR/prompt.zsh"
[[ -f "$ZDOTDIR/keymap.zsh" ]] && source "$ZDOTDIR/keymap.zsh"

if [[ -d "/usr/share/zsh/plugins/" ]]; then
  source "/usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh"
  source "/usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
fi

eval "$(starship init zsh)"

eval "$(zoxide init --cmd cd zsh)"
trap 'cd "$(cat /tmp/tv-jump)" && zoxide add -- "$(pwd -P)"' SIGUSR1

[[ -f "$ZDOTDIR/aliases.zsh" ]] && source "$ZDOTDIR/aliases.zsh"


export VP_HOME="$HOME/.vite-plus"
export PATH="$VP_HOME/bin:$PATH"
