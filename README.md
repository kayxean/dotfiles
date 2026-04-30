# Dotfiles

A collection of packages for Arch Linux that I use for my [Hyprland](https://hyprland.org/) configuration.

This configuration uses `stow` to manage dotfiles. Clone this repository into `~/personal/dotfiles`, then use the `stow` commands below to create symlinks to your home directory.

```sh
# Create symlinks
stow -t ~ -d ~/personal/dotfiles .

# Remove symlinks
stow -D -t ~ -d ~/personal/dotfiles .
```

## Preferences

The apps and tools I actually use and interact with. This includes my browsers, code editors, and terminal utilities that make up my personal workflow and are customized by these dotfiles.

### Applications

- [alacritty](https://github.com/alacritty/alacritty): A cross-platform, GPU-accelerated terminal emulator
- [antigravity](https://antigravity.google/): An agentic development platform from Google, evolving the IDE into the agent-first era.
- [google-chrome](https://www.google.com/chrome): The popular web browser by Google (Stable Channel)
- [google-chrome-beta](https://www.google.com/chrome): The popular web browser by Google (Beta Channel)
- [google-chrome-canary](https://www.google.com/chrome): The popular web browser by Google (Canary Channel)
- [google-chrome-dev](https://www.google.com/chrome): The popular web browser by Google (Dev Channel)
- [nautilus](https://apps.gnome.org/Nautilus/): Default file manager for GNOME
- [zed](https://zed.dev): A high-performance, multiplayer code editor from the creators of Atom and Tree-sitter

### CLI Utilities

- [bat](https://github.com/sharkdp/bat): Cat clone with syntax highlighting and git integration
- [eza](https://github.com/eza-community/eza): A modern replacement for ls (community fork of exa)
- [fd](https://github.com/sharkdp/fd): Simple, fast and user-friendly alternative to find
- [git](https://git-scm.com/): the fast distributed version control system
- [github-cli](https://github.com/cli/cli): The GitHub CLI
- [jq](https://jqlang.github.io/jq/): Command-line JSON processor
- [less](https://www.greenwoodsoftware.com/less/): A terminal based program for viewing text files
- [ripgrep](https://github.com/BurntSushi/ripgrep): A search tool that combines the usability of ag with the raw speed of grep
- [sd](https://github.com/chmln/sd): Intuitive find & replace
- [zoxide](https://github.com/ajeetdsouza/zoxide): A smarter cd command for your terminal

### Tools

- [auto-cpufreq](https://github.com/AdnanHodzic/auto-cpufreq): Automatic CPU speed & power optimizer
- [bun](https://github.com/oven-sh/bun): Incredibly fast JavaScript runtime, bundler, test runner, and package manager – all in one
- [btop](https://github.com/aristocratos/btop): A monitor of system resources, bpytop ported to C++
- [fwupd](https://github.com/fwupd/fwupd): Simple daemon to allow session software to update firmware
- [impala](https://github.com/pythops/impala): TUI for managing wifi
- [nano](https://www.nano-editor.org): Pico editor clone with enhancements
- [ncdu](https://dev.yorhel.nl/ncdu): Disk usage analyzer with an ncurses interface
- [opencode-bin](https://github.com/anomalyco/opencode): The AI coding agent built for the terminal.
- [paru](https://github.com/morganamilo/paru): Feature packed AUR helper
- [scx-scheds](https://github.com/sched-ext/scx): sched_ext schedulers and tools
- [starship](https://starship.rs/): The cross-shell prompt for astronauts
- [stow](https://www.gnu.org/software/stow/): Manage installation of multiple softwares in the same directory tree
- [television](https://github.com/alexpasmantier/television): A general purpose fuzzy finder for your terminal
- [vite-plus](https://github.com/voidzero-dev/vite-plus): The Unified Toolchain for the Web
- [wiremix](https://github.com/tsowell/wiremix): A simple TUI audio mixer for PipeWire

## System Packages

The underlying stack required for hardware and display management. This includes the kernel, drivers, and background daemons that handle audio, networking, and the Wayland protocols needed to run Hyprland.

### Desktop & Wayland Core

- [grim](https://gitlab.freedesktop.org/emersion/grim): Screenshot utility for Wayland
- [hyprland](https://github.com/hyprwm/Hyprland): a highly customizable dynamic tiling Wayland compositor
- [hypridle](https://github.com/hyprwm/hypridle): hyprland’s idle daemon
- [hyprpaper](https://github.com/hyprwm/hyprpaper): a blazing fast wayland wallpaper utility with IPC controls
- [qt5-wayland](https://www.qt.io): Provides APIs for Wayland
- [oblique-cursor](https://github.com/kayxean/oblique-cursor) - A simple hyprcursor theme with a slightly oblique look
- [slurp](https://github.com/emersion/slurp): Select a region in a Wayland compositor
- [uwsm](https://github.com/Vladimir-csp/uwsm): A standalone Wayland session manager
- [wev](https://git.sr.ht/~sircmpwn/wev): A tool for debugging wayland events on a Wayland window, analagous to the X11 tool xev
- [wl-clipboard](https://github.com/bugaevc/wl-clipboard): Command-line copy/paste utilities for Wayland
- [xdg-desktop-portal-gtk](https://github.com/flatpak/xdg-desktop-portal-gtk): A backend implementation for xdg-desktop-portal using GTK
- [xdg-desktop-portal-hyprland](https://github.com/hyprwm/xdg-desktop-portal-hyprland): xdg-desktop-portal backend for hyprland
- [xorg-xwayland](https://xorg.freedesktop.org): run X clients under wayland

### Kernel & Hardware Base

- [amd-ucode](https://gitlab.com/kernel-firmware/linux-firmware): Microcode update image for AMD CPUs
- [base](https://www.archlinux.org): Minimal package set to define a basic Arch Linux installation
- [base-devel](https://www.archlinux.org): Basic tools to build Arch Linux packages
- [efibootmgr](https://github.com/rhboot/efibootmgr): Linux user-space application to modify the EFI Boot Manager
- [libva-utils](https://github.com/intel/libva-utils): Intel VA-API Media Applications and Scripts for libva
- [linux](https://github.com/archlinux/linux): The Linux kernel and modules
- [linux-firmware](https://gitlab.com/kernel-firmware/linux-firmware): Firmware files for Linux - Default set
- [linux-lts](https://www.kernel.org): The LTS Linux kernel and modules
- [linux-lts-headers](https://www.kernel.org): Headers and scripts for building modules for the LTS Linux kernel
- [vulkan-radeon](https://www.mesa3d.org/): Open-source Vulkan driver for AMD GPUs

### Audio & DSP Stack

- [alsa-utils](https://www.alsa-project.org): Advanced Linux Sound Architecture - Utilities
- [calf](http://calf-studio-gear.org): LV2 plug-in suite
- [easyeffects](https://github.com/wwmm/easyeffects): Audio Effects for Pipewire applications
- [gst-plugin-pipewire](https://pipewire.org): Multimedia graph framework - pipewire plugin
- [libdeep_filter_ladspa-git](https://github.com/Rikorose/DeepFilterNet): A Low Complexity Speech Enhancement Framework for Full-Band Audio (48kHz) using Deep Filtering (Git version) - ladspa plugin
- [libpulse](https://www.freedesktop.org/wiki/Software/PulseAudio/): A featureful, general-purpose sound server (client library)
- [lsp-plugins-lv2](https://lsp-plug.in): Collection of open-source plugins - LV2
- [pipewire](https://pipewire.org): Low-latency audio/video router and processor
- [pipewire-alsa](https://pipewire.org): Low-latency audio/video router and processor - ALSA configuration
- [pipewire-jack](https://pipewire.org): Low-latency audio/video router and processor - JACK replacement
- [pipewire-pulse](https://pipewire.org): Low-latency audio/video router and processor - PulseAudio replacement
- [sof-firmware](https://www.sofproject.org/): Sound Open Firmware
- [wireplumber](https://pipewire.pages.freedesktop.org/wireplumber/): Session / policy manager implementation for PipeWire
- [zam-plugins-lv2](https://github.com/zamaudio/zam-plugins): Collection of audio plugins for high-quality processing - LV2 plugins

### Networking & Security

- [bluez](http://www.bluez.org/): Daemons for the bluetooth protocol stack
- [dnscrypt-proxy](https://github.com/DNSCrypt/dnscrypt-proxy): A flexible DNS proxy, with support for encrypted DNS protocols
- [gnome-keyring](https://gitlab.gnome.org/GNOME/gnome-keyring): Stores passwords and encryption keys
- [hyprpolkitagent](https://github.com/hyprwm/hyprpolkitagent): Simple polkit authentication agent for Hyprland, written in QT/QML
- [iptables](https://www.netfilter.org/projects/iptables/index.html): Linux kernel packet control tool (using nft interface)
- [iw](https://wireless.wiki.kernel.org/en/users/documentation/iw): nl80211 based CLI configuration utility for wireless devices
- [iwd](https://git.kernel.org/cgit/network/wireless/iwd.git/): Internet Wireless Daemon
- [nftables](https://netfilter.org/projects/nftables/): Netfilter tables userspace tools
- [polkit](https://github.com/polkit-org/polkit): Application development toolkit for controlling system-wide privileges
- [zapret-git](https://github.com/bol-van/zapret): Bypass deep packet inspection

### System Libraries & Logic

- [brightnessctl](https://github.com/Hummer12007/brightnessctl): Lightweight brightness control tool
- [btrfs-progs](https://btrfs.readthedocs.io): Btrfs filesystem utilities
- [libinput](https://wayland.freedesktop.org/libinput/doc/latest/): Input device management and event handling library
- [libnewt](https://pagure.io/newt): Not Erik's Windowing Toolkit - text mode windowing with slang
- [libnotify](https://gitlab.gnome.org/GNOME/libnotify): Library for sending desktop notifications
- [pacman-contrib](https://gitlab.archlinux.org/pacman/pacman-contrib): Contributed scripts and tools for pacman systems
- [playerctl](https://github.com/altdesktop/playerctl): mpris media player controller and lib for spotify, vlc, audacious, bmp, xmms2, and others.
- [zram-generator](https://github.com/systemd/zram-generator): Systemd unit generator for zram devices
- [zsh](https://www.zsh.org/): A very advanced and programmable command interpreter (shell) for UNIX
- [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions): Fish-like autosuggestions for zsh
- [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting): Fish shell like syntax highlighting for Zsh

### Fonts

- [noto-fonts-emoji](https://www.google.com/get/noto/): Google Noto Color Emoji font
- [otf-geist](https://vercel.com/font): A new font family for Vercel, created by Vercel in collaboration with Basement Studio
- [otf-geist-mono](https://vercel.com/font): A new font family for Vercel, created by Vercel in collaboration with Basement Studio
- [otf-geist-mono-nerd](https://github.com/ryanoasis/nerd-fonts): Patched font Geist Mono from nerd fonts library

## Technical Note

This setup is built around an AMD/Wayland stack. The package choices reflect a preference for modern, high-performance tools and are intended to run on Arch Linux using the LTS kernel for stability.

These configurations are tailored for my specific hardware and workflow. Use them as a reference for building your own Hyprland environment.
