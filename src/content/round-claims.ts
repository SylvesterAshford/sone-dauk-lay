// Content for the pass-and-play table round (MULTIPLAYER.md, DESIGN.md §16).
//
// THE ROUND, and why it is shaped this way:
//
// Everyone argues the SAME conclusion. Detectives must persuade with a reason
// somebody could check. The Manipulator is secretly assigned one of the six
// techniques and must persuade using that instead. The room then works out who
// argued by trick rather than by evidence.
//
// Two earlier drafts were wrong and are recorded here so they do not come back:
//
//   1. "Detectives relay the claim honestly using FRAGMENTS." Impossible — every
//      fragment in that deck IS a manipulation technique.
//   2. "Detectives argue the truth, the Manipulator argues the opposite." Trivially
//      solvable: the Manipulator is whoever disagrees. No deduction required.
//
// Arguing the same side is what makes the round hard, and it teaches the most
// valuable version of the skill: spotting a technique even when it is being used
// for a conclusion you already agree with.
//
// Burmese here is a draft pending native-speaker review (DESIGN.md §15).

export type Situation = {
  id: string;
  /** What is happening. Everyone sees this. */
  scene: { mm: string; en: string };
  /** What EVERY player must convince the room of. Everyone sees this too. */
  goal: { mm: string; en: string };
};

export const SITUATIONS: Situation[] = [
  {
    id: "flood-photo",
    scene: {
      mm: "မနေ့ညက မုန်တိုင်းအပြီး ရေကြီးနေတဲ့ လမ်းတစ်ခုရဲ့ ဓာတ်ပုံ တစ်ပုံ ပျံ့နှံ့နေတယ်။",
      en: "A photo of a flooded street is going around after last night's storm.",
    },
    goal: {
      mm: "မမျှဝေခင် ဒီဓာတ်ပုံ ဘယ်ကလာလဲ စစ်သင့်တယ်။",
      en: "We should check where this photo came from before sharing it.",
    },
  },
  {
    id: "scholarship",
    scene: {
      mm: "ပညာသင်ဆု အသစ်တစ်ခုအကြောင်း စာတစ်စောင် ကျောင်းသားတွေဆီ ရောက်နေတယ်။",
      en: "A message about a new scholarship is reaching students.",
    },
    goal: {
      mm: "ဘယ်သူမှ လျှောက်လွှာအတွက် ငွေ မပေးသင့်ဘူး။",
      en: "Nobody should pay money to apply for it.",
    },
  },
  {
    id: "voice-note",
    scene: {
      mm: "လူသိများသူတစ်ဦးရဲ့ အသံဖိုင်တစ်ခု အွန်လိုင်းမှာ ပျံ့နှံ့နေတယ်။",
      en: "A voice recording of a well-known person is spreading online.",
    },
    goal: {
      mm: "အသံတူရုံနဲ့ စစ်မှန်တယ်လို့ မဆုံးဖြတ်သင့်ဘူး။",
      en: "A matching voice is not enough to prove it is real.",
    },
  },
  {
    id: "medicine",
    scene: {
      mm: "ရောဂါတစ်ခုကို ပျောက်စေတယ်ဆိုတဲ့ ဆေးတစ်မျိုးအကြောင်း ပို့စ် ရှယ်ခံနေရတယ်။",
      en: "A post about a remedy that supposedly cures an illness is being shared.",
    },
    goal: {
      mm: "မစမ်းသုံးခင် ဆရာဝန်နဲ့ တိုင်ပင်သင့်တယ်။",
      en: "You should ask a doctor before trying it.",
    },
  },
  {
    id: "account-warning",
    scene: {
      mm: "အကောင့် ပိတ်တော့မယ်ဆိုတဲ့ သတိပေးစာ တစ်စောင် ရောက်လာတယ်။",
      en: "A warning arrives saying an account is about to be closed.",
    },
    goal: {
      mm: "စာထဲက လင့်ခ်ကို မနှိပ်ဘဲ အက်ပ်ထဲ ကိုယ်တိုင် ဝင်စစ်သင့်တယ်။",
      en: "You should open the app yourself instead of tapping the link.",
    },
  },
  {
    id: "crowd-clip",
    scene: {
      mm: "လူအုပ်ကြီးတစ်ခုရဲ့ ဗီဒီယိုတိုတစ်ခု မြို့နာမည်တစ်ခုနဲ့အတူ ပျံ့နှံ့နေတယ်။",
      en: "A short video of a crowd is spreading with a city's name attached.",
    },
    goal: {
      mm: "ဒီဗီဒီယို ဘယ်နေရာက ဘယ်အချိန်က ဆိုတာ အရင် စစ်သင့်တယ်။",
      en: "We should check where and when this video is actually from.",
    },
  },
  {
    id: "screenshot-quote",
    scene: {
      mm: "လူကြီးတစ်ဦး ပြောခဲ့တယ်ဆိုတဲ့ စကားတစ်ခွန်း ဖန်သားပြင်ဓာတ်ပုံနဲ့ ပျံ့နေတယ်။",
      en: "A screenshot of something an official supposedly said is going around.",
    },
    goal: {
      mm: "ဖန်သားပြင်ဓာတ်ပုံတစ်ခုတည်းက သက်သေ မဟုတ်ဘူး။",
      en: "A screenshot on its own is not proof.",
    },
  },
  {
    id: "job-offer",
    scene: {
      mm: "နိုင်ငံခြားမှာ လစာကောင်းတဲ့ အလုပ်တစ်ခုအကြောင်း စာတစ်စောင် ရောက်လာတယ်။",
      en: "A message arrives about a well-paid job abroad.",
    },
    goal: {
      mm: "မသွားခင် ကုမ္ပဏီ တကယ်ရှိမရှိ စစ်သင့်တယ်။",
      en: "You should check the company is real before going anywhere.",
    },
  },
];

// Phrase starters for the Manipulator, keyed to the technique they were dealt.
//
// The round used to show the whole FRAGMENTS deck to every Manipulator, which
// was wrong twice over: the chips did not match the technique they were
// actually assigned, and they named specific scam props ("a familiar-looking
// logo", "a family in trouble") that fit almost none of the situations. These
// are phrasings instead of props, so they work in any situation.
export const TECHNIQUE_MOVES: Record<string, { mm: string; en: string }[]> = {
  urgency: [
    { mm: "ယနေ့ည မတိုင်မီ လုပ်ရမယ်", en: "It has to be done before tonight" },
    { mm: "အချိန် သိပ်မကျန်တော့ဘူး", en: "There is not much time left" },
    { mm: "နောက်ကျရင် နောင်တရလိမ့်မယ်", en: "You will regret it if you are late" },
  ],
  authority: [
    { mm: "တရားဝင် ထုတ်ပြန်ထားတာ", en: "It was officially announced" },
    { mm: "အထက်က ညွှန်ကြားထားတာ", en: "The instruction came from above" },
    { mm: "တာဝန်ရှိသူတွေ ပြောပြီးသား", en: "The people in charge already said so" },
  ],
  emotion: [
    { mm: "မကူညီရင် နောင်တရမယ်", en: "You will feel bad if you do not help" },
    { mm: "ကလေးတွေ အတွက်ပါ", en: "This is for the children" },
    { mm: "ကြားရတာတောင် စိတ်မကောင်းဘူး", en: "It is heartbreaking just to hear" },
  ],
  doctored: [
    { mm: "ပုံ ရှိတယ်၊ ကိုယ်တိုင် ကြည့်", en: "There is a photo, see for yourself" },
    { mm: "ဗီဒီယိုထဲမှာ အတိအကျ မြင်ရတယ်", en: "You can see it clearly in the video" },
    { mm: "screenshot ရိုက်ထားတယ်", en: "I have a screenshot of it" },
  ],
  expert: [
    { mm: "ဆရာဝန်တစ်ယောက်က ပြောတယ်", en: "A doctor said so" },
    { mm: "ကျွမ်းကျင်သူတွေ သဘောတူတယ်", en: "The experts agree" },
    { mm: "သုတေသနတစ်ခုမှာ ပါတယ်", en: "It was in a study" },
  ],
  context: [
    { mm: "အရင်ကလည်း ဒီလိုပဲ ဖြစ်ခဲ့တယ်", en: "The same thing happened before" },
    { mm: "တခြားနေရာမှာလည်း တွေ့ရတယ်", en: "It is showing up elsewhere too" },
    { mm: "အားလုံး သိပြီးသားပါ", en: "Everyone already knows this" },
  ],
};

// Detective helper prompts: things a person could actually go and check. These
// are the counterweight to TECHNIQUE_MOVES — the honest way to be persuasive.
// Kept deliberately general so they fit any situation in SITUATIONS.
export const REASON_MOVES: { id: string; mm: string; en: string }[] = [
  { id: "date", mm: "ရက်စွဲကို စစ်ကြည့်တယ်", en: "I checked the date on it" },
  { id: "origin", mm: "မူရင်းပို့စ်ကို ရှာတွေ့တယ်", en: "I found the original post" },
  { id: "second", mm: "တခြားသတင်းဌာနကလည်း တူတူ ဖော်ပြတယ်", en: "Another outlet reported the same thing" },
  { id: "history", mm: "အဲဒီအကောင့်မှာ အရင်ပို့စ်တွေ မရှိဘူး", en: "That account has no earlier posts" },
  { id: "official", mm: "တရားဝင် စာမျက်နှာမှာ မတွေ့ဘူး", en: "I could not find it on the official page" },
  { id: "nowhere", mm: "ဒီအကြောင်း တခြားဘယ်မှာမှ မပါဘူး", en: "Nobody else is reporting this" },
];

export const situationById = (id: string) => SITUATIONS.find((s) => s.id === id) ?? SITUATIONS[0];
