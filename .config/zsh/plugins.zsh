FZF_COLOR_DEFAULT="fg:#a4a5a6,bg:#020304,hl:#e25099,preview-fg:#a4a5a6,preview-bg:#020304"
FZF_COLOR_HIGHLIGHT="fg+:#f2f3f4,bg+:#020304,hl+:#f2f3f4,header:#62c073,info:#a4a5a6"
FZF_COLOR_ACTION="prompt:#4aacc0,query:#f2f3f4,marker:#f2f3f4,spinner:#6969f9,pointer:#f2f3f4,border:#171819"

export FZF_DEFAULT_OPTS="
  --preview-window='right:65%'
  --info='right'
  --prompt='~ '
  --pointer='▷'
  --color=$FZF_COLOR_DEFAULT,$FZF_COLOR_HIGHLIGHT,$FZF_COLOR_ACTION
  --border
"

function plugin-find-file() {
    local query="$BUFFER"
    BUFFER=""

    local prefix="fd --type file --follow --hidden --exclude .git"
    local file=$(
        fzf --disabled --query "$query" \
            --bind "start:reload:$prefix {q}" \
            --bind "change:reload:sleep 0.1; $prefix {q} || true" \
            --preview "bat -n --color=always --line-range :256 {}" \
            --reverse \
            --no-height
    )

    if [[ -n "$file" ]]; then
        BUFFER="zeditor $file"
        zle accept-line
    else
        zle redisplay
    fi
}

function plugin-find-directory() {
    local query="$BUFFER"
    BUFFER=""

    local prefix="fd --type directory --follow --hidden --exclude .git"
    local directory=$(
        fzf --disabled --query "$query" \
            --bind "start:reload:$prefix {q}" \
            --bind "change:reload:sleep 0.1; $prefix {q} || true" \
            --preview "eza --tree --color=always {} | head -200" \
            --reverse \
            --no-height
    )

    if [[ -n "$directory" ]]; then
        BUFFER="cd $directory"
        zle accept-line
    else
        zle redisplay
    fi
}

function plugin-find-content(){
    local query="$BUFFER"
    BUFFER=""

    local prefix="rg --column --line-number --no-heading --color=always --smart-case"
    local content=$(
        fzf --ansi --disabled --query "$query" \
            --bind "start:reload:$prefix {q}" \
            --bind "change:reload:sleep 0.1; $prefix {q} || true" \
            --reverse \
            --no-height
    )

    if [[ -n "$content" ]]; then
        BUFFER="zeditor ${content%%:*}"
        zle accept-line
    else
        zle redisplay
    fi
}

function plugin-pnpm-env(){
    local query="$BUFFER"
    BUFFER=""

    local state="/tmp/pnpm-env-status"
    echo "use" > $state

    local prefix="pnpm env list"
    local node=$(
        fzf --disabled --query "$query" \
            --bind "start:reload:$prefix | sed 's/^[[:space:]]*//'" \
            --bind "change:reload:sleep 0.1; $prefix --remote {q} && echo 'remote' > $state || true" \
            --bind "alt-a:change-prompt(add: )+execute-silent:(echo 'add' > $state)" \
            --bind "alt-u:change-prompt(use: )+execute-silent:(echo 'use' > $state)" \
            --bind "alt-r:change-prompt(remove: )+execute-silent:(echo 'remove' > $state)" \
            --prompt "use: " \
            --reverse \
            --height=40%
    )

    if [[ -n "$node" ]]; then
        local action=$(cat $state)

        if [[ "$action" == "use" ]]; then
            pnpm env use --global "$node"
        elif [[ "$action" == "remote" ]]; then
            pnpm env use --global "$node"
        elif [[ "$action" == "add" ]]; then
            pnpm env add --global "$node"
        elif [[ "$action" == "remove" ]]; then
            pnpm env remove --global "$node"
        else
            echo "error: unknown action" >&2
            return 1
        fi

        BUFFER=""
        zle accept-line
    else
        zle redisplay
    fi

    rm -rf $state
}

function plugin-wallpaper(){
    local query="$BUFFER"
    BUFFER=""

    local monitor="eDP-1"
    local gallery="$HOME/wallpapers"
    local config="$HOME/.config/hypr/hyprpaper.conf"

    local prefix="eza $gallery"
    local wallpaper=$(
        fzf --query "$query" \
            --bind "start:reload:$prefix {q}" \
            --bind "change:reload:sleep 0.1; $prefix {q} || true" \
            --prompt "wallpaper: " \
            --reverse \
            --height=40%
    )

    if [[ -n "$wallpaper" ]]; then
        local selected="$gallery/$wallpaper"

        hyprctl hyprpaper unload all > /dev/null
        hyprctl hyprpaper preload "$selected" > /dev/null
        hyprctl hyprpaper wallpaper "$monitor,$gallery/$wallpaper" > /dev/null

        mkdir -p "$(dirname $config)"
        printf "preload = $selected\nwallpaper = $monitor, $gallery/$wallpaper" > "$config"

        BUFFER=""
        zle accept-line
        zle redisplay
    else
        zle redisplay
    fi
}

function plugin-draft(){
    local query="$BUFFER"
    BUFFER=""

    local docs="$HOME/documents"

    local prefix="eza $docs"
    local draft=$(
        fzf --query "$query" \
            --bind "start:reload:$prefix {q}" \
            --bind "change:reload:sleep 0.1; $prefix {q} || true" \
            --prompt "draft: " \
            --reverse \
            --height=40%
    )

    if [[ -n "$draft" ]]; then
        BUFFER="nano $docs/$draft"
        zle accept-line
        zle redisplay
    else
        zle redisplay
    fi
}

zle -N plugin-find-file
zle -N plugin-find-directory
zle -N plugin-find-content
zle -N plugin-pnpm-env
zle -N plugin-wallpaper
zle -N plugin-draft

bindkey "^[f" plugin-find-file
bindkey "^[d" plugin-find-directory
bindkey "^[c" plugin-find-content
bindkey "^[e" plugin-pnpm-env
bindkey "^[w" plugin-wallpaper
bindkey "^[n" plugin-draft
