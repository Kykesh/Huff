# Memory Vault — Obsidian-Style Persistent Memory for Claude

This is a complete scaffold of the four-layer memory system. Drop this folder into your Obsidian vault (or any folder Claude can read), customize CLAUDE.md, and the system runs from day one.

## What's in here

```
05_memory_vault/
├── README.md                       ← you are here
├── CLAUDE.md                       ← THE most important file. Edit first.
├── folder_structure.md             ← explanation of why each folder exists
├── 00-INBOX/                       ← raw captures land here
├── 01-CAPTURES/                    ← processed notes by type
│   ├── observations/               ← things you noticed
│   ├── reactions/                  ← gut responses
│   ├── patterns/                   ← same principle in 2+ domains
│   ├── questions/                  ← things you don't know
│   └── numbers/                    ← real data points
├── 02-CONNECTIONS/                 ← synthesized insights
├── 03-BRIEFS/                      ← content ready to write
├── 04-PUBLISHED/                   ← archived content with performance
└── 05-CLAUDE/
    └── skills/
        ├── process_inbox.md        ← skill 1
        ├── weekly_connections.md   ← skill 2
        ├── generate_brief.md       ← skill 3
        └── write_content.md        ← skill 4
```

## Setup (15 minutes)

1. **Copy this folder somewhere Claude can read it.** If using Obsidian: this folder IS your vault. If using Claude Code: open this folder.
2. **Edit `CLAUDE.md`.** Fill in your identity, projects, voice, hard rules. This is the single highest-leverage file in the system.
3. **Set up captures.** Pick at least one capture method (Readwise, Telegram bot, voice memos via Whisper) and wire it to drop notes into `00-INBOX/`.
4. **Test the inbox skill.** Drop a test note in `00-INBOX/`. Ask Claude: "Process my inbox." Verify it files correctly.
5. **Wait a week.** Then run "run connection session." This is the JARVIS moment.

## The 20-minute daily ritual

| Minutes | What you do |
|---------|-------------|
| 1-5 | Dump captures into `00-INBOX/` (or let Readwise/bot do it) |
| 6-10 | "Process my inbox" |
| 11-15 | "Run connection session" |
| 16-20 | "Generate a brief for [the connection that surprised you most]" |

By minute 20 you have a content brief ready. The rest of the day is execution.

## The 4 hard rules (don't break these)

1. **Organize by TYPE, not topic.** Don't make a folder called "AI" — those notes go into observations/reactions/patterns/etc.
2. **Keep CLAUDE.md LEAN.** A bloated CLAUDE.md eats 20K tokens before you type anything. Cut ruthlessly.
3. **When in doubt, INBOX.** Don't agonize over which subfolder a note belongs in.
4. **Update Current Projects in CLAUDE.md every Monday.** 5 minutes. This single habit keeps Claude's context fresh.

## The compound effect

| Time | What you have |
|------|---------------|
| Month 1 | A useful tool |
| Month 3 | Claude starts connecting things from month 1 to month 3 |
| Month 6 | A record of every belief you held and changed |
| Month 12 | An AI that knows you better than most colleagues |

The competitor who starts 6 months after you isn't just behind on setup — they're behind on 6 months of compounded connections. That gap doesn't close by working harder.

## Where to go next

- After 2 weeks of consistent use: read `05-CLAUDE/skills/weekly_connections.md` and start the Sunday review habit.
- After 1 month: enable Dreaming (if you have Managed Agents access) — see `01_notes/03_claude_memory_system.md`.
- After 3 months: build agent teams (`03_agent_team/`) that read from the vault automatically.
