typeset -ga EZA_FLAGS=(--across --group-directories-first --classify=auto)

alias ls="eza $EZA_FLAGS"
alias la="eza $EZA_FLAGS --all"
alias ll="eza $EZA_FLAGS --all --long --git --git-repos-no-status --time-style='relative' --total-size"
alias lr="eza $EZA_FLAGS --recurse"
alias lt="eza $EZA_FLAGS --recurse --tree"

alias view="bat --style=plain"
alias help="bat --language=help --style=plain"

alias now="date +'%b %d, %Y, %I:%M %p GMT%-:::z'"

alias shutdown="hyprshutdown -t 'Shutting down...' --post-cmd 'shutdown -P 0'"
alias reboot="hyprshutdown -t 'Restarting...' --post-cmd 'reboot'"
alias reload="source $ZDOTDIR/.zshrc && $ZDOTDIR/compile.zsh && hyprctl reload"

alias net-status="systemctl status systemd-networkd systemd-resolved"
alias net-restart="sudo resolvectl flush-caches && sudo systemctl restart systemd-resolved systemd-networkd"
alias net-log="sudo journalctl -u systemd-resolved -f"
alias net-service="ss -tulpn | grep -E ':53|:54'"

alias watch-audio="watch -n0.1 pactl list sources short"
alias check-audio="pw-top"
