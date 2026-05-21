#!/usr/bin/env bash
set -euo pipefail

R=$(tput setaf 1)
G=$(tput setaf 2)
Y=$(tput setaf 3)
B=$(tput setaf 4)
M=$(tput setaf 5)
C=$(tput setaf 6)
W=$(tput setaf 7)
A=$(tput setaf 8)
N=$(tput sgr0)

DOTFILES="$(cd "$(dirname "$0")" && pwd)"

STOW_ARGS=(
  -t "$HOME"
  -d "$DOTFILES"
  --ignore='^\.git'
  --ignore='^result$'
  --ignore='\.md$'
  --ignore='\.sh$'
  --ignore='\.nix$'
  --ignore='\.lock$'
  --ignore='^\.pkglist$'
  --ignore='^\.luarc\.json$'
  --ignore='^dotfiles\.sh$'
  --ignore='\.config/gh/hosts\.yml$'
  --ignore='\.config/hypr/hyprpaper\.conf$'
  --ignore='\.config/opencode/(\.gitignore|node_modules|package(-lock)?\.json)$'
  --ignore='\.local/share/easyeffects/(autoload|irs|rnnoise)$'
)

usage() {
  cat <<EOF
${W}Usage:${N} ${G}$(basename "$0")${N} ${A}<command>${N}

${W}Commands:${N}
  ${M}check${N}   ${W}List entries and verify symlink correctness${N}
  ${M}stow${N}    ${W}Create symlinks from the repo into ${A}\$HOME${N}
  ${B}destow${N}  ${W}Remove symlinks previously created by stow${N}
  ${B}restow${N}  ${W}Delete and recreate all symlinks${N}
  ${C}diff${N}    ${W}Diff repo files against home copies${N}
  ${C}stats${N}   ${W}Show per-entry symlink state${N}
  ${Y}prune${N}   ${W}Remove dead symlinks referencing unknown entries${N}
  ${Y}install${N} ${W}Install system packages and bootstrap dotfiles${N}
EOF
}

entries() {
  fd --no-ignore -t d --max-depth 1 . "$DOTFILES/.config" 2>/dev/null \
    | while read d; do rel="${d#"$DOTFILES"/}"; echo "${rel%/}"; done
  fd --no-ignore -t f --max-depth 1 . "$DOTFILES/.config" 2>/dev/null \
    | while read f; do rel="${f#"$DOTFILES"/}"; echo "$rel"; done
  [[ -d "$DOTFILES/.local/bin" ]] && echo ".local/bin"
  fd --no-ignore -t d --max-depth 1 . "$DOTFILES/.local/share" 2>/dev/null \
    | while read d; do rel="${d#"$DOTFILES"/}"; echo "${rel%/}"; done
}

cmd_check() {
  echo "${C}==> dotfiles:${N} check"

  while read entry; do
    echo "  ${G}checking${N}: ${B}$entry${N}"
  done < <(entries)

  if stow -n "${STOW_ARGS[@]}" . 2>/dev/null; then
    echo "  ${C}ok${N}"
  else
    echo "  ${R}FAIL${N}" >&2
    return 1
  fi
}

is_stowed() {
  local entry="$1"
  local target="$HOME/$entry"
  local source="$DOTFILES/$entry"

  [[ -L "$target" ]] || return 1

  local target_resolved source_resolved
  target_resolved="$(realpath "$target" 2>/dev/null)" || return 1
  source_resolved="$(realpath "$source" 2>/dev/null)" || return 1
  [[ "$target_resolved" == "$source_resolved" ]]
}

cmd_stow() {
  local flag="${1:-}" verb="stow"
  case "$flag" in -D) verb="unstow" ;; -R) verb="restow" ;; esac
  echo "${C}==> dotfiles:${N} $verb"

  if [[ "$flag" == "-R" ]]; then
    while read entry; do
      echo "  ${G}${verb}${N}: ${B}$entry${N}"
    done < <(entries)
    if stow -R "${STOW_ARGS[@]}" .; then
      echo "  ${C}ok${N}"
    else
      echo "  ${R}FAIL${N}" >&2; return 1
    fi
    return
  fi

  local needs_action=() skipped=0
  while read entry; do
    if [[ "$flag" == "-D" ]] && is_stowed "$entry"; then
      needs_action+=("$entry")
    elif [[ "$flag" != "-D" ]] && ! is_stowed "$entry"; then
      needs_action+=("$entry")
    else
      skipped=$((skipped + 1))
    fi
  done < <(entries)

  if [[ ${#needs_action[@]} -eq 0 ]]; then
    if [[ "$flag" == "-D" ]]; then
      echo "  ${Y}nothing to unstow${N}" >&2
    else
      echo "  ${Y}nothing to do${N}, use ${G}restow${N} instead of ${G}stow${N}" >&2
    fi
    return 0
  fi

  for entry in "${needs_action[@]}"; do
    echo "  ${G}${verb}${N}: ${B}$entry${N}"
  done

  if [[ $skipped -gt 0 ]]; then
    if [[ "$flag" == "-D" ]]; then
      echo "  ${Y}skipped${N}: $skipped entries already unstowed" >&2
    else
      echo "  ${Y}skipped${N}: $skipped entries already stowed (use restow instead of stow)" >&2
    fi
  fi

  if stow $flag "${STOW_ARGS[@]}" .; then
    echo "  ${C}ok${N}"
  else
    echo "  ${R}FAIL${N}" >&2; return 1
  fi
}

cmd_diff() {
  echo "${C}==> dotfiles:${N} diff"
  local has_diff=0
  while read entry; do
    local source="$DOTFILES/$entry"
    local target="$HOME/$entry"
    if [[ -d "$source" ]] && [[ -d "$target" ]]; then
      if ! diff -rq "$source" "$target" &>/dev/null; then
        echo "  ${Y}modified${N}: ${B}$entry${N}"
        has_diff=$((has_diff + 1))
      fi
    elif [[ -f "$source" ]] && [[ -f "$target" ]]; then
      if ! diff -q "$source" "$target" &>/dev/null; then
        echo "  ${Y}modified${N}: ${B}$entry${N}"
        has_diff=$((has_diff + 1))
      fi
    fi
  done < <(entries)
  if [[ $has_diff -eq 0 ]]; then
    echo "  ${C}clean${N}"
  fi
}

cmd_stats() {
  echo "${C}==> dotfiles:${N} stats"
  local stowed=0 divergent=0 broken=0 unstowed=0
  while read entry; do
    local target="$HOME/$entry"
    if is_stowed "$entry"; then
      echo "  ${G}stowed${N}: ${B}$entry${N}"
      stowed=$((stowed + 1))
    elif [[ -L "$target" ]]; then
      local target_resolved
      if target_resolved="$(realpath "$target" 2>/dev/null)"; then
        echo "  ${Y}divergent${N}: ${B}$entry${N} -> $target_resolved"
        divergent=$((divergent + 1))
      else
        echo "  ${R}broken${N}: ${B}$entry${N}"
        broken=$((broken + 1))
      fi
    else
      echo "  ${A}unstowed${N}: ${B}$entry${N}"
      unstowed=$((unstowed + 1))
    fi
  done < <(entries)
  echo "  ${G}$stowed${N} stowed, ${Y}$divergent${N} divergent, ${R}$broken${N} broken, ${A}$unstowed${N} unstowed"
}

cmd_prune() {
  echo "${C}==> dotfiles:${N} prune"
  local known_entries
  known_entries="$(entries)"
  local pruned=0
  while IFS= read -r symlink; do
    local abs_target
    abs_target="$(readlink -f "$symlink" 2>/dev/null)" || continue
    [[ "$abs_target" == "$DOTFILES"* ]] || continue
    local rel="${symlink#$HOME/}"
    grep -qxF "$rel" <<<"$known_entries" && continue
    echo "  ${R}removing${N}: $rel"
    rm "$symlink"
    pruned=$((pruned + 1))
  done < <(find "$HOME" -maxdepth 5 -type l 2>/dev/null)
  if [[ $pruned -gt 0 ]]; then
    echo "  ${R}pruned${N}: $pruned orphan symlink(s)"
  else
    echo "  ${C}clean${N}"
  fi
}

cmd_install() {
  echo "${C}==> dotfiles:${N} install"

  if ! command -v paru &>/dev/null; then
    echo "  ${G}installing${N}: paru"
    sudo pacman -S --needed --noconfirm base-devel
    git clone https://aur.archlinux.org/paru.git /tmp/paru
    (cd /tmp/paru && makepkg -si --noconfirm)
    rm -rf /tmp/paru
  fi

  if [[ -f "$DOTFILES/.pkglist" ]]; then
    echo "  ${G}installing${N}: packages from .pkglist"
    paru -S --needed --cleanafter - < "$DOTFILES/.pkglist"
  else
    echo "  ${Y}WARNING: .pkglist not found, skipping packages${N}" >&2
  fi

  echo "  ${G}done${N}, running stow..."
  cmd_stow ""
}

main() {
  case "${1:-}" in
    check)          cmd_check;    exit $? ;;
    stow)           cmd_stow;     exit $? ;;
    destow)         cmd_stow "-D"; exit $? ;;
    restow)         cmd_stow "-R"; exit $? ;;
    diff)           cmd_diff;     exit $? ;;
    stats)          cmd_stats;    exit $? ;;
    prune)          cmd_prune;    exit $? ;;
    install)        cmd_install;  exit $? ;;
    "")             usage;        exit 0 ;;
    *)
      echo "${R}error:${N} unknown command '$1'" >&2
      exit 1
      ;;
  esac
}

main "$@"
