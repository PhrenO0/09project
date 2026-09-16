---
name: reading-slice
description: Implement or resume one bounded feature in the 09project shared-reading mobile app, with edition rights, spoiler behavior, and an interruption checkpoint. Use for this repository's product changes or resuming its interrupted work.
---

# Shared reading slice

Start at the repository root. Read `CHECKPOINT.md` and current git status; read only the product/technical document relevant to the requested slice. Existing files and fresh verification outweigh an old checkpoint.

Choose one observable user flow and its completion criterion. Keep implementation scoped to that flow. The root `AGENTS.md` supplies model routing and write ownership. Send a worker a compact contract, not the full conversation.

For content changes, read `docs/CONTENT.md`: book metadata, room membership, and permission to read an edition are separate. For spoiler changes, include notifications and accessible text, not just visible cards. For state changes, check reopen/reconnect and failed persistence as applicable.

Save code as each small part becomes usable. Run the narrow validation that can disprove a real failure. Do not convert a documentation edit into a full suite or repeatedly validate unchanged success.

Before a handoff, failure, or stage change, update `CHECKPOINT.md` with completed files, exact verification, remaining behavior, and the next command. Run `node scripts/snapshot.mjs`; it records local recovery context without committing or posting anything.

On resuming, check current files and external outcomes before replaying writes. A saved process ID, old subagent name, or pending tool call is not proof it still runs. Repeated usage-limit errors do not justify spawning more models. Return an accurate partial state if execution becomes unavailable.
