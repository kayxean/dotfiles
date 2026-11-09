hl.monitor({
  output = "eDP-1",
  mode = "1920x1080@60.01",
  position = "0x0",
  scale = 1,
  bitdepth = 8,
})

hl.on("hyprland.start", function()
  hl.exec_cmd("uwsm-app -s b -- easyeffects --service-mode --hide-window")
  hl.exec_cmd("uwsm finalize")
end)

for i = 1, 10 do
  local key = i % 10
  hl.bind("SUPER + " .. key, hl.dsp.focus({ workspace = i }))
  hl.bind("SUPER + SHIFT + " .. key, hl.dsp.window.move({ workspace = i }))
end

hl.bind("SUPER + Return", hl.dsp.exec_cmd("uwsm-app -- ghostty +new-window"))

hl.bind("SUPER + A", hl.dsp.exec_cmd("uwsm-app -- ghostty +new-window --title='floating_terminal' -e alsamixer"))
hl.bind("SUPER + I", hl.dsp.exec_cmd("uwsm-app -- helium-browser --incognito"))

hl.bind("SUPER + F", hl.dsp.exec_cmd("uwsm-app -- nautilus --new-window"))
hl.bind("SUPER + U", hl.dsp.exec_cmd("uwsm-app -- easyeffects"))
hl.bind("SUPER + C", hl.dsp.exec_cmd("uwsm-app -- celluloid"))
hl.bind("SUPER + K", hl.dsp.exec_cmd("uwsm-app -- obs"))

hl.bind("SUPER + M", hl.dsp.exec_cmd("uwsm-app -- mixxx"))
hl.bind("SUPER + E", hl.dsp.exec_cmd("uwsm-app -- zeditor"))

hl.bind("SUPER + B", hl.dsp.exec_cmd("uwsm-app -- helium-browser"))
hl.bind("SUPER + R", hl.dsp.exec_cmd("uwsm-app -- ghostty +new-window --title='floating_terminal'"))
hl.bind("SUPER + O", hl.dsp.exec_cmd("uwsm-app -- ghostty +new-window --title='floating_terminal' -e btop"))

hl.bind("SUPER + Print", hl.dsp.exec_raw("screenshot --full"))
hl.bind("SUPER + Insert", hl.dsp.exec_raw("screenshot --area"))
hl.bind("SUPER + F5", hl.dsp.exec_raw("wallpaper"))
hl.bind("SUPER + F6", hl.dsp.exec_raw("audio"))

hl.bind("SUPER + mouse:272", hl.dsp.window.drag(), { mouse = true })
hl.bind("SUPER + mouse:273", hl.dsp.window.float(), { click = true })

hl.bind("SUPER + X", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://x.com'"))
hl.bind("SUPER + D", hl.dsp.exec_cmd("uwsm-app -- discord"))
hl.bind("SUPER + G", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://github.com'"))

hl.bind("SUPER + Q", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://figma.com'"))
hl.bind("SUPER + S", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://open.spotify.com'"))

hl.bind("SUPER + Y", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://youtube.com?hl=en&gl=US'"))
hl.bind("SUPER + ALT + Y", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://youtube.com?hl=en&gl=US' --incognito"))
hl.bind("SUPER + ALT + M", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://music.youtube.com?hl=en&gl=US'"))

hl.bind("SUPER + ALT + I", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://instagram.com'"))
hl.bind("SUPER + ALT + T", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://threads.com'"))
hl.bind("SUPER + ALT + W", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://web.whatsapp.com'"))

hl.bind("SUPER + ALT + R", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://reddit.com'"))
hl.bind("SUPER + ALT + V", hl.dsp.exec_cmd("uwsm-app -- helium-browser --app='https://twitch.tv'"))

hl.bind("SUPER + V", hl.dsp.submap("resize"))
hl.define_submap("resize", function()
  hl.bind("F", hl.dsp.window.resize({ x = 1820, y = 1024 }))
  hl.bind("G", hl.dsp.window.resize({ x = 1366, y = 1024 }))
  hl.bind("H", hl.dsp.window.resize({ x = 768, y = 1024 }))
  hl.bind("J", hl.dsp.window.resize({ x = 512, y = 1024 }))
  hl.bind("Escape", hl.dsp.submap("reset"))
end)

hl.bind("SUPER + N", hl.dsp.window.cycle_next({ next = true, tiled = true }))
hl.bind("SUPER + P", hl.dsp.window.cycle_next({ next = false, tiled = true }))

hl.bind("SUPER + W", hl.dsp.window.close())
hl.bind("SUPER + Tab", hl.dsp.focus({ workspace = "previous" }))

hl.config({
  input = {
    kb_layout = "us",
    kb_options = "caps:escape_shifted_capslock",
    repeat_rate = 50,
    repeat_delay = 200,
    sensitivity = 0.25,
    follow_mouse = 1,
    touchpad = { scroll_factor = 0.768 },
  },
})

---@type { locked: boolean }
local ONCE = { locked = true }

---@type { locked: boolean, repeating: boolean }
local FAST = { locked = true, repeating = true }

hl.bind("XF86MonBrightnessUp", hl.dsp.exec_raw("brightnessctl -e4 -n2 set 5%+"), FAST)
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_raw("brightnessctl -e4 -n2 set 5%-"), FAST)
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_raw("wpctl set-volume -l 1 @DEFAULT_AUDIO_SINK@ 5%+"), FAST)
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_raw("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), FAST)
hl.bind("XF86AudioMicMute", hl.dsp.exec_raw("wpctl set-mute @DEFAULT_AUDIO_SOURCE@ toggle"), FAST)
hl.bind(
  "XF86AudioMute",
  hl.dsp.exec_raw([[
sh -c 'wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle
if wpctl get-volume @DEFAULT_AUDIO_SINK@ | grep -q MUTED; then
  hda-verb /dev/snd/hwC1D0 0x20 0x500 0x07
  hda-verb /dev/snd/hwC1D0 0x20 0x400 0x1
else
  hda-verb /dev/snd/hwC1D0 0x20 0x500 0x07
  hda-verb /dev/snd/hwC1D0 0x20 0x400 0x200
fi'
]]),
  FAST
)
hl.bind("XF86AudioPlay", hl.dsp.exec_raw("playerctl play-pause"), ONCE)
hl.bind("XF86AudioNext", hl.dsp.exec_raw("playerctl next"), ONCE)
hl.bind("XF86AudioPrev", hl.dsp.exec_raw("playerctl previous"), ONCE)

hl.config({
  general = {
    border_size = 1,
    gaps_in = 3,
    gaps_out = 6,
    float_gaps = -1,
    layout = "scrolling",
    col = {
      active_border = "rgba(3090f0ff)",
      inactive_border = "rgba(8e8e9366)",
    },
    resize_on_border = true,
    extend_border_grab_area = 6,
  },
})

hl.workspace_rule({ workspace = "w[tv1]s[false]", gaps_out = 0, gaps_in = 0 })
hl.workspace_rule({ workspace = "f[1]s[false]", gaps_out = 0, gaps_in = 0 })

hl.window_rule({ match = { float = false, workspace = "w[tv1]s[false]" }, border_size = 0 })
hl.window_rule({ match = { float = false, workspace = "w[tv1]s[false]" }, rounding = 0 })
hl.window_rule({ match = { float = false, workspace = "f[1]s[false]" }, border_size = 0 })
hl.window_rule({ match = { float = false, workspace = "f[1]s[false]" }, rounding = 0 })

hl.config({
  decoration = {
    rounding = 12,
    rounding_power = 4,
    blur = { enabled = false },
    shadow = { enabled = false },
  },
})

hl.window_rule({
  name = "suppress-maximize-events",
  match = { class = ".*" },
  suppress_event = "maximize",
})

hl.window_rule({
  name = "fix-xwayland-drags",
  match = {
    class = "^$",
    title = "^$",
    xwayland = true,
    float = true,
    fullscreen = false,
    pin = false,
  },
  no_focus = true,
})

hl.window_rule({
  name = "fix-xdg-desktop-portal",
  match = { initial_class = "xdg-desktop-portal-gtk" },
  size = { "1366", "1024" },
  float = true,
  center = true,
})

hl.window_rule({
  name = "fix-zed-settings",
  match = { class = "dev.zed.Zed", initial_title = "Zed — Settings" },
  size = { "768", "1024" },
  float = true,
  center = true,
})

hl.window_rule({
  name = "fix-terminal-floating",
  match = { class = "com.mitchellh.ghostty", initial_title = "floating_terminal" },
  size = { "1366", "1024" },
  float = true,
  center = true,
})

hl.window_rule({
  name = "fix-devtools",
  match = { class = "helium", initial_title = "DevToolsApp" },
  size = { "768", "1024" },
  float = true,
  center = true,
})

hl.window_rule({
  name = "fix-mixxx-settings",
  match = { class = "org.mixxx.Mixxx", initial_title = "Preferences" },
  size = { "1366", "1024" },
  float = true,
  center = true,
})

hl.window_rule({
  name = "fix-share-picker",
  match = { class = "hyprland-share-picker" },
  size = { "1366", "1024" },
  float = true,
  center = true,
})

hl.config({
  animations = { enabled = true },
})

hl.curve("onOpen", { type = "spring", mass = 1, stiffness = 256, dampening = 32 })
hl.curve("onClose", { type = "spring", mass = 1, stiffness = 768, dampening = 55 })
hl.curve("onMove", { type = "spring", mass = 1, stiffness = 512, dampening = 54 })
hl.curve("onBlur", { type = "spring", mass = 1, stiffness = 1024, dampening = 64 })

hl.animation({ leaf = "workspaces", enabled = false })
hl.animation({ leaf = "specialWorkspace", enabled = false })
hl.animation({ leaf = "layers", enabled = false })
hl.animation({ leaf = "windowsIn", enabled = true, speed = 1, spring = "onOpen", style = "popin 86%" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 1, spring = "onClose", style = "popin 64%" })
hl.animation({ leaf = "windowsMove", enabled = true, speed = 1, spring = "onMove" })
hl.animation({ leaf = "border", enabled = false })
hl.animation({ leaf = "fade", enabled = true, speed = 1, spring = "onBlur" })
hl.animation({ leaf = "fadeSwitch", enabled = false })

hl.config({
  xwayland = {
    enabled = false,
  },
  misc = {
    disable_hyprland_logo = true,
    disable_splash_rendering = true,
    font_family = "Geist",
    force_default_wallpaper = 1,
    mouse_move_enables_dpms = true,
    key_press_enables_dpms = true,
    animate_manual_resizes = true,
    animate_mouse_windowdragging = true,
    focus_on_activate = true,
    middle_click_paste = false,
    disable_watchdog_warning = true,
  },
  ecosystem = {
    no_update_news = true,
    no_donation_nag = true,
  },
})
