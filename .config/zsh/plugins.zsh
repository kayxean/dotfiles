FZF_COLOR_DEFAULT="fg:#a4a5a6,bg:#020304,hl:#e25099,preview-fg:#a4a5a6,preview-bg:#020304"
FZF_COLOR_HIGHLIGHT="fg+:#f2f3f4,bg+:#020304,hl+:#f2f3f4,header:#62c073,info:#a4a5a6"
FZF_COLOR_ACTION="prompt:#4aacc0,query:#f2f3f4,marker:#f2f3f4,spinner:#6969f9,pointer:#f2f3f4,border:#171819"

export FZF_DEFAULT_OPTS="
  --layout='reverse'
  --no-height
  --preview-window='right:65%'
  --info='right'
  --prompt='~ '
  --pointer='▷'
  --color=$FZF_COLOR_DEFAULT,$FZF_COLOR_HIGHLIGHT,$FZF_COLOR_ACTION
  --border
"

function plugin-find-file() {
    local query="${BUFFER}"
    BUFFER=""

    local prefix="fd --type file --follow --hidden --exclude .git"

    local file=$(
        fzf --ansi --disabled --query "$query" \
            --bind "start:reload:$prefix {q}" \
            --bind "change:reload:sleep 0.1; $prefix {q} || true" \
            --color "hl:-1:underline,hl+:-1:underline:reverse" \
            --preview "bat -n --color=always --line-range :256 {}" \
            --exit-0
    )

    if [[ -n "$file" ]]; then
        BUFFER="zeditor ${file}"
        zle accept-line
    fi
}

function plugin-find-directory() {
    local query="${BUFFER}"
    BUFFER=""

    local prefix="fd --type directory --follow --hidden --exclude .git"

    local directory=$(
        fzf --ansi --disabled --query "$query" \
            --bind "start:reload:$prefix {q}" \
            --bind "change:reload:sleep 0.1; $prefix {q} || true" \
            --color "hl:-1:underline,hl+:-1:underline:reverse" \
            --preview "eza --tree --color=always {} | head -200" \
            --exit-0
    )

    if [[ -n "$directory" ]]; then
        BUFFER="cd ${directory}"
        zle accept-line
    fi
}

function plugin-find-content(){
    local query="${BUFFER}"
    BUFFER=""

    local prefix="rg --column --line-number --no-heading --color=always --smart-case"

    local content=$(
        fzf --ansi --disabled --query "$query" \
            --bind "start:reload:$prefix {q}" \
            --bind "change:reload:sleep 0.1; $prefix {q} || true" \
            --color "hl:-1:underline,hl+:-1:underline:reverse" \
            --exit-0
    )

    if [[ -n "$content" ]]; then
        BUFFER="zeditor ${content%%:*}"
        zle accept-line
    fi
}

zle -N plugin-find-file
zle -N plugin-find-directory
zle -N plugin-find-content

bindkey "^[f" plugin-find-file
bindkey "^[d" plugin-find-directory
bindkey "^[c" plugin-find-content
