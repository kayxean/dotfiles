if [ "$(tty)" = "/dev/tty1" ]; then
   if command -v uwsm >/dev/null && uwsm check may-start; then
     exec uwsm start hyprland-uwsm.desktop
   fi
fi
