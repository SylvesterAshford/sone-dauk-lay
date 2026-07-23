// Content pack — ONE vocabulary, ONE scenario pool, ONE progress model (design v4 §2).
// Ported from the confirmed San Dauk Lay prototype. Bundled JSON, never network-fetched.
// All Burmese strings are DRAFTS pending native-speaker review (PRD §13) — they live
// here, not hardcoded in components, so review lands without code changes.

export type Bi = { mm: string; en: string };
export type TechniqueId =
  | "urgency"
  | "authority"
  | "emotion"
  | "doctored"
  | "expert"
  | "context";

export type Technique = {
  id: TechniqueId;
  mm: string;
  en: string;
  tellMm: string;
  tellEn: string;
  kw: RegExp; // offline "built-in checklist" matcher — NOT AI
};

export const TECHNIQUES: Technique[] = [
  {
    id: "urgency",
    mm: "အရေးပေါ် ဖိအား",
    en: "Fake urgency",
    tellMm: "စစ်မှန်သော ဘဏ်တစ်ခုသည် သင့်ကို အချိန်ကန့်သတ်၍ မတိုက်တွန်းပါ။",
    tellEn: "A real bank never gives you a countdown.",
    kw: /(urgent|immediat|within 24|24 hour|deadline|act now|right now|expire|suspend|lock|hurry|last chance|အရေးပေါ်|ချက်ချင်း|၂၄|ယနေ့)/i,
  },
  {
    id: "authority",
    mm: "အတုအယောင် အာဏာ",
    en: "False authority",
    tellMm: "ရာထူး၊ တံဆိပ်တွေက အလွယ်တကူ တုပလို့ရတယ်။ အမည်ကို သီးခြားစစ်ပါ။",
    tellEn: "Titles and logos are easy to fake — verify the name separately.",
    kw: /(bank|official|government|ministry|police|account|verify|customer service|support|ဘဏ်|အစိုးရ|တရားဝင်|ရဲ|အကောင့်)/i,
  },
  {
    id: "emotion",
    mm: "စိတ်လှုပ်ရှား ဆွဲဆောင်မှု",
    en: "Emotional bait",
    tellMm: "ဒေါသ သို့ ကြောက်စိတ် ရုတ်တရက် ဖြစ်လာရင် ခဏရပ်ပါ။",
    tellEn: "If a message suddenly makes you angry or afraid, pause.",
    kw: /(congratulat|winner|you won|prize|free gift|reward|lottery|help|dying|emergency|shocking|ဆုမဲ|ဂုဏ်ယူ|အခမဲ့|အကူအညီ)/i,
  },
  {
    id: "doctored",
    mm: "ပြင်ဆင်ထားသော ပုံ/သံ",
    en: "Doctored media",
    tellMm: "ပုံ တစ်ပုံတည်းနဲ့ မယုံပါနဲ့။ မူရင်းကို ရှာပါ။",
    tellEn: "Don't trust one image alone — look for the original.",
    kw: /(photo|image|video|leaked|footage|screenshot|recording|ဓာတ်ပုံ|ဗီဒီယို|ပုံ)/i,
  },
  {
    id: "expert",
    mm: "အတု ကျွမ်းကျင်သူ",
    en: "Fake expert",
    tellMm: "တကယ့် ကျွမ်းကျင်သူဆို စစ်ဆေးလို့ရတဲ့ အထောက်အထား ရှိတယ်။",
    tellEn: "A real expert leaves evidence you can check.",
    kw: /(doctor|expert|specialist|study|proven|scientist|professor|research|ဆရာဝန်|ကျွမ်းကျင်|သုတေသန)/i,
  },
  {
    id: "context",
    mm: "အကြောင်းအရာ လွဲ",
    en: "Out of context",
    tellMm: "ပုံ မှန်ပေမဲ့ ဇာတ်လမ်း လွဲနေတတ်တယ်။ ဘယ်ကလဲ မေးပါ။",
    tellEn: "The image can be real but the story wrong — ask where it is from.",
    kw: /(share|forward|breaking|happening now|right now in|viral|spread|ဝေမျှ|ဖြန့်|ယခု)/i,
  },
];

export const techniqueById = (id: TechniqueId) =>
  TECHNIQUES.find((t) => t.id === id)!;

export type Track = { n: number; mm: string; en: string; accent: string };
export const TRACKS: Track[] = [
  { n: 1, mm: "နည်းစနစ် ၆ ခု", en: "The six techniques", accent: "var(--color-track-1)" },
  { n: 2, mm: "AI နှင့် တုပမီဒီယာ", en: "AI & synthetic media", accent: "var(--color-track-2)" },
  { n: 3, mm: "သတင်း မှန်ကန်မှု", en: "Information integrity", accent: "var(--color-track-3)" },
];

export type MasteryState = "not_met" | "met" | "practised" | "mastered";

export type Platform =
  | "sms" | "facebook" | "messenger" | "telegram" | "viber" | "call" | "tiktok";

export type Scenario = {
  id: string;
  platform: Platform;
  sender: string;
  meta: string;
  body: Bi;
  genuine: boolean;
  techniques: TechniqueId[];
  // The fragment doing the manipulating + why (for the "look closer" reveal).
  evidence?: { fragmentMm: string; noteMm: string; noteEn: string };
  difficulty?: 1 | 2 | 3;
};

// Youth-Myanmar scenario pool. DRAFT Burmese pending native review (PRD §13).
// NO real people, brands, working URLs, or payment handles — fictional but plausible.
// Sensitive material (sextortion, self-harm, money-already-sent) is NEVER here; it
// belongs to the Lens escalation only.
export const SCENARIOS: Scenario[] = [
  // --- gaming / giveaways (what teens actually get) ---
  { id: "sc-freefire", platform: "facebook", sender: "Free Diamonds MM", meta: "Facebook · 1h", genuine: false, techniques: ["emotion", "authority"], difficulty: 1,
    body: { mm: "🎮 အခမဲ့ Diamond ၅၀၀၀! သင့် game ID နဲ့ password ကို comment မှာ ရေးပြီး ချက်ချင်း ယူလိုက်ပါ။", en: "🎮 Free 5000 Diamonds! Drop your game ID and password in the comments to claim now." },
    evidence: { fragmentMm: "password ကို comment မှာ ရေး", noteMm: "Password တောင်းတာ = လှည့်ကွက်။ တကယ့် game က ဘယ်တော့မှ မတောင်းပါ။", noteEn: "Asking for your password is the trick — no real game ever does." } },
  { id: "sc-kpop", platform: "messenger", sender: "K-Ticket Giveaway", meta: "Messenger · 2h", genuine: false, techniques: ["emotion", "urgency"], difficulty: 1,
    body: { mm: "ဂုဏ်ယူပါတယ်! Concert လက်မှတ် အခမဲ့ ၂ စောင် ပေါက်ပါပြီ။ ယနေ့ည ၁၂ နာရီ မတိုင်မီ အချက်အလက် ဖြည့်ပါ။", en: "Congrats! You won 2 free concert tickets. Fill in your details before midnight tonight." },
    evidence: { fragmentMm: "ယနေ့ည ၁၂ နာရီ မတိုင်မီ", noteMm: "အချိန်ကန့်သတ်ချက်က ဝမ်းသာမှုနဲ့ ရောပြီး တွေးချိန် မပေးအောင် လုပ်တာ။", noteEn: "The deadline rides your excitement so you act before you think." } },
  { id: "sc-tiktok-ban", platform: "tiktok", sender: "TikTok Support", meta: "TikTok · now", genuine: false, techniques: ["authority", "urgency"], difficulty: 1,
    body: { mm: "တရားဝင် အသိပေးချက် — သင့် TikTok အကောင့်ကို ၂၄ နာရီအတွင်း ပိတ်ပါမည်။ ဤနေရာတွင် အတည်ပြုပါ။", en: "Official notice — your TikTok account will be disabled within 24 hours. Verify here." },
    evidence: { fragmentMm: "၂၄ နာရီအတွင်း ပိတ်ပါမည်", noteMm: "အကောင့် ဆုံးရှုံးမှာ ကြောက်စိတ်နဲ့ အမြန်နှိပ်ခိုင်းတာ။ တရားဝင် platform က link နဲ့ မတောင်းပါ။", noteEn: "Fear of losing your account rushes you. Real platforms don't ask via a link like this." } },
  { id: "sc-fb-ban", platform: "facebook", sender: "Facebook Security", meta: "Facebook · now", genuine: false, techniques: ["authority", "urgency"], difficulty: 2,
    body: { mm: "သင့် အကောင့်တွင် မူပိုင်ခွင့် ချိုးဖောက်မှု တွေ့ရှိသည်။ ၁၂ နာရီအတွင်း အယူခံမဝင်ပါက အကောင့် ပိတ်ပါမည်။", en: "A copyright violation was found on your account. Appeal within 12 hours or it will be disabled." },
    evidence: { fragmentMm: "၁၂ နာရီအတွင်း အယူခံမဝင်ပါက", noteMm: "တရားဝင်ဟန်နဲ့ ခြိမ်းခြောက်တာ — အမည်၊ လိပ်စာကို သီးခြား စစ်ပါ။", noteEn: "An official-sounding threat — verify the sender through the real app, not the link." } },
  // --- money / jobs ---
  { id: "sc-parttime", platform: "telegram", sender: "Online Job MM", meta: "Telegram · 3h", genuine: false, techniques: ["expert", "emotion"], difficulty: 2,
    body: { mm: "အိမ်မှာနေရင်း တစ်ရက် ၅၀,၀၀၀ ကျပ် ဝင်ငွေ! အတည်ပြုပြီးသား ကုမ္ပဏီ။ စရိတ် ၁၀,၀၀၀ သာ ဦးစွာ ပေးရန်။", en: "Earn 50,000 Ks/day from home! Verified company. Just pay a 10,000 Ks joining fee first." },
    evidence: { fragmentMm: "စရိတ် ၁၀,၀၀၀ သာ ဦးစွာ ပေးရန်", noteMm: "အလုပ်တစ်ခုက ဝင်ဖို့ ငွေ တောင်းတာ မဟုတ်ဘူး။ ရှေ့ပြေး စရိတ် = လှည့်ကွက်။", noteEn: "A real job pays you — it doesn't charge you to join. An upfront fee is the tell." } },
  { id: "sc-crypto", platform: "facebook", sender: "Verified Trader U Bo", meta: "Facebook · 5h", genuine: false, techniques: ["expert", "emotion"], difficulty: 2,
    body: { mm: "ကျွန်တော် အတည်ပြုထားတဲ့ ကုန်သည်။ ၇ ရက်အတွင်း သင့်ပိုက်ဆံ နှစ်ဆ တိုးစေမယ်။ အာမခံပါတယ်။", en: "I'm a verified trader. I'll double your money in 7 days. Guaranteed." },
    evidence: { fragmentMm: "နှစ်ဆ တိုးစေမယ်။ အာမခံ", noteMm: "“အာမခံ” + “နှစ်ဆ” = ရင်းနှီးမြှုပ်နှံမှုမှာ တကယ့်ကျွမ်းကျင်သူ ဘယ်တော့မှ မပြောပါ။", noteEn: "\"Guaranteed\" + \"double\" — no real expert promises that about money." } },
  { id: "sc-kbzpay", platform: "sms", sender: "KBZ-Pay", meta: "SMS · now", genuine: false, techniques: ["authority", "urgency"], difficulty: 2,
    body: { mm: "သင့် Wallet ကို ယာယီ ပိတ်ထားသည်။ ပြန်ဖွင့်ရန် သင်ရရှိသော OTP ကုဒ်ကို ဤနံပါတ်သို့ ပြန်ပို့ပါ။", en: "Your wallet is temporarily locked. To reopen it, reply with the OTP code you received." },
    evidence: { fragmentMm: "OTP ကုဒ်ကို ... ပြန်ပို့ပါ", noteMm: "OTP က သင့်အကောင့်ရဲ့ သော့။ ဘယ်ဘဏ်မှ OTP ကို မတောင်းပါ။", noteEn: "Your OTP is the key to your account — no bank ever asks for it." } },
  { id: "sc-parcel", platform: "sms", sender: "Delivery", meta: "SMS · 1d", genuine: false, techniques: ["authority", "urgency"], difficulty: 1,
    body: { mm: "သင့်ထံ ပါဆယ်တစ်ခု ရောက်ရှိနေသည်။ အခွန် ၃,၀၀၀ ကျပ် ချက်ချင်း မပေးပါက ပြန်ပို့ပါမည်။", en: "You have a parcel waiting. Pay 3,000 Ks customs now or it will be returned." },
    evidence: { fragmentMm: "အခွန် ၃,၀၀၀ ကျပ် ချက်ချင်း", noteMm: "မမှာထားတဲ့ ပါဆယ်အတွက် ငွေ တောင်းတာ သံသယ ဖြစ်ပါ။", noteEn: "Being charged for a parcel you didn't order should raise doubt." } },
  // --- authority / school ---
  { id: "sc-scholarship", platform: "messenger", sender: "Scholarship Board", meta: "Messenger · 4h", genuine: false, techniques: ["authority", "emotion"], difficulty: 2,
    body: { mm: "ဂုဏ်ယူပါတယ်! သင် ပညာသင်ဆု ရရှိပါပြီ။ လုပ်ဆောင်ခ ၂၀,၀၀၀ ကျပ် ပေးပြီး နေရာ အတည်ပြုပါ။", en: "Congratulations! You've been awarded a scholarship. Confirm your place with a 20,000 Ks processing fee." },
    evidence: { fragmentMm: "လုပ်ဆောင်ခ ၂၀,၀၀၀ ကျပ် ပေးပြီး", noteMm: "တကယ့် ပညာသင်ဆုက ငွေ ပေးခိုင်းတာ မဟုတ်ပါ။", noteEn: "A real scholarship never charges you to receive it." } },
  { id: "sc-examleak", platform: "telegram", sender: "Exam Helper", meta: "Telegram · 2d", genuine: false, techniques: ["emotion", "authority"], difficulty: 3,
    body: { mm: "မေးခွန်း ကြိုတင် အဖြေ ရနိုင်ပါပြီ! ယနေ့ ၅,၀၀၀ ကျပ်နဲ့ ဝယ်ပါ။ နောက်ကျရင် ကုန်ပါပြီ။", en: "Get the exam answers in advance! Buy today for 5,000 Ks. Sold out if you're late." },
    evidence: { fragmentMm: "နောက်ကျရင် ကုန်ပါပြီ", noteMm: "ရှားပါးမှုနဲ့ အမြန်ဆုံး ဆုံးဖြတ်ခိုင်းတာ — ပြီးတော့ တရားမဝင်တဲ့ ကိစ္စ။", noteEn: "Manufactured scarcity to rush you — and it's a dishonest offer to begin with." } },
  // --- doctored / context ---
  { id: "sc-deepfake", platform: "facebook", sender: "Viral Clips", meta: "Facebook · 6h", genuine: false, techniques: ["doctored", "expert"], difficulty: 3,
    body: { mm: "နာမည်ကြီး ကြယ်ပွင့်တစ်ဦး ဒီ app ကို ထောက်ခံနေတဲ့ ဗီဒီယို — ကိုယ်တိုင် ကြည့်လိုက်ပါ။", en: "A video of a famous celebrity endorsing this app — see it for yourself." },
    evidence: { fragmentMm: "ကိုယ်တိုင် ကြည့်လိုက်ပါ", noteMm: "AI က မျက်နှာ/အသံ ပြောင်းနိုင်ပြီ။ တစ်နေရာတည်းက ဗီဒီယိုကို မယုံနဲ့။", noteEn: "AI can swap faces and voices now — don't trust a lone video." } },
  { id: "sc-oldphoto", platform: "telegram", sender: "Breaking MM", meta: "Telegram · now", genuine: false, techniques: ["context", "emotion"], difficulty: 2,
    body: { mm: "ယခုပဲ ဖြစ်နေတာ! ဒီဓာတ်ပုံကို ချက်ချင်း ဝေမျှပါ။ မဖြန့်ရင် နောက်ကျသွားမယ်။", en: "Happening right now! Share this photo immediately. You'll be too late if you don't." },
    evidence: { fragmentMm: "မဖြန့်ရင် နောက်ကျသွားမယ်", noteMm: "အမြန်ဖြန့်ချင်စိတ်က ဒီဇိုင်းလုပ်ထားတာ။ ပုံမှန်ပေမဲ့ အချိန်/နေရာ လွဲနိုင်တယ်။", noteEn: "The urge to share fast is engineered — a real photo can be from another time." } },
  { id: "sc-miracle", platform: "messenger", sender: "Health Group", meta: "group · 1d", genuine: false, techniques: ["expert"], difficulty: 2,
    body: { mm: "ဆရာဝန်တစ်ဦး အတည်ပြုသည် — ဒီ ဆေးဖက်ဝင် အရွက်က ရောဂါ အားလုံး ပျောက်စေသည်။", en: "A doctor confirms — this herb cures every illness." },
    evidence: { fragmentMm: "ဆရာဝန်တစ်ဦး အတည်ပြုသည်", noteMm: "အမည် စစ်လို့မရတဲ့ “ဆရာဝန်” = အတု ကျွမ်းကျင်သူ။", noteEn: "\"A doctor\" with no name you can check is a fake expert." } },
  // --- messaging / calls ---
  { id: "sc-voice", platform: "call", sender: "Unknown", meta: "call · now", genuine: false, techniques: ["urgency", "emotion"], difficulty: 3,
    body: { mm: "“အစ်ကိုပါ၊ အရေးပေါ် ဖြစ်နေလို့ အခု ငွေ လွှဲပေးပါ” — အသံက ရင်းနှီးသလို ခံစားရ။", en: "\"It's your brother, there's an emergency, transfer money now\" — the voice sounds familiar." },
    evidence: { fragmentMm: "အခု ငွေ လွှဲပေးပါ", noteMm: "အသံကို AI က ပုံတူ လုပ်နိုင်ပြီ။ ငွေကိစ္စဆို သိပြီးသား နံပါတ်ကနေ ပြန်ခေါ်ပါ။", noteEn: "Voices can be cloned now — for money, hang up and call back on a number you know." } },
  { id: "sc-romance", platform: "facebook", sender: "New friend", meta: "Facebook · 3d", genuine: false, techniques: ["emotion"], difficulty: 3,
    body: { mm: "မင်း profile ကို တွေ့လိုက်ရတာ အရမ်း သဘောကျတယ်။ ကျွန်တော်တို့ ပိုရင်းနှီးအောင် ဒီ app မှာ chat ရအောင်။", en: "I saw your profile and really like you. Let's get closer — chat me on this other app." },
    evidence: { fragmentMm: "ဒီ app မှာ chat ရအောင်", noteMm: "အမြန် ရင်းနှီးအောင်လုပ်ပြီး တခြားနေရာ ခေါ်တာ — ဖြည်းဖြည်း၊ သတိထားပါ။", noteEn: "Fast intimacy plus moving you to another app is a pattern — slow down." } },
  // --- genuine (trusting these is a skill too) ---
  { id: "sc-g-friend", platform: "messenger", sender: "Kaung", meta: "Messenger · 20m", genuine: true, techniques: [], difficulty: 1,
    body: { mm: "မနက်ဖြန် ဘောလုံးပွဲ လာမလား? ၄ နာရီ ကျောင်းကွင်းမှာနော်။", en: "Coming to the football match tomorrow? 4pm at the school field." } },
  { id: "sc-g-mom", platform: "viber", sender: "အမေ", meta: "Viber · 1h", genuine: true, techniques: [], difficulty: 1,
    body: { mm: "ကျောင်းက ပြန်ရင် ဟင်းသီးဟင်းရွက် ဝယ်ခဲ့နော် သား။ ငွေ အိတ်ထဲမှာ ထားခဲ့တယ်။", en: "Buy some vegetables on your way home from school, dear. I left money in your bag." } },
  { id: "sc-g-school", platform: "facebook", sender: "No. 2 B.E.H.S (page)", meta: "Facebook · 5h", genuine: true, techniques: [], difficulty: 2,
    body: { mm: "Grade 10 စာမေးပွဲ ရလဒ်များကို တနင်္လာနေ့ ကျောင်းတွင် ကြေညာပါမည်။", en: "Grade 10 exam results will be posted at school on Monday." } },
  { id: "sc-g-promo", platform: "sms", sender: "Telecom", meta: "SMS · 2d", genuine: true, techniques: [], difficulty: 2,
    body: { mm: "ဒီစနေ၊ တနင်္ဂနွေ အတွက် ၅GB ဒေတာ ၃,၀၀၀ ကျပ်။ *၁၂၃# ခေါ်ပြီး ဝယ်ယူနိုင်ပါသည်။", en: "This weekend: 5GB data for 3,000 Ks. Dial *123# to buy." } },
  { id: "sc-g-sib", platform: "messenger", sender: "Nyi Nyi", meta: "Messenger · 30m", genuine: true, techniques: [], difficulty: 1,
    body: { mm: "မင်း charger ကို ငှားသုံးလိုက်တယ်နော်။ ကျောင်းအိတ်ထဲမှာ ပြန်ထည့်ပေးထားမယ်။", en: "Borrowed your charger — I'll put it back in your school bag." } },
];

// Pick a case at `level` (difficulty), 1 genuine roughly 1-in-4, avoiding `notId`.
export function pickCase(level?: number, notId?: string): Scenario {
  const byLevel = (s: Scenario) => level == null || (s.difficulty ?? 1) === level;
  const genuineRoll = Math.random() < 0.28;
  let pool = SCENARIOS.filter((s) => s.genuine === genuineRoll && byLevel(s) && s.id !== notId);
  if (!pool.length) pool = SCENARIOS.filter((s) => byLevel(s) && s.id !== notId);
  if (!pool.length) pool = SCENARIOS.filter((s) => s.id !== notId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export type Lesson = {
  id: string;
  track: number;
  state: MasteryState;
  technique: TechniqueId;
  title: Bi;
  meet: { sender: string; meta: string } & Bi;
  how: Bi;
  tell: Bi;
  practice: Bi & { answer: TechniqueId };
  carry: Bi;
};

export const LESSONS: Lesson[] = [
  { id: "t1-urgency", track: 1, state: "mastered", technique: "urgency", title: { mm: "အရေးပေါ် ဖိအား", en: "Fake urgency" },
    meet: { sender: "KBZ Support", meta: "+95 9 4•• ••• 231 · now", mm: "သင့်အကောင့်ကို ၂၄ နာရီအတွင်း ပိတ်ပါမည်။ ချက်ချင်း အတည်ပြုပါ။", en: '"Your account will be closed within 24 hours. Confirm now."' },
    how: { mm: "အရေးပေါ်ဖိအားက သင့်ကို တွေးချိန်မပေးဘဲ လုပ်ဆောင်ခိုင်းသည်။ အချိန်ကန့်သတ်ချက်၊ “ချက်ချင်း”၊ ခြိမ်းခြောက်မှုတို့သည် ကြောက်စိတ်ကို နှိုးဆွပြီး ဆင်ခြင်တုံတရားကို ပိတ်ပစ်သည်။", en: "Urgency makes you act before you think — a countdown switches off judgement." },
    tell: { mm: "စစ်မှန်သော ဘဏ်တစ်ခုသည် သင့်ကို အချိန်ကန့်သတ်၍ မတိုက်တွန်းပါ။", en: "A real bank never gives you a countdown." },
    practice: { mm: "ယနေ့ည ၁၂ နာရီမတိုင်မီ အတည်မပြုပါက ဆုမဲ ဆုံးရှုံးပါမည်။", en: '"Confirm before midnight tonight or lose your prize."', answer: "urgency" },
    carry: { mm: "အမြန်လုပ်ခိုင်းရင် ခဏရပ်။ အရေးပေါ်ဆိုတာ လှည့်ကွက်တစ်ခု ဖြစ်နိုင်တယ်။", en: "If it rushes you, pause — urgency itself is the trick." } },
  { id: "t1-authority", track: 1, state: "practised", technique: "authority", title: { mm: "အတုအယောင် အာဏာ", en: "False authority" },
    meet: { sender: "MPT အသိပေးချက်", meta: "system · now", mm: "အစိုးရ တရားဝင် အသိပေးချက် — သင့် SIM ကို ချက်ချင်း ပြန်လည် မှတ်ပုံတင်ပါ။", en: '"Official govt notice — re-register your SIM immediately."' },
    how: { mm: "ရာထူး၊ တံဆိပ်၊ တရားဝင်ဟန်တို့က ယုံကြည်မှုကို အလိုအလျောက် ရစေသည်။ သို့သော် ၎င်းတို့ကို အလွယ်တကူ တုပလို့ရသည်။", en: "Titles and logos manufacture trust — and they are easy to fake." },
    tell: { mm: "ရာထူး၊ တံဆိပ်တွေက အလွယ်တကူ တုပလို့ရတယ်။ အမည်ကို သီးခြားစစ်ပါ။", en: "Titles and logos are easy to fake — verify the name separately." },
    practice: { mm: "ဘဏ်မှ ဝန်ထမ်း ဖြစ်ပါသည်။ သင့် PIN ကို အတည်ပြုပေးပါ။", en: '"I am from the bank. Please confirm your PIN."', answer: "authority" },
    carry: { mm: "တံဆိပ်ကို မယုံနဲ့၊ လူကို စစ်ပါ။ တရားဝင်ဟန်ဆောင်တာ လွယ်တယ်။", en: "Don't trust the badge — check the person behind it." } },
  { id: "t1-emotion", track: 1, state: "not_met", technique: "emotion", title: { mm: "စိတ်လှုပ်ရှား ဆွဲဆောင်မှု", en: "Emotional bait" },
    meet: { sender: "Lucky Draw", meta: "Facebook · 2h", mm: "ဂုဏ်ယူပါတယ်! သင် iPhone ဆုမဲ ပေါက်ပါပြီ။ အခုပဲ လာယူပါ။", en: '"Congratulations! You won an iPhone. Claim it now."' },
    how: { mm: "ဝမ်းသာမှု၊ ဒေါသ၊ ကြောက်ရွံ့မှု ပြင်းထန်စွာ ဖြစ်လာချိန်တွင် ဆင်ခြင်မှု ကျဆင်းသည်။ ခံစားချက်ကို လှုံ့ဆော်ခြင်းသည် လှည့်ကွက်တစ်ခုဖြစ်သည်။", en: "Strong feeling lowers your guard — that spike is the point." },
    tell: { mm: "ဒေါသ သို့ ကြောက်စိတ် ရုတ်တရက် ဖြစ်လာရင် ခဏရပ်ပါ။", en: "If a message suddenly makes you angry or afraid, pause." },
    practice: { mm: "ဒီပုံကို မျှဝေမှ တိရစ္ဆာန်လေးကို ကယ်နိုင်မယ်!", en: '"Share this photo or the animal dies!"', answer: "emotion" },
    carry: { mm: "ခံစားချက် အပြင်းဆုံး ဖြစ်စေတဲ့ စာက အသံသယ အဝင်ဆုံး ဖြစ်သင့်တဲ့ စာ။", en: "The message that stirs the most feeling deserves the most doubt." } },
  { id: "t1-doctored", track: 1, state: "not_met", technique: "doctored", title: { mm: "ပြင်ဆင်ထားသော ပုံ/သံ", en: "Doctored media" },
    meet: { sender: "News share", meta: "Telegram · now", mm: "ဒီဓာတ်ပုံက အခုမှ ပေါက်ကြားလာတာ။ သက်သေ အခိုင်အမာပဲ။", en: '"This leaked photo is solid proof."' },
    how: { mm: "ဓာတ်ပုံ၊ ဗီဒီယို၊ အသံတို့ကို ပြင်ဆင်ဖန်တီးနိုင်ပြီ။ ပုံတစ်ပုံတည်းက သက်သေ မဟုတ်တော့ပါ။", en: "Images, video and audio can all be edited now — one image is not proof." },
    tell: { mm: "ပုံ တစ်ပုံတည်းနဲ့ မယုံပါနဲ့။ မူရင်းကို ရှာပါ။", en: "Don't trust one image alone — look for the original." },
    practice: { mm: "ဒီ screenshot က သူ ပြောခဲ့တာ သက်သေပဲ။", en: '"This screenshot proves what they said."', answer: "doctored" },
    carry: { mm: "ပုံတစ်ပုံ = သက်သေ မဟုတ်ဘူး။ မူရင်း ဘယ်မှာလဲ မေးပါ။", en: "One image is not proof — ask where the original is." } },
  { id: "t1-expert", track: 1, state: "not_met", technique: "expert", title: { mm: "အတု ကျွမ်းကျင်သူ", en: "Fake expert" },
    meet: { sender: "Dr. Health", meta: "Page · 1d", mm: "ဆရာဝန်တစ်ဦး အနေနဲ့ ဒီဆေးကို အာမခံပါတယ်။", en: '"As a doctor, I guarantee this cure."' },
    how: { mm: "ကျွမ်းကျင်သူဟန် ဆောင်ခြင်းက ယုံစေသည်။ တကယ့် ကျွမ်းကျင်သူဆို စစ်ဆေးလို့ရတဲ့ အထောက်အထား ချန်ထားသည်။", en: "Posing as an expert buys belief; a real one leaves checkable evidence." },
    tell: { mm: "တကယ့် ကျွမ်းကျင်သူဆို စစ်ဆေးလို့ရတဲ့ အထောက်အထား ရှိတယ်။", en: "A real expert leaves evidence you can check." },
    practice: { mm: "ပါမောက္ခတစ်ဦးက ဒါကို သိပ္ပံနည်းကျ သက်သေပြပြီးပါပြီ။", en: '"A professor has scientifically proven this."', answer: "expert" },
    carry: { mm: "ဘွဲ့ကို မယုံနဲ့၊ အထောက်အထားကို တောင်းပါ။", en: "Don't trust the title — ask for the evidence." } },
  { id: "t1-context", track: 1, state: "not_met", technique: "context", title: { mm: "အကြောင်းအရာ လွဲ", en: "Out of context" },
    meet: { sender: "Breaking", meta: "shared · now", mm: "ယခုပဲ ဖြစ်နေတာ! ဒီဗီဒီယိုကို ချက်ချင်း ကြည့်ပါ။", en: '"Happening right now! Watch this video."' },
    how: { mm: "ပုံ မှန်ပေမဲ့ ဇာတ်လမ်း လွဲနေတတ်သည်။ ဟောင်းသော ပုံ/ဗီဒီယိုကို အသစ်လို့ ပြန်တင်လေ့ရှိသည်။", en: "The image can be real but the story wrong — old media is re-posted as new." },
    tell: { mm: "ပုံ မှန်ပေမဲ့ ဇာတ်လမ်း လွဲနေတတ်တယ်။ ဘယ်ကလဲ မေးပါ။", en: "The image can be real but the story wrong — ask where it is from." },
    practice: { mm: "ဒီဓာတ်ပုံက ကျွန်တော်တို့မြို့မှာ မနေ့က ဖြစ်ခဲ့တာ။", en: '"This photo is from our town yesterday."', answer: "context" },
    carry: { mm: "ဘယ်၊ ဘယ်တုန်းက ဆိုတာ မေးပါ။ ပုံမှန်ပေမဲ့ နေရာ/အချိန် လွဲနိုင်တယ်။", en: "Ask where and when — a real photo can still be from another time." } },
  { id: "t2-voice", track: 2, state: "not_met", technique: "urgency", title: { mm: "အသံ ပုံတူ (Voice clone)", en: "Voice clones" },
    meet: { sender: "သား", meta: "call · now", mm: "“အမေ၊ သားပါ။ အရေးပေါ် ငွေလိုနေလို့ အခု လွှဲပေးပါ။” — အသံက တကယ့် သားနဲ့ တူ။", en: '"Mum, it’s me — I need money now." The voice sounds exactly like your son.' },
    how: { mm: "AI သည် အသံနမူနာ စက္ကန့်အနည်းငယ်နှင့် မည်သူ့အသံကိုမဆို ပုံတူ ဖန်တီးနိုင်ပြီ။ ကြားရုံနဲ့ ယုံလို့ မရတော့ပါ။", en: "AI can clone a voice from seconds of audio. Hearing is no longer believing." },
    tell: { mm: "အသံက ငွေတောင်းရင် ဖုန်းချ၊ သိပြီးသား နံပါတ်ကနေ ပြန်ခေါ်ပါ။", en: "If a voice asks for money, hang up and call back on a number you already trust." },
    practice: { mm: "“အဖေ ဆေးရုံရောက်နေတယ်၊ အခု ငွေလွှဲပါ” — မသိတဲ့ နံပါတ်က ဖုန်း။", en: '"Dad is in hospital, send money now" — from an unknown number.', answer: "urgency" },
    carry: { mm: "အသံကို ပုံတူ ဖန်တီးလို့ရပြီ။ ငွေကိစ္စဆို သိပြီးသား နံပါတ်ကနေ အတည်ပြုပါ။", en: "Voices can be faked now — for money, always confirm on a number you know." } },
  { id: "t2-deepfake", track: 2, state: "not_met", technique: "doctored", title: { mm: "Deepfake ဗီဒီယို", en: "Deepfakes" },
    meet: { sender: "Official clip", meta: "viral · 3h", mm: "ခေါင်းဆောင်တစ်ဦး ကြေညာနေသည့် ဗီဒီယို — သဘာဝကျကျ ဟန်ပန်နှင့်။", en: "A video of a leader making an announcement — looking completely natural." },
    how: { mm: "မျက်နှာ/နှုတ်ခမ်း လှုပ်ရှားမှုကို AI က ပြောင်းလဲနိုင်ပြီ။ ဟောင်းသော လက္ခဏာ (မျက်တောင် မခတ်ခြင်း) အချို့ ပျောက်သွားပြီ။", en: "AI can alter faces and lips; some old tells (no blinking) have stopped working." },
    tell: { mm: "တစ်နေရာတည်းက ဗီဒီယိုကို မယုံနဲ့။ ယုံရတဲ့ သတင်းရင်းမြစ်မှာ ပြန်ရှာပါ။", en: "Don't trust a lone video — look for it on a source you already trust." },
    practice: { mm: "ဒီ ဗီဒီယိုမှာ သူ အဲဒါ ပြောတာ ကိုယ်တိုင် မြင်ရတယ်။", en: '"I saw them say it myself in this video."', answer: "doctored" },
    carry: { mm: "မြင်ရုံနဲ့ မယုံနဲ့။ တခြား ရင်းမြစ်မှာ တွေ့မှ ယုံပါ။", en: "Seeing is not believing — confirm it on another source." } },
  { id: "t2-aitext", track: 2, state: "not_met", technique: "expert", title: { mm: "AI ရေးသား စာသား", en: "AI-written text" },
    meet: { sender: "Health tips", meta: "group · 1d", mm: "ချောမွေ့ ပြေပြစ်တဲ့ ကျန်းမာရေး အကြံပြုချက် ရှည်လျားစွာ — အမှားအယွင်း တစ်ခုမှ မရှိသလို။", en: "A long, flawless-sounding health tip — with no errors at all." },
    how: { mm: "AI သည် ချောမွေ့သော မြန်မာစာကို အလွယ်တကူ ရေးနိုင်ပြီ။ ချောမွေ့မှုက မှန်ကန်မှုကို မဆိုလိုပါ။", en: "AI writes fluent Burmese easily. Fluency is not credibility." },
    tell: { mm: "ချောမွေ့လို့ မှန်တာ မဟုတ်ဘူး။ ဘယ်သူ ရေးတာလဲ၊ အထောက်အထား ရှိလား မေးပါ။", en: "Polished does not mean true — ask who wrote it and what backs it." },
    practice: { mm: "ဒီ ဆောင်းပါးက အရမ်း professional ဆန်တယ်၊ ဒါကြောင့် မှန်မှာပါ။", en: '"This article reads so professionally, so it must be true."', answer: "expert" },
    carry: { mm: "လှပတဲ့ စာလုံးတွေက သက်သေ မဟုတ်ဘူး။ ရင်းမြစ်ကို မေးပါ။", en: "Beautiful writing is not evidence — ask for the source." } },
  { id: "t3-source", track: 3, state: "not_met", technique: "context", title: { mm: "သတင်း ဘယ်ကလာသလဲ", en: "Where information comes from" },
    meet: { sender: "Shared post", meta: "timeline · 5h", mm: "“တစ်ဦးက ပြောတယ်” ဆိုပြီး ရင်းမြစ် မဖော်ပြဘဲ ဝေမျှထားသော ပို့စ်။", en: 'A post shared with "someone said" and no named source.' },
    how: { mm: "သတင်းတိုင်းမှာ ဖန်တီးသူ၊ ရန်ပုံငွေ၊ ရည်ရွယ်ချက် ရှိသည်။ “ဘယ်သူ ပြောတာလဲ၊ ဘာကြောင့်လဲ” မေးခြင်းက ပထမ အဆင့်။", en: "Every message has a creator, funding and motive — ask who and why first." },
    tell: { mm: "ဘယ်သူ ပြောတာလဲ၊ ဘာကြောင့် ပြောတာလဲ — အရင်မေးပါ။", en: "Who is saying this, and why? Ask that first." },
    practice: { mm: "“လူတိုင်း သိပြီးသားပါ” ဆိုပြီး ရင်းမြစ် မပြဘဲ ဝေမျှတာ။", en: '"Everyone already knows this" — shared with no source.', answer: "context" },
    carry: { mm: "မဝေမျှခင် “ဒါ ဘယ်ကလဲ” လို့ တစ်ခေါက် မေးပါ။", en: "Before you reshare, ask once: where did this come from?" } },
  { id: "t3-rumour", track: 3, state: "not_met", technique: "emotion", title: { mm: "ကောလာဟလ ဘာကြောင့် မြန်သလဲ", en: "Why rumours travel faster" },
    meet: { sender: "Urgent!!", meta: "forwarded ×2000", mm: "အမြန်ဆုံး မျှဝေပါ! မဖြန့်ရင် နောက်ကျသွားမယ်။", en: '"Share as fast as you can before it’s too late!"' },
    how: { mm: "အံ့အားသင့်စေ၊ ဒေါသဖြစ်စေသော အကြောင်းအရာက ပြင်ဆင်ချက်ထက် ပိုမြန်စွာ ပျံ့နှံ့သည်။ မှန်ကန်မှုက နှေးသည်၊ ခံစားချက်က မြန်သည်။", en: "Content that shocks or angers spreads faster than the correction ever will." },
    tell: { mm: "အမြန်ဆုံး ဖြန့်ချင်စိတ် ဖြစ်လာရင် — အဲဒါက ဖြန့်ဖို့ ဒီဇိုင်းလုပ်ထားတာ။", en: "The urge to share fast is exactly what it was designed to trigger." },
    practice: { mm: "အမြန် forward လုပ်ပါ၊ မဟုတ်ရင် နောက်ကျမယ်!", en: '"Forward quickly or you’ll be too late!"', answer: "emotion" },
    carry: { mm: "ကောလာဟလက ပြင်ဆင်ချက်ထက် မြန်တယ်။ ဖြန့်ခင် ခဏရပ်ပါ။", en: "Rumours outrun corrections — pause before you spread one." } },
  { id: "t3-skept", track: 3, state: "not_met", technique: "context", title: { mm: "သံသယ vs အယုံအကြည်ကင်းမှု", en: "Skepticism vs cynicism" },
    meet: { sender: "Real notice?", meta: "official page · now", mm: "ကျန်းမာရေးဌာနမှ တကယ့် အသိပေးချက် — သို့သော် “ဘာမှ မယုံနဲ့” လို့ တုံ့ပြန်သူများ။", en: 'A genuine health notice — met with "believe nothing" replies.' },
    how: { mm: "သံသယက ကာကွယ်ရေး၊ အယုံအကြည် လုံးဝ ကင်းမှုက ချို့ယွင်းချက်။ အားလုံး မှားတယ်လို့ ယူဆရင် မှန်တဲ့ သတင်းကိုပါ လက်လွှတ်ရသည်။", en: "Skepticism protects you; believing nothing leaves you defenceless too." },
    tell: { mm: "အားလုံးကို မယုံတာ မဟုတ်ဘူး — ဘယ်ဟာကို ယုံရမလဲ သိအောင် စစ်တာ။", en: "The goal is not to trust nothing — it is to know what to trust." },
    practice: { mm: "ဒီ ခေတ်မှာ ဘာမှ မယုံနဲ့တော့၊ အားလုံး လိမ်တာချည်းပဲ။", en: '"Trust nothing these days — it’s all lies anyway."', answer: "context" },
    carry: { mm: "ဘာမှ မယုံတာ မဟုတ်ဘူး၊ စစ်တတ်အောင် ကြိုးစားတာ။", en: "Don't believe nothing — learn how to check." } },
];

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
export const lessonForTechnique = (id: TechniqueId) =>
  LESSONS.find((l) => l.technique === id)?.id;

// The Lens scripted cases (offline flow + starter chips). design v4 §9.
export type LensCase = {
  id: string;
  chip: string;
  sender: string;
  meta: string;
  body: Bi;
  q: Bi;
  answers: string[];
  tech: TechniqueId;
  check: string[];
  checkEn: string;
  cant: Bi;
};

export const LENS_CASES: LensCase[] = [
  { id: "bank", chip: "A bank SMS", sender: "KBZ Support", meta: "SMS · now",
    body: { mm: "သင့်အကောင့် ပိတ်ခံရမည်။ ဤလင့်ခ်တွင် ချက်ချင်း အတည်ပြုပါ။", en: '"Your account will be blocked. Confirm at this link now."' },
    q: { mm: "ဒီစာက မင်းကို ဘာလုပ်စေချင်တာလဲ?", en: "What does this message want you to do?" },
    answers: ["ချက်ချင်း နှိပ်ဖို့", "ကြောက်အောင်", "ငွေတောင်းဖို့"], tech: "urgency",
    check: ["ဘဏ်ကို သင်သိတဲ့ တရားဝင် နံပါတ်ကနေ ကိုယ်တိုင် ဆက်သွယ်ပါ။", "လင့်ခ်ကို မနှိပ်ပါနဲ့။", "တခြားသူတွေ ဒီလိုစာ ရလားလို့ မေးကြည့်ပါ။"],
    checkEn: "Contact the bank yourself on a number you know · never tap the link · ask if others got the same.",
    cant: { mm: "ဒီ SMS က တကယ့် ဘဏ်ကလား မဟုတ်ဘူးလား ကျွန်တော် မသိနိုင်ဘူး။ ဖွဲ့စည်းပုံကိုပဲ ပြောပြနိုင်တယ်။", en: "I can't know if this SMS is really from your bank — only show you how it's built." } },
  { id: "prize", chip: "A prize message", sender: "Lucky Draw", meta: "Messenger · 1h",
    body: { mm: "ဂုဏ်ယူပါတယ်! သင် ဆုကြီး ပေါက်ပါပြီ။ ယခုပဲ အချက်အလက် ဖြည့်ပါ။", en: '"Congratulations! You won a big prize. Enter your details now."' },
    q: { mm: "ဒီစာက မင်းကို ဘယ်လို ခံစားစေချင်တာလဲ?", en: "How does this message want you to feel?" },
    answers: ["ဝမ်းသာအောင်", "ကံကောင်းသလို", "အမြန်လုပ်ချင်အောင်"], tech: "emotion",
    check: ["ဆုမဲ ကြေညာချက်ကို တရားဝင် စာမျက်နှာမှာ ရှာကြည့်ပါ။", "ကိုယ်ရေးအချက်အလက် မပေးပါနဲ့။", "“ဘယ်သူ ကမကထ လုပ်တာလဲ” မေးပါ။"],
    checkEn: "Look up the prize on an official page · never give personal details · ask who is running it.",
    cant: { mm: "ဒါ တကယ့် ဆုမဲလား မဟုတ်ဘူးလား မသိနိုင်ပါ။ ဒါပေမဲ့ ခံစားချက်ကို လှုံ့ဆော်ပုံကို ပြနိုင်တယ်။", en: "I can't know if this prize is real — but I can show how it works on your feelings." } },
  { id: "voice", chip: "A voice call for money", sender: "Unknown", meta: "call · now",
    body: { mm: "“မိသားစုဝင်တစ်ဦး အရေးပေါ် ဖြစ်နေလို့ အခု ငွေလွှဲပေးပါ” — အသံက ရင်းနှီးသလို။", en: '"A family member is in trouble — transfer money now." The voice sounds familiar.' },
    q: { mm: "ဒါ တကယ့် သူ ဟုတ်မဟုတ် ဘယ်လို စစ်မလဲ?", en: "How would you check this is really them?" },
    answers: ["သိတဲ့ နံပါတ်ကနေ ပြန်ခေါ်", "မိသားစုကို မေး", "လုံခြုံရေး မေးခွန်း မေး"], tech: "urgency",
    check: ["ဖုန်းချပြီး သင်သိပြီးသား နံပါတ်ကနေ ပြန်ခေါ်ပါ။", "ငွေ မလွှဲခင် တခြားသူနဲ့ အတည်ပြုပါ။", "အသံကို ပုံတူ ဖန်တီးလို့ရတယ် ဆိုတာ သတိရပါ။"],
    checkEn: "Hang up and call back on a number you know · confirm with someone else before sending · voices can be cloned.",
    cant: { mm: "ဖုန်းတဘက်က ဘယ်သူလဲ ကျွန်တော် မသိနိုင်ပါ။ ဒါပေမဲ့ ဘယ်လို စစ်ရမလဲ ပြောပြနိုင်တယ်။", en: "I can't know who is on the call — but I can show you how to check." } },
  { id: "gaming", chip: "A free-diamonds post", sender: "Free Diamonds MM", meta: "Facebook · now",
    body: { mm: "အခမဲ့ Diamond ၅၀၀၀! game ID နဲ့ password ကို comment မှာ ရေးလိုက်ပါ။", en: '"Free 5000 Diamonds! Drop your game ID and password in the comments."' },
    q: { mm: "ဒီ post က မင်းဆီက ဘာ တောင်းနေတာလဲ?", en: "What is this post asking you for?" },
    answers: ["password", "game ID", "ဘာမှ မလို"], tech: "authority",
    check: ["ဘယ် game မှ password ကို comment မှာ မတောင်းပါ။", "ID/password ကို ဘယ်သူ့ကိုမှ မပေးပါနဲ့။", "တရားဝင် event ဆို app ထဲမှာ ကြေညာပါတယ်။"],
    checkEn: "No game asks for your password in comments · never share your ID/password · real events are announced inside the app.",
    cant: { mm: "ဒါ တကယ့် ကမ်းလှမ်းမှုလား မသိနိုင်ပါ။ ဒါပေမဲ့ password တောင်းတာ ဘာကြောင့် အန္တရာယ်ရှိလဲ ပြောပြနိုင်တယ်။", en: "I can't know if the offer is real — but I can show why asking for a password is dangerous." } },
  { id: "job", chip: "An easy-money job", sender: "Online Job MM", meta: "Telegram · 1h",
    body: { mm: "အိမ်မှာနေရင်း တစ်ရက် ၅၀,၀၀၀ ကျပ်! ဝင်ဖို့ စရိတ် ၁၀,၀၀၀ ကျပ် အရင် ပေးပါ။", en: '"Earn 50,000 Ks/day from home! Pay a 10,000 Ks joining fee first."' },
    q: { mm: "ဒီ အလုပ်က မင်းကို ဘာလုပ်ခိုင်းနေတာလဲ?", en: "What is this job asking you to do first?" },
    answers: ["ငွေ အရင်ပေး", "အချက်အလက် ပေး", "စဉ်းစား"], tech: "expert",
    check: ["အလုပ်တစ်ခုက ဝင်ဖို့ ငွေ မတောင်းပါ။", "ကုမ္ပဏီ အမည်ကို သီးခြား ရှာကြည့်ပါ။", "အရမ်း ကောင်းလွန်းရင် သံသယ ဖြစ်ပါ။"],
    checkEn: "A real job doesn't charge you to join · look up the company separately · too good to be true usually is.",
    cant: { mm: "ဒါ တကယ့် အလုပ်လား မသိနိုင်ပါ။ ဒါပေမဲ့ ရှေ့ပြေးစရိတ် တောင်းတာ ဘာကြောင့် အန္တရာယ်ရှိလဲ ပြနိုင်တယ်။", en: "I can't know if the job is real — but I can show why an upfront fee is a red flag." } },
];

// Villain's Seat (design §7 / spec §5.4) — slot-filling only, deferred build.
export const ROLES = [
  { id: "thief", label: "The Thief", goal: "Get families to send money quickly." },
  { id: "agitator", label: "The Agitator", goal: "Make people angry enough to share without checking." },
  { id: "manipulator", label: "The Manipulator", goal: "Change what someone believes about an event." },
  { id: "bully", label: "The Bully", goal: "Pressure one person into staying silent." },
] as const;

export const FRAGMENTS = [
  { id: "deadline", label: "a 24-hour deadline", tech: "urgency" as TechniqueId },
  { id: "name", label: "an official-sounding name", tech: "authority" as TechniqueId },
  { id: "logo", label: "a familiar-looking logo", tech: "authority" as TechniqueId },
  { id: "family", label: "a family in trouble", tech: "emotion" as TechniqueId },
  { id: "expert", label: 'a "verified" expert', tech: "expert" as TechniqueId },
  { id: "proof", label: 'a screenshot as "proof"', tech: "doctored" as TechniqueId },
] as const;
