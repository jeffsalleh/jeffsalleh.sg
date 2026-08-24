---
title: "Give it eyes"
description: "My AI agent kept fixing a bug that wasn't fixed. It wasn't a reasoning problem — it was looking at the wrong thing. Part 2 of a series on handing an agent the whole stack."
date: 2026-08-XX
tags: ["technology", "ai", "engineering"]
image: "/images/give-it-eyes-hero.png"
draft: false
---

This is Part 2 of a series about rebuilding my fantasy football platform on the
Oracle stack and letting an AI agent run the whole thing. [Part 1 is
here](/post/i-handed-an-ai-agent-my-whole-stack/) if you want the setup.

Here's the moment that taught me the most.

## The bug that kept coming back

At one point in the build, the agent and I got stuck in a loop. There was a
rendering problem on the site — the kind of UI bug where the page looks wrong to
a human but nothing is technically on fire. The agent would look at it, decide
it understood the cause, make a change, and declare it fixed.

It wasn't fixed. So we'd go around again. And again.

This happened not once but with a whole run of small rendering bugs — call it
half a dozen — each with the same frustrating shape. The agent was confident.
The logs were clean. The page was still broken. And every round trip cost a full
cycle: change the code, deploy it, and me coming back to say "no, still wrong."

## Why it couldn't see the problem

It took me a while to work out what was actually happening, and when I did, it
was obvious in hindsight.

The agent was verifying its work by **reading logs and HTTP responses.** It would
hit the endpoint, get a `200 OK`, see valid JSON or valid HTML come back, and
reasonably conclude that the thing worked. From where it was standing, the
evidence said success.

But a rendering bug doesn't show up in a `200 OK`. The server can return a
perfectly valid response that a browser then lays out completely wrong. The only
way to catch that class of problem is to **look at the rendered page the way a
human does** — not at the response, at the result.

The agent wasn't doing that. And I don't think it's because it couldn't. I think
it's because reading logs is its *default* — probably the way it was trained to
verify that software works. Logs are where a lot of engineering ground truth
lives, so "check the logs" is a sensible first instinct. It just happens to be
exactly the wrong instinct for a bug that only exists visually.

## The fix was a sentence

I stopped it and told it to use its built-in browser — to actually open the page
and look at what rendered, instead of inferring correctness from the logs.

That was the whole fix. Not a tool I installed. Not a new capability. A
redirection. "Stop reading the logs. Open it and look."

The change was immediate. A category of bug that had been costing us
deploy-and-ask cycles all week became something the agent could see for itself,
diagnose, and fix in one pass. The loop broke. Ten minutes spent teaching it to
look was worth more than several hours of it reasoning cleverly about the wrong
evidence.

## What this actually taught me

It would be easy to file this under "give your agent a browser" and move on. But
that misses the real lesson, and the real lesson is the reason I'm still useful
in this workflow at all.

**The agent defaults to one way of doing things.** For verifying output, that
default is reading logs. It's a reasonable default, and most of the time it's
fine. But it's *a* default, not the only way — and it will happily apply it to
problems where it's the slow, wrong tool, without ever noticing there's a better
one.

An experienced engineer knows there are other ways to "see." I've spent years
debugging software, and I know from that experience that some problems you read
in the logs, and some problems you have to *look at* — you open the thing in a
browser, you watch it fail, you see it with your own eyes. That knowledge isn't
exotic. It's just earned. And it's exactly what the agent didn't have.

So the value I added wasn't writing code — the agent did that faster than I
could. It wasn't even spotting the bug. It was recognising that **the agent was
stuck in its default approach, and knowing the technique that would get it
unstuck.** I didn't out-reason the AI. I knew which of my old habits to hand it.

### And it isn't only about being unstuck — it's about cost

Every one of those wasted rounds cost something real. Each deploy-and-ask cycle
burned time, burned my attention, and — as I'll show in a later post — burned
money, because the longer an agent works, the more expensive every one of its
turns becomes. A loop that repeats six times isn't six times the cost. It's
worse than that, because the wasted work piles up and taxes everything that
comes after it.

The single sentence that broke the loop — "stop reading the logs, open it and
look" — didn't just fix a bug. It cut off a compounding cost. And I could only
write that sentence because I'd debugged enough software over the years to know
it was the right one. **My experience wasn't nostalgia. It was the cheapest
optimisation in the entire project.**

That's the part I most want other senior engineers to hear. There's a quiet
worry in our field that deep development experience is becoming a museum piece —
that once the AI writes the code, the years you spent learning to build software
stop mattering. I found the opposite. The experience is what lets you *drive* the
AI well: to recognise when its method is wrong, to know the faster technique, to
smell a compounding cost before it runs away from you. The models are
extraordinary at execution. Steering them — deciding *how* the work should be
done, not just what — is still a human job, and it is done best by people who
have done the work themselves.

That gap, between executing and steering, is where experience still lives. If
anything, it matters more now, not less.

## Next

Part 3 is the one I've been not-quite-looking-forward to writing: the day the
agent destroyed my production host, in full, honestly. What happened, why I let
it, and what it taught me about the difference between autonomy and abandonment.

<!-- If you'd like the earlier parts, link the series index or Part 1 again here -->
