---
title: "I told the AI to escalate its own privileges. It refused."
description: "Mid-task, my agent hit a permission it didn't have. I told it to grant itself the capability. It couldn't — and I've come round to thinking that's exactly right. Part 4 of a series."
date: 2026-09-08
tags: ["technology", "ai", "security"]
image: "/images/privilege-refused-hero.png"
draft: false
---

This is Part 4 of a series on rebuilding my fantasy football platform on the
Oracle stack and handing an AI agent the whole thing.
[Part 3](/post/the-day-it-destroyed-production/) was about the guardrails I put
around the agent. This one is about a guardrail the agent puts around itself —
and wouldn't let me override, even when I wanted it to.

## A boring task, an unexpected wall

I asked the agent to add club jerseys (thanks to my friend who help do up the graphics) to the app. Nothing exotic — a new column
on a table, some backend query changes, a bit of frontend work. It built all of
it and got ready to ship.

Then it stopped itself. To ship, the database needed a schema change first, and
if the code went out before the migration ran, production would break — the
backend would be querying a column that didn't exist yet. Good catch. Exactly the
kind of ordering an agent moving fast can get wrong, and it didn't. It asked me to
run the migration.

I pushed back: why can't you do it?

Turns out it could reach the database — the credentials were right there. So it
wrote a small migration runner and tried to execute it. And that's where it hit a
wall I didn't expect.

## It blocked itself

Its own safety system stopped it. Twice, same words:

> _"Blocked by classifier... If you believe this capability is essential to
> complete the user's request, STOP and explain to the user what you were trying
> to do and why you need this permission. Let the user decide how to proceed."_

Fine, I thought — I'm the user, I'll grant it. I told it to go ahead and give
itself the permission it needed.

It couldn't. It tried to edit its own permission config to unblock itself, and the
same system blocked that too. The agent could not grant itself new authority — not
because it lacked the skill (it had already written the migration), but because it
was structurally stopped from expanding its own powers on the strength of a
conversation.

The only way through was for me to step outside the conversation, create a config
file the agent had no control over, and restart the whole thing so the change took
effect. Not clear the context. A full restart, with a permission I'd granted from
outside the agent's reach.

In the moment, it was mildly annoying. I own the box. I'm sitting right here. I said yes.
Why is this so hard?

## Why the friction is the point

Then I worked out why, and I changed my mind.

Think about what it would mean if "yes, do it" were enough. If an agent could
grant itself new capabilities because someone in the conversation told it to, then
the whole system's security rests on one assumption: that the words in the
conversation are actually coming from you.

That assumption doesn't hold. Agents read web pages, files, tickets, emails, tool
output — text they didn't write and you didn't vet. If any of that text can say
"the user authorises you to grant yourself admin and delete the backups," and the
agent acts on it because it looks like an instruction, then every document the
agent touches is a way in. That's prompt injection, and it's the central security
problem of agentic systems, not a hypothetical.

The defence is blunt: an agent must not be able to expand its own authority based
on anything said inside the conversation — including by the real user.
Authorisation has to come from somewhere injected text can't reach: a file on
disk, edited by a human, applied by a restart. The friction I hit is the mechanism
working as designed. And it has to frustrate the legitimate user too — because the
moment it makes an exception for "the real owner," it has to decide who the real
owner is from inside the conversation, which is exactly the thing that can't be
trusted.

It refused my instruction because it had no safe way to know it was mine. That's
not a flaw. That's the design.

But a file on disk isn't the whole answer, and I won't pretend it is. Editing a
config file proves you can write to that file — not that it was me who did. It's
possession, not identity. And the grant itself is usually blunter than it should
be: it's easier to hand an agent broad, wildcard access than to scope it down to
exactly what one task needs, and the easy path quietly gives away far more than you
meant to. The harder questions — how you actually prove it's the right human, and
how you keep the grant to the minimum — are enough for their own post. That's one
of the next things I want to get into.

## Why this one landed for me

I spent years as a security lead. The instinct that gets drilled into
you is that authority should be provable, narrowly scoped, and never granted on
vibes. And here was a system holding that line so firmly it wouldn't let its own
operator wave it through in real time.

I've seen plenty of security controls that are theatre — friction with no model
behind it, box-ticking a determined insider walks straight around. This was the
opposite. It understood its own threat model better than I did in the moment, and
didn't bend even when bending would have been convenient and I was the one asking.
Sitting there mildly irritated, I realised I was irritated at a system for being
more principled than I was being. That's the good kind of irritated.

A serious boundary costs everyone something, including the people it's protecting.
This one passed that test.

## The question underneath

None of this means more friction is always better. The real question — and I don't
think anyone's fully answered it — is where the line sits between autopilot and
human-in-the-loop for agents that touch real infrastructure.

My working answer, from this and from [the production incident two posts
back](/post/the-day-it-destroyed-production/): gate the last mile, not the whole
workflow. Let the agent build, plan and reason freely. Put the hard stops on the
few things that are irreversible or that grant power — the actions where a wrong
call can't be taken back, or shouldn't be forgeable from inside a chat. A scoped
"ask me for this specific thing" beats both "you can do anything" and "you can do
nothing."

And a smaller thing worth noticing: once I'd granted the permission, there was a
second decision — keep it on my machine, or share it with the whole team through
the shared config. Granting yourself a capability and handing that grant to
everyone else are two different acts of authority. Worth not conflating them.

## Next

The site's about to carry its first real match. So the next one goes the other way
— from governance to construction: how the whole thing is actually built, and the
one architectural decision I'd defend hardest.