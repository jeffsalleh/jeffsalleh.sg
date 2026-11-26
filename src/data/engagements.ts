// The master list of Jeff's external engagements: panels, firesides, talks,
// workshops, judging, hosting and media.
//
// - Newest first is not required: the Speaking page sorts by date.
// - `date` can be a full date (2026-11-19), a month (2023-07) or a year (2024).
// - `public: false` keeps an entry in this list but off the website.
// - `post` is a blog slug. The link only shows once that post is published.
// - The Engagements index in Google Drive keeps the prep folders and notes.

export type EngagementType =
  | 'panel'
  | 'fireside'
  | 'talk'
  | 'workshop'
  | 'moderator'
  | 'host'
  | 'judge'
  | 'organiser'
  | 'mentoring'
  | 'media';

export const TYPE_LABELS: Record<EngagementType, string> = {
  panel: 'Panel',
  fireside: 'Fireside',
  talk: 'Talk',
  workshop: 'Workshop',
  moderator: 'Moderator',
  host: 'Host',
  judge: 'Judge',
  organiser: 'Organiser',
  mentoring: 'Mentoring',
  media: 'Media',
};

export interface Engagement {
  date: string;
  title: string;
  event?: string;
  organiser: string;
  /** Short organiser name, used to count distinct organisers. */
  org: string;
  type: EngagementType;
  role: string;
  where?: string;
  summary: string;
  post?: string;
  link?: { label: string; url: string };
  public: boolean;
}

export const engagements: Engagement[] = [
  {
    date: '2026-11-30',
    title: 'Shaping opportunity: technology and the future of work',
    event: "Asia's Rising Circle (Edition 2)",
    organiser: 'Singapore International Foundation, with Google',
    org: 'SIF',
    type: 'fireside',
    role: 'Fireside chat speaker',
    where: 'Google Singapore',
    summary:
      "Part of SIF's learning journey to Google: what technology is changing about work, and how to stay ready for what comes next.",
    public: true,
  },
  {
    date: '2026-11-26',
    title: 'Crisis communication in the age of AI',
    event: 'CET1014 Crisis Management and Essential Services',
    organiser: 'Singapore University of Social Sciences',
    org: 'SUSS',
    type: 'talk',
    role: 'Guest lecturer',
    where: 'SUSS',
    summary:
      'A guest lecture for community volunteers on how AI changes crisis communication: how it works and fails, fakes and how to prove what is real, how much human control AI needs, engineering for failure, and what AI agents could change next.',
    public: true,
  },
  {
    date: '2026-11-19',
    title: 'Agility and effective management in the age of disruptions',
    event: 'Team Lead Programme',
    organiser: 'SMU Executive Development',
    org: 'SMU',
    type: 'fireside',
    role: 'Fireside dialogue with Lawrence Chua, moderated by Dr Faisal Aman',
    where: 'Singapore Management University',
    summary:
      'The closing dialogue for team leads from eight organisations and six nationalities: staying agile, leading through capacity cuts, and bringing a team along when the direction changes.',
    post: 'buy-in-on-the-destination-not-the-route',
    public: true,
  },
  {
    date: '2026-10-31',
    title: "Muslim Professionals' Summit 2026",
    event: 'Flagship panel',
    organiser: 'AMP Singapore',
    org: 'AMP',
    type: 'panel',
    role: 'Panellist',
    where: 'Marina Bay Sands',
    summary:
      'AI and careers, in front of about 750 professionals. The top-voted question went unanswered on the day, so I answered it on the blog.',
    post: 'the-question-we-ran-out-of-time-for-final-candidate',
    public: true,
  },
  {
    date: '2026-10-11',
    title: 'Career Potential Unlocked: the private sector',
    event: 'Session 1 of 3',
    organiser: 'Malay Muslims in Tech',
    org: 'MMiT',
    type: 'workshop',
    role: 'Workshop lead',
    where: 'Online',
    summary:
      'For tech professionals five to ten years in: staying an individual contributor or moving into management, growing as a senior IC, and making your work visible.',
    public: true,
  },
  {
    date: '2026-10-01',
    title: "Interview ahead of the Muslim Professionals' Summit",
    organiser: 'AMP Singapore, with Make Good Studio',
    org: 'AMP',
    type: 'media',
    role: 'Interviewee',
    summary: 'Pre-summit interview.',
    // Add the published link, then set public to true.
    public: false,
  },
  {
    date: '2026-09-01',
    title: 'Alumni to Student Mentoring 2026',
    organiser: 'Monash University',
    org: 'Monash',
    type: 'mentoring',
    role: 'Mentor to two IT students',
    where: 'Online',
    summary:
      "Mentoring two Monash IT students through the university's alumni programme: career direction, CV reviews and the first steps into industry.",
    public: true,
  },
  {
    date: '2026-05-26',
    title: 'Postgraduate Industry Experience Expo',
    organiser: 'Monash University, Faculty of IT',
    org: 'Monash',
    type: 'judge',
    role: 'Judge',
    where: 'Online',
    summary: "Judged postgraduate IT projects at my alma mater's virtual expo.",
    public: true,
  },
  {
    date: '2026-05-25',
    title: 'AI awareness for RRG counsellors',
    organiser: 'MHA and the Religious Rehabilitation Group',
    org: 'RRG',
    type: 'workshop',
    role: 'Facilitator',
    where: 'Khadijah Mosque',
    summary:
      'A hands-on session on how AI works, where it can mislead, and how the young people they counsel are already using it.',
    public: true,
  },
  {
    date: '2026-05-06',
    title: 'Run Java better on OCI',
    event: 'Java Summit 2026',
    organiser: 'Oracle (internal)',
    org: 'Oracle',
    type: 'talk',
    role: 'Speaker',
    summary: 'Internal event.',
    public: false,
  },
  {
    date: '2026-05',
    title: 'Video feature on the outgoing Professional Networks co-leads',
    organiser: 'Yayasan MENDAKI Professional Networks',
    org: 'MENDAKI',
    type: 'media',
    role: 'Featured',
    summary: 'Social media video feature.',
    // Add the published link, then set public to true.
    public: false,
  },
  {
    date: '2025-11-29',
    title: 'ACG Youth Forum 2025',
    organiser: 'PPIS, with MHA',
    org: 'PPIS',
    type: 'panel',
    role: 'Panellist; resource person for the fireside session',
    summary:
      'Spoke on the opening panel, then joined a podcast-style fireside chat to take questions from the young participants.',
    public: true,
  },
  {
    date: '2025-09-22',
    title: 'Taking your career global',
    event: 'Informal sharing with SGLN Fellows',
    organiser: 'MENDAKI Professional Networks',
    org: 'MENDAKI',
    type: 'talk',
    role: 'Speaker',
    where: 'Catapult',
    summary:
      'What the Singapore Leaders Network fellowship taught me about leading beyond Singapore.',
    post: 'ground-control-to-major-tom',
    public: true,
  },
  {
    date: '2025-09-19',
    title: 'Digital Tech x Public Policy Dialogue',
    organiser: 'Yayasan MENDAKI Professional Networks',
    org: 'MENDAKI',
    type: 'panel',
    role: 'Panellist; closing remarks',
    where: 'Google Singapore',
    summary:
      'A panel with Google and EDB, moderated by MDDI, on building a future-ready, citizen-centric digital nation.',
    public: true,
  },
  {
    date: '2025-09-13',
    title: 'MARA Convention 2025',
    event: 'Career panel',
    organiser: 'MENDAKI Club',
    org: 'MENDAKI Club',
    type: 'panel',
    role: 'Panellist',
    summary: 'A career panel for young Malay-Muslim students and professionals.',
    public: true,
  },
  {
    date: '2025-07-23',
    title: 'AI adoption and community impact, with Dr Waleed Kadous',
    organiser: 'MENDAKI Professional Networks (Tech)',
    org: 'MENDAKI',
    type: 'host',
    role: 'Host; moderated the closed-door session',
    summary:
      'A closed-door dialogue with leaders from MENDAKI, AMP, PPIS, MUIS and Wak Tanjong Mosque, then an open session for the community.',
    post: 'the-algorithmic-ink-where-singapore-muslim-leaders-and-techies-design-the-blueprint-for-values-driv',
    public: true,
  },
  {
    date: '2025-03-23',
    title: 'Mosque Tech Challenge 2025',
    organiser: 'Mosque Tech Challenge, sponsored by MENDAKI Professional Networks',
    org: 'Mosque Tech Challenge',
    type: 'judge',
    role: 'Judge',
    where: 'Al-Mawaddah Mosque',
    summary:
      "Judged youth hackathon teams on the theme of nurturing families, for relevance, technical innovation and business potential.",
    public: true,
  },
  {
    date: '2025-02-08',
    title: 'OMS Summit 2025: collaboration through tech',
    event: 'Breakout session 3',
    organiser: 'MUIS One Mosque Sector',
    org: 'MUIS',
    type: 'moderator',
    role: 'Panel moderator',
    where: 'Singapore Expo',
    summary:
      'Moderated a panel on collaboration through technology and effective communication, for mosque leaders, staff and partners.',
    public: true,
  },
  {
    date: '2024-11-09',
    title: 'Community and Partner Meetup',
    organiser: 'MENDAKI Professional Networks (Tech)',
    org: 'MENDAKI',
    type: 'host',
    role: 'Host',
    summary:
      'Shared our plans for the tech network and, mostly, listened: tech professionals, VCs, tech societies, non-profits and government in one room.',
    post: 'sikit-sikit-lama-lama-jadi-bukit',
    public: true,
  },
  {
    date: '2024-09-15',
    title: 'MARA Convention 2024',
    event: 'Career advisory panel',
    organiser: 'MENDAKI Club',
    org: 'MENDAKI Club',
    type: 'panel',
    role: 'Panellist',
    summary: 'Career advice for young Malay-Muslim professionals and students.',
    public: true,
  },
  {
    date: '2024',
    title: 'Top 5 things SRE should consider to scale cloud operations',
    event: 'DevOpsDays Singapore 2024',
    organiser: 'DevOpsDays Singapore',
    org: 'DevOpsDays',
    type: 'talk',
    role: 'Ignite speaker',
    summary: 'Twenty auto-advancing slides on what it takes to run cloud operations at scale.',
    public: true,
  },
  {
    date: '2023-12-02',
    title: 'Progress: climbing the corporate ladder',
    event: 'MARA Convention 2023',
    organiser: 'MENDAKI Club',
    org: 'MENDAKI Club',
    type: 'fireside',
    role: 'Fireside chat speaker',
    where: 'Suntec Convention Centre',
    summary:
      'For up to 150 young professionals: setting career goals, building the skills to progress, and holding on to your values on the way up.',
    public: true,
  },
  {
    date: '2023-07',
    title: 'My whys',
    organiser: 'Oracle Volunteers, at Temasek Junior College',
    org: 'Temasek JC',
    type: 'talk',
    role: 'Speaker',
    summary:
      'What keeps me going, told through photos from my own journey, for volunteers and student leaders.',
    post: 'reflecting-on-my-whys-23',
    public: true,
  },
  {
    date: '2022-08',
    title: "Satisfying the '-ilities' of an enterprise cloud service",
    event: 'Learning Festival 2022',
    organiser: 'NUS-ISS',
    org: 'NUS-ISS',
    type: 'talk',
    role: 'Speaker',
    summary:
      "Why 'feature done' isn't done: the seven qualities a cloud service has to prove before it is allowed to run.",
    post: 'satisfying-the-illities-of-an-enterprise-cloud-service',
    public: true,
  },
  {
    date: '2021-11',
    title: "A fantasy league for the Singapore Premier League",
    organiser: 'TODAY, reported by NTU journalism students',
    org: 'TODAY',
    type: 'media',
    role: 'Interviewee',
    summary: 'A full-length feature on the Voiddeck Football fantasy league we built for local football.',
    post: 'voiddeck-football-covered-in-the-local-news',
    public: true,
  },
  {
    date: '2021-09-04',
    title: 'Re:Work Career Conversation: Digital Economy',
    organiser: 'MENDAKI Club',
    org: 'MENDAKI Club',
    type: 'panel',
    role: 'Panellist',
    where: 'WeWork Funan',
    summary:
      'A panel and four breakout groups on getting into tech, personal branding, and landing the right job.',
    post: 'speaking-at-mendaki-club-s-re-work-initiative',
    public: true,
  },
  {
    date: '2019-09-28',
    title: 'Future Forward: Career Critique Convention',
    organiser: 'The Codette Project and MSociety, sponsored by MENDAKI Club',
    org: 'The Codette Project',
    type: 'talk',
    role: 'Speaker, two sessions',
    where: 'Lifelong Learning Institute',
    summary:
      'Two 20-minute talks for ITE, polytechnic and university students on growing in tech, and what teams look for when they hire.',
    public: true,
  },
  {
    date: '2019-07-14',
    title: 'Women-only hackathon',
    organiser: 'The Codette Project',
    org: 'The Codette Project',
    type: 'judge',
    role: 'Judge',
    summary: "Judged The Codette Project's women-only hackathon.",
    public: true,
  },
  {
    date: '2019-03',
    title: 'Autonomous data explosion',
    event: 'Oracle OpenWorld Asia',
    organiser: 'Oracle',
    org: 'Oracle',
    type: 'talk',
    role: 'Lightning talk, with Julian Dontcheff (Accenture)',
    where: 'Singapore',
    summary:
      "A lightning talk on the autonomous database: I opened, then handed over to Accenture's Julian Dontcheff for the technical deep dive.",
    post: 'oracle-open-world-singapore-2019',
    public: true,
  },
  {
    date: '2017-08',
    title: "Graduates' Tea 2017",
    organiser: 'MENDAKI Club',
    org: 'MENDAKI Club',
    type: 'mentoring',
    role: 'Table facilitator',
    summary: 'Hosted a table of new graduates for career conversations.',
    public: true,
  },
  {
    date: '2017-05',
    title: 'Me + Mak + Nenek',
    event: 'Computer literacy workshops',
    organiser: 'The Codette Project',
    org: 'The Codette Project',
    type: 'workshop',
    role: 'Content adviser',
    summary:
      'Four Saturday workshops in English and Malay for elderly women and their daughters, run for Mother\'s Day. I advised on the slides, handouts and the "Staying Safe" booklet.',
    public: true,
  },
  {
    date: '2016-12-10',
    title: 'Career + Tech Workshop',
    event: 'The first one',
    organiser: 'MENDAKI Club',
    org: 'MENDAKI Club',
    type: 'talk',
    role: 'Speaker, for Void Deck Ventures',
    summary:
      "Void Deck Ventures' story, shared with one of our young engineers: building technology for mosques and non-profits, and mentoring fresh grads along the way.",
    public: true,
  },
  {
    date: '2016-12-10',
    title: 'Attendance tracking at Al-Amin Mosque',
    event: 'Mosque sector symposium, North East cluster',
    organiser: 'MUIS',
    org: 'MUIS',
    type: 'talk',
    role: 'Presenter, for Void Deck Ventures',
    summary:
      'A one-year trial of card-scan attendance and parent alerts across four aLIVE classes, and what we would build next.',
    public: true,
  },
  {
    date: '2016-06-12',
    title: 'Mosque Tech Challenge 2016',
    organiser: 'Mosque Tech Challenge',
    org: 'Mosque Tech Challenge',
    type: 'judge',
    role: 'Judge',
    summary: 'Judged the hackathon teams building technology for mosques.',
    public: true,
  },
  {
    date: '2015-07',
    title: 'Mosque Tech Challenge 2015',
    organiser: 'Mosque Tech Challenge, with MENDAKI Club',
    org: 'Mosque Tech Challenge',
    type: 'organiser',
    role: 'Co-organiser',
    summary: 'Helped run a 24-hour hackathon during Ramadan to build technology for mosques.',
    public: true,
  },
];

/** Sortable key: missing month or day sorts to the start of its period. */
export function sortKey(date: string): string {
  const [y, m = '00', d = '00'] = date.split('-');
  return `${y}-${m}-${d}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "19 Nov", "Nov" or "" for a year-only date. */
export function shortDate(date: string): string {
  const [, m, d] = date.split('-');
  if (!m) return '';
  const mon = MONTHS[Number(m) - 1];
  return d ? `${Number(d)} ${mon}` : mon;
}

/** "19 Nov 2026", "Nov 2026" or "2026". */
export function longDate(date: string): string {
  const y = date.split('-')[0];
  const s = shortDate(date);
  return s ? `${s} ${y}` : y;
}

/** Stable anchor id for an engagement, used by /speaking#id links. */
export function anchorId(e: Pick<Engagement, 'date' | 'title'>): string {
  const slug = e.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '');
  return `${e.date}-${slug}`;
}
