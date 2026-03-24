typeset -U path
autoload -Uz up-line-or-beginning-search down-line-or-beginning-search
zle -N up-line-or-beginning-search
zle -N down-line-or-beginning-search

setopt auto_cd auto_menu auto_list auto_param_slash correct flow_control globdots extended_glob no_bang_hist

bindkey "^[[A" up-line-or-beginning-search
bindkey "^[[B" down-line-or-beginning-search
bindkey "^[[H" beginning-of-line
bindkey "^[[F" end-of-line
bindkey "^?" backward-delete-char
bindkey "^[[3~" delete-char
bindkey "^[[D" backward-char
bindkey "^[[C" forward-char
bindkey "^[[1;5D" backward-word
bindkey "^[[1;5C" forward-word
bindkey "^D" kill-buffer
bindkey "^Z" undo
bindkey "^Y" redo

export TERMINAL="alacritty"
export EDITOR="nano"
export BROWSER="chromium"

export GIT_EDITOR="zed --wait"

export BAT_PAGER="less -R"
export BAT_PAGING="always"
export BAT_THEME="scope"

[[ -f ~/.config/zsh/functions.zsh ]] && source ~/.config/zsh/functions.zsh
[[ -f ~/.config/zsh/aliases.zsh ]] && source ~/.config/zsh/aliases.zsh

eval "$(starship init zsh)"
eval "$(zoxide init --cmd cd zsh)"
trap 'cd $(cat /tmp/tv-jump)' SIGUSR1

HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000
unsetopt extended_history
setopt append_history
setopt inc_append_history
setopt share_history
setopt hist_ignore_all_dups
setopt hist_save_no_dups

source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

. "$HOME/.vite-plus/env"
