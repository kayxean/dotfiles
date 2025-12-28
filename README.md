# Dotfiles

A collection of packages for Arch Linux that I use for my [Hyprland](https://hyprland.org/) configuration.

This configuration uses `stow` to manage dotfiles. Clone this repository into `~/repo/dotfiles`, then use the `stow` commands below to create symlinks to your home directory.

```sh
# Create symlinks
stow -t ~ -d ~/repo/dotfiles .

# Remove symlinks
stow -D -t ~ -d ~/repo/dotfiles .
```

## Packages
- [alacritty](https://archlinux.org/packages/extra/x86_64/alacritty/) - A cross-platform, GPU-accelerated terminal emulator
- [chromium](https://archlinux.org/packages/extra/x86_64/chromium/) - A web browser built for speed, simplicity, and security
- [chromium-widevine](https://aur.archlinux.org/packages/chromium-widevine) - DRM support for Chromium
- [google-chrome](https://aur.archlinux.org/packages/google-chrome) - Proprietary web browser
- [nautilus](https://archlinux.org/packages/extra/x86_64/nautilus/) - Default file manager for GNOME
- [zed](https://archlinux.org/packages/extra/x86_64/zed/) - A high-performance, multiplayer code editor from the creators of Atom and Tree-sitter

### Utilities
- [bat](https://archlinux.org/packages/extra/x86_64/bat/) - `cat` clone with syntax highlighting
- [eza](https://archlinux.org/packages/extra/x86_64/eza/) - A modern replacement for `ls`
- [fd](https://archlinux.org/packages/extra/x86_64/fd/) - A simple, fast and user-friendly alternative to `find`
- [git](https://archlinux.org/packages/extra/x86_64/git/) - the fast distributed version control system
- [github-cli](https://archlinux.org/packages/extra/x86_64/github-cli/) - The GitHub CLI
- [jq](https://archlinux.org/packages/extra/x86_64/jq/) - A lightweight and flexible command-line JSON processor
- [less](https://archlinux.org/packages/core/x86_64/less/) - A terminal based program for viewing text files
- [ripgrep](https://archlinux.org/packages/extra/x86_64/ripgrep/) - A fast, smarter alternative to `grep`
- [stow](https://archlinux.org/packages/extra/any/stow/) - Manage installation of multiple softwares in the same directory tree
- [television](https://archlinux.org/packages/extra/x86_64/television/) - A very fast, portable and hackable fuzzy finder for the terminal
- [tree](https://archlinux.org/packages/core/x86_64/tree/) - A directory listing program displaying a depth indented list of files
- [zoxide](https://archlinux.org/packages/extra/x86_64/zoxide/) - A smarter `cd` command for your terminal

### Shell
- [auto-cpufreq](https://aur.archlinux.org/packages/auto-cpufreq) - CPU frequency manager
- [btop](https://archlinux.org/packages/extra/x86_64/btop/) - A monitor of system resources
- [impala](https://archlinux.org/packages/extra/x86_64/impala/) - TUI for managing wifi
- [iwd](https://archlinux.org/packages/extra/x86_64/iwd/) - Internet Wireless Daemon
- [nano](https://archlinux.org/packages/core/x86_64/nano/) - Simple text editor
- [ncdu](https://archlinux.org/packages/extra/x86_64/ncdu/) - Disk usage analyzer with an ncurses interface
- [paru](https://github.com/Morganamilo/paru) - AUR helper
- [pkgfile](https://archlinux.org/packages/extra/x86_64/pkgfile/) - A tool to search for files in official repository packages
- [starship](https://archlinux.org/packages/extra/x86_64/starship/) - The cross-shell prompt for astronauts
- [zsh](https://archlinux.org/packages/extra/x86_64/zsh/) - A very advanced and programmable command interpreter (shell) for UNIX
- [zsh-autosuggestions](https://archlinux.org/packages/extra/any/zsh-autosuggestions/) - Fish-like autosuggestions for zsh
- [zsh-syntax-highlighting](https://archlinux.org/packages/extra/any/zsh-syntax-highlighting/) - Fish shell like syntax highlighting for Zsh

## System
- [amd-ucode](https://archlinux.org/packages/core/any/amd-ucode/) - Microcode update image for AMD CPUs
- [base](https://archlinux.org/packages/core/any/base/) - Minimal package set to define a basic Arch Linux installation
- [base-devel](https://archlinux.org/packages/core/any/base-devel/) - Basic tools to build Arch Linux packages
- [bluez](https://archlinux.org/packages/extra/x86_64/bluez/) - Daemon for the bluetooth protocol stack
- [brightnessctl](https://archlinux.org/packages/extra/x86_64/brightnessctl/) - Lightweight brightness control tool
- [btrfs-progs](https://archlinux.org/packages/core/x86_64/btrfs-progs/) - Btrfs filesystem utilities
- [efibootmgr](https://archlinux.org/packages/core/x86_64/efibootmgr/) - Linux user-space application to modify the EFI Boot Manager
- [libinput](https://archlinux.org/packages/extra/x86_64/libinput/) - Input device management and event handling library
- [libnotify](https://archlinux.org/packages/extra/x86_64/libnotify/) - Library for sending desktop notifications
- [libva-utils ](https://archlinux.org/packages/extra/x86_64/libva-utils/)- Intel VA-API Media Applications and Scripts for libva
- [linux](https://archlinux.org/packages/core/x86_64/linux/) - The Linux kernel and modules
- [linux-firmware](https://archlinux.org/packages/core/any/linux-firmware/) - Firmware files for Linux
- [linux-lts](https://archlinux.org/packages/core/x86_64/linux-lts/) - The Linux kernel and modules
- [linux-lts-headers](https://archlinux.org/packages/core/x86_64/linux-lts-headers/) - Headers for Linux kernel LTS
- [playerctl](https://archlinux.org/packages/extra/x86_64/playerctl/) - mpris media player controller
- [snapper](https://archlinux.org/packages/extra/x86_64/snapper/) - A tool for managing BTRFS and LVM snapshots
- [usbutils](https://archlinux.org/packages/core/x86_64/usbutils/) - A collection of USB tools to query connected USB devices
- [vulkan-radeon](https://archlinux.org/packages/extra/x86_64/vulkan-radeon/) - Open-source Vulkan driver for AMD GPUs
- [zram-generator](https://archlinux.org/packages/extra/x86_64/zram-generator/) - Systemd unit generator for zram devices

### Hyprland
- [hypridle-git](https://aur.archlinux.org/packages/hypridle-git/) - Hyprland idle daemon
- [hyprland-git](https://aur.archlinux.org/packages/hyprland-git/) - A highly customizable dynamic tiling Wayland compositor
- [hyprpaper-git](https://aur.archlinux.org/packages/hyprpaper-git/) - A blazing fast wayland wallpaper utility with IPC controls
- [polkit](https://archlinux.org/packages/extra/x86_64/polkit/) - Application development toolkit for controlling system-wide privileges
- [xdg-desktop-portal-gtk](https://archlinux.org/packages/extra/x86_64/xdg-desktop-portal-gtk/) - GTK-based XDG Desktop Portal implementation
- [xdg-desktop-portal-hyprland-git](https://aur.archlinux.org/packages/xdg-desktop-portal-hyprland-git) - Hyprland XDG Desktop Portal implementation
- [xorg-xwayland](https://archlinux.org/packages/extra/x86_64/xorg-xwayland/) - X server for running X11 applications on Wayland

### Wayland
- [grim](https://archlinux.org/packages/extra/x86_64/grim/) - Screenshot utility for Wayland
- [libnewt](https://archlinux.org/packages/extra/x86_64/libnewt/) - Not Erik's Windowing Toolkit - text mode windowing with slang
- [slurp](https://archlinux.org/packages/extra/x86_64/slurp/) - Select a region in a Wayland compositor
- [uwsm](https://archlinux.org/packages/extra/any/uwsm/) - Universal Wayland session manager
- [wev](https://archlinux.org/packages/extra/x86_64/wev/) - A tool for debugging wayland events on a Wayland window
- [wl-clipboard](https://archlinux.org/packages/extra/x86_64/wl-clipboard/) - Command-line copy/paste utilities for Wayland

### Audio
- [easyeffects](https://archlinux.org/packages/extra/x86_64/easyeffects/) - Audio Effects for Pipewire applications
  - [calf](https://archlinux.org/packages/extra/x86_64/calf/) - Collection of audio plugins
  - [lsp-plugins-lv2](https://archlinux.org/packages/extra/x86_64/lsp-plugins-lv2/) - Collection of audio plugins
  - [zam-plugins-lv2](https://archlinux.org/packages/extra/x86_64/zam-plugins-lv2/) - Collection of audio plugins
- [libpulse](https://archlinux.org/packages/extra/x86_64/libpulse/) - A featureful, general-purpose sound server (client library)
- [pipewire](https://archlinux.org/packages/extra/x86_64/pipewire/) - Low-latency audio/video router and processor
  - [gst-plugin-pipewire](https://archlinux.org/packages/extra/x86_64/gst-plugin-pipewire/) - PipeWire GStreamer plugin
  - [pipewire-alsa](https://archlinux.org/packages/extra/x86_64/pipewire-alsa/) - PipeWire ALSA plugin
  - [pipewire-jack](https://archlinux.org/packages/extra/x86_64/pipewire-jack/) - PipeWire Jack plugin
  - [pipewire-pulse](https://archlinux.org/packages/extra/x86_64/pipewire-pulse/) - PipeWire PulseAudio plugin
- [sof-firmware](https://archlinux.org/packages/extra/x86_64/sof-firmware/) - Sound Open Firmware
- [wiremix](https://aur.archlinux.org/packages/wiremix) - Audio mixer for PipeWire
- [wireplumber](https://archlinux.org/packages/extra/x86_64/wireplumber/) - PipeWire session manager

### Fonts
- [noto-fonts-emoji](https://archlinux.org/packages/extra/any/noto-fonts-emoji/) - Emoji font
- [otf-geist](https://aur.archlinux.org/packages/otf-geist) - Sans-serif font family
- [otf-geist-mono](https://aur.archlinux.org/packages/otf-geist-mono) - Monospaced font family
- [otf-geist-mono-nerd](https://archlinux.org/packages/extra/any/otf-geist-mono-nerd/) - Monospaced font family (Nerd Font)

### Firewall
- [dnscrypt-proxy](https://archlinux.org/packages/extra/x86_64/dnscrypt-proxy/) - A flexible DNS proxy, with support for encrypted DNS protocols
- [iptables-nft](https://archlinux.org/packages/core/x86_64/iptables-nft/) - Linux kernel packet control tool (using nft interface)
- [nftables](https://archlinux.org/packages/extra/x86_64/nftables/) - Netfilter firewall, userspace command line utility
- [zapret-git](https://aur.archlinux.org/packages/zapret-git) - Bypass deep packet inspection
