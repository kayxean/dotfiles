alias list="eza --across --group-directories-first --classify=auto"
alias ls="list"
alias la="list --all"
alias ll="list --all --long --git --git-repos-no-status --time-style='relative' --total-size"
alias lr="list --recurse"
alias lt="list --recurse --tree"

alias view="bat --style=plain"
alias help="bat --language=help --style=plain"

alias now="date +'%I:%M %p, %a, %b %d'"

alias update="paru -Syu"
alias service="systemctl list-units --type=service --all --no-legend --plain"

alias net-status="systemctl status systemd-networkd systemd-resolved dnscrypt-proxy zapret"
alias net-restart="sudo resolvectl flush-caches && sudo systemctl restart dnscrypt-proxy zapret systemd-resolved"
alias net-log="sudo journalctl -u dnscrypt-proxy -u zapret -f"
alias net-service="ss -tulpn | grep :53"
alias zap-rules="sudo nft list table inet zapret"
