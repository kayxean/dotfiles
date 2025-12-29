function set-wallpaper(){
    local wallpaper="$1"
    local monitor="eDP-1"
    local gallery="$HOME/wallpapers"
    local config="$HOME/.config/hypr/hyprpaper.conf"

    if [[ -n "$wallpaper" ]]; then
        killall hyprpaper 2>/dev/null

        mkdir -p "$(dirname "$config")"
        printf "wallpaper {\n  monitor = $monitor\n  path = $gallery/$wallpaper\n  fit_mode = fill\n}\n\nsplash = false" > "$config"

        hyprctl dispatch exec hyprpaper
    fi
}
