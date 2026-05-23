setopt auto_cd              # cd by typing directory name alone
setopt auto_list            # list choices on ambiguous completion
setopt auto_menu            # highlight menu selection on tab completion
setopt menu_complete        # cycle through completions on repeated tab
setopt always_to_end        # cursor jumps to end of word after mid-word completion
setopt auto_param_keys      # auto-insert closing quote/bracket on tab completion
setopt list_types           # highlight file types in completion list (/ * @)
setopt list_packed          # compact completion columns instead of wide spacing
setopt auto_param_slash     # auto-append trailing slash to directory names on completion
setopt auto_pushd           # push directory onto stack on cd
setopt chase_links          # resolve symlinks to their canonical paths
setopt combining_chars      # display combining characters properly (accents, emoji)
setopt correct              # suggest corrections for misspelled commands
setopt extended_glob        # enable advanced glob patterns (#, ~, ^)
setopt globdots             # match files starting with . (dotfiles) in globs
setopt interactive_comments # allow # comments in interactive shell
setopt long_list_jobs       # show all jobs in long format with exit status
setopt no_bang_hist         # disable ! history expansion (avoid accidental explosions)
setopt nobeep               # no beep on errors or ambiguous completions
setopt numeric_glob_sort    # sort numeric filenames naturally (1,2,10 not 1,10,2)
setopt pushd_ignore_dups    # don't push duplicate directories onto dir stack
setopt pushd_minus          # pushd/popd uses - as argument meaning $OLDPWD
setopt warn_create_global   # warn if a function creates a global variable unintentionally
setopt pipe_fail            # pipeline returns rightmost non-zero exit code
