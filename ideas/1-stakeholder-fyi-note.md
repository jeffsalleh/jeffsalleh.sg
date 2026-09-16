Subject: Dogfooding JMS setup on OCI — findings filed, and where AI helps

Hi all,

Sharing something I did over the last week, in case it's useful.

I set up JMS Basic Edition on a personal free-tier project — a small Java service
on a single Always Free instance — going through the public docs and API only, no
internal shortcuts, to see our on-ramp the way an outside developer would.

It works, it runs on Always Free at no cost, and it came up end to end. Our
Terraform support and APIs held up well enough that I drove the whole setup with an
AI agent.

Going through it hands-on turned up a couple of real rough edges: a silent-failure
mode in usage tracking under hardened systemd, and a misleading error message
during plugin registration. I verified both against real logs before raising
anything, and the team has picked them up to file the fixes.

The part worth flagging: JMS setup has been a challenge for customers for years,
especially on-premise. This exercise doesn't solve that, and I want to be clear
it's a narrower result. But for customers already running Java workloads on OCI, I
think AI-assisted onboarding can make getting started genuinely easy. The agent did
most of the work; where it needed steering, those spots are capturable as reusable
skills so the next person doesn't hit them. That's a real, achievable win, and it's
worth pursuing.

More as it develops. Happy to walk anyone through it.

Thanks,
j.
