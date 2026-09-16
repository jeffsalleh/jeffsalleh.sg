# Jeff Salleh — blog master plan & ideas
# Reconstructed 2026-09 from conversation history. THIS IS THE MASTER — keep your own copy;
# Claude's container resets between sessions, so whatever you save is the source of truth.

===================================================================
## THE AI-AGENT SERIES — running order & status
===================================================================
A series on rebuilding the Voiddeck Football fantasy app (Singapore Premier League)
by handing an AI agent the whole stack, on the Oracle stack.

1. Part 1 — "I handed an AI agent my whole stack"  ✅ PUBLISHED + promoted
     Shut down a working Firebase app (500+ users, 2 seasons) because of manual
     post-match toil; rebuilt off Firebase onto OCI; agent runs EVERYTHING
     (Terraform, DB, backend, frontend, pipeline, host). Framed as "help me decide
     whether to relaunch" — later answered yes (launched 11 Sep).

2. Part 2 — "Give it eyes"  ✅ PUBLISHED + promoted
     Agent verified via logs/HTTP, couldn't SEE the rendered page. Six invisible UI
     bugs. Fix = "stop reading logs, open the browser and look." THESIS: agent
     defaults to one method; experience is knowing when its default is the slow one.
     Experience = cheapest optimisation in the project. Hero: logs-vs-rendered split.

3. Part 3 — "The day it destroyed production"  ✅ PUBLISHED + promoted
     -auto-approve skipped the plan review; agent destroyed the production host.
     Cheap (pre-launch, all in code, rebuilt). LESSON: not "don't automate" —
     tripwires not seatbelts. Guardrail by CRITICALITY & reversibility, not quantity.
     Hero: terraform plan with one red -destroy line.

4. Part 4 — "I told the AI to escalate its own privileges. It refused."  ✅ PUBLISHED
     (8 Sep). Jeff told it to grant itself a cap; it COULDN'T — anti-prompt-injection:
     authorisation can't come from inside the conversation, even from the real user.
     THESIS: the friction is the point. Security-lead voice. Bridge added: config file
     = possession not identity; wildcard grants too blunt (teed up the security post).
     Hero: "Blocked by classifier" terminal. Classifier quote verbatim. Universal
     framing, not "about Claude."

5. Part 5 — "The stack is the least interesting part"  ← DRAFTED, final edits
     REFLECTION (not architecture-hub). Stack is dull; real question = how much to
     hand an agent, how comfortable, what gotchas, would I recommend it (yes, eyes
     open — "the gotchas are the curriculum"). Includes: observability = "can't
     offload what you can't observe"; PRIVILEGE calibration lesson (under-granted →
     kept blocked → over-corrected to broad grants = the trap; ties to Part 4 from
     the human side); JMS dogfooding as a real driver (day-job, kept safe); ends on
     "when is it enough / more than I anticipated." "Oracle Java" throughout. NOT
     "senior engineer" (Jeff = Senior Director) → "for anyone who's been doing this
     a while."
     TODO before publish: set real date (was 2026-09-11 placeholder — publish a few
     days AFTER match day); decide hero (architecture diagram vs reflection image).

6. Cost post — NEXT after Part 5. "Infra was free, the agent wasn't."
     ~$470 tokens vs SGD 0.00 cloud. Quadratic context growth: end-of-project turn
     cost 5.6x a start turn; output = 0.2% of tokens / 8% of cost; cache reads = 2/3
     of total. "The dominant cost was re-reading the conversation about building it."
     Needs Jeff's real numbers from Anthropic console / /cost.

7. Security / identity / least-privilege deep-dive — Part 4 follow-up.
     (1) authenticate the authorisation not just the artifact; (2) least privilege —
     wildcard blast radius = what injection exploits; (3) up-front capability
     DECLARATION (Jeff's original idea, doesn't exist = safest centrepiece). REFRAME:
     least privilege protects the AGENT from itself too. Line: "scope its power not
     to distrust it, but to protect it — and yourself — from its own competence at
     speed." VERIFIED vs Claude Code docs: fine-grained perms ALREADY EXIST (so
     reframe #2 to "tool supports it, discipline is the hard part"); file-enforcement
     has documented gaps (cite, don't claim discovery); up-front declaration doesn't
     exist.

8. OpenSpec + grill-me — spec-driven dev. OpenSpec great as THINKING tool, weak as
     PROCESS tool (half the workflow ran). Matt Pocock "grill me" skill (aihero.dev).
     Ladder: grill-me (mins) → OpenSpec (days) → DB triggers (permanent) = discovery
     → record → enforcement. WRITE AFTER Jeff runs grill-me on mini-leagues.

9. Capstone — "Where does software begin now?" Roles dissolving; PM hands eng a
     near-complete system; platform engineering's future.

===================================================================
## STANDALONE / INTERLUDE POSTS
===================================================================
- Post X — "Every alarm I added found a bug" (DRAFTED). Observability engineering
  audit: Helidon liveness/readiness trap, CI thread-race, false alarm caught &
  retracted, vantage-point drift.
- Post Y — "My site was lying about itself" (NOT drafted). Self-audit/privacy:
  undeployed Caddyfile, missing access logs, privacy-policy gap, cookie near-miss.
  PDPA beat in SAFE self-audit framing. Sensitive — frame carefully.
- "Joy of building" interlude — light, ~400 words. Friend's AI TikTok player videos
  → thumbnails. The post is that JEFF IS HAVING FUN. Own the geekery. No lesson.
- "Seven cents" — Oracle Cloud free-tier testament (real SGD 0.07 invoice). PUBLISH
  LATER — ripens ("SGD 0.07 after a full SPL season"). Pairs with cost post. Wait
  for a couple more invoices. Frame as personal hobby, not Oracle marketing.

===================================================================
## FROM ENGAGEMENT (Liyana Sulaiman, CPTO — Part 2 comments)
===================================================================
- A — "Conventional vs agentic: is it actually faster?" Capstone territory. Nuance.
- B — "The agent made me an SQE and an SRE again." Bottleneck moves from WRITING to
  TRUSTING; the human's value = quality-eng + reliability instincts. Strong, fresh.
METHOD NOTE: best ideas come from real engagement & off-the-cuff replies. When a
reply surprises even Jeff — that's a post.

===================================================================
## FUTURE JOURNEY THREADS (Jeff, Sep 2026)
===================================================================
- Running an application (operating, not building) — live ops, observability in anger.
- Integrating with others — app ↔ other systems; harder than self-contained build.
- Agents that DO things (THE PAYOFF ARC) — leap from agent-that-builds to agents-that-
  OPERATE; automate the manual post-match work that killed v1. Closes the circle.
  High priority, satisfying narrative payoff.
CONNECTIVE THREAD: steer toward the SCS BoK contribution. "Agents that operate, not
just build" is a distinctive angle most framework writing skips.

===================================================================
## TWO-TRACK STRATEGY (profile-building decision)
===================================================================
TRACK 1 — Reflection series (current). Broad audience, judgment/honesty, code kept
  out of the way. The BRAND.
TRACK 2 — Technical deep-dive series (NEW, later). Practitioner audience, code+config.
  The CREDIBILITY. Candidates: PL/SQL invariant patterns; Terraform structure; deploy
  pipeline; deliberately-non-optimal auto-draft; JMS on-ramp config (day-job line —
  waits for fixes+clearance). Track 2 IS the SCS reference implementation.
WHY: almost no one credibly does BOTH — directors can't code, engineers lack the
  leadership vantage. Both = "senior director who still ships" PROVEN. Cross-link the
  tracks. SEQUENCING: finish Track 1; bank Track 2 titles; launch around SCS approach.

===================================================================
## SCS BODY OF KNOWLEDGE — reference-implementation outreach
===================================================================
Chapters: "Agentic Development: A Pattern Decision Guide" (Shishir Choudhary) — 3
lenses Agency/Dimensionality/Harness; rule "climb only as high as the problem
requires." And "Foundations of Agentic AI" (Linda William, Ester Goh, Kian Eng Ong).
Jeff's series = unwitting WORKED EXAMPLE of their framework (scars match taxonomy).
Hook: Jeff's NTU AI-ethics cert used these as primary refs — cert → scars → framework.
DECISION: FINISH THE SERIES FIRST, then approach authors with a complete, public,
proven artifact. Negotiate from strength; protect authorship. Outreach email drafted
(soft touch; specific praise; "as a personal project" early; 3 failure teasers; tiny
ask). Upgrade "I'm building this" → "I built this" when the series lands.
CAUTIONS: cite authors by name, link SCS, short quotes only; don't let their taxonomy
flatten Jeff's voice.

===================================================================
## JMS DOGFOODING — internal-first, external later (DAY-JOB SENSITIVE)
===================================================================
Jeff OWNS Java Management Service. Dogfooded JMS Basic Edition on the personal
football project. STATUS (3 Sep): 2 bugs verified & FILED, team owns them (Marcos
Pindado). Findings verified vs live docs — several original "defects" were misreads
(docs were right). Real ones: JUT+systemd silent failure (docs gap); ERR_NO_FLEET
wrong links + fleet-less-by-default (product/UX); missing serviceCode index.
Internal docs drafted: triage table, stakeholder note (Jeff's voice, honestly scoped
— "doesn't solve on-prem, but AI can make OCI onboarding easy").
FUTURE JMS CAPS to dogfood (same internal-first playbook): Java Libraries/SBOM
scanning; Crypto roadmap analysis (strongest — forward-looking security); Java
below-baseline / lifecycle mgmt.
EXTERNAL story: find → fix → tell. Waits for fixes + comms clearance. "AI makes JMS
setup easy / skills for the agent" = the SAFE external framing.

===================================================================
## RECURRING PUBLISH MECHANICS
===================================================================
- Publish to site 1-2 days before LinkedIn (warms OG card).
- Promote mid-week Tue/Wed ~9am SGT. ~1 week spacing.
- LinkedIn: link in FIRST COMMENT (thought-leadership) — scheduler doesn't auto-post
  it, add manually. Product/tap-and-play posts = link in body is fine.
- Hero via frontmatter `image:` (renders as hero AND OG). DON'T also add a markdown
  image line (double render). PNG not SVG for OG (LinkedIn won't render SVG cards).
- ALWAYS a real `date:` (YYYY-MM-DD). The 2026-08-XX placeholder BREAKS the build.
- Run URL through linkedin.com/post-inspector before promoting.
- Keep your own copy of THIS file — Claude's container resets.

===================================================================
## SITE FACTS
===================================================================
- Blog: jeffsalleh.sg (Astro, Cloudflare Pages, GitHub jeffsalleh/jeffsalleh.sg).
  Dark default + light toggle. Logo "jeff_salleh". Fonts Sora/Hanken Grotesk/
  JetBrains Mono. Accent #5B9CFF.
- Product: football.voiddeck.sg (LAUNCHED 11 Sep 2026, first SPL match). Helidon +
  Oracle Java + Oracle Autonomous DB + React + OCI + Terraform; rules in PL/SQL
  triggers. OG share-banner.png set (theme #2C5138). Brand: cream bg, checkerboard-
  ball logo, peach + teal-blue squares.
- Published on jeffsalleh.sg: Struan House ("Twenty-five years since Frankston");
  Java Story reaction ("On Netscape, timing, and the work you don't see"); MCP certs
  post; "A new home, and a small experiment"; Parts 1-4 of the agent series.

===================================================================
## NEW FLAGSHIP IDEA — "Decomposing use cases into agent-sized work"
===================================================================
Jeff's original insight (came out of the cost post, Sep 2026). Potentially the
strongest, most original post in the whole series — and a real SCS BoK contribution.

THE ANALOGY: instructing an agent with too much accumulated context is like
over-instructing your children. More history to hold & recollect = slower, more
frustrated, more expensive. The cost post proved it mechanically (98% re-reading);
this is the human truth underneath: retention has a cost; past a point more context
makes the collaborator WORSE.

THE LEAP (the new idea): if long context is the enemy, the SKILL of agent-era dev
becomes decomposing a use case into small, atomic, self-contained tasks that each
fit in a short/cheap session, then integrating them. Not one long conversation
building a whole feature — a use case broken into session-sized units, reassembled.

THE ARCHITECTURAL POINT (the thesis): current SW engineering produces known
artifacts (requirements, design, schemas, contracts, tests...). The agent era needs
a NEW artifact that doesn't quite exist yet / has no settled name: the reviewable
DECOMPOSITION of a use case into agent-sized, integratable units + their sequencing.
Jeff reached for "algorithm" — right instinct, different altitude: not the algorithm
INSIDE a function, but "the algorithm of the work itself" — what gets built, in what
order, with what boundaries, so each piece stays small enough to stay cheap.
Producing & REVIEWING that artifact well is what saves the cost.

NAMING: no settled term. Closest existing: work/task decomposition (too generic),
vertical slicing (closest in spirit, but agile not agent-native). Naming this thing
is a gift for the writer — naming the unnamed is what gets a piece remembered.

RELATIONSHIP TO OPENSPEC (Jeff: "not sure yet, let's think"): Claude's read —
OpenSpec/grill-me are TOOLS/mechanisms (capture decisions, interrogate a plan);
Jeff's idea is the PRINCIPLE above them (why decompose, and that the decomposition
is a new artifact). LIKELY: the decomposition post is the bigger piece and ABSORBS
the OpenSpec material as its "how in practice" section, rather than OpenSpec being a
separate competing post. So the queue may simplify: OpenSpec standalone → folded in.
NOT LOCKED — Jeff wants to think about scope.

PLACEMENT: cost post now teases it (short fold-in + "deserves its own piece, the one
I want to write next"). So this is the NEXT post after cost. Possibly the bridge
between Track 1 (reflection) and Track 2 (technical). Strong SCS-BoK candidate.
