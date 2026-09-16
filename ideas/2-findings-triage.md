# JMS Basic Edition on-ramp — verified findings (triage)

**Author:** Jeff Salleh · **Date:** 2026-09-03 · **Audience:** JMS docs + engineering owners

I enabled JMS Basic Edition on a personal free-tier project (Helidon / Oracle JDK
25, single A1 Always Free instance, agent-driven), using only public docs and the
API, no internal shortcuts, to see the on-ramp as an outside developer does.

**Good news first:** it works, on Always Free, at SGD 0.00, and an AI agent stood
it up end to end from our public surface alone. Inventory and Java Usage Tracker
are both flowing.

The session surfaced several rough edges. I've since verified each one against the
current published docs, and dropped the ones that turned out to be my own misreads
rather than real gaps. The docs were more correct than my mid-debugging notes
assumed (see the "verified out" note at the end). What remains below are the
findings that hold up. Since we own these surfaces, I'd like to resource the real
fixes directly.

## Findings worth a ticket

| # | Finding | Fix type | Where | Sev | Status |
|---|---|---|---|---|---|
| A | **No serviceCode troubleshooting index.** A missing policy, a missing fleet attachment, and a plugin-recognition failure all surface as the same opaque 404, distinguished only by an internal serviceCode (NotAuthorizedOrNotFound / ERR_NO_FLEET / ERR_UNRECOGNIZED). Nothing public maps these to cause and resolution; diagnosis required reading the plugin's own log on the instance. | Docs (new page) | New troubleshooting reference: serviceCode → cause → resolution | Med | Verified — no such index found in public docs |
| B | **Java Usage Tracker vs systemd hardening — silent failure.** A service with ProtectSystem=strict and an unlisted ReadWritePaths for the JUT log dir produces zero signal anywhere (no JVM error, no journal line, no JMS-side error). Applications simply stays at 0. JUT/JMS docs don't mention systemd sandboxing at all. Found only by eliminating every other variable and reading the unit file. | Docs | JUT setup docs — add a ReadWritePaths note for modern EL9+ systemd hardening and call out the silent-failure mode | Med | Verified — no mention in current docs. Increasingly common on EL9+; strongest finding |
| C | **The OCA plugin auto check-in registers the plugin fleet-less by default.** CreateJmsPlugin returns 200, the plugin is visible on both console and API, but it sits INACTIVE/NEEDS_ATTENTION, unattached to any fleet, because the automatic flow never supplies --fleet-id. Attaching it is a separate manual step (jms-plugin update --fleet-id, or "Add Managed Instance" in the console). | Product / UX | Product: should the auto flow attach to a fleet, or is fleet-less-by-default intended? If intended, the required follow-up step belongs on the documented happy path, not troubleshooting. | Med–High | Confirmed real on console + API. A shipped console enhancement now surfaces this state more clearly, so the open question is design intent (auto-attach vs deliberate two-step). |

## One finding to confirm before ticketing

| # | Finding | Why hold | Next step |
|---|---|---|---|
| D | ERR_NO_FLEET check-in error appeared to link to the wrong page (creating-fleet.html rather than plugin-attach guidance). | Rests on my session log; error help-links are runtime metadata I can't confirm from public docs, and the onboarding experience has been actively improving. | Reproduce on the current build; confirm the link target before raising. |

## A working reference config (available)

The session produced a working, fully-commented Terraform module (fleet.tf) for
Basic Edition on Always Free — log group, custom log, fleet
(is_advanced_features_enabled = false), an instance-scoped dynamic group, and a
verified policy set with a per-statement comment. Clean basis for an official
quickstart if we want one. Audit events and plugin logs available.

## Suggested next step

Raise A, B, and C — A and B as docs tickets, C as a product/UX question. Confirm D
against the current console first. Happy to raise the tickets myself or hand off
per surface.

---

## Verified out (for transparency, not tickets)

Three items from the raw session notes did NOT survive checking against the live
docs. Recording them so no one re-raises them:

- **`service jms` vs `resource jms SERVER-COMPONENTS`.** The canonical
  policy-statements.html is correct throughout; it never uses `service jms`. The
  error came from assuming the `service <name>` pattern by analogy and not checking
  the page. Our process miss, not a docs defect.
- **"Policy statements scattered, no single complete list."** manual-setup-oci-jms.html
  Step 5 does provide a single consolidated Basic-Edition policy block and
  cross-links to the reference pages. Not a defect; at most a minor discoverability
  point.
- **"manage log-groups needed but docs only say read."**
  resolving-jms-fleet-health-issues.html explicitly documents
  `ALLOW RESOURCE jms SERVER-COMPONENTS TO MANAGE log-groups` (Option 3) for exactly
  the fleet-health symptom hit. Documented, just on the troubleshooting page rather
  than the base policy page. Mild cross-reference nit at most.
