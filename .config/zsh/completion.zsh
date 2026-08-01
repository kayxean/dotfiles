autoload -Uz compinit
zmodload zsh/complist
zcompdump="$XDG_CACHE_HOME/zsh/zcompdump"
compinit -C -d "$zcompdump"
if [[ ! -f "${zcompdump}.zwc" || "$zcompdump" -nt "${zcompdump}.zwc" ]]; then
  zcompile "$zcompdump" 2>/dev/null
fi

typeset -g LS_COLORS='fi=00:di=00;34:ln=00;32:pi=00;33:so=00;35:bd=00;34:cd=00;34:ex=00;32:or=01;31:mi=01;31:su=37;41:sg=30;43:tw=30;42:ow=34;42:st=37;44'
LS_COLORS+=':*.cfg=00;33:*.conf=00;33:*.ini=00;33:*.desktop=00;33:*.service=00;33'
LS_COLORS+=':*.sh=00;33:*.zsh=00;33:*.bash=00;33'
LS_COLORS+=':*.md=00;35:*.mdx=00;35:*.txt=00;35'
LS_COLORS+=':*.json=00;32:*.toml=00;32:*.xml=00;32:*.yml=00;32:*.yaml=00;32:*.html=00;32'
LS_COLORS+=':*.astro=00;32:*.svelte=00;32:*.vue=00;32:*.tsx=00;32:*.cjs=00;32:*.mjs=00;32'
LS_COLORS+=':*.js=00;32:*.ts=00;32:*.jsx=00;32:*.py=00;32:*.go=00;32:*.rs=00;32:*.zig=00;32'
LS_COLORS+=':*.c=00;32:*.cpp=00;32:*.h=00;32:*.hpp=00;32'
LS_COLORS+=':*.map=01;31'

zstyle ':completion:*:default' menu select=2
zstyle ':completion:*:default' list-colors ${(s.:.)LS_COLORS}

zstyle ':completion:*' group-name ''
zstyle ':completion:*' format '%F{green}%d%f'
zstyle ':completion:*:descriptions' format '%F{blue}%d%f'
zstyle ':completion:*:corrections' format '%F{magenta}%d%f'
zstyle ':completion:*:messages' format '%F{cyan}%d%f'
zstyle ':completion:*:warnings' format '%F{red}No matches for %d%f'

zstyle ':completion:*' select-prompt '%F{cyan}%l/%L %p%f'
zstyle ':completion:*' list-prompt '%F{cyan}-- %p --%f'

zstyle ':completion:*' matcher-list '' 'm:{a-zA-Z}={A-Za-z}' 'r:|[._-]=* r:|=*' 'l:|=* r:|=*'
zstyle ':completion:*' keep-prefix true
zstyle ':completion:*' recent-dirs-insert both
