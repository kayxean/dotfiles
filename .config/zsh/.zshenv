[[ -t 0 ]] && export GPG_TTY=$TTY

export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"

export TERMINAL="alacritty"
export VISUAL="zeditor"
export EDITOR="zeditor --wait"
export BROWSER="google-chrome-beta"

typeset -U path

export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.nix-profile/bin:$PATH"

[[ -f "$HOME/.nix-profile/share/devrel/env.sh" ]] && source "$HOME/.nix-profile/share/devrel/env.sh"
