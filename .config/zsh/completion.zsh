autoload -Uz compinit
zmodload zsh/complist
zcompdump="$XDG_CACHE_HOME/zsh/zcompdump"
compinit -C -d "$zcompdump"
if [[ ! -f "${zcompdump}.zwc" || "$zcompdump" -nt "${zcompdump}.zwc" ]]; then
  zcompile "$zcompdump" 2>/dev/null
fi

tv-files() {
  zle push-input
  BUFFER="tv files"
  zle accept-line
}

tv-dirs() {
  zle push-input
  BUFFER="tv dirs"
  zle accept-line
}

tv-history() {
  zle push-input
  BUFFER="tv history"
  zle accept-line
}

tv-zoxide() {
  zle push-input
  BUFFER="tv zoxide"
  zle accept-line
}

zle -N tv-files
zle -N tv-dirs
zle -N tv-history
zle -N tv-zoxide

bindkey '^E' tv-files
bindkey '^G' tv-dirs
bindkey '^R' tv-history
bindkey '^@' tv-zoxide
