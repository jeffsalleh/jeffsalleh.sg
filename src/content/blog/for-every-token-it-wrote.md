---
title: "For every token it wrote, 395 were spent re-reading"
description: "The cloud bill for building the whole thing was basically nothing. The agent was a different story. And the surprising part isn't the total. It's where the tokens actually went. Part 6 of a series."
date: 2026-09-16
tags: ["technology", "ai", "engineering"]
image: "/images/cost-hero.png"
draft: false
---

This is Part 6 of a series on rebuilding my fantasy football platform by handing an
AI agent the whole stack. [Part 5](/post/the-stack-is-the-least-interesting-part/)
was about how much of the work I was willing to hand over. This one is about what
handing it over actually cost.

The cloud side is easy to report. Here's the actual invoice for a month of running
the whole thing on Oracle Cloud's Always Free tier: a real database, real compute,
a real pipeline, a live service people are using. This is an enterprise-class
service combination at virtually zero cost, one that you can bootstrap your Java
project on easily.

![Oracle tax invoice for the project: total 0.07 SGD](/images/invoice-redacted.png)

Seven cents. Six of enterprise-class infrastructure, one of GST. That's the bill
for the month.

The agent was not free. I'm on a subscription plan, so nothing showed up as a
per-token invoice, and I'm not going to invent a dollar figure I didn't pay. But
the session logs record every token the agent ever processed, and the *shape* of
that is the interesting part. It's true whether you're paying per token or not.

So I wrote a prompt and had the agent count it. Every session transcript for this
project, on disk, 102 files across five weeks. Here's what a month and a bit of
agent-driven building actually consumed.

## The numbers

Over five weeks, active from mid-August to mid-September, across roughly **11,000
agent turns**, the project processed **3.38 billion tokens.**

That number meant nothing to me until I broke it down by what the tokens were
actually *for*:

- **Output**, everything the agent actually wrote, every line of code, every
  config, every commit message, every explanation: **0.25%** of all tokens.
- **Cache reads**, the agent re-reading conversation it had already had, on every
  single turn: **98.3%**.
- Everything else, fresh input and cache writes: the remaining **1.5%**.

Read those again. A quarter of one percent of the tokens went into producing
anything new. Ninety-eight percent went into the agent re-reading the conversation
so far, over and over, so it could take the next step.

Put as a ratio: **for every single token the agent wrote, roughly 395 tokens were
spent re-reading context it already had.**

## What that would have cost at retail

I wouldn't invent a dollar figure, but it's worth translating the tokens into money,
because it reframes what "free" means.

The project ran mostly on Claude's Sonnet, with the more capable Opus model switched
on for the early stretch before I turned it off. That mix matters, because Opus
costs several times more per token, so it swings the total more than its share of
the tokens would suggest. This is an estimate from the logs and not a bill I paid,
but at published list rates it lands somewhere in the region of **2,500 to 3,000
dollars.** I'll give it as a range rather than a precise dollar amount the data
doesn't support: the spread is mostly down to that early Opus usage.

And here's the part that makes the whole point for me, whichever end of the range
you take: the overwhelming majority of it is the cache reads. Not the code. The
re-reading. The output, all the actual work product of the project, is a hundred or
so dollars of it. The rest is the agent re-reading its own conversation, priced up.

I paid none of it, because of my subscription. Ponder on this: the cloud
infrastructure to build and run this cost seven cents, and the intelligence to build
it would have been worth a few thousand dollars at retail, bundled into a monthly
plan. That's the real story of where the money is in this kind of work. Not the
servers. The thinking. And most of the thinking, it turns out, is just remembering.

## Why this surprised even me

Earlier in the project I'd written up a rough cost breakdown, and it said something
much tamer, roughly two-thirds re-reading, a third writing and input. When I
recounted from the raw logs across the whole history, the skew was enormously
worse. What happened?

The earlier writeup measured **dollars**. And on a per-token basis, cache reads are
priced far cheaper than output or fresh input, roughly a tenth. So when you weight
by cost, the cheap-but-enormous pile of re-reading gets flattened down to something
that looks reasonable: about 68% of the spend rather than 98% of the tokens.

Both numbers are right. But the dollar framing hides what's actually going on. In
raw token terms, the terms that describe what the machine is *doing* turn by turn,
the picture is stark: an agent doesn't mostly write. It mostly re-reads. The writing
is a rounding error on top of a mountain of the same conversation, consumed again
and again. Whichever way you measure, you land in the same place: session length,
not code output, is what the usage is actually made of.

## The cost grows as the conversation grows

There's a mechanical reason for this, and it's worth understanding if you work with
agents.

Every turn, the agent re-reads the context so far. So the longer a session runs,
the bigger that context gets, and the more every subsequent turn costs, for
identical work. It compounds.

I could see it in the logs. Comparing the first fifth of turns in each session
against the last fifth, late-session turns averaged **2.53 times** the size of
early ones. A turn near the end of a session costs more than double a turn near the
start, for the same kind of work, purely because there's more conversation behind
it to re-read.

About the limits of that number, because it isn't a clean climb. The single longest
session, one very long day of over 2,200 turns, showed almost no smooth
turn-over-turn growth at all. That's because the tool periodically compacts and
discards the history it has summarized, resetting the accumulated context. So in
practice it's a sawtooth, not a ramp: context grows, gets cut back, grows again. The
2.53 times is the average effect across sessions, not a promise that turn 500 always
costs more than turn 100. And the tool's own pruning only goes so far. You can do a
lot more yourself, which is the rest of this post.

Either way, the lesson holds. A wasted turn isn't just its own cost. It permanently
enlarges the context that every later turn has to re-read. The six identical bugs I
fixed one at a time in an earlier post weren't just expensive six times over. They
were a tax on everything that came after them.

## A gap in the number

One caveat I won't gloss over: that same compaction means 3.38 billion is a floor,
not a total. The turns that compaction erased are gone from the transcripts
permanently, so the true lifetime figure is higher, by an amount I can't recover
and won't guess at. What I can say is that the 98% re-read, the quarter-percent of
output, is not sensitive to the missing turns. If anything, more history means more
re-reading, which only sharpens the point.

## How you actually cut that number

If the overwhelming majority of a few-thousand-dollar bill is re-reading, then
reducing the re-reading is the whole game. And the useful thing I realised, writing
this, is that I already knew how. Every earlier post in this series was, without my
noticing at the time, a lever on this exact cost.

Here's the practitioner version, with the executive takeaway made plain, because if
you're the one signing off on AI spend, these are the levers that move the number.

**Keep sessions short and scoped.** This is the big one. Every turn re-reads the
entire session so far, so a single long marathon session re-reads a mountain; the
same work split across several short, focused sessions re-reads a fraction. When I
stopped running one endless conversation and started closing the loop and starting
fresh, the per-turn cost dropped sharply. Executive translation: the cost is driven
by session *length*, not by how much gets built. Long-running agent sessions are the
expensive ones, almost regardless of output.

**Decompose the work before you start.** Short sessions are only possible if the
work is broken into pieces small enough to fit in one. That decomposition, taking a
use case and splitting it into atomic, self-contained tasks, is what makes the whole
thing cheap. It's also, I think, a genuine new discipline in its own right, which is
why it gets its own post next. You get better at this by knowing exactly what you
want to deliver, the use cases, and how to use the AI best to build them.

**Don't let mistakes accumulate.** The six identical bugs I fixed one at a time in
an earlier post weren't just slow. Every one of those wasted turns permanently
enlarged the context every later turn had to re-read. Fixing a whole class of
problem in one pass instead of six isn't only faster; it's cheaper for the entire
rest of the session. A wasted turn is a tax on everything that follows it.

**Give the agent what it needs up front.** When the agent couldn't see the rendered
page and thrashed through six deploy-and-check cycles, each of those cycles was
turns, and turns are re-reading. Two minutes spent giving it the right tool saved
hours of thrashing, and every hour of thrashing was billable context. Removing the
reason for wasted turns removes their cost too.

**Match the model to the task.** This one I learned the expensive way. For the early
stretch I had the frontier model switched on, partly because it was the default and
partly out of a "this is a real project, better use the strong one" instinct. That
instinct is where a lot of the bill came from, because the frontier model costs
several times more per token. As I went, I realised I didn't need it for most of
what I was doing. I dropped to a lighter model and still got where I needed to go.
The lesson: reserve the expensive model for the genuinely hard reasoning, and use a
cheaper one for the bulk. If the task is a straightforward CRUD endpoint or a
well-shaped change, the frontier model is money spent on capability you aren't using.
Most of the time, the lighter model is more than enough.

Put together, the executive picture is simple, and it's the opposite of the usual
worry. The fear is that the AI writing the code is the expensive part. It isn't. The
output is a rounding error. The two things that actually drive the cost are how long
and messy your sessions get, and whether you reach for the priciest model when a
cheaper one would do. Neither is about writing less code. Both are about discipline:
structure the work into short, clean, well-scoped pieces, and match the model to the
difficulty of each one. Get those two right and the same project can cost a fraction
of what it would as one long, sprawling conversation on the most expensive model
available.

## A different way to think about the work

Of those levers, one is bigger than a tip, and it's the one I've been turning over
since.

It reminds me of instructing my own children. Give them one clear thing to do and
they do it well. Pile on a long history of context and caveats and prior
conversation, and everyone slows down, because now they have to hold and recollect
all of it before they can act. An agent is no different. The more it has to carry,
the more expensive and sluggish every step becomes.

Which points at something about how you should actually build software this way. The
skill isn't writing a big feature in one long conversation. It's decomposing a use
case into small, self-contained pieces, each one small enough to be built cleanly in
a short, cheap session, and then integrated. That decomposition, breaking a use case
down into agent-sized units and sequencing how they come together, starts to look
like a genuine software-engineering artifact in its own right. Not the algorithm
inside a function. The algorithm of the work itself: what gets built, in what order,
with what boundaries, so each piece stays small enough to stay cheap.

We already produce plenty of artifacts when we design software. I think the agent
era needs this one too, and I'm not sure it has a settled name yet. Tools like
OpenSpec gesture at part of it. But the principle underneath, decompose for
session-sized work, review the decomposition before you build, is the thing that
actually saves the cost this whole post is about. That deserves its own piece, and
it's the one I want to write next.

## Next

More to come. But if there's one image from this whole project I'll keep, it's the
two numbers side by side: the cloud cost me seven cents, and the agent that built
it spent 3.38 billion tokens, nearly all of them re-reading itself. Infrastructure
turned out to be almost free. Intelligence is where everything went. The machine
spends almost all of its effort remembering, and almost none of it writing.
