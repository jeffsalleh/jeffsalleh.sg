---
title: "On Netscape, timing, and the work you don't see"
description: "CultRepo just released The Java Story. I'm not in it, but the timeline is my whole working life. A few thoughts on timing, stewardship, and the invisible work that keeps a platform alive."
date: 2026-07-24
tags: ["technology", "leadership", "reflection"]
draft: false
---

![The Java Story — a documentary by CultRepo](/images/the-java-story-hero.jpg)

The Java Story opens with James Gosling — the creator of the Java programming language — saying this:

> _"If I could go back in time and tell the 20-year-old me about the life he was about to have, none of it would make sense."_

A few weeks ago, on the technology-refreshed version of this blog, I wrote something almost exactly like that from the other side of a different door — standing outside my old research office at Monash, twenty-five years after I graduated, and trying to imagine explaining any of this to the version of me who used to spend nights in that room.

Different life. Different door. Same feeling.

That's roughly the frame of mind I sat down to watch **The Java Story** in.

## I'm not in it

I'm not in the documentary. The film is by CultRepo, and it tells the story through the people who were there — Gosling, Joshua Bloch, James Duncan Davidson, Tim Lindholm, Kim Polese, Georges Saab, Brian Goetz, and many others. I joined the Java Platform Group only six years ago. Against a language that's thirty years old, that makes me relatively new.

But watching it, I realised something. I've been inside its timeline my whole working life — and it has quietly shaped both my career and, in a very real sense, my family.

In 1999 I was at Monash, learning to code in a serious way for the first time. Java was five years old. Netscape was the browser most of us used. I'd had programming exposure earlier — GW-BASIC on a home PC as a teen, and then C and C++ dominated my diploma years — and I was comfortable there. But Monash was where object-oriented concepts and Java came at me together, and I struggled. Not with the mechanics of code — I already had that. With the shift in how you _think_ about a program. Objects, classes, inheritance, encapsulation — a whole new mental model I hadn't needed before.

Something eventually clicked. The concepts stopped feeling foreign. The code stopped fighting me. For the first time, I felt like I was writing software instead of wrestling syntax.

My final-year project was an applet running in Netscape, built with my team for a high school in Frankston. Educational software, delivered through a browser, on a language that was still finding its identity. I enjoyed every day of that project. My honours thesis went deeper — I wrote cryptographic libraries in J2ME (Java 2 Micro Edition), and rebuilt the J2ME virtual machine to run on Palm OS handhelds. I ran the final system on a PalmPilot and a Compaq iPAQ. That work led directly to my first job at a small Melbourne startup, and shortly after to A*STAR's Java Wireless Competency Center back in Singapore.

Somewhere in the world at that same moment, Gosling and his team were making the case that if they missed one specific window — Netscape shipping the JVM in the browser, developers reaching for something better than C++, the internet needing a real platform — they were in trouble. He knew it in his bones. He said so on stage. And he was right.

I got my first job because of Java. I raised my family mastering the platform. Every meaningful chapter since — Oracle Asia R&D, storage products, media platforms, and now a cloud service — has been on Java, near Java, or shoulder-to-shoulder with people who live in it.

I'm not in the story. I've just been living inside its timeline the whole time.

## Timing, honestly

Gosling talks about timing a few times in the film. The version I keep coming back to is this: _"The timing of Java was a little bit of luck and a little bit of foresight."_

That's an honest sentence. It's not a heroic origin myth. It's not "we built the future"; it's "we saw a window and we ran through it, and it might not have worked."

The doc doesn't hide how thin the margin was. Java came within a **three-day hotfix** of dying on stage before it even launched. The team had been laid off. Bill Joy had to claw the layoffs back. Time Warner picked someone else. They pirated a T3 line into the building because Sun's official infrastructure couldn't handle the traffic when things suddenly worked.

None of that shows up in the marketing story of a platform that now runs on three billion devices. But it's the actual story. Timing gave them the door. What they did next — the frantic, unglamorous, occasionally-illegal work of being ready when it opened — is why any of it exists.

That's a lesson that keeps compounding as you get more senior. Timing gets the door open. Craft is what walks through it. And usually, nobody watches you walk.

## The line I keep thinking about

Near the end of the film, Georges Saab — my SVP — says something that I think is the whole ethic of Java in one sentence:

> _"For most engineers, a goal is to be invisible. To not disrupt people's lives, to solve problems before people even see them."_

Java is thirty years old. It didn't survive because of Netscape. It survived because generations of engineers kept doing invisible work — the garbage collectors that only get noticed when they misbehave, the JIT improvements you only see in a benchmark, the security patches shipped on Tuesdays because Tuesdays are when security patches ship. The compatibility deprecations argued over for years. The bug hunts that never made a press release.

Most of that work is done by people I'll never meet, on projects the public will never hear the names of. And every credit card in a pocket, every hospital IT system, every Netflix microservice — three billion devices, more than ten million developers, thirty years of quiet, load-bearing code — depends on those invisible hands.

Watching the film, I thought about how strange a thing that is to steward.

## Steward

There's another line in the film, from Georges again:

> _"To be a steward of something is to do much more than just develop new features. A steward has to look out for the entire platform all the time. A steward also has to have empathy, be able to put yourselves in the shoes of a working Java programmer."_

The film also captures Brian Goetz in a moment of honesty about the Java 8 lambdas work — the change that arguably saved the language after a decade of stagnation:

> _"I came into work every day and asked myself: is today the day I'm going to make a billion-dollar mistake?"_

I read that as one of the most senior engineers in the world admitting that the weight doesn't get lighter with rank. It gets heavier. And the maturity is in showing up anyway, every day, and doing the boring careful work, and not looking for applause.

That's what stewardship actually costs.

## Six years in

I lead a Java Management Service on Oracle Cloud Infrastructure. My team is spread across several geographies, working on a service I'm genuinely proud of, with people I care about. It's the work of a lifetime for a lot of us. It also sits on top of thirty years of a platform I didn't build and hundreds of people I didn't know who kept it alive between the visible moments.

Six years in. Not new anymore, but relatively new. Still learning from the same people who are now, remarkably, my colleagues — and, in Georges' case, my boss. What still catches me off guard is their generosity. When I have an idea I'd like to prototype on the platform, or a rough thought I need to pressure-test, they give me their time. Real time. From people whose calendars belong to a language billions depend on. That's the part of Java I didn't understand until I was inside it.

The best I can do, most days, is try to be one of the invisible hands too. Do the quiet work. Look out for the platform. Try to leave it a little better than I found it, so someone in 2050 can inherit it the way I inherited it in 2020.

## Watch it

If Java has been part of your story — as a student, as a developer, or as a user of any of the billions of devices it runs on — I think you'll find something in _The Java Story_. It's about a platform, but it's really about a community, and the very ordinary people who kept catching it every time it nearly fell.

To James Gosling — thank you for betting on the moment, and for building a language that quietly held up my whole working life before I ever met anyone who worked on it.

And to my colleagues in the Java Platform Group today — the people I get to build with, learn from, and lean on: you are the reason this platform is still here, thirty years in. It's a privilege to be among you.
