HISTFILE="$XDG_STATE_HOME/zsh/history" # path to persistent history file
HISTSIZE=10000                         # max events kept in memory
SAVEHIST=10000                         # max events saved to disk

unsetopt extended_history     # don't record timestamps in history
setopt append_history         # append to history file, don't overwrite
setopt inc_append_history     # append immediately, not on shell exit
unsetopt share_history        # don't share history across sessions
setopt hist_ignore_all_dups   # don't record duplicates when they're added
setopt hist_save_no_dups      # purge duplicates when writing to file
setopt hist_reduce_blanks     # strip whitespace before recording
setopt hist_expire_dups_first # drop duplicates first when history is full
setopt hist_find_no_dups      # skip duplicate entries when searching with arrows
setopt hist_ignore_space      # skip lines starting with a space in history
