autoload -Uz compinit
zcompdump="$XDG_CACHE_HOME/zsh/zcompdump"
compinit -C -d "$zcompdump"
[[ ! -f "${zcompdump}.zwc" || "$zcompdump" -nt "${zcompdump}.zwc" ]] && zcompile "$zcompdump" 2>/dev/null

zstyle ":completion:*" menu select
zstyle ":completion:*" matcher-list "m:{a-z}={A-Z}"
zstyle ':completion:*' rehash true
zstyle ':completion:*' list-dirs-first true
zstyle ':completion:*' file-sort modification
zstyle ':completion:*' special-dirs false
zstyle ':completion:*' insert-tab pending
zstyle ':completion:*' ignored-patterns '.*'
zstyle ':completion:*' file-patterns '%p(.^@):glob:regular-files' '*(-/):glob:directories' '%p(^@):glob:all-files'
