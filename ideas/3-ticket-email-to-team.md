Subject: JMS on-ramp — a UX/docs issue worth a ticket (with evidence)

Hi [name],

I spent a session last week enabling JMS Basic Edition on a personal free-tier
project (a small Java service on a single Always Free instance), deliberately using
only our public docs and API, to see the on-ramp the way an outside developer
would. Good news first: it works, it's free, and it came up end to end.

Along the way I hit one issue I think is worth a ticket, because it'll trip up
anyone onboarding a plugin the same way. I've got verbatim logs for all of it (in
the repo, pointers at the bottom); this note is just the readable version.

The core problem

When the OCA plugin auto-registers, CreateJmsPlugin returns 200, but the plugin
comes up fleet-less. Every hourly check-in after that then fails with a 404
(serviceCode ERR_NO_FLEET), and the error message's own links point at the wrong
fixes:

  - one link sends you to "create a fleet", but the fleet already exists
  - the other sends you to install the Management Agent, a different mechanism
    entirely, not the OCA-plugin path actually in use

Neither link mentions the thing that actually fixes it: manually attaching the
plugin to the fleet (jms-plugin update --fleet-id). That's a step the automatic
flow never performs on its own, so a developer following the happy path lands in a
loop with no signposted way out.

On my instance this repeated identically 12 times over ~3 hours before I worked out
the fix by hand. Once attached, the plugin went RUNNING and check-ins have been
clean (204) ever since.

Two smaller things, same area

1. Missing serviceCode index. Three different failures during the session all
   surfaced as visually-identical 404s, distinguishable only by an internal
   serviceCode (NotAuthorizedOrNotFound, ERR_NO_FLEET, ERR_UNRECOGNIZED). There's
   no single troubleshooting table mapping those codes to cause and fix. Worth
   noting one of the three (ERR_UNRECOGNIZED) does link somewhere useful, so it's
   really just ERR_NO_FLEET that's the outlier.

2. Design question, not just docs. Is fleet-less-by-default the intended behaviour?
   If it is, the required follow-up (attach to fleet) should be part of the
   documented happy path rather than surfaced only as a 404 later. If it isn't,
   auto-attach would remove the whole problem.

What I'd suggest

File one ticket covering the ERR_NO_FLEET links (the clear defect) and fold in the
serviceCode-index gap. The design question can ride along or be split out. I'm
happy to raise it myself against your tracker, or hand it over.

One I'm holding back

There's a second finding (Java Usage Tracker going silent under systemd hardening)
that I think is real and increasingly common on EL9+, but I don't currently have
clean live proof; the log rotated. I'd rather not send it until I can back it
properly, so I've left it out for now. Happy to chase it down separately if useful.

Reproduction, for reference: create a fleet, enable the OCA plugin, and never call
jms-plugin update --fleet-id. The auto-registration flow produces the ERR_NO_FLEET
message on its own, every check-in.

Genuinely a good experience overall. This is the one rough edge worth smoothing.
Happy to walk through any of it.

Thanks,
Jeff
