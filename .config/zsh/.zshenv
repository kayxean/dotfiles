[[ -t 0 ]] && export GPG_TTY=$(tty)

export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"

export STARSHIP_CONFIG="$ZDOTDIR/starship.toml"

export TERMINAL="alacritty"
export VISUAL="zeditor"
export EDITOR="zeditor --wait"
export BROWSER="google-chrome-beta"

typeset -U path

export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.nix-profile/bin:$PATH"
