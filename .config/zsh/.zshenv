[[ -t 0 ]] && export GPG_TTY="${TTY:-$(tty 2>/dev/null || true)}"

export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"

export XDG_CURRENT_DESKTOP="Hyprland"
export XDG_SESSION_DESKTOP="Hyprland"
export XDG_SESSION_TYPE="wayland"

export TERMINAL="ghostty"
export VISUAL="zeditor"
export EDITOR="zeditor --wait"
export BROWSER="helium-browser"

export VP_HOME="$HOME/.vite-plus"
export CARGO_HOME="$HOME/.cargo"
export RUSTUP_HOME="$HOME/.rustup"

typeset -U path PATH
path=(
  "$HOME/.local/bin"
  "$VP_HOME/bin"
  "$CARGO_HOME/bin"
  "${path[@]}"
)
export PATH

# Vite+ bin (https://viteplus.dev)
. "/home/dev/.vite-plus/env"
