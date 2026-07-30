// Claims for the pass-and-play round (MULTIPLAYER.md, DESIGN.md §16).
//
// Every player argues from the SAME persuasion deck (FRAGMENTS). What differs is
// the conclusion they are told to push: Detectives argue `truth`, the Manipulator
// argues `flip`. Nobody sees anyone else's instruction.
//
// This is the whole lesson in one mechanic — the techniques are neutral tools and
// intent is what differs. An earlier draft had Detectives "relay honestly" using
// the same deck, which is incoherent: every fragment in that deck IS a
// manipulation technique, so honest relay is impossible with it.
//
// Burmese here is a draft pending native-speaker review (DESIGN.md §15).

export type Claim = {
  id: string;
  /** The situation everyone sees. */
  situation: { mm: string; en: string };
  /** What Detectives are secretly told to argue for. This is what is actually true. */
  truth: { mm: string; en: string };
  /** What the Manipulator is secretly told to argue for. */
  flip: { mm: string; en: string };
};

export const CLAIMS: Claim[] = [
  {
    id: "flood-photo",
    situation: {
      mm: "မိုးသည်းထန်စွာ ရွာပြီးနောက် ရေကြီးနေတဲ့ လမ်းတစ်ခုရဲ့ ဓာတ်ပုံ တစ်ပုံ ပျံ့နှံ့နေတယ်။",
      en: "A photo of a flooded street is going around after last night's storm.",
    },
    truth: {
      mm: "ဒီဓာတ်ပုံက လွန်ခဲ့တဲ့ သုံးနှစ်က ဓာတ်ပုံ ဖြစ်ကြောင်း အခန်းထဲက လူတွေကို ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room the photo is three years old.",
    },
    flip: {
      mm: "ဒီဓာတ်ပုံက မနေ့ညက ရိုက်ထားတာ ဖြစ်ကြောင်း အခန်းထဲက လူတွေကို ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room the photo was taken last night.",
    },
  },
  {
    id: "scholarship",
    situation: {
      mm: "ကျောင်းသားတွေဆီ ပညာသင်ဆု အသစ်တစ်ခုအကြောင်း စာတစ်စောင် ရောက်လာတယ်။",
      en: "A message about a new scholarship is reaching students.",
    },
    truth: {
      mm: "လျှောက်လွှာအတွက် ဘယ်တော့မှ ငွေ ပေးစရာ မလိုကြောင်း အခန်းထဲက လူတွေကို ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room you never have to pay to apply.",
    },
    flip: {
      mm: "နေရာ အကန့်အသတ်ရှိလို့ လျှောက်လွှာကြေး ယနေ့ပဲ ပေးသွင်းသင့်ကြောင်း ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room they should pay the application fee today, before places run out.",
    },
  },
  {
    id: "voice-note",
    situation: {
      mm: "လူသိများတဲ့ ပုဂ္ဂိုလ်တစ်ဦးရဲ့ အသံဖိုင်တစ်ခု အွန်လိုင်းမှာ ပျံ့နှံ့နေတယ်။",
      en: "A voice recording of a well-known person is spreading online.",
    },
    truth: {
      mm: "အသံကို ယခုအခါ တုပလုပ်နိုင်ပြီဖြစ်ကြောင်း၊ စစ်ဆေးဖို့ လိုကြောင်း ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room voices can be faked now, so it needs checking.",
    },
    flip: {
      mm: "အသံက အတိအကျ တူနေလို့ စစ်မှန်ရမည် ဖြစ်ကြောင်း ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room it must be real because the voice matches exactly.",
    },
  },
  {
    id: "medicine",
    situation: {
      mm: "ရောဂါတစ်ခုကို ပျောက်ကင်းစေတယ်ဆိုတဲ့ ဆေးတစ်မျိုးအကြောင်း ပို့စ်တစ်ခု ရှယ်ခံနေရတယ်။",
      en: "A post about a remedy that supposedly cures an illness is being shared.",
    },
    truth: {
      mm: "ဆရာဝန်နဲ့ တိုင်ပင်ဖို့ လိုကြောင်း၊ ပို့စ်တစ်ခုတည်းနဲ့ မလုံလောက်ကြောင်း ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room to ask a doctor, because one post is not evidence.",
    },
    flip: {
      mm: "လူများစွာ ကောင်းတယ်ပြောလို့ ချက်ချင်း စမ်းသုံးသင့်ကြောင်း ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room to try it right away, because so many people say it worked.",
    },
  },
  {
    id: "account-warning",
    situation: {
      mm: "အကောင့် ပိတ်တော့မယ်ဆိုတဲ့ သတိပေးစာတစ်စောင် ရောက်လာတယ်။",
      en: "A warning arrives saying an account is about to be closed.",
    },
    truth: {
      mm: "အက်ပ်ထဲမှာ ကိုယ်တိုင် ဝင်စစ်သင့်ပြီး လင့်ခ်ကို မနှိပ်သင့်ကြောင်း ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room to open the app themselves instead of tapping the link.",
    },
    flip: {
      mm: "အချိန်မီ ကယ်ဖို့ လင့်ခ်ကို ယခုပဲ နှိပ်သင့်ကြောင်း ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room to tap the link now, before it is too late.",
    },
  },
  {
    id: "clip-out-of-context",
    situation: {
      mm: "လူအုပ်ကြီးတစ်ခုရဲ့ ဗီဒီယိုတိုတစ်ခု မြို့နာမည်တစ်ခုနဲ့အတူ ပျံ့နှံ့နေတယ်။",
      en: "A short video of a crowd is spreading with a city's name attached.",
    },
    truth: {
      mm: "ဗီဒီယိုက တခြားနေရာက ဖြစ်နိုင်လို့ ဘယ်ကလာလဲ စစ်သင့်ကြောင်း ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room to check where it came from, because it may be somewhere else.",
    },
    flip: {
      mm: "ဗီဒီယိုက ဖော်ပြထားတဲ့ မြို့ကပဲ ဖြစ်ကြောင်း ယုံကြည်အောင် လုပ်ပါ။",
      en: "Convince the room it is definitely from the city named.",
    },
  },
];

export const claimById = (id: string) => CLAIMS.find((cl) => cl.id === id) ?? CLAIMS[0];
