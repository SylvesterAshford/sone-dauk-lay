import type { Lesson, Card } from "./pack";

// Lessons derived from the two Burmese lesson documents
// (lesson_for_learning_hub_13_15.docx, lesson_for_learning_hub_16_18.docx).
//
// The documents are CLASSROOM material: they assume a teacher, paper, homework
// and class debates. This app is self-directed on a phone with no teacher, so
// the transferable knowledge is re-shaped into concept flashcards (design §8.5)
// while the classroom activities (homework, written reports, group debate) are
// deliberately dropped.
//
// Filed by TOPIC into the existing tracks; the doc age band (13-15 / 16-18) is
// used only as an easier-first ordering hint, never as a gate.
//
// ALL Burmese here is DRAFT pending native-speaker review (§15). It is adapted
// from the source documents, not copied verbatim, and shortened for phone
// reading.
export const DECK_LESSONS: Lesson[] = [
  /* ---- from the 13-15 document ---- */
  {
    id: "t3-types", track: 3, technique: "context",
    title: { mm: "သတင်းအတု အမျိုးအစား ၃ မျိုး", en: "Three kinds of false information" },
    meet: {
      sender: "Health Group", meta: "Facebook · 3h",
      mm: "ငှက်ပျောသီးက ကင်ဆာကို ကုသပေးတယ်တဲ့။ မိသားစုကို မျှဝေပေးပါ။",
      en: '"Bananas cure cancer. Share with your family."',
    },
    how: {
      mm: "သတင်းအတု အားလုံး တူညီတဲ့ ရည်ရွယ်ချက်နဲ့ မဟုတ်ပါ။ တစ်ချို့က မသိလိုက်ဘဲ မျှဝေမိတာ၊ တစ်ချို့က တမင် လိမ်ထားတာ၊ တစ်ချို့က အမှန်ကို လူထိခိုက်အောင် သုံးတာပါ။ ရည်ရွယ်ချက်ကို ခွဲခြားနိုင်ရင် တုံ့ပြန်ပုံလည်း ကွဲပါတယ်။",
      en: "Not all false information shares the same intent. Some is shared by mistake, some is deliberately invented, and some is true information weaponised to hurt someone. The intent changes how you should respond.",
    },
    tell: {
      mm: "မျှဝေခဲ့သူက လိမ်ချင်လို့လား၊ ကူညီချင်လို့လား မေးပါ။",
      en: "Ask whether the person sharing it meant to deceive — or meant to help.",
    },
    practice: {
      mm: "ရွေးကောက်ပွဲ မတိုင်မီ ပြိုင်ဘက်ကို နှိမ့်ချဖို့ ဖန်တီးထားတဲ့ သတင်း။",
      en: '"A story invented before an election to damage a rival."',
      answer: "context",
    },
    carry: {
      mm: "မှားတာနဲ့ လိမ်တာ မတူဘူး။ ရည်ရွယ်ချက်ကို မေးပါ။",
      en: "Being wrong and lying are not the same. Ask about intent.",
    },
    deck: [
      {
        front: { mm: "Misinformation ဆိုတာ ဘာလဲ။", en: "Misinformation — what does it mean?" },
        back: { mm: "မှားနေတဲ့ အချက်အလက်ကို လိမ်ဖို့ ရည်ရွယ်ချက် မပါဘဲ မျှဝေလိုက်ခြင်း။ သိချင်စိတ်၊ စိုးရိမ်စိတ် ဒါမှမဟုတ် ကူညီချင်စိတ်ကြောင့် ဖြစ်တတ်ပါတယ်။", en: "Sharing information that is wrong, with no intent to deceive — usually out of curiosity, worry, or a wish to help." },
        example: { mm: "ဥပမာ — ငှက်ပျောသီးက ကင်ဆာ ကုသတယ်ဆိုတဲ့ စာကို မစစ်ဘဲ မိသားစုကို ပို့လိုက်ခြင်း။", en: "Example: forwarding a \"bananas cure cancer\" post to family without checking it." },
      },
      {
        front: { mm: "Disinformation ဆိုတာ ဘာလဲ။", en: "Disinformation — what does it mean?" },
        back: { mm: "လူတွေကို လှည့်ဖြားဖို့၊ ထိခိုက်စေဖို့ ဒါမှမဟုတ် အကျိုးအမြတ် ရဖို့ တမင်တကာ ဖန်တီးထားတဲ့ မှားယွင်းသော အချက်အလက်။", en: "False information created on purpose — to mislead, to cause harm, or to gain something." },
        example: { mm: "ဥပမာ — ရွေးကောက်ပွဲ မတိုင်မီ ပြိုင်ဘက်ကို နှိမ့်ချဖို့ သတင်းအတု ဖန်တီး ဖြန့်ခြင်း။", en: "Example: inventing and spreading fake stories about a rival before an election." },
      },
      {
        front: { mm: "Malinformation ဆိုတာ ဘာလဲ။", en: "Malinformation — what does it mean?" },
        back: { mm: "မှန်ကန်တဲ့ အချက်အလက်ကို လူတစ်ဦး ဒါမှမဟုတ် အဖွဲ့အစည်းတစ်ခုကို ထိခိုက်စေဖို့ ရည်ရွယ်ချက်နဲ့ ထုတ်ဖော် မျှဝေခြင်း။", en: "True information deliberately released to harm a person or an organisation." },
        example: { mm: "ဥပမာ — တစ်ယောက်ယောက်ရဲ့ ကိုယ်ရေးကိုယ်တာ အချက်အလက်တွေကို လက်စားချေဖို့ အွန်လိုင်းမှာ ဖြန့်ခြင်း။", en: "Example: posting someone's private details online as revenge." },
      },
      {
        front: { mm: "ရည်ရွယ်ချက်ကို ဘာလို့ ခွဲခြားရလဲ။", en: "Why does intent matter?" },
        back: { mm: "မသိလိုက်ဘဲ မျှဝေမိသူကို အမှန်ပြပေးရုံနဲ့ ရပါတယ်။ တမင် လိမ်နေသူကတော့ အမှန်ပြရုံနဲ့ ရပ်မှာ မဟုတ်ပါ။ ဘယ်လို တုံ့ပြန်ရမလဲ ဆုံးဖြတ်ဖို့ ရည်ရွယ်ချက်က အရေးကြီးပါတယ်။", en: "Someone who shared by mistake usually stops when shown the facts. Someone deliberately deceiving will not. Intent decides how you respond." },
      },
    ],
  },
  {
    id: "t3-algorithm", track: 3, technique: "context",
    title: { mm: "Algorithm နဲ့ သင့် Feed", en: "Algorithms and your feed" },
    meet: {
      sender: "your feed", meta: "app · now",
      mm: "သင် တစ်ခုကို ကြာကြာကြည့်တိုင်း အဲဒီလိုမျိုး နောက်ထပ် တစ်ဆယ်ခု ရောက်လာတယ်။",
      en: '"Every time you linger on one post, ten more like it arrive."',
    },
    how: {
      mm: "Algorithm က သင် ဘာကြိုက်လဲ လေ့လာပြီး အလားတူတာတွေကိုပဲ ပြပါတယ်။ အဲဒါက သင့်ကို ကြိုက်တာချည်း ဝိုင်းနေတဲ့ ပူဖောင်းထဲ ပို့နိုင်ပြီး၊ ဆန့်ကျင်ဘက် အမြင်တွေ မမြင်ရတော့ဘဲ သတင်းအတုကို ပိုယုံလွယ် စေပါတယ်။",
      en: "Algorithms learn what holds your attention and show you more of it. That can seal you inside a bubble where you never meet an opposing view, which makes false information easier to believe.",
    },
    tell: {
      mm: "သင့် Feed မှာ သဘောမတူတဲ့ အရာ ဘယ်လောက် မြင်ရလဲ ရေတွက်ကြည့်ပါ။",
      en: "Count how many things in your feed you actually disagree with.",
    },
    practice: {
      mm: "သင် ကြိုက်တဲ့ အမြင်ကို ထောက်ခံတဲ့ စာချည်းပဲ ဆက်တိုက် မြင်နေရခြင်း။",
      en: '"You only ever see posts that agree with you."',
      answer: "context",
    },
    carry: {
      mm: "သင့် Feed က ကမ္ဘာကြီး မဟုတ်ဘူး။ ရွေးပြထားတာ။",
      en: "Your feed is not the world. It is a selection.",
    },
    deck: [
      {
        front: { mm: "Algorithm ဆိုတာ ဘာလဲ။", en: "Algorithm — what does it mean?" },
        back: { mm: "အလုပ်တစ်ခု ပြီးမြောက်ဖို့ သတ်မှတ်ထားတဲ့ အဆင့်တွေရဲ့ အစုအဝေးပါ။ ဆိုရှယ်မီဒီယာမှာတော့ သင် ဘာကြိုက်လဲ၊ ဘယ်သူနဲ့ ဆက်သွယ်လဲ၊ ဘာကို ကြာကြာကြည့်လဲ လေ့လာပြီး နောက်ထပ် ဘာပြရမလဲ ဆုံးဖြတ်ပေးတယ်။", en: "A set of steps for completing a task. On social media it learns what you like, who you interact with, and what you watch for longest — then decides what to show you next." },
      },
      {
        front: { mm: "Filter Bubble ဆိုတာ ဘာလဲ။", en: "Filter bubble — what does it mean?" },
        back: { mm: "Algorithm က သင်ကြိုက်မယ်ထင်တာချည်းပဲ ပြပေးလို့ ဖြစ်လာတဲ့ အခြေအနေပါ။ ဆန့်ကျင်ဘက် အမြင်တွေကနေ ကာထားသလို ဖြစ်ပြီး အတွေးအမြင် ကျဉ်းမြောင်းလာပါတယ်။", en: "The state you end up in when the algorithm only shows you what it thinks you will like. It shields you from opposing views and narrows your thinking." },
        example: { mm: "ဥပမာ — ပါတီ A ကို ကြိုက်ရင် ပါတီ A အကြောင်းချည်း မြင်ရပြီး ပါတီ B အကြောင်း မမြင်ရတော့ခြင်း။", en: "Example: if you like Party A, you see only Party A content and stop seeing Party B at all." },
      },
      {
        front: { mm: "Echo Chamber ဆိုတာ ဘာလဲ။", en: "Echo chamber — what does it mean?" },
        back: { mm: "ကိုယ်နဲ့ သဘောတူသူချည်းပဲ ဝိုင်းနေပြီး အချင်းချင်း အမြင်ကို ပြန်လည် အတည်ပြုနေတဲ့ အခြေအနေပါ။ ကိုယ့်အမြင် ပိုခိုင်လာပေမယ့် ကွဲပြားတဲ့ အမြင်ကို လက်ခံနိုင်စွမ်း လျော့ကျပါတယ်။", en: "Being surrounded only by people who agree with you, each confirming the others. Your view feels stronger, but your ability to consider other views shrinks." },
      },
      {
        front: { mm: "ပူဖောင်းကို ဘယ်လို ဖောက်မလဲ။", en: "How do you break the bubble?" },
        back: { mm: "သဘောမတူတဲ့ စာမျက်နှာကို တမင် Follow လုပ်ပါ။ ပုံမှန် မဖတ်တဲ့ သတင်းရင်းမြစ်ကို ရှာပါ။ တခြားဘာသာစကားနဲ့ရေးထားတာ ဖတ်ကြည့်ပါ။ ဆန့်ကျင်ဘက် အမြင်ကို ရည်ရွယ်ချက်ရှိရှိ ရှာပါ။", en: "Deliberately follow a page you disagree with. Seek out a source you would not normally read. Read about it in another language. Go looking for the opposing view on purpose." },
      },
    ],
  },
  {
    id: "t3-produce", track: 3, technique: "expert",
    title: { mm: "သတင်း ထုတ်လုပ်သူရဲ့ တာဝန်", en: "The reporter's responsibility" },
    meet: {
      sender: "you", meta: "your post · now",
      mm: "သင် တစ်ခုခု တင်တော့မယ်။ မတင်ခင် ဘာတွေ စစ်သင့်လဲ။",
      en: '"You are about to post something. What should you check first?"',
    },
    how: {
      mm: "သတင်း မျှဝေတာဟာ ထုတ်လုပ်တာ တစ်မျိုးပါ။ ထုတ်လုပ်သူတိုင်းမှာ တာဝန် ရှိပါတယ် — အချက်အလက် စစ်ဆေးခြင်း၊ မျှတမှု၊ တိကျမှု၊ ပွင့်လင်းမြင်သာမှု၊ လူ့အခွင့်အရေး လေးစားမှု၊ ပြီးတော့ အမှားကို ဝန်ခံ ပြင်ဆင်ခြင်း။",
      en: "Sharing news is a form of producing it, and producers carry duties: verify, be fair, be accurate, be transparent, respect people's rights, and correct mistakes openly.",
    },
    tell: {
      mm: "မတင်ခင် ဘယ်ကရလဲ၊ ဘယ်သူပြောလဲ၊ ဘယ်မှာ အတည်ပြုလို့ရလဲ မေးပါ။",
      en: "Before posting, ask: where is this from, who said it, and where can it be confirmed?",
    },
    practice: {
      mm: "ဆရာဝန် တစ်ယောက်လို့ဆိုပြီး အထောက်အထား မပြဘဲ ဆေးတစ်မျိုး အာမခံခြင်း။",
      en: '"Claiming to be a doctor and guaranteeing a cure, with no evidence."',
      answer: "expert",
    },
    carry: {
      mm: "မျှဝေတာက ထုတ်လုပ်တာပါ။ တာဝန်လည်း ပါလာတယ်။",
      en: "Sharing is publishing — the duty comes with it.",
    },
    deck: [
      {
        front: { mm: "အချက်အလက် စစ်ဆေးခြင်း (Verification)", en: "Verification" },
        back: { mm: "မထုတ်ဝေခင် အချက်အလက်တွေကို စစ်ပါ။ ဒါက အရေးအကြီးဆုံး တာဝန်ပါ။ ဘယ်ကရတာလဲ၊ ဘယ်သူပြောတာလဲ၊ နောက်ထပ် ဘယ်နေရာမှာ အတည်ပြုလို့ရလဲ။", en: "Check the facts before publishing. This is the first duty. Where did it come from, who said it, and where else can it be confirmed?" },
      },
      {
        front: { mm: "မျှတမှု (Fairness)", en: "Fairness" },
        back: { mm: "ပါဝင်ပတ်သက်သူ အားလုံးရဲ့ အမြင်ကို ထည့်သွင်း ဖော်ပြပါ။ ဘယ်သူ့အမြင် ပါသလဲ၊ ဘယ်သူ့အမြင် ကျန်ခဲ့လဲ မေးပါ။", en: "Include the views of everyone involved. Ask whose view is present — and whose is missing." },
      },
      {
        front: { mm: "တိကျမှု (Accuracy)", en: "Accuracy" },
        back: { mm: "နာမည်၊ ရက်စွဲ၊ ကိန်းဂဏန်း အားလုံး မှန်ဖို့ လိုပါတယ်။ သေးငယ်တဲ့ အမှားက သတင်းတစ်ခုလုံးရဲ့ ယုံကြည်မှုကို ပျက်စေနိုင်ပါတယ်။", en: "Names, dates and numbers must all be right. A small error can cost the whole story its credibility." },
      },
      {
        front: { mm: "ပွင့်လင်းမြင်သာမှု (Transparency)", en: "Transparency" },
        back: { mm: "အချက်အလက်ကို ဘယ်ကရလဲ၊ ဘယ်လို စုဆောင်းခဲ့လဲ ဖော်ပြပါ။ ဖုံးကွယ်စရာ မလိုတဲ့ လုပ်ငန်းစဉ်က ယုံကြည်မှုကို တည်ဆောက်ပါတယ်။", en: "Say where your information came from and how you gathered it. A process you do not need to hide builds trust." },
      },
      {
        front: { mm: "အမှား ပြင်ဆင်ခြင်း (Correction)", en: "Correction" },
        back: { mm: "အမှား ဖြစ်သွားရင် ရဲရဲဝံ့ဝံ့ ဝန်ခံပြီး ပြင်ပါ။ ဖျောက်ထားတာထက် ပြင်ဆင်တာက ပိုပြီး ယုံကြည်ရပါတယ်။", en: "If you get it wrong, admit it openly and fix it. Correcting earns more trust than quietly deleting." },
      },
    ],
  },

  /* ---- from the 16-18 document ---- */
  {
    id: "t2-deepfake-ai", track: 2, technique: "doctored",
    title: { mm: "Deepfake နဲ့ တုပမီဒီယာ", en: "Deepfakes and synthetic media" },
    meet: {
      sender: "Viral Clips", meta: "Facebook · 2h",
      mm: "ခေါင်းဆောင်တစ်ယောက်က စစ်ကြေညာနေတဲ့ ဗီဒီယို ပျံ့နှံ့နေတယ်။",
      en: '"A video is spreading of a leader declaring war."',
    },
    how: {
      mm: "AI က လူတစ်ယောက်ရဲ့ မျက်နှာ၊ အသံ၊ အမူအရာကို တခြားဗီဒီယိုပေါ် တပ်ဆင်နိုင်ပါပြီ။ ဒါကို Deepfake လို့ ခေါ်ပါတယ်။ ဒါဟာ လက်နက်နှစ်ဖက်ပါတဲ့ ဓားလိုပါပဲ — အတု ဖန်တီးဖို့လည်း၊ အတု ရှာဖွေဖို့လည်း သုံးလို့ရပါတယ်။",
      en: "AI can now paste one person's face, voice and gestures onto another video. That is a deepfake. The technology cuts both ways: it can create fakes and it can help detect them.",
    },
    tell: {
      mm: "ဗီဒီယိုတစ်ခုတည်းက သက်သေ မဟုတ်တော့ပါ။ တခြားရင်းမြစ်မှာ ရှိမရှိ ရှာပါ။",
      en: "A video alone is no longer proof. Look for the same event in another source.",
    },
    practice: {
      mm: "ခေါင်းဆောင်တစ်ဦး ဘယ်တော့မှ မပြောခဲ့တဲ့ စကားကို ပြောနေတဲ့ ဗီဒီယို။",
      en: '"A video of a leader saying something they never said."',
      answer: "doctored",
    },
    carry: {
      mm: "မြင်ရတိုင်း မယုံနဲ့တော့။ ဘယ်ကလာလဲ မေးပါ။",
      en: "Seeing is no longer believing. Ask where it came from.",
    },
    deck: [
      {
        front: { mm: "AI ဆိုတာ ဘာလဲ။", en: "AI — what does it mean?" },
        back: { mm: "လူသားရဲ့ ဉာဏ်ရည်ကို ကွန်ပျူတာနဲ့ အတုယူ ဖန်တီးထားတဲ့ နည်းပညာပါ။ ဒေတာကနေ သင်ယူနိုင်၊ ဆုံးဖြတ်ချက် ချနိုင်၊ အမှားကနေ ပြုပြင်နိုင်ပါတယ်။", en: "Technology that imitates human intelligence with computers. It can learn from data, make decisions, and correct itself from mistakes." },
      },
      {
        front: { mm: "Machine Learning ဆိုတာ ဘာလဲ။", en: "Machine learning — what does it mean?" },
        back: { mm: "ညွှန်ကြားချက် အသေးစိတ် မပေးဘဲ ဒေတာကနေ ကိုယ်တိုင် သင်ယူအောင် လုပ်တဲ့ နည်းလမ်းပါ။ AI ရဲ့ အဓိက အစိတ်အပိုင်းပါ။", en: "A way of letting a computer learn from data instead of being given step-by-step instructions. It is the core of modern AI." },
        example: { mm: "ဥပမာ — ခွေးနဲ့ ကြောင်ပုံ အများကြီး ပြထားရင် ကွန်ပျူတာက ခွဲခြားတတ်လာတယ်။", en: "Example: show it enough photos of dogs and cats and it learns to tell them apart." },
      },
      {
        front: { mm: "Deepfake ဆိုတာ ဘာလဲ။", en: "Deepfake — what does it mean?" },
        back: { mm: "AI သုံးပြီး လူတစ်ယောက်ရဲ့ မျက်နှာ၊ အသံ၊ ကိုယ်ဟန်အမူအရာကို တခြားဗီဒီယို ဒါမှမဟုတ် ဓာတ်ပုံပေါ်မှာ တပ်ဆင် ဖန်တီးထားတဲ့ အတုအယောင် မီဒီယာပါ။", en: "Media made with AI by placing one person's face, voice or gestures onto another video or photo." },
      },
      {
        front: { mm: "Synthetic Media ဆိုတာ ဘာလဲ။", en: "Synthetic media — what does it mean?" },
        back: { mm: "Deepfake ထက် ကျယ်ပြန့်ပါတယ်။ AI က လုံးဝ အသစ် ဖန်တီးထားတဲ့ မီဒီယာ အားလုံးကို ဆိုလိုပါတယ် — စာ၊ ပုံ၊ သီချင်း၊ ဗီဒီယို။", en: "Broader than deepfakes: any media generated wholly by AI — text, images, music, or video." },
      },
      {
        front: { mm: "ဘယ်လို စစ်မလဲ။", en: "How do you check?" },
        back: { mm: "တခြား ယုံကြည်ရတဲ့ သတင်းဌာနမှာ ပါမပါ ရှာပါ။ မူရင်း ဘယ်ကလာလဲ လိုက်ကြည့်ပါ။ အသံနဲ့ နှုတ်ခမ်း ကိုက်မကိုက်၊ အလင်းအမှောင် သဘာဝကျမကျ ကြည့်ပါ။ အရေးကြီးဆုံးက — အမြန် မမျှဝေပါနဲ့။", en: "Look for the same story in a trusted outlet. Trace the original source. Check whether the audio matches the lips and whether the lighting looks natural. Above all: do not share it fast." },
      },
    ],
  },
  {
    id: "t2-privacy", track: 2, technique: "context",
    title: { mm: "သင့်ဒေတာက ဘယ်သူပိုင်လဲ", en: "Who owns your data?" },
    meet: {
      sender: "an app", meta: "permissions · now",
      mm: "အက်ပ်တစ်ခုက သင့် တည်နေရာ၊ အဆက်အသွယ်၊ ဓာတ်ပုံတွေကို ခွင့်တောင်းနေတယ်။",
      en: '"An app is asking for your location, contacts and photos."',
    },
    how: {
      mm: "သင် အွန်လိုင်းမှာ ဘာလုပ်လဲ၊ ဘယ်သွားလဲ၊ ဘာရှာလဲ ဆိုတာ အားလုံး ဒေတာအဖြစ် စုဆောင်းခံရပါတယ်။ အဲဒီဒေတာကို ကုမ္ပဏီတွေက ကြော်ငြာ၊ ထုတ်ကုန်၊ နိုင်ငံရေး မက်ဆေ့ချ်တွေ ပစ်မှတ်ထား ပို့ဖို့ သုံးပါတယ်။ ဒါကို Surveillance Capitalism လို့ ခေါ်ပါတယ်။",
      en: "What you do online, where you go, what you search — all of it is collected as data. Companies use it to target you with ads, products and political messages. That business model is called surveillance capitalism.",
    },
    tell: {
      mm: "အက်ပ်က အလကား ဆိုရင် ရောင်းစရာက သင့်ဒေတာ ဖြစ်နိုင်ပါတယ်။",
      en: "If the app is free, your data may be the thing being sold.",
    },
    practice: {
      mm: "သင် တစ်ခါမှ မပြောဖူးတဲ့ ပစ္စည်းအကြောင်း ကြော်ငြာ ရုတ်တရက် ပေါ်လာခြင်း။",
      en: '"An ad appears for something you only ever mentioned out loud."',
      answer: "context",
    },
    carry: {
      mm: "အလကား ဆိုတာ မရှိဘူး။ တစ်ခုခုနဲ့ ပေးနေရတယ်။",
      en: "Nothing is free. You are paying with something.",
    },
    deck: [
      {
        front: { mm: "Surveillance Capitalism ဆိုတာ ဘာလဲ။", en: "Surveillance capitalism — what does it mean?" },
        back: { mm: "လူတွေရဲ့ ကိုယ်ရေးကိုယ်တာ ဒေတာကို စုဆောင်းပြီး ငွေကြေးအဖြစ် ပြောင်းလဲတဲ့ စီးပွားရေး မော်ဒယ်ပါ။ ပါမောက္ခ Shoshana Zuboff က ဒီအမည်ကို ပေးခဲ့တာပါ။", en: "A business model that collects people's personal data and turns it into money. The term comes from Professor Shoshana Zuboff." },
      },
      {
        front: { mm: "ဘယ်လို ဒေတာတွေ စုဆောင်းခံရလဲ။", en: "What data gets collected?" },
        back: { mm: "သင် ရှာဖွေတာ၊ ကြည့်တာ၊ နှိပ်တာ၊ ဘယ်လောက်ကြာ ကြည့်တာ၊ တည်နေရာ၊ အဆက်အသွယ်၊ ဝယ်ယူမှု၊ ဘယ်သူနဲ့ စကားပြောတာ — အားလုံးနီးပါးပါ။", en: "What you search, watch, tap and linger on; your location, contacts, purchases, and who you talk to — nearly all of it." },
      },
      {
        front: { mm: "ပစ်မှတ်ထား ကြော်ငြာ ဆိုတာ ဘာလဲ။", en: "Targeted advertising — what does it mean?" },
        back: { mm: "သင့်ဒေတာကို သုံးပြီး သင့်ကို အထူး ရွေးချယ် ပို့တဲ့ ကြော်ငြာပါ။ ထုတ်ကုန် ကြော်ငြာ တင် မဟုတ်ဘဲ နိုင်ငံရေး မက်ဆေ့ချ်တွေလည်း ဒီနည်းနဲ့ ပို့နိုင်ပါတယ်။", en: "Ads selected for you personally using your data. It is not only products — political messages can be targeted the same way." },
      },
      {
        front: { mm: "ဘယ်လို ကာကွယ်မလဲ။", en: "How do you protect yourself?" },
        back: { mm: "အက်ပ်တွေရဲ့ ခွင့်ပြုချက်တွေကို ပြန်စစ်ပါ။ မလိုတဲ့ တည်နေရာ ခွင့်ပြုချက်ကို ပိတ်ပါ။ ကြော်ငြာ ကိုယ်ရေးကိုယ်တာ ဆက်တင်ကို ကြည့်ပါ။ မျှဝေတဲ့ အချက်အလက်ကို လျှော့ပါ။", en: "Review your app permissions. Turn off location access you do not need. Check your ad-privacy settings. Share less by default." },
      },
    ],
  },
  {
    id: "t3-democracy", track: 3, technique: "authority",
    title: { mm: "သတင်းအတုနဲ့ ဒီမိုကရေစီ", en: "False information and democracy" },
    meet: {
      sender: "Election Watch", meta: "Telegram · 1d",
      mm: "မဲရုံတွေမှာ လိမ်နေတယ်ဆိုတဲ့ စာ ရွေးကောက်ပွဲ မတိုင်မီ ပျံ့နှံ့နေတယ်။",
      en: '"A claim that polling stations are rigged spreads just before an election."',
    },
    how: {
      mm: "ဒီမိုကရေစီက နိုင်ငံသားတွေ အချက်အလက် မှန်မှန်နဲ့ ဆုံးဖြတ်နိုင်မှ အလုပ်လုပ်ပါတယ်။ သတင်းအတုက အဲဒီ အခြေခံကို တိုက်စားပါတယ် — ယုံကြည်မှု ပျက်စေခြင်း၊ လူတွေကို ကွဲစေခြင်း၊ နောက်ဆုံး ဘာကိုမှ မယုံတော့ဘဲ ဖြစ်စေခြင်း။",
      en: "Democracy works only when citizens can decide using accurate information. False information erodes that foundation: it destroys trust, divides people, and finally leaves them believing nothing at all.",
    },
    tell: {
      mm: "အရေးကြီးတဲ့ ဆုံးဖြတ်ချက် မတိုင်မီ ရုတ်တရက် ပေါ်လာတဲ့ သတင်းကို သတိထားပါ။",
      en: "Be wary of claims that appear suddenly, right before an important decision.",
    },
    practice: {
      mm: "တရားဝင် ဌာနအမည် အတုနဲ့ မဲပေးနည်း လွဲမှားစွာ ကြေညာခြင်း။",
      en: '"A fake official-sounding account announcing the wrong voting procedure."',
      answer: "authority",
    },
    carry: {
      mm: "ဘာကိုမှ မယုံတော့တာက အတုကို ယုံတာလောက်ပဲ အန္တရာယ်ရှိတယ်။",
      en: "Believing nothing is as dangerous as believing the lie.",
    },
    deck: [
      {
        front: { mm: "သတင်းအတုက ဒီမိုကရေစီကို ဘာလို့ ခြိမ်းခြောက်လဲ။", en: "Why does false information threaten democracy?" },
        back: { mm: "နိုင်ငံသားတွေ မှားတဲ့ အချက်အလက်နဲ့ ဆုံးဖြတ်ရင် ဆုံးဖြတ်ချက်က သူတို့ရဲ့ တကယ့်ဆန္ဒ မဟုတ်တော့ပါ။ ရွေးချယ်ခွင့်ကို အတုနဲ့ လှည့်စားခံရတာပါ။", en: "If citizens decide using false facts, the decision is no longer really theirs. Their choice has been manipulated." },
      },
      {
        front: { mm: "ရွေးကောက်ပွဲ သတင်းအတုတွေက ဘယ်လို ပုံစံလဲ။", en: "What does election disinformation look like?" },
        back: { mm: "မဲပေးရမယ့် ရက်၊ နေရာ၊ နည်းလမ်းကို လွဲမှားစွာ ပြောခြင်း။ မဲမသမာမှု အထောက်အထားမဲ့ စွပ်စွဲခြင်း။ ကိုယ်စားလှယ်တွေအကြောင်း လုပ်ကြံ ပြောခြင်း။", en: "Wrong dates, places or procedures for voting. Unevidenced claims of fraud. Fabricated stories about candidates." },
      },
      {
        front: { mm: "ယုံကြည်မှု ပျက်ရင် ဘာဖြစ်လဲ။", en: "What happens when trust collapses?" },
        back: { mm: "လူတွေက အတုကိုပဲ ယုံတာ မဟုတ်ဘဲ ဘာကိုမှ မယုံတော့ပါ။ အဲဒါက အန္တရာယ် ပိုကြီးပါတယ် — အမှန်တရားကို ရှာဖွေဖို့ စိတ်ကူး ကုန်သွားလို့ပါ။", en: "People do not just believe the lie — they stop believing anything. That is worse, because they give up looking for the truth at all." },
      },
      {
        front: { mm: "နိုင်ငံသားတစ်ယောက်အနေနဲ့ ဘာလုပ်နိုင်လဲ။", en: "What can one citizen do?" },
        back: { mm: "မမျှဝေခင် စစ်ပါ။ တရားဝင် ရင်းမြစ်ကနေ မဲပေးနည်းကို အတည်ပြုပါ။ မှားနေတာကို မြင်ရင် ယဉ်ကျေးစွာ အမှန်ပြပါ။ အမုန်းတရား ဖြန့်တာကို မကူညီပါနဲ့။", en: "Check before you share. Confirm voting information from an official source. Correct errors politely when you see them. Do not help spread hate." },
      },
    ],
  },
];

// Concept decks for the twelve original lessons, keyed by lesson id and merged
// in pack.ts. Same rule as above: Learn teaches the words, Play drills the
// reflex. Burmese is DRAFT pending native-speaker review (§15).
export const CORE_DECKS: Record<string, Card[]> = {
  /* ---- track 1 · the six techniques ---- */
  "t1-urgency": [
    { front: { mm: "အရေးပေါ် ဖိအား ဆိုတာ ဘာလဲ။", en: "Fake urgency — what does it mean?" },
      back: { mm: "သင့်ကို တွေးချိန် မပေးဘဲ ချက်ချင်း လုပ်ခိုင်းဖို့ ဖန်တီးထားတဲ့ အချိန်ဖိအားပါ။ အချိန်ကန့်သတ်ချက်၊ “ချက်ချင်း”၊ ခြိမ်းခြောက်မှုတွေက ကြောက်စိတ်ကို နှိုးဆွပါတယ်။", en: "Manufactured time pressure designed to make you act before you think. Countdowns, \"immediately\", and threats all trigger fear." } },
    { front: { mm: "အချိန်ကန့်သတ်ချက်က ဘာလို့ အလုပ်ဖြစ်လဲ။", en: "Why does a deadline work?" },
      back: { mm: "အလျင်လိုလာရင် ဦးနှောက်က ဆင်ခြင်တဲ့ အပိုင်းကို ပိတ်ပြီး အမြန် တုံ့ပြန်တဲ့ အပိုင်းကို သုံးပါတယ်။ အဲဒါက စစ်ဆေးဖို့ အချိန် မရအောင် လုပ်လိုက်တာပါ။", en: "Under time pressure your brain switches from the deliberate mode to the fast-reacting one. That is exactly what removes your chance to check." } },
    { front: { mm: "အလျင်လိုခိုင်းရင် ဘာလုပ်မလဲ။", en: "What do you do when rushed?" },
      back: { mm: "ခဏရပ်ပါ။ စစ်မှန်တဲ့ ဘဏ်၊ ရုံး၊ ဝန်ဆောင်မှုက သင့်ကို အချိန်ကန့်သတ်ပြီး မတိုက်တွန်းပါ။ သိပြီးသား လမ်းကြောင်းကနေ ကိုယ်တိုင် ပြန်ဆက်သွယ်ပါ။", en: "Pause. A real bank, office or service does not put you on a countdown. Contact them yourself through a channel you already know." } },
  ],
  "t1-authority": [
    { front: { mm: "အတုအယောင် အာဏာ ဆိုတာ ဘာလဲ။", en: "False authority — what does it mean?" },
      back: { mm: "ရာထူး၊ တံဆိပ်၊ တရားဝင်ဟန်ကို သုံးပြီး ယုံကြည်မှုကို အလိုအလျောက် ရယူတဲ့ နည်းလမ်းပါ။", en: "Using a title, a logo or an official tone to borrow trust automatically." } },
    { front: { mm: "တံဆိပ်တွေက ဘာလို့ မယုံရလဲ။", en: "Why can't you trust a badge?" },
      back: { mm: "လိုဂို၊ အမည်၊ ဖောင့်၊ ပုံစံ အားလုံးကို မိနစ်ပိုင်းအတွင်း ကူးယူလို့ ရပါတယ်။ တံဆိပ်က အလွယ်ဆုံး တုပလို့ရတဲ့ အရာပါ။", en: "Logos, names, fonts and layouts can be copied in minutes. The badge is the easiest part to fake." } },
    { front: { mm: "ဘယ်လို အတည်ပြုမလဲ။", en: "How do you verify?" },
      back: { mm: "စာထဲက လင့်ခ် ဒါမှမဟုတ် နံပါတ်ကို မသုံးပါနဲ့။ တရားဝင် ဝဘ်ဆိုက် ဒါမှမဟုတ် သိပြီးသား နံပါတ်ကနေ သီးခြား စစ်ပါ။", en: "Do not use the link or number inside the message. Check separately, through the official site or a number you already have." } },
  ],
  "t1-emotion": [
    { front: { mm: "စိတ်လှုပ်ရှား ဆွဲဆောင်မှု ဆိုတာ ဘာလဲ။", en: "Emotional bait — what does it mean?" },
      back: { mm: "ဒေါသ၊ ကြောက်စိတ်၊ ဝမ်းနည်းမှု ဒါမှမဟုတ် ဝမ်းသာမှုကို ရုတ်တရက် ပြင်းထန်စွာ ဖြစ်စေပြီး ဆင်ခြင်မှုကို လျော့ကျစေတဲ့ နည်းလမ်းပါ။", en: "Triggering a sudden spike of anger, fear, grief or joy so that your judgement drops." } },
    { front: { mm: "ခံစားချက်က ဘာလို့ အကာအကွယ်ကို လျော့စေလဲ။", en: "Why does feeling lower your guard?" },
      back: { mm: "ခံစားချက် ပြင်းထန်ချိန်မှာ ဦးနှောက်က အသေးစိတ် စစ်ဆေးတာထက် ချက်ချင်း တုံ့ပြန်တာကို ဦးစားပေးပါတယ်။ အဲဒီအခိုက်အတန့်က လှည့်ကွက်ရဲ့ ရည်ရွယ်ချက်ပါ။", en: "When feeling runs high your brain prioritises reacting over checking. That moment is the whole point of the trick." } },
    { front: { mm: "ခံစားချက် ရုတ်တရက် တက်လာရင်။", en: "When you feel the spike" },
      back: { mm: "အဲဒါကို လက္ခဏာအဖြစ် သတ်မှတ်ပါ။ မမျှဝေခင် ခဏရပ်ပါ။ ခံစားချက် အပြင်းဆုံး ဖြစ်စေတဲ့ စာက အသေချာဆုံး စစ်သင့်တဲ့ စာပါ။", en: "Treat it as the tell. Pause before sharing. The message that stirs the most feeling deserves the most checking." } },
  ],
  "t1-doctored": [
    { front: { mm: "ပြင်ဆင်ထားသော ပုံ/သံ ဆိုတာ ဘာလဲ။", en: "Doctored media — what does it mean?" },
      back: { mm: "ဓာတ်ပုံ၊ ဗီဒီယို ဒါမှမဟုတ် အသံကို ဖြတ်တောက်၊ ပြင်ဆင်၊ ပေါင်းစပ်ပြီး အဓိပ္ပါယ် ပြောင်းလဲထားခြင်းပါ။", en: "Photos, video or audio that have been cropped, edited or recombined to change their meaning." } },
    { front: { mm: "ပုံတစ်ပုံက ဘာလို့ သက်သေ မဟုတ်လဲ။", en: "Why is one image not proof?" },
      back: { mm: "ပုံတစ်ပုံက ဘယ်အချိန်၊ ဘယ်နေရာ၊ ဘာဖြစ်ခဲ့လဲ မပြောပါ။ ဖြတ်တောက်လိုက်ရုံနဲ့ အဓိပ္ပါယ် လုံးဝ ပြောင်းသွားနိုင်ပါတယ်။", en: "An image alone does not tell you when, where or what happened. A crop alone can reverse its meaning." } },
    { front: { mm: "မူရင်းကို ဘယ်လို ရှာမလဲ။", en: "How do you find the original?" },
      back: { mm: "ပုံကို ပြောင်းပြန် ရှာဖွေ (reverse image search) ကြည့်ပါ။ တခြား သတင်းဌာနမှာ ပါမပါ ရှာပါ။ အစောဆုံး တင်ခဲ့တဲ့ နေရာကို လိုက်ကြည့်ပါ။", en: "Try a reverse image search. Look for it in other outlets. Trace back to the earliest posting." } },
  ],
  "t1-expert": [
    { front: { mm: "အတု ကျွမ်းကျင်သူ ဆိုတာ ဘာလဲ။", en: "Fake expert — what does it mean?" },
      back: { mm: "ဆရာဝန်၊ ပါမောက္ခ၊ ပညာရှင်ဟန် ဆောင်ပြီး အထောက်အထား မပါဘဲ ယုံကြည်မှု ရယူခြင်းပါ။", en: "Posing as a doctor, professor or specialist to win belief without offering evidence." } },
    { front: { mm: "တကယ့် ကျွမ်းကျင်သူက ဘာ ချန်ထားလဲ။", en: "What does a real expert leave?" },
      back: { mm: "စစ်ဆေးလို့ရတဲ့ အထောက်အထား — အမည်၊ ဌာန၊ သုတေသန၊ ကိုးကား။ စစ်လို့ရတာက အဓိကပါ။", en: "Evidence you can check — a name, an institution, research, references. The checkability is the point." } },
    { front: { mm: "ဘယ်လို စစ်မလဲ။", en: "How do you check?" },
      back: { mm: "အမည်ကို သီးခြား ရှာပါ။ အဲဒီ ဌာနမှာ တကယ် ရှိမရှိ ကြည့်ပါ။ တခြား ကျွမ်းကျင်သူတွေ သဘောတူမတူ ရှာပါ။", en: "Search the name separately. Check the institution really lists them. See whether other experts agree." } },
  ],
  "t1-context": [
    { front: { mm: "အကြောင်းအရာ လွဲ ဆိုတာ ဘာလဲ။", en: "Out of context — what does it mean?" },
      back: { mm: "အမှန်တကယ် ဖြစ်ခဲ့တဲ့ ပုံ ဒါမှမဟုတ် စကားကို တခြား အချိန်၊ တခြား နေရာ၊ တခြား အကြောင်းအရာနဲ့ တွဲပြီး အဓိပ္ပါယ် လွဲအောင် လုပ်ခြင်းပါ။", en: "Taking something that really happened and attaching it to a different time, place or story so it means something else." } },
    { front: { mm: "အမှန်ကို သုံးပြီး ဘာလို့ လှည့်လို့ရလဲ။", en: "How can something true still mislead?" },
      back: { mm: "ပုံက အတု မဟုတ်လို့ စစ်ဆေးမှုကို ကျော်လွန်သွားပါတယ်။ လိမ်တာက ပုံ မဟုတ်ဘဲ ပုံနဲ့ တွဲထားတဲ့ ဇာတ်လမ်းပါ။", en: "Because the image is not fake, it passes inspection. The lie is not the image — it is the story attached to it." } },
    { front: { mm: "ဘယ်လို စစ်မလဲ။", en: "How do you check?" },
      back: { mm: "ဘယ်တုန်းက၊ ဘယ်မှာလဲ မေးပါ။ ပုံကို ပြောင်းပြန် ရှာပါ။ အစောဆုံး ပေါ်ခဲ့တဲ့ အချိန်နဲ့ အခု ပြောနေတဲ့ အချိန် ကိုက်မကိုက် ကြည့်ပါ။", en: "Ask when and where. Reverse-search the image. Check whether the earliest appearance matches the date now being claimed." } },
  ],

  /* ---- track 2 · AI & synthetic media ---- */
  "t2-voice": [
    { front: { mm: "အသံ ပုံတူ ဆိုတာ ဘာလဲ။", en: "Voice clone — what does it mean?" },
      back: { mm: "AI က အသံနမူနာ စက္ကန့်အနည်းငယ်နဲ့ တစ်ယောက်ယောက်ရဲ့ အသံကို ပုံတူ ဖန်တီးပြီး မပြောဖူးတဲ့ စကားကို ပြောခိုင်းနိုင်တဲ့ နည်းပညာပါ။", en: "AI recreating someone's voice from seconds of audio, and making it say things they never said." } },
    { front: { mm: "ရင်းနှီးတဲ့ အသံကို ဘာလို့ မယုံရလဲ။", en: "Why can't you trust a familiar voice?" },
      back: { mm: "အသံနမူနာက ဗီဒီယို၊ အသံမှတ်တမ်း၊ ဆိုရှယ်မီဒီယာကနေ အလွယ်တကူ ရနိုင်ပါတယ်။ မိသားစုဝင်ရဲ့ အသံလို့ ထင်ရတာ သက်သေ မဟုတ်တော့ပါ။", en: "Samples are easy to take from videos, voice notes and social media. Sounding like a family member is no longer proof." } },
    { front: { mm: "ဖုန်းထဲက အသံက ငွေတောင်းရင်။", en: "If a voice on the phone asks for money" },
      back: { mm: "ဖုန်းချပါ။ သိပြီးသား နံပါတ်ကနေ ကိုယ်တိုင် ပြန်ခေါ်ပါ။ မိသားစုနဲ့ သီးသန့် မေးခွန်းတစ်ခု ကြိုသတ်မှတ်ထားတာလည်း ကူညီပါတယ်။", en: "Hang up and call back on a number you already have. A family code word agreed in advance also helps." } },
  ],
  "t2-deepfake": [
    { front: { mm: "Deepfake ဗီဒီယို ဆိုတာ ဘာလဲ။", en: "Deepfake video — what does it mean?" },
      back: { mm: "AI သုံးပြီး မျက်နှာ၊ နှုတ်ခမ်း လှုပ်ရှားမှု၊ အမူအရာကို ပြောင်းလဲ ဖန်တီးထားတဲ့ ဗီဒီယိုပါ။", en: "Video in which AI has altered a face, lip movements or gestures." } },
    { front: { mm: "ဟောင်းတဲ့ လက္ခဏာတွေ ဘာလို့ မရတော့လဲ။", en: "Why have the old tells stopped working?" },
      back: { mm: "မျက်တောင် မခတ်ခြင်း၊ မျက်နှာ ဆက်စပ်မှု မှားခြင်းလို အမှားတွေကို နည်းပညာက ဖြေရှင်းသွားပါပြီ။ မျက်စိနဲ့ ကြည့်ပြီး ခွဲခြားတာ ယုံကြည်စိတ်ချရတဲ့ နည်းလမ်း မဟုတ်တော့ပါ။", en: "Errors like not blinking or bad face edges have been fixed. Spotting fakes by eye is no longer reliable." } },
    { front: { mm: "ဒါဆို ဘာကို စစ်မလဲ။", en: "So what do you check instead?" },
      back: { mm: "ဗီဒီယိုကို မစစ်ဘဲ ရင်းမြစ်ကို စစ်ပါ။ ယုံရတဲ့ သတင်းဌာနတွေမှာ ဒီအကြောင်း ပါမပါ ရှာပါ။ တစ်နေရာတည်းမှာပဲ ရှိရင် သတိထားပါ။", en: "Check the source, not the pixels. Look for the same event in trusted outlets. If it exists in only one place, be careful." } },
  ],
  "t2-aitext": [
    { front: { mm: "AI ရေးသား စာသား ဆိုတာ ဘာလဲ။", en: "AI-written text — what does it mean?" },
      back: { mm: "AI က ဖန်တီးထားတဲ့ ဆောင်းပါး၊ ပို့စ်၊ မှတ်ချက်တွေပါ။ ချောမွေ့ပြီး ယုံကြည်ရပုံ ရှိပေမယ့် လုံးဝ လုပ်ကြံထားတာ ဖြစ်နိုင်ပါတယ်။", en: "Articles, posts or comments generated by AI. They can read smoothly and confidently while being entirely invented." } },
    { front: { mm: "ချောမွေ့မှုက ဘာလို့ လှည့်စားလဲ။", en: "Why does fluency fool us?" },
      back: { mm: "ကောင်းစွာ ရေးထားတာကို ပညာရှိတဲ့သူ ရေးတယ်လို့ အလိုအလျောက် ထင်တတ်ပါတယ်။ ဒါပေမယ့် ချောမွေ့မှုက စာလုံးအလှပါ၊ အထောက်အထား မဟုတ်ပါ။", en: "We assume polished writing came from someone who knows. But fluency is a property of the prose, not of the facts." } },
    { front: { mm: "ဒါဆို ဘာမေးမလဲ။", en: "So what do you ask?" },
      back: { mm: "ဘယ်သူ ရေးတာလဲ။ ဘယ်အထောက်အထား ကိုးကားထားလဲ။ အဲဒီ ကိုးကားချက်တွေ တကယ် ရှိလား စစ်ကြည့်ပါ။", en: "Who wrote it? What sources does it cite? Then check whether those sources actually exist." } },
  ],

  /* ---- track 3 · information integrity ---- */
  "t3-source": [
    { front: { mm: "ရင်းမြစ် ဆိုတာ ဘာလဲ။", en: "Source — what does it mean?" },
      back: { mm: "အချက်အလက် အမှန်တကယ် ထွက်လာတဲ့ နေရာပါ — မျှဝေခဲ့သူ မဟုတ်ဘဲ ပထမဆုံး ထုတ်ပြန်ခဲ့သူပါ။", en: "Where the information actually originated — not who shared it with you, but who first published it." } },
    { front: { mm: "ဘယ်သူ ပြောတာလဲ၊ ဘာကြောင့်လဲ။", en: "Who is saying this, and why?" },
      back: { mm: "သတင်းတိုင်းမှာ ဖန်တီးသူ၊ ရန်ပုံငွေ၊ ရည်ရွယ်ချက် ရှိပါတယ်။ ဒီနှစ်ခု မေးလိုက်ရုံနဲ့ အများစုကို စစ်ထုတ်နိုင်ပါတယ်။", en: "Every message has a creator, funding and a motive. Those two questions filter out most of it." } },
    { front: { mm: "ရင်းမြစ် မတွေ့ရင် ဘာလုပ်မလဲ။", en: "What if you cannot find a source?" },
      back: { mm: "ရင်းမြစ် မရှိတာ ကိုယ်တိုင်က လက္ခဏာတစ်ခုပါ။ မမျှဝေပါနဲ့။ “ဘယ်ကလာတာလဲ” လို့ မေးလိုက်ရုံနဲ့ တော်တော်များများ ရပ်သွားပါတယ်။", en: "The absence of a source is itself a tell. Do not share it. Simply asking \"where is this from?\" stops a great deal." } },
  ],
  "t3-rumour": [
    { front: { mm: "ကောလာဟလ ဘာလို့ ပိုမြန်လဲ။", en: "Why do rumours travel faster?" },
      back: { mm: "အံ့အားသင့်စေတာ၊ ဒေါသဖြစ်စေတာက မျှဝေချင်စိတ်ကို ချက်ချင်း ဖြစ်စေပါတယ်။ မှန်ကန်တဲ့ ပြင်ဆင်ချက်ကတော့ စိတ်လှုပ်ရှားစရာ မဟုတ်လို့ နှေးပါတယ်။", en: "Shock and anger create an immediate urge to share. A correction is not exciting, so it moves slowly." } },
    { front: { mm: "ပြင်ဆင်ချက်က ဘာလို့ မမီလိုက်လဲ။", en: "Why does the correction never catch up?" },
      back: { mm: "ပြင်ဆင်ချက် ရောက်တဲ့အချိန်မှာ လူတွေ မူရင်းကို မြင်ပြီးသားပါ။ တစ်ချို့က ပြင်ဆင်ချက်ကို လုံးဝ မမြင်လိုက်ပါ။", en: "By the time it arrives, people have already seen the original. Many never see the correction at all." } },
    { front: { mm: "မမျှဝေခင် ဘာလုပ်မလဲ။", en: "What do you do before sharing?" },
      back: { mm: "အမြန်ဆုံး ဖြန့်ချင်စိတ် ဖြစ်လာရင် ခဏရပ်ပါ။ အဲဒီ အလျင်လိုစိတ်ကိုယ်တိုင်က ဒီဇိုင်း လုပ်ထားတာပါ။ ရင်းမြစ်ကို အရင် စစ်ပါ။", en: "If you feel the urge to share fast, pause. That urge is the designed effect. Check the source first." } },
  ],
  "t3-skept": [
    { front: { mm: "သံသယ ဆိုတာ ဘာလဲ။", en: "Skepticism — what does it mean?" },
      back: { mm: "ယုံမယုံ ဆုံးဖြတ်ခင် အထောက်အထား တောင်းတဲ့ အလေ့အထပါ။ စစ်ဆေးဖို့ ဆန္ဒ ရှိနေသေးတာက အဓိကပါ။", en: "The habit of asking for evidence before deciding what to believe. The key part is that you are still willing to check." } },
    { front: { mm: "အယုံအကြည် ကင်းမှု ဆိုတာ ဘာလဲ။", en: "Cynicism — what does it mean?" },
      back: { mm: "ဘာကိုမှ မယုံတော့တဲ့ အခြေအနေပါ။ စစ်ဆေးဖို့ကို လုံးဝ စွန့်လွှတ်လိုက်တာမို့ သံသယနဲ့ လုံးဝ မတူပါ။", en: "Believing nothing at all. It is not the same as skepticism, because you have given up checking entirely." } },
    { front: { mm: "အယုံအကြည် ကင်းမှုက ဘာလို့ အန္တရာယ်ရှိလဲ။", en: "Why is cynicism dangerous too?" },
      back: { mm: "အားလုံး မှားတယ်လို့ ယူဆရင် မှန်တဲ့ သတင်း — ကျန်းမာရေး၊ ဘေးအန္တရာယ်၊ ရွေးကောက်ပွဲ အချက်အလက် — တွေကိုပါ လက်လွှတ်ရပါတယ်။ လိမ်သူတွေအတွက် အဲဒါက အနိုင်ရတာပါ။", en: "If everything is false, you also lose the true things — health, safety and election information. For a manipulator, that counts as a win." } },
  ],
};
