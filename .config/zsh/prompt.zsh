precmd() {
  if ((!_plugins_loaded)); then
    typeset -g _plugins_loaded=1
    if [[ -d "/usr/share/zsh/plugins/" ]]; then
      source "/usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh"
      source "/usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
    fi
  fi
  vcs_info
  _precmd_set_dir
  [[ -n "$_seen_prompt" ]] && print || typeset -g _seen_prompt=1
  print -Pn "\e]0;%1~\a"
}
preexec() { print -Pn "\e]0;$1 — %1~\a"; }

autoload -Uz vcs_info
zstyle ':vcs_info:*' max-exports 3
zstyle ':vcs_info:git:*' formats '%F{blue}git:(%F{red}%b%F{blue})%f ' '%r' '%R'
zstyle ':vcs_info:*' enable git

setopt PROMPT_SUBST

typeset -g _prompt_dir

_precmd_set_dir() {
  local trunc_len=2

  if [[ -n "${vcs_info_msg_1_}" ]]; then
    local repo_name="${vcs_info_msg_1_}"
    local repo_root="${vcs_info_msg_2_}"
    local rel_path="${PWD#$repo_root}"
    rel_path="${rel_path#/}"
    if [[ -z "$rel_path" ]]; then
      _prompt_dir="$repo_name"
    else
      local full_path="$repo_name/$rel_path"
      local -a parts=("${(s:/:)full_path}")
      if ((${#parts} <= trunc_len)); then
        _prompt_dir="$full_path"
      else
        local start=$((${#parts} - trunc_len + 1))
        _prompt_dir="${(j:/:)parts[start,-1]}"
      fi
    fi
  else
    local trunc_path track_tilde=0
    if [[ "$PWD" == "$HOME" ]]; then
      _prompt_dir="~"
      return
    elif [[ "$PWD" == "/" ]]; then
      _prompt_dir="/"
      return
    elif [[ "$PWD" == "$HOME"/* ]]; then
      trunc_path="${PWD#$HOME/}"
      track_tilde=1
    else
      trunc_path="${PWD#/}"
    fi

    local -a parts=("${(s:/:)trunc_path}")
    if ((track_tilde && ${#parts} == 1)); then
      _prompt_dir="~/$trunc_path"
    elif ((${#parts} <= trunc_len)); then
      _prompt_dir="$trunc_path"
    else
      local start=$((${#parts} - trunc_len + 1))
      _prompt_dir="${(j:/:)parts[start,-1]}"
    fi
  fi
}

PROMPT='%(?.%F{white}󰣇.%F{red}󰀦)%f %F{cyan}${_prompt_dir}%f ${vcs_info_msg_0_}'
