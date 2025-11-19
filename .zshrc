zmodload zsh/complist
autoload -Uz up-line-or-beginning-search down-line-or-beginning-search

setopt append_history
setopt inc_append_history
setopt share_history
setopt hist_ignore_dups
setopt hist_save_no_dups
setopt no_bang_hist
setopt auto_cd
setopt auto_menu
setopt auto_list
setopt auto_param_slash
setopt correct
setopt flow_control
setopt globdots
setopt extended_glob

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
bindkey "^[[1;5D" backward-word
bindkey "^[[1;5C" forward-word
bindkey "^D" kill-buffer
bindkey "^Z" undo
bindkey "^Y" redo

eval "$(starship init zsh)"
eval "$(zoxide init --cmd cd zsh)"

source ~/.config/zsh/aliases.zsh
source ~/.config/zsh/plugins.zsh

source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000

export TERMINAL="alacritty"
export EDITOR="nano"
export BROWSER="chromium"

packages="$HOME/packages"
export PATH="$packages/pnpm:$packages/npm/global/bin:$packages/rust/bin:$packages/go/bin:$PATH"

export PNPM_HOME="$packages/pnpm"
export PNPM_CACHE_DIR="$packages/pnpm/cache"
export PNPM_GLOBAL_HOME="$packages/pnpm/global"
export PNPM_STORE_DIR="$packages/pnpm/store"

export npm_config_cache="$packages/npm/cache"
export npm_config_prefix="$packages/npm/global"

export RUSTUP_HOME="$packages/rust"
export CARGO_HOME="$packages/rust/cache"

export GOPATH="$packages/go"
export GOCACHE="$packages/go/cache"
export GOMODCACHE="$packages/go/mod"
export GOBIN="$packages/go/bin"

export BAT_PAGER="less -R"
export BAT_PAGING="always"
export BAT_THEME="scope"
