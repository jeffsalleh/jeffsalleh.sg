---
title: "The stack is the least interesting part"
description: "The site went live for its first real match. People keep asking how it's built. But the architecture was never the interesting question. How much of it I was willing to hand to an agent was. Part 5 of a series."
date: 2026-09-13
tags: ["technology", "ai", "engineering"]
image: "/images/how-much-to-hand-over-hero.png"
draft: false
---

The site went live for its first real match this week, and a few people have asked
how it's built. I'll answer that, but briefly, because the honest truth is the
stack is the least interesting part of this whole thing.

Helidon and Oracle Java for the backend, Oracle Autonomous Database underneath it,
React on the front, all of it on OCI and described in Terraform. If you've built
for the web in the last decade none of that will surprise you, and in five years
half of it will have changed anyway. Technology moves. Stacks move. Architecture
evolves. For anyone who's been doing this a while, choosing an architecture is not
a new problem. I know what to expect, I know what to do, there's nothing on that
axis I haven't seen before.

The interesting question was a different one, and it's the reason I did this at
all: **how much of the work can I actually hand to an agent, and how comfortable
am I doing it?** And underneath that: what are the gotchas, what do I have to stay
mindful of, and the question almost nobody asks out loud, would I even recommend
working this way to someone else?

## The part I don't have twenty years of instinct for

Architecture change, I can reason about cold. Handing the work to an agent, I
can't. Not yet. That's the paradigm I *don't* have a career's worth of instinct
for, and that's exactly why it was worth doing.

So the real experiment underneath the football app was calibration. How much do I
let it run on its own? Where do I insist on being in the loop? What am I
comfortable never looking at, and what would I never delegate no matter how good
it got? Those aren't questions with textbook answers, because the textbook hasn't
been written. You find the line by walking up to it, and sometimes over it. It
destroyed my production host once ([Part 3](/post/the-day-it-destroyed-production/))
because I'd set the line in the wrong place. That's the cost of learning a
paradigm nobody's mapped yet.

I still don't have a clean answer. What I have is a much better-calibrated sense
of my own comfort than I had a month ago, which is the actual deliverable of a
project like this, more than the app itself.

Take privileges. [In Part 4](/post/i-told-the-ai-to-escalate-its-own-privileges/)
I wrote about the agent refusing to grant *itself* new power, the machine holding
a line even I couldn't talk it past. What I didn't say is that I struggled with the
same line from the other side. I started cautious, granting the agent as little as
I could get away with. So it kept hitting walls and stalling, and I kept getting
pulled in to unblock it. That got tiring fast, and so I over-corrected, opening
things up broadly just to stop the interruptions. Which is exactly the trap. The
broad grant is the easy way out when a blocked agent is nagging at you, and it
quietly hands over far more than you meant to. The right level of access isn't a
decision you make once. It's a thing you get wrong in both directions, too tight,
then too loose, before you find the line. And the friction of being blocked pushes
you toward over-granting at precisely the moment you should be scoping more
carefully.

## Building it is the easy half

Here's the thing that surprised me most: getting an agent to *build* something is
the easy part. Getting comfortable *running* what it built is the hard part.

A working demo is one thing. A live service that people are actually using, that
has to keep working when you're not watching, is a completely different bar.
And you can't be comfortable handing that to an agent unless you can *see* what's
happening inside it. Which is why the observability and monitoring work wasn't a
side-quest in this project. It was the whole point. You cannot offload what you
cannot observe. The moment real users showed up, that stopped being a principle
and became the thing I actually leaned on.

## Why this project, specifically

There's a professional reason I built this one and not some throwaway.

Running Oracle Java workloads well, knowing what versions are out there, keeping
them current, watching how they behave in production, is exactly the problem
space I work in day to day. Doing it on my own project, on my own free-tier
instance, let me dogfood the tools I actually work with: standing up Oracle's Java
Management Service on my own fleet, seeing the on-ramp the way a customer would,
finding the rough edges myself. It's one thing to own a service. It's another to
be a user of it at 1am on a personal project, with no shortcuts, hitting the same
walls anyone else would.

That turned out to be some of the most valuable work in the whole exercise, and
it fed straight back into the day job. But that's its own story for another time.

## When is it enough?

The question I keep coming back to is: when is it enough?

For most of this project that was an architecture question. Enough features,
enough tests, enough hardening to call it done. I know how to answer that one.

But now that it's live and people are actually using it, "enough" has quietly
become a bigger question than the one I started with. Enough autonomy handed to
the agent? Enough of me still in the loop? Enough observability to sleep at night
while a service I mostly didn't type runs on its own?

Would I recommend working this way? Honestly, yes, but with eyes open. Not
because it's effortless (it isn't), but because the only way to build the judgment
for what's coming is to actually do it, get burned in small ways, and learn where
your own line sits. The gotchas in this series, the destroyed host, the bugs I
couldn't see, the cost I didn't expect, aren't reasons not to. They're the
curriculum.

I don't have the full answer yet. Honestly, it's turned into more than I
anticipated when I started, which is usually the sign that a project was worth
doing.

## Next

The next post is the uncomfortable one about cost. The infrastructure ran for
basically nothing. The agent did not. Where that cost actually came from is the
part that surprised me.
