local map = vim.keymap.set
local opts = { noremap = true, silent = true }

vim.o.laststatus = 0
vim.o.cmdheight = 0

map({ "n", "x" }, "n", function()
  local count = vim.v.count
  if count > 0 then
    vim.cmd("normal! " .. count .. "%")
  else
    vim.cmd("normal! 0%")
  end
end, opts)

map({ "n", "x" }, "w", "k", opts)
map({ "n", "x" }, "a", "h", opts)
map({ "n", "x" }, "s", "j", opts)
map({ "n", "x" }, "d", "l", opts)
map({ "n", "x" }, "i", "-", opts)
map({ "n", "x" }, "j", "^", opts)
map({ "n", "x" }, "k", "+", opts)
map({ "n", "x" }, "l", "g_", opts)
map({ "n", "x" }, "<CR>", "o", opts)
map({ "n", "x" }, "r", "i", opts)
map({ "n", "x" }, "e", "a", opts)
map({ "n", "x" }, "<Home>", "gg", opts)
map({ "n", "x" }, "<End>", "G", opts)
map({ "n", "x" }, "<Up>", "<C-y>", opts)
map({ "n", "x" }, "<Down>", "<C-e>", opts)
map({ "n", "x" }, "<Left>", "<Nop>", opts)
map({ "n", "x" }, "<Right>", "<Nop>", opts)
map({ "n", "x" }, "h", "<Nop>", opts)
map({ "n", "x" }, "m", "<Nop>", opts)
map("n", "x", "d", opts)
map("n", "t", "F", opts)
map("n", "o", "<C-r>", opts)
map("n", ".", ";", opts)
map("x", "x", "d", opts)
map("x", "o", "<C-r>", opts)
map("x", ".", "o", opts)
map("x", ",", "o", opts)
map("o", "x", "V_", opts)
