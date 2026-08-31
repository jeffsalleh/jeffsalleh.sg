---
title: "The day it destroyed production"
description: "I gave my AI agent auto-approve on infrastructure changes. It saved me hours — right up until it destroyed my production host. The lesson isn't 'stop automating.' It's about where you put the tripwires. Part 3 of a series."
date: 2026-08-31
tags: ["technology", "ai", "engineering"]
image: "/images/destroyed-production-hero.png"
draft: false
---

This is Part 3 of a series about rebuilding my fantasy football platform on the
Oracle stack and letting an AI agent run the whole thing. In
[Part 1](/post/i-handed-an-ai-agent-my-whole-stack/) I promised this post, and
then dragged myself slightly to write it. Here it is.

## The setup: I took myself out of the loop, on purpose

Terraform — the tool that turns your infrastructure into code — has a review
step built in. You run `plan`, it shows you exactly what it's about to change,
and nothing happens until you type "yes." It's a seatbelt. Every change stops and
asks.

Early in the project I turned that seatbelt off. I ran the agent with
`-auto-approve`, which skips the confirmation and applies changes immediately.

I want to be clear that this was a *deliberate* and, I still believe, *correct*
decision. The whole premise of the experiment was to let the agent run — to keep
a human out of the loop, so it could move at its own speed instead of mine.
Stopping to hand-approve every infrastructure change would have defeated the
point and wasted hours. Auto-approve is genuinely good. Most of the time, you
*want* the human out of the loop. I never like being the bottleneck and most of the time that is the issue in the real world - a bottleneck somewhere in the system.

Most of the time.

## The moment

At some point the agent decided the cleanest way to make a change was to destroy
a resource and recreate it. In Terraform that's a completely normal thing to do —
sometimes a change can't be made in place, so it tears the resource down
and builds it fresh.

With the seatbelt on, I'd have seen that in the plan. The word `destroy` would
have been sitting right there in the output, and I'd have paused. With the
seatbelt off, there was no pause. The plan was generated and applied in the same
breath, and my production host — the live instance the whole site was running on
— was gone. Irrecoverably.

Here's the key part, and the part that matters for anyone reading this to
learn rather than to wince: **it barely cost me anything.** The site was still
pre-launch. No real users, no live data, nothing anyone would miss. And because
the entire stack lived in code, "destroyed" didn't mean "gone forever" — the
agent rebuilt the service from scratch, from the same Terraform, and brought it
back. What was irrecoverable was the *host*. The *service* was fully
recoverable, because it had never really lived in that host — it lived in the
code that described it.

So this isn't a horror story but a near-miss in the best sense: a real failure,
under conditions cheap enough that I got the lesson without paying too much for it. Which
is exactly why I want to be precise about what the lesson actually is.

## The wrong lesson

The easy takeaway is "don't give an agent auto-approve - audit everything." That's the wrong takeaway — and NOT the lesson and if you take it you'll build slower for no real gain.

Auto-approve wasn't the mistake. Running fast wasn't the mistake. If I'd hand-
approved every change, I'd have spent the project babysitting a progress bar, and
the ninety-odd routine, additive, completely safe changes the agent made would
have each cost me an interruption for the sake of the one that mattered. That's
not safety. That's just friction pretending to be safety.

The mistake was subtler: I had automation with **no guardrails**. It was all-or-
nothing — either the human approves everything, or the human approves nothing.
There was no middle setting, and the middle is where the right answer lives.

## The right lesson: tripwires, not seatbelts

The fix isn't to slow everything down. It's to let almost everything run free,
and put **tripwires** (I love this term) on the specific actions that are dangerous — the ones where
a human genuinely needs to be in the loop.

And the key insight is *which* actions those are. My first instinct was "stop if
the plan destroys resources." But that's too blunt — destroying resources is
often completely safe. My production host is a good example: it was disposable,
fully described in code, rebuildable in minutes. Stopping every time something
like that gets replaced would just recreate the friction I was trying to avoid.

The real tripwire isn't quantity. It's **criticality and reversibility.** Some
resources are disposable; destroying them is cheap because they're reproducible
from code. Other resources are irreplaceable, and destroying them is
catastrophic and permanent — dropping a database that has no backup, wiping the
only copy of something stateful. That action should stop and demand a human
*every single time*, even though it's just one resource in the plan. The blunt
"all resources destroyed" rule would happily wave that through if it were the
only change.

So the guardrail I'd design isn't "stop on destroy." It's: *classify the
resources by blast radius, and put a hard human-in-the-loop stop on the
irreversible, unbacked, critical ones — while letting everything additive and
everything reproducible run at full speed.*

To be clear, this is the lesson I drew, not a system I've already built. But it's
concrete enough to build, and that's the point — it's a rule, not a vibe.

## Why this is a human's job

Here's the part that ties back to everything else I've written in this series.

To design that guardrail, someone has to be able to look at a resource and know:
is this disposable, or is this the one whose loss can't be undone? That the
compute host is throwaway but the database is sacred. That *this* volume is a
cache and *that* one is the only copy. The agent, looking at a Terraform plan,
sees "a resource being destroyed." The experienced engineer sees "the one
resource in here whose destruction is irreversible."

That distinction — knowing where the real danger is buried, which requires
genuinely understanding the technology, architecture and how it behaves — is exactly the
expertise the agent doesn't reliably have and can't be trusted to infer. It's
the same theme as [the observability work](/post/give-it-eyes/) and everything
else in this series: the agent is astonishing at execution, and the human's
enduring job is judgment. Here the judgment is precise and high-stakes — deciding
where the tripwires go, so the agent can run free everywhere else.

Auto-approve didn't fail me. The absence of a single well-placed tripwire did.
And knowing where that tripwire belongs turned out to be the most valuable thing
I brought to the whole afternoon.

## Next

Having learned the hard way that a running system can surprise you, I spent a
later session adding real monitoring to it — and discovered that almost every
alarm I tried to add uncovered a bug that was already there. That's the next
post.
