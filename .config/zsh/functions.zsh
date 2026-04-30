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

update() {
    local dotfiles="$HOME/personal/dotfiles"

    paru -Syu --needed --cleanafter

    pacman -Qtdq | xargs -r sudo pacman -Rns

    sudo rm -rf /var/cache/pacman/pkg/download-*(N)

    paru -Sc
    sudo journalctl --vacuum-time=7d

    pacman -Qeq > "$dotfiles/.pkglist"
}

bootstrap() {
    local dotfiles="$HOME/personal/dotfiles"
    local pkglist="$dotfiles/.pkglist"

    if [[ -f "$pkglist" ]]; then
        paru -S --needed --cleanafter - < "$pkglist"
    else
        echo "Error: $pkglist not found."
        return 1
    fi
}
