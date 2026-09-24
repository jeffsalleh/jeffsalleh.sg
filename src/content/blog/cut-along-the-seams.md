---
title: "Cut along the seams"
description: "The cost of building with an agent is the length of the conversation. So the real skill is knowing where to cut a use case into pieces. I found the cut isn't where I expected: not between backend and frontend, but wherever the work first changes a promise to the outside world."
date: 2026-09-24
tags: ["technology", "ai", "engineering"]
image: "/images/seams-hero.png"
draft: false
---

This follows on from [the cost post](/post/for-every-token-it-wrote/), which ended on a promise. I'd found that the expensive part of building with an agent isn't the code, it's the length of the conversation, and that the fix is to keep sessions short and scoped. Which raises the obvious question: how do you actually do that? How do you cut a use case into pieces small enough to build in a short session and still have them fit back together?

I went looking through my own project for the answer, expecting to find that I'd been splitting work the way we're all taught to in Computer Science school, by layer: database, then backend, then frontend. This is a classic 3-tier architecture pattern in the web development module that shows up during exams and expected in our assignments. That's not what I found, at least not until I started working with AI agents. The good decompositions cut somewhere else entirely, and once I saw where, it changed how I think about the whole exercise, at the same time reflecting and questioning what I've learned and internalised to be a Software Development Lifecycle.

## The thing without a name

When we design software we produce artifacts, and most of them have names. The requirements. The design. The schema. The test plan. In fact, it is ingrained in many of those in my generation of the 7 structural and 7 behavioural UML diagrams, where 3 (Use Case, Class Diagram and Sequence Diagram) "survived" the "modern engineering" of the recent agile/microservices era. Each is a recognised thing you can point at, review, and hand to someone.

There's one artifact in that lineage I don't think has a settled name, and it turns out to matter more in the agent era than it used to: the plan for how a use case gets broken into small, buildable pieces, and the order they come together in. Not what the system does, that's the design. Not whether it works, that's the tests. How the work itself is carved up.

We've always done this, informally, in our heads or on a whiteboard. What changed is that with an agent, doing it well and doing it explicitly is suddenly worth real money, because a good split is what keeps each session short, and short sessions are what keep the cost down. The thing we used to do by instinct now deserves to be a real, reviewable artifact.

The interesting question isn't whether to decompose. Everyone agrees you should. The interesting question is *where you cut*.

## Where I thought the cut was, and where it actually was

The obvious place to cut is by logical layer. Build the database changes, then the backend, then the frontend. It feels clean because it matches how the code is organised and how we used to design our systems, and in many places still do.

But look at how my best-behaved features actually got split. Here's the task plan for adding a Telegram broadcast to the site, verbatim from the spec:

> Three commits. Commit 1: the outbox, with nothing on the other end. Commit 2: send it, and say so on the Privacy page. Commit 3: withdrawals, and the deadline post.

That's not database-backend-frontend. Commit 1 builds a queue that does nothing. Commit 2 is the one that matters, and the spec says exactly why the boundary sits there: it's the commit that *first sends anything to a third party*, so it's the one that changes what the site is doing with people's data, and the one that has to update the Privacy page in the same breath.

The seam wasn't between layers. It was at the point where the work first changed a promise to the outside world.

I can put a number on it. That whole Telegram feature, the spec plus all three commits plus two same-day bugfixes, eight commits across a single unbroken six-hour sitting, cost **$65.26** in agent usage at list rates. And even for a feature that stayed on topic from the first minute to the last, look at where the money went: $3.69 of it was output, the code the agent actually wrote, $19.88 was cache writes, and **$41.69, nearly two-thirds, was cache reads**, the agent re-reading the conversation so far. That is the same shape as the last post, at feature scale. Roughly eight dollars a commit, most of it spent remembering.

I found the same cut everywhere I'd decomposed well. Every notification feature I built split on the same line: the commit that first reaches a third party, or first collects new data, shipped as its own reviewable unit, with the legal and user-facing consequences handled right there and nowhere else. The boundary was never "backend versus frontend." It was "does this change the contract with the user, yet?"

## A unit is the smallest slice that's either fully inert or fully real

Once I saw the pattern, I could state what a good unit actually is. It's the smallest slice of work that is either **fully inert**, it ships and changes nothing anyone can observe, like that empty outbox, or **fully real**, it ships and does the whole thing including its consequences. And it has one crisp answer to a single question: *does this touch a third party or collect new data yet, or not?*

That question is the seam. Cut there and each piece is independently shippable and independently true or false. You can build it in one short session, review it on its own, and know exactly what it does and doesn't change. Commit 1 changes nothing, so it carries no risk and needs no privacy update. Commit 2 changes everything at once, so its consequences are all in one place where a reviewer can see them.

Cut anywhere else, halfway through the thing that reaches Telegram, say, and you get a piece that's neither inert nor real. It half-touches the outside world. Now the consequences are smeared across two commits, the privacy implication is ambiguous, and the session has to hold both halves in its head at once, which is exactly the long, expensive context the cost post was about.

## What it looks like when you don't do this

I have a clean counter-example in the same project, because I skipped this on one feature and paid for it.

The new fantasy league manager onboarding flow was planned as a task list of about thirty-five items, and every one of them was, in some sense, "part of onboarding." That sounds like a decomposition. It isn't. "Part of onboarding" is a *topic*, not a unit. There was no line in the plan that said *this* is the slice that's inert and *that* is the slice that goes real. So there was nowhere for the work to stop.

And it didn't stop. That feature became a single session of roughly fifteen hours that mixed the actual onboarding work with two unrelated infrastructure fixes, spun off an entirely separate change midway through when one endpoint's shape didn't match what a screen already expected, and included a run of commits that were just fixing what the previous commit in the same session had broken. The session sprawled because the plan gave it no seams to stop at.

Here's the part that surprised me when I went back and counted. The onboarding work *itself* wasn't expensive. The direct build, the spec and the first real push plus the manual squad picker that spun off it, came to about **$87.01** at list rates, close to Telegram's $65.26. Onboarding was not inherently a costlier feature. But because the session never closed, it kept absorbing unrelated work on the same growing context, and by the time that window finally ended it had run to **$189.69**. Around $146 of that was work that had nothing to do with onboarding, riding along in a context that just kept getting more expensive to re-read. The feature didn't cost more. The *sprawl* did.

Put the two side by side. The Telegram feature's task plan drew its boundaries at the contract seams, and those boundaries became the actual commit boundaries; each commit stood on its own. The onboarding plan drew its boundaries around a topic, and the work ran until it exhausted itself. Same project, same agent, same me. The only difference was where, and whether, the plan cut.

## Two kinds of hygiene, and the one that did the work

Here's the thing I only saw once I had the numbers in front of me, and it sharpened the whole idea for me.

You might assume the difference between $65 and $190 is simply that one was a short session and the other a long one. That was the lesson of the cost post: keep sessions short. But that isn't what happened here. Both of these features were built inside the *same* twelve-day, continuously-running conversation. Neither was a clean, fresh, short session. Telegram wasn't cheap because the session was short. It was cheap because, even deep inside a long-running session, its work had seams, so it stayed on topic for its whole window and then stopped.

That splits into two separate disciplines that are easy to conflate:

- **Session hygiene** is what the cost post was about: keep the conversation short, close the loop, start fresh, so the context you re-read on every turn stays small.
- **Task hygiene** is what this post is about: cut the work along its seams, so each piece has a clear place to stop, whether or not the session around it is short.

The important discovery is that they're independent. Telegram had task hygiene *without* session hygiene, and task hygiene alone was enough to keep it cheap and clean. Onboarding had neither, and the absence of seams is precisely what let its session run wild in the first place. Good seams don't just make each piece cheaper to build. They give a session permission to end, which is the thing that actually caps the cost.

And to be clear that the session cost is real and not abstract: the manual squad picker, which spun off the onboarding work as its own two commits over about two and a quarter hours, still cost **$43.21**, two-thirds of Telegram's entire eight-commit feature, from 84 assistant turns. Almost all of it was cache reads, the agent re-reading accumulated context it was dragging along. Two commits, two hours, forty-three dollars, mostly spent remembering. That is the compounding cost from the last post, showing up again inside this one, and it is exactly what good seams contain.

## Being honest about the tool and the mess

Two key notes, because a tidy version of this would be deceiving.

First, plans survive contact with reality only mostly. That clean three-commit Telegram split? Commit 1's verification step forced a real write through the new trigger, and that write tripped over a genuine pre-existing bug elsewhere, which got fixed in the same commit. So the plan was three clean units; reality was three units plus one incidental bug-fix that only surfaced *because* building the inert piece made me exercise it for real. That's not a failure of the decomposition. It's what decomposition is for: the inert piece flushed out a real bug before the live piece shipped on top of it.

Second, I used a tool, OpenSpec, to write these plans down, and I want to be honest about how I used it. As a thinking tool it was excellent. Writing the split forced decisions that coding-first would have made silently. On one feature the spec made me argue explicitly against the obvious reading of my own request, and record why it was wrong, a decision that, coded directly, I'd very plausibly have gotten wrong with no trace that an alternative was ever considered. That is the real value: the plan drags implicit decisions into daylight before they're baked into code by default.

But as a *process* tool I only ran half of it. OpenSpec has an archive step: once a change ships, you're meant to fold its spec into the permanent record and archive the proposal. I did that zero times. Every shipped feature's plan is still sitting in the "changes" folder, never archived, the permanent spec never updated. The discipline that captures the decisions for the *next* person was the discipline I let slide under momentum. So take my endorsement with that caveat: the thinking half paid for itself many times over; the bookkeeping half, I didn't sustain. *(P.S. I have since made sure I archive them.)*

## What to call it

So, the name, because I think this deserves one and the usual words don't fit.

"Work breakdown" is too generic; it describes chopping any big thing into smaller things and says nothing about where the cut goes. "The spec" is the decisions, the *what*, not the carving of the work. "Vertical slicing," from agile, is the nearest in spirit but predates all of this and carries a ceremony that doesn't map onto "sized for a short agent session."

For a while I wanted to call the artifact an "execution spec," a peer to the design spec and the test spec: the design says what to build, the tests say how you'll know it works, the execution spec says how the work is cut up and sequenced to get built. That's a fair name for the document.

But the document isn't the insight. The insight is *where you cut*, and the evidence kept pointing at one word. These aren't arbitrary task boundaries. They're **seams**: the natural lines where a piece of work becomes either fully inert or fully real, where the contract with the user changes or doesn't. Good decomposition isn't breaking work into small pieces. It's finding the seams and cutting along them.

So that's what I'll call it. **Cut along the seams.** Find the line where the work first changes a promise to the outside world, make that its own unit, and let the inert scaffolding ship ahead of it carrying no risk. The document that records those cuts can be an execution spec if you like. The skill is seeing the seams.

I'm not precious about the word, and if you've got a better one I'd like to hear it, because the thing itself is real whether we name it well or not. We're all going to be producing these, and reviewing them, far more than we used to.

## Why this matters beyond a hobby project

Step back. In the agent era a growing share of the value an engineer adds is not writing the code, which the agent does faster than we can, but deciding how the work should be shaped so the agent can build it well and cheaply. And the shaping has a right answer more often than it feels like it should. Cut along the seams, where the contract changes, and the pieces are cheap, reviewable, and integrate cleanly. Cut across them, around a topic, and the work sprawls and the cost balloons.

Knowing where a problem's seams are, which requires actually understanding the domain and its consequences, is exactly the kind of judgment that doesn't go away when the typing is automated. If anything it becomes the main event. The agent can build any piece you hand it. Deciding what the pieces are is still the job.

Domain knowledge and implementation experience go a long way here. They help with how to break the work down, and then with the ability to connect the dots. This is where AI is still lacking: keeping context, recalling fast without having to pay for it (how beautiful is the human mind, and how grateful I am to have one for free). I mentioned at the start about parenting, and AI is like giving my kids clear, short instructions. It matters. This is one thing you won't experience in any module of any computer science course. Never thought parenting skills would be applicable in the AI world. So if you're not a parent, be one; if you are a parent, have more agents. I mean children. It will help you navigate the AI world better.

P.S. PM Lawrence Wong, you can thank me later for this TFR plug for Singapore.
