autoload -Uz up-line-or-beginning-search down-line-or-beginning-search
zle -N up-line-or-beginning-search   # register widget
zle -N down-line-or-beginning-search # register widget

bindkey "^[[A" up-line-or-beginning-search    # ↑ — search history from cursor
bindkey "^[[B" down-line-or-beginning-search  # ↓ — search history from cursor
bindkey "^[[H" beginning-of-line              # Home — go to line start
bindkey "^[[F" end-of-line                    # End — go to line end
bindkey "^?" backward-delete-char             # Backspace — delete char before cursor
bindkey "^[[3~" delete-char                   # Delete — delete char under cursor
bindkey "^[[D" backward-char                  # ← — move cursor left
bindkey "^[[C" forward-char                   # → — move cursor right
bindkey "^[[1;5D" backward-word               # Ctrl+← — jump word left
bindkey "^[[1;5C" forward-word                # Ctrl+→ — jump word right
bindkey "^D" kill-buffer                      # Ctrl+D — clear entire line
bindkey "^Z" undo                             # Ctrl+Z — undo
bindkey "^Y" redo                             # Ctrl+Y — redo
