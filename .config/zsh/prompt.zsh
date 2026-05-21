HISTFILE="$XDG_STATE_HOME/zsh/history"
HISTSIZE=10000
SAVEHIST=10000

unsetopt extended_history
setopt append_history
setopt inc_append_history
unsetopt share_history
setopt hist_ignore_all_dups
setopt hist_save_no_dups
setopt hist_reduce_blanks

setopt auto_cd
setopt auto_list
setopt auto_menu
setopt auto_param_slash
setopt auto_pushd
setopt chase_links
setopt combining_chars
setopt correct
setopt extended_glob
setopt flow_control
setopt globdots
setopt interactive_comments
setopt long_list_jobs
setopt no_bang_hist
setopt nobeep
setopt numeric_glob_sort
setopt pushd_ignore_dups
setopt pushd_minus

autoload -Uz compinit
compinit -d "$XDG_CACHE_HOME/zsh/zcompdump"

zstyle ":completion:*" menu select
zstyle ":completion:*" matcher-list "m:{a-z}={A-Z}"
zstyle ':completion:*' rehash true
zstyle ':completion:*' group-name ''
zstyle ':completion:*:descriptions' format '[%d]'
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
zstyle ':completion:*:kill:*' command 'ps -u $USER -o pid,%cpu,%mem,comm'

precmd() { print -Pn "\e]0;%1~\a" }
preexec() { print -Pn "\e]0;$1 — %1~\a" }

autoload -Uz url-quote-magic
zle -N self-insert url-quote-magic

autoload -Uz zsh-mime-setup && zsh-mime-setup
