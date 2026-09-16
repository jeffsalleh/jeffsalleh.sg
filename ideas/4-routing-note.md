# Routing note — who gets the JMS material, in what order (internal, not for publication)

Guidance for circulating the JMS findings so it lands as "owner improving the
product," sets up any future external write-up cleanly, and gets the fixes to the
right people.

## Order of circulation

1. **Your directs / the JMS docs + engineering owners first.**
   They own the surfaces that need fixing. Sending here first makes it a working
   document, not a broadcast. Frame: "I dogfooded our Basic Edition on-ramp on a
   personal free-tier project — here's a confirmed defect list and the fixes I want
   us to make." Fastest path to the docs actually improving.

2. **Your management — as an FYI, not an ask.**
   A short heads-up that you did this, what you found, that you're actioning the
   fixes. It's a good-news leadership story, and it quietly lays groundwork for the
   external version later (they'll already know the raw findings were handled
   properly internally first).

3. **Comms / PR — only when you're ready to talk about the EXTERNAL version.**
   Not needed for the internal docs. This is where clearance comes from for any
   public blog post. Having already routed the raw findings internally makes this an
   easier conversation.

## Hold back at each stage

- **Internal:** full works, no softening. Keep the honest "this validates JMS for
  the use case" framing — it's true and it's the right one.
- **External:** strip anything internal entirely — no internal business
  conversations, no on-ramp strategy language, no forward product intentions. The
  public version is a developer boilerplate + honest on-ramp experience, framed
  pro-tool, with doc gaps presented as "things to know" rather than a defect list.

## The perk, used well

You can make these gaps disappear fast because you own the service. That turns the
whole thing from "here's what's wrong" into "here's what I found and here's what we
shipped to fix it." The strongest external post is the one you write AFTER the fixes
land: "I dogfooded my own service, found the rough edges, fixed them, here's the
smooth on-ramp." Find → fix → tell the story. Uniquely available to you because you
own it.

## STATUS (as of 2026-09-03)

Bugs filed and owned by the team (Marcos Pindado). Two real findings confirmed
(JUT+systemd silent failure; ERR_NO_FLEET wrong links / fleet-less-by-default).
Stakeholder FYI note drafted (see 1-stakeholder-fyi-note.md).
