if [[ $TTY == /dev/tty1 ]] && (( $+commands[uwsm] )) && uwsm check may-start; then
  exec uwsm start hyprland-uwsm.desktop
fi
