```md
# $HOME

I started collecting dotfiles because my home directory
looked like a crime scene and I needed an alibi. Three
operating systems, two existential crises, and one
accidental rm -rf later, these are the survivors.

Nothing in this repository is guaranteed to work on
your machine. Nothing in this repository is guaranteed
to work on my machine either. But most of the time it
does, and that is a boundary I am unwilling to test.

## How to deploy

paru -S $(cat .pkglist)

If it doesn't work, your computer is haunted.

⣄⢦⡰⣄⢦⡰⣤⡰⣤⡰⣤⣄⢦⣄⢦⣤⡰⣄⢦⡰⣄⡒⢀⣠⣄⣢⢤⡰⣤⡰⣄⢦⣠⣀⠐⢤⢢⡔⣤⣄⠦⣄⢦⡰⣄⢦⣰⣠⣄⠦⣄⣢⣔⣠⣂⡴⣠⢆⡴⣠⢆⡴⣠⢆⡔
⣿⣿⣿⣿⣿⣿⣷⣿⣷⣿⣷⣿⣿⣾⣿⣾⣿⣿⣿⣿⠋⣴⣿⣷⣿⣾⣿⣿⣷⣿⣿⣿⣷⣿⣿⣦⡙⣿⣿⣾⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣷⣿⣷⠿⠿⠟⠛⠛⠋⢉⣉⣀⣀⣤
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⣾⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⡝⠿⠿⠿⣷⠸⣿⣿⣿⣿⣿⣿⠿⠿⠟⠛⠛⢉⣉⣁⣠⣤⠤⠴⠶⣒⣚⣫⣭⣭⣴⣶⣶
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⡆⣴⡶⣦⢲⣿⣿⡏⣿⢱⡟⣶⢹⡇⣿⣿⣿⣿⣿⡆⢠⣤⣒⢛⣭⣭⣭⣷⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡜⣿⣿⣿⣿⣷⣝⣓⡯⣿⣾⣿⣿⣿⢨⣥⣵⣿⢣⣿⣿⣿⣿⣿⡇⢸⣿⣿⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡘⣿⣿⣿⣿⣿⣯⡞⠹⠶⠶⠶⠞⢡⣿⡿⢋⣾⣿⣿⣿⣿⣿⡇⢸⣿⣿⢽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣮⡛⢿⣿⣿⢿⢠⡶⢖⣢⣄⠀⠸⢟⣵⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡮⢍⣓⣓⣛⣛⣻⣭⣵⣬⡛⣿⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣫⣾⣿⣿⣿⣿⣿⣿⣿⣷⡙⣿⡘⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢡⣿⣿⣿⢏⣿⣿⣿⣿⣿⣿⡇⣿⣷⢹⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⢿⣟
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⣾⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⡇⣿⣿⣧⠿⠿⠿⠛⠛⠋⠁⢸⣿⣿⣿⣿⣿⠿⠿⢿⣛⡋⢾⢎⣭⣵⣶⡔⠛⢋⣉⣉
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⡇⡿⠿⠿⠛⠛⣭⣭⣥⣶⣀⣀⣀⢀⣠⣤⣤⣴⠄⢸⠟⠩⠶⠒⠒⠛⢉⣉⡁⣠⢸⣿⣿⣿⣿⡇⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⢿⣛⣛⣫⣥⣭⣷⣶⣾⣿⣿⣿⣿⣿⣿⣷⣶⠶⠶⣾⣯⣬⣽⣶⣶⣿⣦⣤⣴⣶⣶⣾⣿⣿⡿⣋⣾⣿⢸⣿⣿⣿⡿⢃⢻⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢩⣤⣴⣚⣛⣻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠫⣶⡏⣶⣅⠪⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⡍⠍⢩⣾⣿⣿⡋⠮⠭⢖⣒⣮⣵⣾⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣮⢩⣭⣽⣛⣛⠷⠶⠾⣭⣭⣽⣛⣛⡿⠿⠿⣿⣿⣿⣷⣶⣶⣶⣿⣿⣶⣭⣭⣟⣛⣛⣯⣭⣭⣶⣿⣿⣶⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣶⣶⣾⣭⣭⣽⣛⣛⣲⠶⠶⣯⣭⣽⣛⣛⣻⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣯⣭⣭⣭⣭⣭⣭⣭⣭⣭⣼⣭⣭⣭⣭⣭⣭⣽⣭⣭⣭⣭⣭⣭⣭⣭⣭⣽⣥⣦⣴⣼⣯⣽⣭⣭⣭⣴⣦⣬⣭⣭⣭⣭⣽⣭⣭⣭⣭⣭⣭⣭⣽⣭⣯⣭⣽⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿

## What is inside

Apps - programs that require a graphical session to
disappoint me. A terminal emulator that has seen things.
Four Chrome channels because I am conducting a long-term
experiment on memory fragmentation. A code editor that
crashed once and I have been punishing it ever since by
installing more extensions. An AI agent that reviews my
code and sighs in iambic pentameter.

Shell - command line tools I installed because the
alternatives were already installed and that felt like
surrendering. A fuzzy finder that I use exclusively to
open the same three directories. A prompt that tells me
the git status I will ignore anyway. Zsh plugins that
add approximately 400 milliseconds to every terminal
startup and I protect each one with my life.

System - configuration files governed by a set of rules
that I discovered through trial and error and promptly
forgot. The compositor settings are balanced on a knife's
edge between performance and not catching fire. The audio
chains were assembled by reading forum posts until my
eyes blurred and then copy-pasting until something worked.
I do not touch these files. They do not touch me. We have
an understanding.

Readonly graveyard - system files that I backed up here
because the alternative is retracing my steps through a
browser history that I clear every three months out of
paranoia. A DNS proxy that routes around censorship and
also around my ability to understand it. A firewall that
started as a single rule and multiplied like a recursive
function with no base case. A DPI bypass that I configured
at 3 AM during a power outage and if I ever have to set it
up again I will simply move to a different country.

⣿⣿⣿⣿⡿⠟⠋⠉⠉⠉⠉⠉⠙⠙⠿⣿⣿⠏⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡇⠙⠛⠉⢀⠀⠂⠌⠠⠁⠌⠠⢁⠂⠄⡀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⠀⢀⠂⠄⡈⠐⡈⠄⠡⢈⠐⠠⠈⠄⠠⢁⠈⢻⣿⣿⣿⣿⡿⠟⣛⣫⣭⣭⣭⣝⣛⡻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡇⠀⢂⠐⠠⠀⢁⣐⡀⠁⠄⡈⠄⠡⠈⣀⣀⠈⠀⣿⣿⢟⣥⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣬⡻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠟
⡇⠐⠠⠈⠄⠁⢿⣏⡿⠂⠐⠠⢈⠐⠸⣏⡿⠃⡀⡿⣡⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⡿⣿⣿⣿⣿⡌⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠛⠛⠋⣉⣉⣁⣤⡤⠴⠶⣶
⣧⠀⠡⠈⠄⠡⢀⠀⠠⠀⣁⣂⣀⣈⠀⠠⢀⠐⢰⢣⣿⣿⣿⣿⠿⠟⣛⠻⣟⣩⣾⣾⣮⠛⣛⡛⣿⡜⣿⣿⣿⣿⣿⠟⠛⠉⣉⣉⣠⣤⡤⠶⢶⣒⣛⣻⣭⣭⣵⣶⣶⣿⣿⣿⣿
⣿⣧⡀⠡⠈⡐⠠⠈⠄⠈⣉⡉⠉⠉⠀⠂⠄⣠⣿⢸⣿⣿⣿⣿⡇⣿⡟⡷⣹⢫⣿⣧⣿⢸⣟⡿⣸⡇⣿⣿⣿⣿⣿⡇⢸⣶⣮⢵⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣦⣄⡐⠠⠁⡈⠛⠉⡀⢀⠀⠀⣴⣾⣿⣿⣎⢿⣿⣿⣿⣿⣶⣶⢶⡿⢿⣿⣿⡿⡸⣶⣾⡿⣱⣿⣿⣿⣿⣿⡇⢸⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⠟⠁⠠⠐⠠⢁⠐⡀⠂⠄⡀⠻⣿⣿⣿⣎⠻⣿⣿⣿⣿⣷⠏⠘⠉⠛⠋⠉⢰⣿⠟⣱⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡟⠁⠀⠄⡁⠂⡁⠄⢂⠠⠁⢂⠐⠀⢻⣿⣿⣿⣷⣬⣛⠿⣿⡿⣜⣛⣭⣶⣦⠄⢘⣵⣾⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠁⠠⠁⢂⢀⠡⢀⠂⠄⠂⡁⠂⡈⠐⠈⠿⠿⣿⣿⣿⠿⠟⢤⣾⣯⣭⣭⣷⣶⡟⢷⣌⢿⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡿⠀⠄⡁⣿⠀⡀⢂⠐⡈⠐⠠⣡⣀⠡⠈⠄⡐⢀⠀⡀⠄⣀⡀⢹⣿⣿⣿⣿⣿⣿⡎⣿⡎⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡇⠀⠂⠄⣿⣷⠀⠄⠂⠄⠡⢀⣿⣿⣿⣿⣶⣶⣶⣶⢠⣾⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇⣿⣿⡜⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣺⣿⣿⣿⣿⣿⣿⣿⢟⠿⡿⠿⠿⢛⣛⣿⣿⠿
⣿⣿⡇⢈⠐⡀⣿⣿⡀⢈⠐⡈⢀⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⡿⣸⣿⣿⣿⣿⣿⣿⡧⠿⠿⠗⠙⠛⠉⠉⠉⠀⠀⢸⣿⡿⠾⢿⣛⣛⣻⡭⠭⠆⢛⣣⣾⣿⣿⡆⣠⣤⣤⣴
⣿⣿⡇⢀⠂⠄⢻⣿⡗⠀⢂⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⡇⡿⠿⠿⣃⣛⣻⣭⣭⣑⣒⣒⣲⠶⠶⠦⠤⠰⠶⠶⣖⣛⡃⠘⠋⠐⢋⣉⣉⣤⣤⣤⢆⣴⢸⣿⣿⣿⣿⡇⣿⣿⣿⣿
⣿⣿⣿⣦⣀⣸⣿⣿⣷⡀⣸⡿⠿⢟⣛⣛⣯⣭⣭⣷⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢟⣛⠛⢛⠿⣿⣿⣿⣿⣿⣷⣾⣿⣿⣿⡿⢿⡿⢟⣵⣿⡿⣸⣿⠿⢟⣛⡱⣸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡟⣴⣿⣐⠶⠶⢯⣭⣭⣟⣛⣛⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣔⣛⣇⠿⣖⣙⣘⠿⢿⣿⣿⣿⣿⣿⣿⡿⢎⣃⣒⣶⣶⢶⣒⣒⣺⣭⣭⣶⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣇⣿⣿⣿⣿⣿⢸⣶⣶⣾⣭⣭⣟⣛⣻⡶⠶⢾⣭⣭⣽⣛⣛⡿⠿⠿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣾⣶⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠸⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠶⠶⠿⠭⠭⠝⣛⠛⠷⠶⠾⠭⠭⠽⠛⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⢿⠿⡿⢿⠿⢿⠿⣿

## Philosophy

If you have to ask what distro I run, you are not
ready for the answer. But it starts with A and ends
with X and there is a lot of CH in between.

At some point I stopped configuring things to work
better and started configuring them to feel like
mine. There is a difference. I cannot explain the
difference. But I know it when I break it.

The machine knows me now. Not in a meaningful way.
In the way that a door knows which shoulder you use
to open it. Muscle memory exchanged in both
directions. I have shaped it and it has shaped me
and neither of us remembers who started it.

This is not a setup. It is a sediment. Years of
decisions I no longer question because questioning
them would mean admitting I made them.

## License

This software is provided "as is" and "as I left it."
No warranties are expressed, implied, or considered.
The author is not liable for damages, lost time,
existential crises, or the realization that your own
dotfiles are not this funny.

By cloning this repository you agree to never ask
me why anything works the way it does. I do not
know. That is not a disclaimer. That is the truth.

Use is permitted for personal, educational, and
recreational suffering. Commercial use requires
that you explain to me what you are selling and
why you thought this would help.

Redistribution is allowed but discouraged. If you
share this and someone else breaks their system,
that is between you and them. I was not there.
I have never been there. I do not know you.

## Final note

If you forked this repo, you have made a mistake.
This config is optimized for exactly one machine
and it is mine. Your GPU will cry. Your monitor
will flicker. Your WiFi will forget the password.

⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣛⣛⣭⣭⣭⣝⣛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣫⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣍⠻⣿⣻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠟⠛⠉⢀⠀⡀⢀⠀⡈⠉⠛⠿⡿⠋⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢣⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡌⢿⣷⣮⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣯⠈⠛⠁⠠⠐⢈⠀⢂⠐⡀⠂⠄⡁⠂⠄⡀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣸⣿⠇⣿⣿⣿⣿⠿⠿⠿⠿⠿⣻⣿⣿⣯⠛⣛⠛⡿⡜⣿⣿⠇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⠂⠀⠄⠡⢈⠠⢈⠀⠂⠄⡁⠂⠄⡁⢂⠐⠠⠘⣿⣿⣿⣿⠿⣛⣯⣭⣭⣭⣭⣭⣕⣻⠸⣿⣿⣿⣿⡇⣾⣟⣷⢹⢣⣿⣇⣿⢸⣏⡿⢸⡇⣿⣯⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡇⠠⠈⠄⡁⠂⢀⣤⣌⡀⠂⠄⡁⠂⢄⣤⣬⡀⠂⢻⡿⢋⣵⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣮⡻⣿⣿⣿⣶⣭⢖⣿⠿⠿⠿⠿⡰⣶⣾⡿⢱⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠛
⡇⠀⠌⠐⠠⢀⠹⠿⠼⠃⡀⠂⠄⠡⠘⠻⠜⠃⡀⡞⣱⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⢟⣿⣿⣿⣿⣌⢿⣿⣿⣷⠏⠐⠛⠛⠛⠋⢰⣿⡿⠡⠿⠟⠛⠛⠉⣉⣉⣠⣤⡤⠴⢶⣒⣛
⣿⡄⠈⠄⡁⠂⠄⡐⢀⠂⣠⣥⣬⣤⡀⠐⡀⠂⢰⢱⣿⣿⣿⡿⠟⢛⣛⡛⣛⣽⣼⣼⣮⢍⣉⡛⣻⡜⠿⣿⡟⣔⣟⡋⠁⢀⣀⣠⣤⠤⠶⢶⣒⣛⣻⣭⣭⣷⣶⣶⣿⣿⣿⣿⣿
⣿⣿⣦⠐⠀⡁⢂⠐⡀⣀⣤⠄⠀⠀⠀⠐⢀⣴⣿⢸⣿⣿⣿⣿⡕⢿⣟⡷⣽⣸⣿⣧⣏⠻⣽⠟⣼⡇⢗⣠⣬⣭⣭⠀⢸⣷⡆⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣦⣄⣂⠐⠀⠉⠁⠄⠂⡀⠀⠴⣿⣿⣿⣎⢿⣿⣿⣿⣿⣷⡶⣺⠿⣛⣛⣛⡫⠼⣿⣿⡿⣰⣿⣿⣿⣿⣿⠄⢸⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⡿⠋⠁⡀⠌⠠⠁⠌⠐⡀⠂⠄⠘⣿⣿⣿⣮⠻⣿⣿⣿⣿⣾⠃⢉⣉⡉⠉⠉⢸⣿⢟⢰⣿⣿⠿⣿⣿⣿⠆⢺⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡟⠀⡐⠠⠐⠠⠁⠌⠠⢁⠐⡈⠐⡀⠸⣿⣿⣿⣿⣮⣙⠿⢿⣟⣜⣻⣵⣾⡶⠄⠨⣵⡏⣾⣿⡇⡇⣿⣿⣿⡄⢹⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠃⠠⠐⢠⠁⢂⠡⠈⡐⢀⠂⠄⢁⠐⠠⠙⠿⢿⣿⣿⠿⠋⠵⣶⣶⣶⣶⣶⣿⣟⢿⣎⠃⣿⣿⡇⣿⡜⣿⣿⠀⢺⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠀⠄⠡⢸⡄⠂⠠⠁⠄⢂⠈⣠⣄⡈⠐⠀⠂⠄⡀⠠⠀⢂⣀⢸⣿⣿⣿⣿⣿⣿⡎⣿⡆⣿⣿⡇⣿⡇⣿⣿⠀⣹⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠀⡈⠄⣸⣿⠀⠁⠌⠐⡀⢂⣾⣿⣿⣿⣿⣷⣶⡶⣠⣾⣿⣿⢱⣿⣿⣿⣿⣿⣿⡇⣿⣿⡜⣿⡇⣿⣿⡎⡿⠀⢸⣿⡏⣿⣿⣿⣿⣿⣿⣿⡿⣛⡻⠿⢟⣛⢛⣫⡭⠿⠿
⣿⣿⣿⠀⠐⡀⢿⣿⡄⠡⢈⠐⠀⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⡏⣾⣿⣿⣿⣿⣿⠿⠇⠿⠛⠓⠙⠀⠉⠁⠀⠀⠀⢸⣿⡇⠛⣛⣛⣋⡭⠭⠔⠂⣛⣵⡿⣿⣿⡆⣤⡤⢴⣶
⣿⣿⣿⠀⠂⠄⣘⣿⣯⠐⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⠧⠿⢟⣛⣃⣯⣭⣭⣥⣴⣞⣛⣛⣒⣲⡶⠶⠰⠖⣒⣛⣙⡁⠘⠁⢃⣉⣃⣠⣤⣴⡜⢀⣼⢓⣮⣥⣘⣯⡈⣾⣬⣼⣿
⣿⣿⣿⣶⣤⣠⣿⣿⣿⡄⢸⠿⠿⣛⣛⣫⣭⣭⣷⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣛⣻⢉⢻⠿⡿⠿⠿⠿⠿⠿⠿⣿⠿⡿⠿⠿⠿⡫⠶⠿⢯⢸⠋⣛⣉⡉⡖⣼⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡿⢰⣿⣘⣛⠶⠶⠶⣭⣭⣝⣛⣛⡿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣜⣛⣋⣛⣚⣁⣌⡻⠷⢿⣶⡿⣷⢷⢿⠗⣊⣬⣕⣚⣓⣓⣂⣝⣧⣄⣢⣾⣻⣮⣮⣽⣿

You have been warned.
```
