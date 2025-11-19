alias z="__zoxide_z"
alias zi="__zoxide_zi"

alias list="eza --across --group-directories-first --classify=auto"
alias ls="list"
alias la="list --all"
alias ll="list --all --long --git --git-repos-no-status --time-style='relative' --total-size"
alias lr="list --recurse"
alias lt="list --recurse --tree"

alias view="bat --style=plain"
alias help="bat --language=help --style=plain"

alias now="date +'%I:%M %p, %a, %b %d'"
alias exit="hyprctl dispatch exit"

alias firewall="sudo ufw status verbose"
alias service="systemctl list-units --type=service --all --no-legend --plain"
