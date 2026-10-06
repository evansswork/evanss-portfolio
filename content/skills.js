// @ts-check
// ============================================================
//  SKILLS
//  tools : kartu berlogo (kind: 'code' = masuk kategori Technical di CV)
//  tools : kartu berlogo yang berjalan (marquee 2 baris, arah berlawanan).
//          icon = kunci dari src/data/icons.js
//  sticker: pil warna-warni (hard + soft skill), warna diacak otomatis
// ============================================================

/** @type {import('./types').Skills} */
export const skills = {
  tools: [
    { icon: 'tiktok', name: 'TikTok Shop & Live', note: 'campaign, live ops, host SOP' },
    { icon: 'instagram', name: 'Instagram', note: 'reels, stories, growth' },
    { icon: 'youtube', name: 'YouTube', note: 'scripts & long-form' },
    { icon: 'shopee', name: 'Shopee', note: 'catalog & promo' },
    { icon: 'canva', name: 'Canva', note: 'design & decks' },
    { icon: 'obs', name: 'OBS Studio', note: 'live broadcast' },
    { icon: 'klaviyo', name: 'Klaviyo', note: 'email & flow analytics' },
    { icon: 'python', name: 'Python', note: 'deep learning projects', kind: 'code' },
    { icon: 'tensorflow', name: 'TensorFlow', note: 'model training', kind: 'code' },
    { icon: 'javascript', name: 'JavaScript', note: 'web interactivity', kind: 'code' },
    { icon: 'html', name: 'HTML', note: 'semantic markup', kind: 'code' },
    { icon: 'css', name: 'CSS', note: 'responsive layout', kind: 'code' },
    { icon: 'tailwind', name: 'Tailwind CSS', note: 'utility-first UI', kind: 'code' },
    { icon: 'leaflet', name: 'Leaflet.js', note: 'interactive maps', kind: 'code' },
    { icon: 'laravel', name: 'Laravel', note: 'web platforms', kind: 'code' },
    { icon: 'php', name: 'PHP', note: 'backend', kind: 'code' },
    { icon: 'git', name: 'Git & GitHub', note: 'version control', kind: 'code' },
  ],
  // cv: 'tech' | 'soft' (kosong = marketing & content) → kategori di CV
  // Klik stiker → panel "where I used this". proof: 'case:<slug>' | 'xp:<id>' | 'go:#selector'
  stickers: [
    { label: 'Content strategy', proof: ['case:stimuler', 'case:youthentic', 'case:natashagan'] },
    { label: 'Social media marketing', proof: ['case:natashagan', 'case:stimuler', 'xp:kjp'] },
    { label: 'Digital Marketing', proof: ['case:youthentic', 'xp:kjp', 'xp:ayaco', 'case:natashagan'] },
    { label: 'Copywriting', proof: ['xp:crypto', 'case:digiflix', 'case:youthentic'] },
    { label: 'Video Editing', proof: ['case:stimuler', 'case:natashagan', 'case:kokoparfum'] },
    { label: 'Livestreaming', proof: ['case:youthentic', 'xp:kjp', 'case:jackarmy'] },
    { label: 'E-commerce', proof: ['case:youthentic', 'xp:kjp'] },
    { label: 'Pricing', proof: ['case:youthentic'] },
    { label: 'SEO', proof: ['case:stimuler'] },
    { label: 'Analytics', proof: ['case:stimuler', 'case:jackarmy', 'case:natashagan'] },
    { label: 'Recruitment', proof: ['case:youthentic', 'xp:petra-esports'] },
    { label: 'Scriptwriting', proof: ['case:digiflix', 'case:stimuler'] },
    { label: 'Trend research', proof: ['case:stimuler', 'case:jackarmy', 'case:digiflix'] },
    { label: 'Machine learning', cv: 'tech', proof: ['case:fair-price-finder', 'xp:dbs'] },
    { label: 'Algorithms', cv: 'tech', proof: ['case:fair-price-finder', 'xp:dbs'] },
    { label: 'Database', cv: 'tech', proof: ['case:elite-scrim', 'case:spaceshare'] },
    { label: 'Debugging', cv: 'tech', proof: ['xp:cks', 'case:spaceshare'] },
    { label: 'Leadership', cv: 'soft', proof: ['xp:petra-esports', 'case:youthentic'] },
    { label: 'Communication', cv: 'soft', proof: ['xp:petra-esports', 'xp:crypto'] },
    { label: 'Creativity', cv: 'soft', proof: ['case:stimuler', 'case:youthentic'] },
    { label: 'Multitasking', cv: 'soft', proof: ['go:#xp-timeline'] },
    { label: 'Teamwork', cv: 'soft', proof: ['xp:wgg', 'case:spaceshare', 'case:elite-scrim'] },
    { label: 'Adaptability', cv: 'soft', proof: ['go:#xp-timeline', 'case:natashagan'] },
    { label: 'Crisis management', cv: 'soft', proof: ['xp:petra-esports', 'xp:wgg'] },
    { label: 'Organization', cv: 'soft', proof: ['xp:cks', 'xp:exhit'] },
  ],
};
