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

export type Scenario = {
  id: string;
  platform: "sms" | "facebook" | "messenger" | "telegram" | "viber" | "call";
  sender: string;
  meta: string;
  body: Bi;
  genuine: boolean;
  techniques: TechniqueId[];
};

// Scenario pool — every 5-round set must include >=1 genuine (design v4 §7, spec §5.2).
export const SCENARIOS: Scenario[] = [
  { id: "sc-urgency", platform: "sms", sender: "KBZ Support", meta: "SMS · now", genuine: false, techniques: ["urgency", "authority"],
    body: { mm: "သင့်အကောင့်ကို ၂၄ နာရီအတွင်း ပိတ်ပါမည်။ ချက်ချင်း အတည်ပြုပါ။", en: "Your account will be closed within 24 hours. Confirm now." } },
  { id: "sc-authority", platform: "sms", sender: "MPT အသိပေးချက်", meta: "system · now", genuine: false, techniques: ["authority"],
    body: { mm: "အစိုးရ တရားဝင် အသိပေးချက် — သင့် SIM ကို ချက်ချင်း ပြန်လည် မှတ်ပုံတင်ပါ။", en: "Official govt notice — re-register your SIM immediately." } },
  { id: "sc-emotion", platform: "facebook", sender: "Lucky Draw", meta: "Facebook · 2h", genuine: false, techniques: ["emotion"],
    body: { mm: "ဂုဏ်ယူပါတယ်! သင် iPhone ဆုမဲ ပေါက်ပါပြီ။ အခုပဲ လာယူပါ။", en: "Congratulations! You won an iPhone. Claim it now." } },
  { id: "sc-doctored", platform: "telegram", sender: "News share", meta: "Telegram · now", genuine: false, techniques: ["doctored"],
    body: { mm: "ဒီဓာတ်ပုံက အခုမှ ပေါက်ကြားလာတာ။ သက်သေ အခိုင်အမာပဲ။", en: "This leaked photo is solid proof." } },
  { id: "sc-expert", platform: "facebook", sender: "Dr. Health", meta: "Page · 1d", genuine: false, techniques: ["expert"],
    body: { mm: "ဆရာဝန်တစ်ဦး အနေနဲ့ ဒီဆေးကို အာမခံပါတယ်။", en: "As a doctor, I guarantee this cure." } },
  { id: "sc-context", platform: "telegram", sender: "Breaking", meta: "shared · now", genuine: false, techniques: ["context", "emotion"],
    body: { mm: "ယခုပဲ ဖြစ်နေတာ! ဒီဗီဒီယိုကို ချက်ချင်း ကြည့်ပါ။", en: "Happening right now! Watch this video." } },
  { id: "sc-voice", platform: "call", sender: "သား", meta: "call · now", genuine: false, techniques: ["urgency", "emotion"],
    body: { mm: "အမေ၊ သားပါ။ အရေးပေါ် ငွေလိုနေလို့ အခု လွှဲပေးပါ။", en: "Mum, it's me — I need money now, please transfer." } },
  { id: "sc-aitext", platform: "messenger", sender: "Health tips", meta: "group · 1d", genuine: false, techniques: ["expert"],
    body: { mm: "ချောမွေ့ ပြေပြစ်တဲ့ ကျန်းမာရေး အကြံပြုချက် — အမှားအယွင်း တစ်ခုမှ မရှိသလို။", en: "A flawless-sounding health tip — with no errors at all." } },
  // genuine messages — trusting these is a skill (design v4 §7)
  { id: "sc-genuine-1", platform: "sms", sender: "Ma Ma", meta: "SMS · 10m", genuine: true, techniques: [],
    body: { mm: "ညနေ စျေးဝယ်ပြီး ပြန်လာမယ်နော်။ ဟင်းချက်ဖို့ ကြက်ဥ လိုသေးလား?", en: "Heading home after the market — do we still need eggs?" } },
  { id: "sc-genuine-2", platform: "messenger", sender: "Ko Zaw", meta: "Messenger · 1h", genuine: true, techniques: [],
    body: { mm: "မနက်ဖြန် ၉ နာရီ ရုံးမှာ တွေ့ကြမယ်နော်။ စာရွက်တွေ ယူလာဖို့ မမေ့နဲ့။", en: "See you at the office at 9 tomorrow. Don't forget the papers." } },
  { id: "sc-genuine-3", platform: "facebook", sender: "Thida", meta: "Facebook · 3h", genuine: true, techniques: [],
    body: { mm: "မွေးနေ့ ဆုတောင်းတွေ အတွက် ကျေးဇူးတင်ပါတယ်။ အားလုံးကို ချစ်တယ်။", en: "Thank you all for the birthday wishes. Love you all." } },
  { id: "sc-genuine-4", platform: "viber", sender: "U Aung (clinic)", meta: "Viber · 2d", genuine: true, techniques: [],
    body: { mm: "သင့် ချိန်းဆိုချက်ကို တနင်္လာနေ့ မွန်းလွဲ ၂ နာရီ ပြောင်းပေးထားပါတယ်။", en: "Your appointment has been moved to Monday at 2pm." } },
];

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
  { id: "t1-urgency", track: 1, state: "not_met", technique: "urgency", title: { mm: "အရေးပေါ် ဖိအား", en: "Fake urgency" },
    meet: { sender: "KBZ Support", meta: "+95 9 4•• ••• 231 · now", mm: "သင့်အကောင့်ကို ၂၄ နာရီအတွင်း ပိတ်ပါမည်။ ချက်ချင်း အတည်ပြုပါ။", en: '"Your account will be closed within 24 hours. Confirm now."' },
    how: { mm: "အရေးပေါ်ဖိအားက သင့်ကို တွေးချိန်မပေးဘဲ လုပ်ဆောင်ခိုင်းသည်။ အချိန်ကန့်သတ်ချက်၊ “ချက်ချင်း”၊ ခြိမ်းခြောက်မှုတို့သည် ကြောက်စိတ်ကို နှိုးဆွပြီး ဆင်ခြင်တုံတရားကို ပိတ်ပစ်သည်။", en: "Urgency makes you act before you think — a countdown switches off judgement." },
    tell: { mm: "စစ်မှန်သော ဘဏ်တစ်ခုသည် သင့်ကို အချိန်ကန့်သတ်၍ မတိုက်တွန်းပါ။", en: "A real bank never gives you a countdown." },
    practice: { mm: "ယနေ့ည ၁၂ နာရီမတိုင်မီ အတည်မပြုပါက ဆုမဲ ဆုံးရှုံးပါမည်။", en: '"Confirm before midnight tonight or lose your prize."', answer: "urgency" },
    carry: { mm: "အမြန်လုပ်ခိုင်းရင် ခဏရပ်။ အရေးပေါ်ဆိုတာ လှည့်ကွက်တစ်ခု ဖြစ်နိုင်တယ်။", en: "If it rushes you, pause — urgency itself is the trick." } },
  { id: "t1-authority", track: 1, state: "not_met", technique: "authority", title: { mm: "အတုအယောင် အာဏာ", en: "False authority" },
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
