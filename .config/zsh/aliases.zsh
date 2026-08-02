alias now="date +'%b %d, %Y, %I:%M %p GMT%-:::z'"

alias shutdown="hyprshutdown -t 'Shutting down...' --post-cmd 'shutdown -P 0'"
alias reboot="hyprshutdown -t 'Restarting...' --post-cmd 'reboot'"
alias reload="source $ZDOTDIR/.zshrc && $ZDOTDIR/compile.zsh && hyprctl reload"

alias net-status="systemctl status systemd-networkd systemd-resolved"
alias net-log="sudo journalctl -u systemd-resolved -f"
alias net-service="ss -tulpn | grep -E ':53|:54'"

alias audio-watch="watch -n0.1 pactl list sources short"

alias fix-network="sudo resolvectl flush-caches && sudo systemctl restart systemd-resolved systemd-networkd"
alias fix-audio="systemctl --user restart pipewire wireplumber"
alias fix-record="systemctl --user restart pipewire wireplumber xdg-desktop-portal-hyprland"
