vim.o.laststatus = 0
vim.o.cmdheight = 0

-- movement
vim.keymap.set({ "n", "x" }, "w", "k", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "a", "h", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "s", "j", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "d", "l", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "i", "-", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "j", "^", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "k", "+", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "l", "g_", { noremap = true, silent = true })

-- scroll
vim.keymap.set({ "n", "x" }, "<Home>", "gg", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "<End>", "G", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "<Up>", "<C-y>", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "<Down>", "<C-e>", { noremap = true, silent = true })

-- insert actions
vim.keymap.set({ "n", "x" }, "<CR>", "o", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "<S-CR>", "O", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "r", "i", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "e", "a", { noremap = true, silent = true })

-- normal ops
vim.keymap.set("n", "x", "d", { noremap = true, silent = true })
vim.keymap.set("n", "t", "F", { noremap = true, silent = true })
vim.keymap.set("n", "o", "<C-r>", { noremap = true, silent = true })
vim.keymap.set("n", ".", ";", { noremap = true, silent = true })

-- visual ops
vim.keymap.set("x", "x", "d", { noremap = true, silent = true })
vim.keymap.set("x", "o", "<C-r>", { noremap = true, silent = true })
vim.keymap.set("x", ".", "o", { noremap = true, silent = true })
vim.keymap.set("x", ",", "o", { noremap = true, silent = true })

-- operator
vim.keymap.set("o", "x", "V_", { noremap = true, silent = true })

-- percentage
vim.keymap.set("n", "n", function()
	if vim.v.count > 0 then
		vim.cmd("normal! " .. vim.v.count .. "%")
	else
		vim.cmd("normal! 0%")
	end
end, { noremap = true, silent = true })

vim.keymap.set("x", "n", function()
	local c = vim.v.count
	vim.api.nvim_feedkeys((c > 0 and tostring(c) or "0") .. "%", "n", false)
end, { noremap = true, silent = true })

-- matching
vim.cmd("packadd matchit")
vim.keymap.set({ "n", "x" }, "m", function()
	local line = vim.fn.getline(".")
	local col = vim.fn.col(".")
	local ch = line:sub(col, col)
	if ch == '"' or ch == "'" or ch == "`" then
		local before = 0
		for i = 1, col - 1 do
			if line:sub(i, i) == ch then
				before = before + 1
			end
		end
		local target
		if before % 2 == 0 then
			target = line:find(ch, col + 1, true)
		else
			local rev = line:sub(1, col - 1):reverse()
			local r = rev:find(ch, 1, true)
			if r then
				target = col - r
			end
		end
		if target then
			vim.api.nvim_win_set_cursor(0, { vim.fn.line("."), target - 1 })
		end
		return
	end
	vim.cmd("normal! %")
end, { noremap = true, silent = true })

-- disabled defaults
vim.keymap.set({ "n", "x" }, "<Left>", "<Nop>", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "<Right>", "<Nop>", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "h", "<Nop>", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "b", "<Nop>", { noremap = true, silent = true })
vim.keymap.set({ "n", "x" }, "q", "<Nop>", { noremap = true, silent = true })
