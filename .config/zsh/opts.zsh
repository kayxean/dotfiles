# cd by typing directory name alone
setopt auto_cd
# list choices on ambiguous completion
setopt auto_list
# highlight menu selection on tab completion
setopt auto_menu
# auto-append trailing slash to directory names on completion
setopt auto_param_slash
# push directory onto stack on cd
setopt auto_pushd
# resolve symlinks to their canonical paths
setopt chase_links
# display combining characters properly (accents, emoji)
setopt combining_chars
# suggest corrections for misspelled commands
setopt correct
# enable advanced glob patterns (#, ~, ^)
setopt extended_glob
# match files starting with . (dotfiles) in globs
setopt globdots
# allow # comments in interactive shell
setopt interactive_comments
# show all jobs in long format with exit status
setopt long_list_jobs
# disable ! history expansion (avoid accidental explosions)
setopt no_bang_hist
# no beep on errors or ambiguous completions
setopt nobeep
# sort numeric filenames naturally (1,2,10 not 1,10,2)
setopt numeric_glob_sort
# don't push duplicate directories onto dir stack
setopt pushd_ignore_dups
# pushd/popd uses - as argument meaning $OLDPWD
setopt pushd_minus
