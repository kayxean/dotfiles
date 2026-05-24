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
alias reload="source $ZDOTDIR/.zshrc && zsh-dump && hyprctl reload"

alias net-status="systemctl status systemd-networkd systemd-resolved dnscrypt-proxy zapret"
alias net-restart="sudo resolvectl flush-caches && sudo systemctl restart dnscrypt-proxy zapret systemd-resolved"
alias net-log="sudo journalctl -u dnscrypt-proxy -u zapret -f"
alias net-service="ss -tulpn | grep :53"
alias zap-rules="sudo nft list table inet zapret"

alias watch-audio="watch -n0.1 pactl list sources short"
alias check-audio="pw-top"

alias bun="sandbox-bun"
alias bunx="sandbox-bunx"
alias vp="sandbox-vp"
alias vpr="sandbox-vpr"
alias vpx="sandbox-vpx"
alias node="sandbox-node"
alias npm="sandbox-npm"
alias npx="sandbox-npx"
alias go="sandbox-go"
alias gofmt="sandbox-gofmt"
alias python3="sandbox-python3"
alias pip="sandbox-pip"
alias lua="sandbox-lua"
alias zig="sandbox-zig"
alias rustup="sandbox-rustup"
alias cargo="sandbox-cargo"
alias rustc="sandbox-rustc"

alias helium-private="helium-browser --proxy-server='socks5://127.0.0.1:9050' --host-resolver-rules='MAP * ~NOTFOUND , EXCLUDE 127.0.0.1' --test-type"
