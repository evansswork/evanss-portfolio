// @ts-check
// ============================================================
//  PLAYBOOK — section "How I make content that works"
//  Empat langkah; tiap langkah punya layar HP sendiri (visual: research | hook | edit | measure)
//  dan tautan ke case study sebagai bukti.
// ============================================================

/** @type {import('./types').Playbook} */
export const playbook = {
  steps: [
    {
      visual: 'research',
      title: 'Research',
      lead: 'Find what already works',
      text: 'Trend and competitor analysis, prime-time checks and the questions the audience keeps asking, before a single frame is shot.',
      tools: ['TikTok analytics', 'Instagram insights', 'Competitor scans'],
      proof: 'case:jackarmy',
      proofLabel: 'See it in JackArmy & Araulla',
    },
    {
      visual: 'hook',
      title: 'Hook',
      lead: 'Write the first three seconds first',
      text: 'Every script follows hook, build-up, payoff, with the call to action planned from the start instead of tacked on at the end.',
      tools: ['Scripts', 'Story beats', 'CTAs'],
      hookText: 'Raffi Ahmad pake parfum Youthentic Celestial Drift',
      proof: 'case:digiflix',
      proofLabel: 'See it in Digiflix ID',
    },
    {
      visual: 'edit',
      title: 'Edit',
      lead: 'Cut for retention',
      text: "Fast pacing, captions, sound design and transitions, adapted to each platform's algorithm and the creator's own voice.",
      tools: ['Pacing', 'Captions', 'Sound design'],
      proof: 'case:stimuler',
      proofLabel: 'See it in Stimuler',
    },
    {
      visual: 'measure',
      title: 'Measure',
      lead: 'Keep what wins, scale it',
      text: 'Read the insights, double down on formats that reach non-followers, and turn what works into SOPs the whole team can repeat.',
      tools: ['Insights', 'Live SOPs', 'Iteration'],
      proof: 'case:youthentic',
      proofLabel: 'See it in Youthentic',
    },
  ],
};
