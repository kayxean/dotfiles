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

### Desktop

- [hyprland-git](https://aur.archlinux.org/packages/hyprland-git/) - Dynamic tiling Wayland compositor
- [hypridle-git](https://aur.archlinux.org/packages/hypridle-git/) - Idle daemon
- [hyprpaper-git](https://aur.archlinux.org/packages/hyprpaper-git/) - Wallpaper utility with IPC controls
- [hyprpolkitagent-git](https://aur.archlinux.org/packages/hyprpolkitagent-git/) - Polkit authentication agent
- [uwsm](https://archlinux.org/packages/extra/any/uwsm/) - Wayland session manager
- [xdg-desktop-portal-hyprland-git](https://aur.archlinux.org/packages/xdg-desktop-portal-hyprland-git) - Desktop portal implementation
- [xdg-desktop-portal-gtk](https://archlinux.org/packages/extra/x86_64/xdg-desktop-portal-gtk/) - GTK desktop portal
- [xorg-xwayland](https://archlinux.org/packages/extra/x86_64/xorg-xwayland/) - X server for Wayland
- [polkit](https://archlinux.org/packages/extra/x86_64/polkit/) - Privilege escalation tool

### Shell

- [zsh](https://archlinux.org/packages/extra/x86_64/zsh/) - Shell
- [zsh-autosuggestions](https://archlinux.org/packages/extra/any/zsh-autosuggestions/) - Fish-like autosuggestions
- [zsh-syntax-highlighting](https://archlinux.org/packages/extra/any/zsh-syntax-highlighting/) - Syntax highlighting
- [starship](https://archlinux.org/packages/extra/x86_64/starship/) - Cross-shell prompt
- [alacritty](https://archlinux.org/packages/extra/x86_64/alacritty/) - GPU-accelerated terminal
- [alsa-utils](https://archlinux.org/packages/core/x86_64/alsa-utils/) - Audio utilities

### Applications

- [chromium](https://archlinux.org/packages/extra/x86_64/chromium/) - Web browser
- [chromium-widevine](https://aur.archlinux.org/packages/chromium-widevine) - DRM support
- [google-chrome](https://aur.archlinux.org/packages/google-chrome) - Proprietary browser
- [zed](https://archlinux.org/packages/extra/x86_64/zed/) - Code editor
- [nautilus](https://archlinux.org/packages/extra/x86_64/nautilus/) - File manager

### CLI Utilities

- [bat](https://archlinux.org/packages/extra/x86_64/bat/) - cat with syntax highlighting
- [btop](https://archlinux.org/packages/extra/x86_64/btop/) - System monitor
- [eza](https://archlinux.org/packages/extra/x86_64/eza/) - Modern ls replacement
- [fd](https://archlinux.org/packages/extra/x86_64/fd/) - Fast find alternative
- [git](https://archlinux.org/packages/extra/x86_64/git/) - Version control
- [github-cli](https://archlinux.org/packages/extra/x86_64/github-cli/) - GitHub CLI
- [jq](https://archlinux.org/packages/extra/x86_64/jq/) - JSON processor
- [less](https://archlinux.org/packages/core/x86_64/less/) - Text file viewer
- [ncdu](https://archlinux.org/packages/extra/x86_64/ncdu/) - Disk usage analyzer
- [paru](https://github.com/Morganamilo/paru) - AUR helper
- [ripgrep](https://archlinux.org/packages/extra/x86_64/ripgrep/) - Smarter grep alternative
- [stow](https://archlinux.org/packages/extra/any/stow/) - Symlink manager
- [television](https://archlinux.org/packages/extra/x86_64/television/) - Fuzzy finder
- [zoxide](https://archlinux.org/packages/extra/x86_64/zoxide/) - Smarter cd
- [just](https://archlinux.org/packages/extra/any/just/) - Command runner
- [pueue](https://archlinux.org/packages/extra/x86_64/pueue/) - Task manager

### Networking

- [iwd](https://archlinux.org/packages/extra/x86_64/iwd/) - Internet Wireless Daemon
- [impala](https://archlinux.org/packages/extra/x86_64/impala/) - TUI for wifi
- [iw](https://archlinux.org/packages/core/x86_64/iw/) - Wireless device configuration
- [dnscrypt-proxy](https://archlinux.org/packages/extra/x86_64/dnscrypt-proxy/) - Encrypted DNS proxy

### Wayland Tools

- [grim](https://archlinux.org/packages/extra/x86_64/grim/) - Screenshot utility
- [slurp](https://archlinux.org/packages/extra/x86_64/slurp/) - Region selector
- [wl-clipboard](https://archlinux.org/packages/extra/x86_64/wl-clipboard/) - Copy/paste utilities
- [wev](https://archlinux.org/packages/extra/x86_64/wev/) - Wayland event debugger
- [qt5-wayland](https://archlinux.org/packages/extra/x86_64/qt5-wayland/) - Qt5 Wayland plugin
- [libnewt](https://archlinux.org/packages/extra/x86_64/libnewt/) - Text mode windowing toolkit

### Audio

- [pipewire](https://archlinux.org/packages/extra/x86_64/pipewire/) - Audio/video router
- [wireplumber](https://archlinux.org/packages/extra/x86_64/wireplumber/) - PipeWire session manager
- [pipewire-alsa](https://archlinux.org/packages/extra/x86_64/pipewire-alsa/) - ALSA plugin
- [pipewire-jack](https://archlinux.org/packages/extra/x86_64/pipewire-jack/) - JACK plugin
- [pipewire-pulse](https://archlinux.org/packages/extra/x86_64/pipewire-pulse/) - PulseAudio plugin
- [gst-plugin-pipewire](https://archlinux.org/packages/extra/x86_64/gst-plugin-pipewire/) - GStreamer plugin
- [libpulse](https://archlinux.org/packages/extra/x86_64/libpulse/) - PulseAudio client library
- [easyeffects](https://archlinux.org/packages/extra/x86_64/easyeffects/) - Audio effects
  - [calf](https://archlinux.org/packages/extra/x86_64/calf/) - Audio plugins
  - [lsp-plugins-lv2](https://archlinux.org/packages/extra/x86_64/lsp-plugins-lv2/) - Audio plugins
  - [zam-plugins-lv2](https://archlinux.org/packages/extra/x86_64/zam-plugins-lv2/) - Audio plugins
  - [libdeep_filter_ladspa-git](https://aur.archlinux.org/packages/libdeep_filter_ladspa-git/) - Deep filter
- [sof-firmware](https://archlinux.org/packages/extra/x86_64/sof-firmware/) - Sound Open Firmware
- [wiremix](https://aur.archlinux.org/packages/wiremix) - PipeWire mixer

### Fonts

- [otf-geist](https://aur.archlinux.org/packages/otf-geist) - Sans-serif font
- [otf-geist-mono](https://aur.archlinux.org/packages/otf-geist-mono) - Monospaced font
- [otf-geist-mono-nerd](https://archlinux.org/packages/extra/any/otf-geist-mono-nerd/) - Nerd Font variant
- [noto-fonts-emoji](https://archlinux.org/packages/extra/any/noto-fonts-emoji/) - Emoji font

### System

- [linux](https://archlinux.org/packages/core/x86_64/linux/) - Linux kernel
- [linux-firmware](https://archlinux.org/packages/core/any/linux-firmware/) - Firmware files
- [linux-lts](https://archlinux.org/packages/core/x86_64/linux-lts/) - LTS kernel
- [linux-lts-headers](https://archlinux.org/packages/core/x86_64/linux-lts-headers/) - LTS headers
- [amd-ucode](https://archlinux.org/packages/core/any/amd-ucode/) - CPU microcode
- [base](https://archlinux.org/packages/core/any/base/) - Minimal package set
- [base-devel](https://archlinux.org/packages/core/any/base-devel/) - Build tools
- [btrfs-progs](https://archlinux.org/packages/core/x86_64/btrfs-progs/) - Btrfs utilities
- [snapper](https://archlinux.org/packages/extra/x86_64/snapper/) - Snapshot manager
- [efibootmgr](https://archlinux.org/packages/core/x86_64/efibootmgr/) - Boot manager
- [bluez](https://archlinux.org/packages/extra/x86_64/bluez/) - Bluetooth daemon
- [brightnessctl](https://archlinux.org/packages/extra/x86_64/brightnessctl/) - Brightness control
- [libinput](https://archlinux.org/packages/extra/x86_64/libinput/) - Input device library
- [libnotify](https://archlinux.org/packages/extra/x86_64/libnotify/) - Notifications library
- [libva-utils](https://archlinux.org/packages/extra/x86_64/libva-utils/) - VA-API tools
- [playerctl](https://archlinux.org/packages/extra/x86_64/playerctl/) - Media player controller
- [vulkan-radeon](https://archlinux.org/packages/extra/x86_64/vulkan-radeon/) - Vulkan driver
- [zram-generator](https://archlinux.org/packages/extra/x86_64/zram-generator/) - zram systemd generator
- [auto-cpufreq](https://aur.archlinux.org/packages/auto-cpufreq) - CPU frequency manager

### Security

- [nftables](https://archlinux.org/packages/extra/x86_64/nftables/) - Firewall
- [iptables-nft](https://archlinux.org/packages/core/x86_64/iptables-nft/) - iptables using nft
- [zapret-git](https://aur.archlinux.org/packages/zapret-git) - DPI bypass
- [gnome-keyring](https://archlinux.org/packages/extra/x86_64/gnome-keyring/) - Keyring daemon

### Tools

- [nano](https://archlinux.org/packages/core/x86_64/nano/) - Text editor
- [opencode-bin](https://opencode.ai) - AI coding assistant
