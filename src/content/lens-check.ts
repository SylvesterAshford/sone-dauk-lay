// The Lens guided check (DESIGN.md §9, §14).
//
// The player pastes a message, then answers six categorisation questions. The
// Lens then names what the answers point to, lists what is checkable, and says
// plainly what it cannot know — and asks the player what THEY think.
//
// It does NOT rule on truth. §14: "Do not let the Lens state that something is
// true, false, fake, or a scam. Its refusal is the feature." That is not
// timidity: this runs entirely offline for teenagers in Myanmar, and a
// confident wrong answer about political content is worse than no answer. The
// user does the judging; the Lens shows them how the message is built.
//
// Burmese here is a draft pending native-speaker review (DESIGN.md §15).

import type { TechniqueId } from "./pack";

export type CheckOption = {
  mm: string;
  en: string;
  /** Technique this answer points at, if any. null = nothing to flag. */
  points: TechniqueId | null;
  /** Something the player could actually go and do. */
  todo?: { mm: string; en: string };
};

export type CheckStep = {
  id: string;
  label: { mm: string; en: string };
  q: { mm: string; en: string };
  options: CheckOption[];
};

export const LENS_CHECK: CheckStep[] = [
  {
    id: "source",
    label: { mm: "ရင်းမြစ်", en: "Source" },
    q: { mm: "ဒါ ဘယ်ကနေ ရောက်လာတာလဲ။", en: "Where did this come from?" },
    options: [
      { mm: "တရားဝင် စာမျက်နှာ တစ်ခုကနေ", en: "An official page", points: null },
      { mm: "ထပ်ဆင့် မျှဝေထားတာ", en: "A forwarded message", points: "context",
        todo: { mm: "မူရင်း ဘယ်သူ တင်ခဲ့လဲ ရှာကြည့်ပါ။", en: "Find who posted it first." } },
      { mm: "မသိတဲ့ အကောင့် တစ်ခုကနေ", en: "An account I don't know", points: "authority",
        todo: { mm: "အဲဒီအကောင့်မှာ အရင်ပို့စ်တွေ ရှိလားလို့ ကြည့်ပါ။", en: "Check whether that account has any earlier posts." } },
    ],
  },
  {
    id: "evidence",
    label: { mm: "သက်သေ", en: "Evidence" },
    q: { mm: "ဘာ သက်သေ ပြထားလဲ။", en: "What proof does it show?" },
    options: [
      { mm: "စစ်လို့ရတဲ့ လင့်ခ် ဒါမှမဟုတ် စာရွက်စာတမ်း", en: "A link or document I can check", points: null },
      { mm: "ဖန်သားပြင်ဓာတ်ပုံ ဒါမှမဟုတ် ပုံပဲ", en: "Only a screenshot or a photo", points: "doctored",
        todo: { mm: "မူရင်း ပုံကို ပြန်ရှာကြည့်ပါ။", en: "Reverse-search the original image." } },
      { mm: "ဘာမှ မပြထားဘူး", en: "Nothing at all", points: null,
        todo: { mm: "“ဘယ်လို သိလဲ” လို့ မေးပါ။", en: "Ask how they know." } },
    ],
  },
  {
    id: "feeling",
    label: { mm: "ခံစားချက်", en: "Feeling" },
    q: { mm: "ဖတ်ပြီးတဲ့အခါ ဘယ်လို ခံစားရလဲ။", en: "How did it make you feel?" },
    options: [
      { mm: "ဒေါသ ဒါမှမဟုတ် ကြောက်စိတ်", en: "Angry or scared", points: "emotion",
        todo: { mm: "ခဏ ရပ်ပါ။ ခံစားချက် လျော့မှ ပြန်ဖတ်ပါ။", en: "Pause. Read it again once the feeling settles." } },
      { mm: "အရမ်း ဝမ်းသာ", en: "Very excited", points: "emotion",
        todo: { mm: "ခဏ ရပ်ပါ။ ခံစားချက် လျော့မှ ပြန်ဖတ်ပါ။", en: "Pause. Read it again once the feeling settles." } },
      { mm: "ဘာမှ မထူးဘူး", en: "Not much", points: null },
    ],
  },
  {
    id: "hurry",
    label: { mm: "အမြန်", en: "Hurry" },
    q: { mm: "အမြန် လုပ်ခိုင်းနေလား။", en: "Is it rushing you?" },
    options: [
      { mm: "အချိန်ကန့်သတ်ချက် ပါတယ်", en: "There's a deadline", points: "urgency",
        todo: { mm: "အချိန်ကန့်သတ်ချက်ကို လျစ်လျူရှုပြီး ကိုယ်တိုင် စစ်ပါ။", en: "Ignore the deadline and check it yourself." } },
      { mm: "ချက်ချင်း မျှဝေဖို့ ပြောတယ်", en: "It says share it now", points: "urgency",
        todo: { mm: "မစစ်ရသေးရင် မမျှဝေပါနဲ့။", en: "Don't share it until you've checked." } },
      { mm: "မဟုတ်ဘူး", en: "No", points: null },
    ],
  },
  {
    id: "vouching",
    label: { mm: "အာမခံသူ", en: "Who vouches" },
    q: { mm: "ဘယ်သူက အာမခံထားလဲ။", en: "Who is vouching for it?" },
    options: [
      { mm: "နာမည် ပါပြီး ရှာလို့ရတဲ့ လူတစ်ယောက်", en: "A named person I could look up", points: null },
      { mm: "“ဆရာဝန်တစ်ယောက်” လိုမျိုး နာမည် မပါဘူး", en: "An unnamed \"expert\"", points: "expert",
        todo: { mm: "နာမည် မပါရင် စစ်လို့ မရဘူး။ နာမည် တောင်းပါ။", en: "No name means you cannot check it. Ask for one." } },
      { mm: "ဘယ်သူမှ မပါဘူး", en: "Nobody", points: null },
    ],
  },
  {
    id: "elsewhere",
    label: { mm: "တခြားနေရာ", en: "Elsewhere" },
    q: { mm: "တခြားနေရာမှာလည်း ပါနေလား။", en: "Is anyone else reporting it?" },
    options: [
      { mm: "တခြား သတင်းဌာနတွေမှာလည်း ပါတယ်", en: "Other outlets have it too", points: null },
      { mm: "ဒီတစ်ခုတည်းပဲ တွေ့တယ်", en: "Only this one place", points: "context",
        todo: { mm: "တစ်နေရာတည်းမှာပဲ ရှိရင် ခဏ စောင့်ကြည့်ပါ။", en: "If it's only in one place, wait before believing it." } },
      { mm: "မရှာကြည့်ရသေးဘူး", en: "I haven't looked", points: null,
        todo: { mm: "ခေါင်းစဉ်ကို ကူးပြီး ရှာကြည့်ပါ။", en: "Copy the headline and search for it." } },
    ],
  },
];

/** What the Lens refuses to do, said plainly. Shown on every result (§14). */
export const CANT_KNOW = {
  mm: "ဒါ အမှန်လား အမှားလား ကျွန်တော် မပြောနိုင်ပါဘူး။ ကျွန်တော် ပြနိုင်တာက ဒီစာကို ဘယ်လို တည်ဆောက်ထားလဲ ဆိုတာပါ။ ဆုံးဖြတ်တာက သင်ပါ။",
  en: "I can't tell you whether this is true or false. What I can show you is how it is built. The deciding is yours.",
};
