hl.monitor({
	output = "eDP-1",
	mode = "maxwidth",
	position = "0x0",
	scale = "1",
})

hl.on("hyprland.start", function()
	hl.exec_cmd("uwsm-app -s b -- alacritty --daemon")
	hl.exec_cmd("uwsm-app -s b -- easyeffects --hide-window --service-mode")
	hl.exec_cmd("uwsm finalize")
end)

hl.config({
	general = {
		border_size = 0,
		gaps_in = 0,
		gaps_out = 0,
		snap = { enabled = true },
	},
	decoration = {
		blur = { enabled = false },
		shadow = { enabled = false },
	},
	animations = { enabled = false },
	input = {
		follow_mouse = 1,
		repeat_rate = 40,
		repeat_delay = 250,
		touchpad = { scroll_factor = 0.4 },
	},
	misc = {
		disable_hyprland_logo = true,
		force_default_wallpaper = 1,
		font_family = "Geist",
		vrr = 1,
		mouse_move_enables_dpms = true,
		key_press_enables_dpms = true,
	},
	binds = {
		scroll_event_delay = 200,
	},
	xwayland = {
		force_zero_scaling = true,
	},
	render = {
		new_render_scheduling = true,
		non_shader_cm = 3,
		use_fp16 = 1,
	},
	ecosystem = {
		no_update_news = true,
		no_donation_nag = true,
	},
})

hl.bind("SUPER + RETURN", hl.dsp.exec_cmd("uwsm-app -- alacritty msg create-window --class terminal"))
hl.bind("SUPER + S", hl.dsp.exec_cmd("uwsm-app -- chromium-personal"))
hl.bind("SUPER + I", hl.dsp.exec_cmd("uwsm-app -- chromium-private"))
hl.bind("SUPER + B", hl.dsp.exec_cmd("uwsm-app -- chromium-dev"))
hl.bind("SUPER + E", hl.dsp.exec_cmd("uwsm-app -- zeditor"))
hl.bind("SUPER + G", hl.dsp.exec_cmd("uwsm-app -- antigravity"))

hl.bind("SUPER + U", hl.dsp.exec_cmd("uwsm-app -- easyeffects"))
hl.bind("SUPER + F", hl.dsp.exec_cmd("uwsm-app -- nautilus --new-window"))

hl.bind("SUPER + V", function()
	local w = hl.get_active_window()
	local project = ""

	if w ~= nil then
		local cls = w.class
		if cls == "dev.zed.Zed" or cls == "zed" or cls == "zed-editor" then
			project = string.match(w.title, "^(.-) —") or ""
		end
	end

	if project ~= "" then
		hl.dispatch(
			hl.dsp.exec_cmd(
				"uwsm-app -- sh -c 'for d in \"$HOME/dev/"
					.. project
					.. '" "$HOME/.local/'
					.. project
					.. '"; do [ -d "$d" ] && { dir="$d"; break; }; done; '
					.. 'alacritty --class float-window --working-directory "${dir:-$HOME}" --command tv --no-remote\''
			)
		)
	else
		hl.dispatch(
			hl.dsp.exec_cmd(
				"uwsm-app -- alacritty msg create-window --class float-window --working-directory $HOME --command tv --no-remote"
			)
		)
	end
end)

hl.bind(
	"SUPER + A",
	hl.dsp.exec_cmd("uwsm-app -- alacritty msg create-window --class float-window --command alsamixer")
)
hl.bind("SUPER + O", hl.dsp.exec_cmd("uwsm-app -- alacritty msg create-window --class float-window --command btop"))

hl.bind(
	"INSERT",
	hl.dsp.exec_cmd(
		'uwsm-app -- sh -c \'grim -g "$(slurp)" -t png - | tee "$HOME/pictures/.shared/$(date +%y%j-%I%M%S).png" | wl-copy -t image/png\''
	)
)

hl.bind(
	"PRINT",
	hl.dsp.exec_cmd(
		"uwsm-app -- sh -c 'grim -t png - | tee \"$HOME/pictures/.shared/$(date +%y%j-%I%M%S).png\" | wl-copy -t image/png'"
	)
)

hl.bind("SUPER + W", hl.dsp.window.close())
hl.bind("SUPER + SHIFT + Q", hl.dsp.exec_cmd("uwsm stop"))

hl.bind("SUPER + TAB", hl.dsp.focus({ workspace = "previous" }))
hl.bind("SUPER + left", hl.dsp.focus({ direction = "left" }))
hl.bind("SUPER + right", hl.dsp.focus({ direction = "right" }))
hl.bind("SUPER + up", hl.dsp.focus({ direction = "up" }))
hl.bind("SUPER + down", hl.dsp.focus({ direction = "down" }))

hl.bind("SUPER + mouse:272", hl.dsp.window.drag(), { mouse = true })
hl.bind("SUPER + SHIFT + mouse:272", hl.dsp.window.resize(), { mouse = true })

hl.bind("SUPER + SHIFT + left", hl.dsp.layout("splitratio -0.05"))
hl.bind("SUPER + SHIFT + right", hl.dsp.layout("splitratio +0.05"))

for i = 1, 10 do
	local key = i % 10
	hl.bind("SUPER + " .. key, hl.dsp.focus({ workspace = i }))
	hl.bind("SUPER + SHIFT + " .. key, hl.dsp.window.move({ workspace = i }))
end

hl.bind(
	"XF86AudioRaiseVolume",
	hl.dsp.exec_cmd("wpctl set-volume -l 1 @DEFAULT_AUDIO_SINK@ 5%+"),
	{ locked = true, repeating = true }
)
hl.bind(
	"XF86AudioLowerVolume",
	hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"),
	{ locked = true, repeating = true }
)
hl.bind(
	"XF86AudioMute",
	hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"),
	{ locked = true, repeating = true }
)
hl.bind(
	"XF86AudioMicMute",
	hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SOURCE@ toggle"),
	{ locked = true, repeating = true }
)
hl.bind("XF86MonBrightnessUp", hl.dsp.exec_cmd("brightnessctl -e4 -n2 set 5%+"), { locked = true, repeating = true })
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd("brightnessctl -e4 -n2 set 5%-"), { locked = true, repeating = true })

hl.bind("XF86AudioNext", hl.dsp.exec_cmd("playerctl next"), { locked = true })
hl.bind("XF86AudioPause", hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })
hl.bind("XF86AudioPlay", hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })
hl.bind("XF86AudioPrev", hl.dsp.exec_cmd("playerctl previous"), { locked = true })

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
	name = "float-portal-dialogs",
	match = { initial_class = "^(xdg-desktop-portal-gtk|float-window)$" },
	float = true,
	size = { "1440", "768" },
	center = true,
	pin = true,
	rounding = 8,
})

hl.window_rule({ name = "alacritty", match = { class = "terminal" }, scrolling_width = 0.5 })

hl.workspace_rule({ workspace = "2", layout_opts = { direction = "right" } })
