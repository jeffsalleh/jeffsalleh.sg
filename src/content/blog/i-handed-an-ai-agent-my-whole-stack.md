---
title: "I handed an AI agent my whole stack"
description: "Two seasons ago I shut down a fantasy football app with 500+ users because the operational toil wasn't worth it. Last week I rebuilt it on the Oracle stack — and let an AI agent run everything. Part 1 of a series."
date: 2026-08-17
tags: ["technology", "ai", "engineering"]
image: "/images/vdf-banner-1600.png"
draft: false
---

## The version that worked, and why I stopped

A couple of years ago I built a fantasy football platform for Voiddeck Football
— the small community of local footie fans I've written about before. It was
built around the Singapore Premier League, and it ran for two seasons. Five
hundred-plus registered users, and on any given match day around sixty percent
of them were active — making score predictions, rating players, arguing about
both.

It worked. People used it. And I shut it down anyway.

The reason is one every engineer will recognise: **the toil wasn't worth it.**
The app itself ran fine, but the post-match work was semi-manual. There were no
clean APIs to pull match results, so every week I was hand-feeding data into the
system to make the scoring work. A working product, quietly strangled by
operational overhead. So I turned it off.

That version ran on Firebase — Firestore for data, Firebase Auth for sign-in,
Cloud Functions for the logic, a React frontend on top. It was a good fit for
getting something live quickly. It was also a stack I didn't really control, and one that abstracted away
exactly the infrastructure parts I now wanted to understand and explore
hands-on with AI agents — the IAM, the networking, the pipelines, the host
itself.

## Why I rebuilt it — and rebuilt it *here*

Last week I brought it back. But not as a straight revival. I moved the whole
thing off Firebase and onto the Oracle Cloud Infrastructure (OCI) stack — and I
did it to answer a question I care about professionally.

I lead a cloud service at Oracle built around Java and OCI. I spend my days
around this technology. So the question I actually wanted to answer was: **can I
replicate, on the stack I steward, the same speed that AI-assisted development
gives me everywhere else?**

Because the honest truth is that the *first* version died of infrastructure
toil. In the pre-AI world, doing this "properly" — writing the infrastructure,
deploying it, wiring the connections, managing the database, building the
pipeline — is a lot of undifferentiated work. It's exactly the kind of work that
made version one not worth continuing.

So the rules of the experiment were deliberate:

- **The agent runs everything.** Not "AI helps me write code" — that was last
  year's experiment. This time Claude Code got the whole stack: the Terraform,
  the database, the backend, the frontend, the delivery pipeline, and the live
  host. My job was to direct, review and decide, not to type.
- **Oracle JDK 25 on Oracle Linux 9, Oracle Database, OCI.** The platform I work
  with, tested personally, on my own time, on a real project.
- **OCI Always Free.** A real cloud with real IAM and real constraints, at zero
  cost — so mistakes stay cheap, the problems are genuine rather than simulated,
  and anyone reading this can replicate it without a bill.
- **Business logic in the database.** The scoring cascade, guards and deadlines
  live in PL/SQL triggers — a deliberate inversion of the Firebase model, where
  logic lived in Cloud Functions. If correctness lives in the database, it
  doesn't depend on which client is writing.

Moving from Firestore's document model to a relational schema with the rules
enforced in the database is, philosophically, almost the opposite of how the
Firebase version was built. That turned out to matter more than I expected —
but that's a later post.

## Five days later

**[football.voiddeck.sg](https://football.voiddeck.sg)** is live. TLS 1.3,
Google and Facebook sign-in, a fantasy team you can create and have auto-drafted
for you, a working predictions flow, and a pipeline that builds, tests,
publishes and deploys with no human in the loop.

Forty-eight commits over five days. Total cloud bill: **SGD 0.00.**

The agent didn't just write application code. It provisioned, diagnosed and
repaired infrastructure it hadn't built. It caught a free-tier policy change
that would have terminated my instance and resized it in time. It built a full
OCI DevOps pipeline. It set up TLS with Caddy and Let's Encrypt. At one point it
destroyed the production host — genuinely, irrecoverably — and then rebuilt the
service from scratch.

That last sentence deserves its own post. It gets one.

## What surprised me

Three things I didn't see coming, each of which becomes its own post in this
series:

- **The biggest bottleneck wasn't intelligence. It was sight.** For most of the
  project the agent could check HTTP responses but couldn't see what a page
  actually *rendered*. Six bugs shipped in a row with the same shape — until two
  minutes of setup gave it a browser, after which a bug that had been invisible
  all week was found and fixed in five.
- **The infrastructure was free. The agent was not.** The session logs let me
  measure exactly what the AI itself consumed — and where that cost came from
  reframed how I think about working with agents entirely. The single most
  expensive thing in the project wasn't building anything.
- **The database was right the whole time.** Every correctness bug lived in the
  layers above the triggers. The oldest advice in enterprise software turned out
  to be the best advice for the agent era too.

## The professional thread

I'll be honest that this isn't only a hobby. It's also a way to answer, with
first-hand evidence rather than slideware, a question my team and my management
actually care about: what does agent-run development on the Oracle stack really
look like — the speed, the failure modes, the cost, the guardrails you need?

The next layer is operating it properly. A live service needs observability and
management — and OCI has a growing set of capabilities for exactly that.
Analytics, monitoring, and Java Management Service are among the options I'm
considering as I take this from "it runs" to "it runs well and I can see
inside it." That's a thread I'll pick up later in the series.

## What's next

This is Part 1. Coming up:

1. **Give it eyes** — why observability, not reasoning, was the real limit.
2. **The day it destroyed production** — an honest post-mortem of the worst
   moment.
3. **What the agent actually cost** — real numbers, a surprising shape.
4. **Before the first line of code** — specs, relentless interviews, and where
   decisions get made now.
5. **Where does software begin?** — what this means for the roles the industry
   is built around.

## And if you want to help me decide

Here's the honest part: I haven't decided whether to actually relaunch this for
the community. The old version had a real following, but it also had real toil
behind it, and I want to be sure the rebuild genuinely solves that before I ask
people to invest a season in it again.

So the site is live, but think of it as a working prototype I'm gathering
feedback on rather than a finished launch. If you're part of the Voiddeck
Football crowd — or just want to try a fantasy platform that one person and one
AI rebuilt in a week — sign in with Google or Facebook at
[football.voiddeck.sg](https://football.voiddeck.sg), have a team drafted for
you, and tell me what you think. Whether I bring it back for the new season
depends partly on what you tell me.

One note if you go poking around: player data is simulated for now, and stays
that way until the clubs officially publish their squads for the season. The
foundations are deliberately built to grow — mini-leagues, the manual squad
picker, and real match data are the next things I'd add if this goes ahead.

How I'd add them is part of the experiment too. I want to try building the next
round with a spec-driven workflow (OpenSpec) and something I've been meaning to
put to use: Matt Pocock's "grill me" skill, a deceptively simple prompt that has
the AI interview you relentlessly about a plan before a line of code gets
written. It's a tiny thing — a few lines — but it points at something bigger
about where a feature actually begins now. That's a whole post later in this
series; you'll be able to watch me try it out on this site in real time.

Fair warning: mini-leagues aren't built yet, the manual squad picker doesn't
exist, and the free-transfer tile is missing because I'd rather show nothing
than show an invented number. That honesty is rather the theme of this whole
series.
