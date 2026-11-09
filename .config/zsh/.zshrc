alias now="date +'%b %d, %Y, %I:%M %p GMT%-:::z'"

alias shutdown="hyprshutdown -t 'Shutting down...' --post-cmd 'shutdown -P 0'"
alias reboot="hyprshutdown -t 'Restarting...' --post-cmd 'reboot'"

alias fix-audio="systemctl --user restart pipewire pipewire-pulse wireplumber"
alias fix-portal="systemctl --user restart xdg-desktop-portal-gtk xdg-desktop-portal-hyprland"
alias fix-network="sudo resolvectl flush-caches && sudo systemctl restart systemd-resolved systemd-networkd"

autoload -Uz up-line-or-beginning-search down-line-or-beginning-search
zle -N up-line-or-beginning-search
zle -N down-line-or-beginning-search

bindkey "^[[A" up-line-or-beginning-search
bindkey "^[[B" down-line-or-beginning-search
bindkey "^[[H" beginning-of-line
bindkey "^[[F" end-of-line
bindkey "^?" backward-delete-char
bindkey "^[[3~" delete-char
bindkey "^[[D" backward-char
bindkey "^[[C" forward-char
bindkey "^K" kill-buffer
bindkey "^Z" undo
bindkey "^Y" redo

HISTFILE="${XDG_CACHE_HOME:-$HOME/.cache}/zsh/history"
HISTSIZE=768
SAVEHIST=768

setopt extended_glob
setopt globdots
setopt numeric_glob_sort
setopt hist_ignore_all_dups
setopt hist_save_no_dups
setopt hist_find_no_dups
setopt hist_ignore_dups
setopt append_history
setopt inc_append_history

eval "$(starship init zsh)"

eval "$(zoxide init zsh --cmd cd)"

if [[ -n "${GHOSTTY_RESOURCES_DIR:-}" && -f "$GHOSTTY_RESOURCES_DIR/shell-integration/zsh/ghostty-integration" ]]; then
  source "$GHOSTTY_RESOURCES_DIR/shell-integration/zsh/ghostty-integration"
fi

if [[ -f /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh ]]; then
  source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
fi

if [[ -f /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh ]]; then
  source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
fi

# Vite+ bin (https://viteplus.dev)
. "/home/dev/.vite-plus/env"
