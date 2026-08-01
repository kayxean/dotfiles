[[ -t 0 ]] && export GPG_TTY="$TTY"

export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"

export TERMINAL="alacritty"
export VISUAL="zeditor"
export EDITOR="zeditor --wait"
export BROWSER="helium-browser"

export PATH="$HOME/.local/bin:$PATH"
