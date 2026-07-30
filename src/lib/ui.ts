"use client";

import { useLang } from "./lang";

// All user-facing chrome strings in one place, so the app-wide language toggle
// (lang.ts) reaches every screen and a native-speaker reviewer has ONE file to
// read instead of hunting ternaries through the UI (§15 review is blocking).
//
// Burmese is primary (§11). Every mm string here is DRAFT pending native review.
// Content strings (scenarios, lessons, techniques) live in content/pack.ts —
// this file is only the surrounding interface.
const S = {
  // --- loop stepper ---
  stepSee: { mm: "မြင်", en: "See" },
  stepName: { mm: "အမည်တပ်", en: "Name" },
  stepBuild: { mm: "တည်ဆောက်", en: "Build" },
  frameSee: { mm: "စာကို ဖတ်ကြည့်ပါ။ ပထမ ခံစားချက်က ဘာလဲ။", en: "Read the message. What's your gut say?" },
  frameName: { mm: "နည်းစနစ် ခြောက်ခုထဲက ဘယ်ဟာ အလုပ်လုပ်နေလဲ။", en: "Which of the six techniques is at work?" },
  frameBuild: { mm: "ကိုယ်တိုင် တစ်ခု လုပ်ကြည့်ပါ — အဲဒါက မှတ်မိစေတယ်။", en: "Make one yourself — that's what makes it stick." },

  // --- shared ---
  pokeMascot: { mm: "စုံထောက်လေးကို နှိပ်ကြည့်ပါ", en: "Poke the little detective" },
  back: { mm: "‹ နောက်သို့", en: "‹ Back" },
  casebookBack: { mm: "‹ မှတ်စု", en: "‹ Casebook" },
  nextCase: { mm: "နောက် အမှု →", en: "Next case →" },

  // --- See ---
  seeCase: { mm: "အမှု", en: "CASE" },
  newCase: { mm: "အမှုသစ်", en: "New case" },
  arrivedOn: { mm: "ဒီစာ ရောက်လာတဲ့ နေရာ", en: "This arrived on" },
  whatWouldYouDo: { mm: "သင် ဘာလုပ်မလဲ။", en: "What would you do?" },
  voteTrust: { mm: "ယုံတယ်", en: "Trust it" },
  voteNotSure: { mm: "မသေချာဘူး", en: "Not sure" },
  voteDoubt: { mm: "သံသယရှိတယ်", en: "Doubt it" },
  noPenalty: { mm: "သေချာကြည့်လို့ ဒဏ်မရှိပါ။ ရိုးရိုးသားသား ရွေးပါ။", en: "No penalty for looking closer. Pick honestly." },

  // --- See result ---
  lookCloser: { mm: "အခု ပိုသေချာ ကြည့်ပါ", en: "Now look closer" },
  nameTechniqueCta: { mm: "နည်းစနစ်ကို အမည်တပ်ပါ →", en: "Name the technique →" },
  realHead: { mm: "ဒါက အစစ်ပါ။", en: "This one's real." },
  realBody: { mm: "ယုံလိုက်တာ မှန်ပါတယ် — အစစ်ကို အတုလို့ ခေါ်တာလည်း တိကျမှု ဆုံးရှုံးစေတယ်။", en: "Trusting it was the right call — calling real messages fake costs accuracy too." },
  genuineHead: { mm: "ကောင်းတယ် — ဒါက အစစ်ပါ။", en: "Good — this one's genuine." },
  genuineBody: { mm: "အမှန်ကို ယုံတတ်တာ ကျွမ်းကျင်မှုတစ်ခုပါ။ ဒါပေမယ့် မသိတဲ့ ပို့သူကို စစ်ပါ။", en: "Trusting true things is a skill. Still, verify senders you don't recognise." },
  closerHead: { mm: "ပိုကြည့်သင့်တယ်။", en: "Worth a closer look." },
  closerBody: { mm: "ဒီထဲမှာ သင့်ကို လှုံ့ဆော်ဖို့ ဖန်တီးထားတာ ရှိတယ် — ဘယ်အပိုင်းလဲ ရှာကြည့်ရအောင်။", en: "Something here is built to move you — let's find the part doing it." },
  confusingHead: { mm: "မှန်ပါတယ် — ရှုပ်အောင် ဖန်တီးထားတာပါ။", en: "Fair — it's designed to be confusing." },
  confusingBody: { mm: "ဒီအပိုင်းက သဲလွန်စပါ။", en: "Here's the fragment that tips it." },
  instinctHead: { mm: "ခံစားချက် ကောင်းတယ်။", en: "Good instinct." },
  instinctBody: { mm: "ဒီထဲမှာ သင့်အပေါ် အလုပ်လုပ်ဖို့ ဖန်တီးထားတာ ရှိတယ်။", en: "Something here is designed to work on you." },
  balanceGenuine: { mm: "စာတိုင်းက ထောင်ချောက် မဟုတ်ပါ။ အစစ်ကို ယုံတတ်တာလည်း ကျွမ်းကျင်မှုတစ်ဝက်ပါ — ရည်မှန်းချက်က မျက်စိရှင်းဖို့၊ အားလုံးကို သံသယဖြစ်ဖို့ မဟုတ်ပါ။", en: "Not every message is a trap. Trusting real ones is half the skill — the goal is a sharp eye, not blanket suspicion." },
  balanceFake: { mm: "အစစ်တွေလည်း ရှိပါတယ်။ အစစ်ကို အတုလို့ ခေါ်တာက တိကျမှု ဆုံးရှုံးစေတယ် — မျက်စိရှင်းဖို့ ရည်မှန်းပါ။", en: "Real messages exist too. Calling a real one fake costs accuracy — aim for a sharp eye, not blanket suspicion." },

  // --- Name ---
  pasteYourOwn: { mm: "ကိုယ်ပိုင် စာ ထည့်ပါ ›", en: "Paste your own ›" },
  whichTechnique: { mm: "ဒါ ဘယ်နည်းစနစ် သုံးထားလဲ။", en: "Which technique is this using?" },
  pickAsMany: { mm: "သက်ဆိုင်သမျှ ရွေးပါ — အစစ်ထင်ရင် တစ်ခုမှ မရွေးပါနဲ့။", en: "Pick as many as apply — or none if it looks genuine." },
  check: { mm: "စစ်ဆေးပါ", en: "Check" },
  looksGenuine: { mm: "အစစ် ထင်ပါတယ်", en: "It looks genuine" },
  whyDoesThisWork: { mm: "ဘာကြောင့် အလုပ်ဖြစ်လဲ။ သင်ခန်းစာ ဖတ်ပါ ›", en: "Why does this work? Read the lesson ›" },
  tryBuilding: { mm: "တစ်ခု တည်ဆောက်ကြည့်ပါ →", en: "Try building one →" },

  // --- Build ---
  pickRole: { mm: "အခန်းကဏ္ဍ ရွေးပါ", en: "Pick a role" },
  pickTechniques: { mm: "နည်းစနစ် ၂-၃ ခု ရွေးပါ", en: "Pick 2–3 techniques" },
  yourGoal: { mm: "သင့် ရည်ရွယ်ချက်", en: "Your goal" },
  writeIt: { mm: "ရေးကြည့်ပါ →", en: "Write it →" },
  fillFromDeck: { mm: "ဖဲထုပ်ထဲက ဖြည့်ပါ", en: "Fill from the deck" },
  seeIfFool: { mm: "လူတွေကို လှည့်နိုင်မလား ကြည့်ပါ", en: "See if it would fool people" },
  buildEmptyHint: { mm: "အောက်က အပိုင်းအစတွေကို နှိပ်ပြီး စာအတု တစ်စောင် တည်ဆောက်ပါ။ ဒီစာမျက်နှာထဲမှာပဲ ရှိနေမှာပါ။", en: "Tap fragments below to assemble a fake message. It stays locked to this screen." },
  gameContentBanner: { mm: "ဂိမ်း အကြောင်းအရာ — အတု · ကူးယူ၊ မျှဝေ မရပါ", en: "GAME CONTENT — FAKE · CANNOT BE COPIED OR SHARED" },
  backToDefence: { mm: "ကာကွယ်ရေးဘက် ပြန်သွားပါ →", en: "Back to defence — see your progress →" },
  buildStickNote: { mm: "တစ်ခါ ကိုယ်တိုင် တည်ဆောက်ပြီးရင် သဘာဝထဲမှာ မှတ်မိလာပါလိမ့်မယ်။ အဲဒါက ဒီအဆင့်ရဲ့ ရည်ရွယ်ချက်ပါ။", en: "Now you've built one, you'll recognise it in the wild. That's the whole point of the seat." },
  goalFallback: { mm: "ရည်ရွယ်ချက် သတ်မှတ်ဖို့ အပေါ်က အခန်းကဏ္ဍ တစ်ခု ရွေးပါ။", en: "Pick a role above to set your goal." },
  // Build result. Every line here is derived from what the player actually
  // tapped — there is no invented audience and no invented number.
  buildUses: { mm: "သင် သုံးထားတဲ့ နည်းစနစ်များ", en: "Techniques you used" },
  buildNotUsed: { mm: "မသုံးထားသေးတာ", en: "Left unused" },

  // --- You / progress ---
  youTab: { mm: "မှတ်တမ်း", en: "YOU" },
  techniquesYouCanName: { mm: "သင် အမည်တပ်နိုင်တဲ့ နည်းစနစ်များ", en: "Techniques you can name" },
  progressNote: { mm: "တိုးတက်မှုကို သင်ရရှိထားတဲ့ ကျွမ်းကျင်မှုနဲ့ တိုင်းတာပါတယ် — အမှတ် သို့ ပြီးဆုံးသင်ခန်းစာ အရေအတွက်နဲ့ မဟုတ်ပါ။", en: "Progress is measured by the skill you carry — not points or lessons finished." },
  nextRank: { mm: "နောက်တစ်ဆင့်", en: "next" },
  topRank: { mm: "အမြင့်ဆုံး အဆင့် — ဆက်ထိန်းထားပါ", en: "top rank — stay sharp" },
  forFacilitators: { mm: "သင်ကြားပေးသူများအတွက်", en: "For facilitators" },
  fiveQuestionCheck: { mm: "မေးခွန်း ၅ ခု စစ်ဆေးမှု", en: "Run the 5-question check" },
  printDeck: { mm: "ကတ်ဖဲထုပ် ပုံနှိပ်ပါ (PDF)", en: "Print the card deck (PDF)" },
  genuineTrusted: { mm: "သင် ယုံခဲ့တဲ့ စစ်မှန်သော စာများ", en: "Genuine messages you trusted" },
  trustingIsSkill: { mm: "အစစ်ကို ယုံတတ်တာလည်း ကျွမ်းကျင်မှုတစ်ခုပါ", en: "trusting real messages is a skill too" },

  // --- Learn hub ---
  theCasebook: { mm: "မှတ်စုစာအုပ်", en: "The casebook" },
  whyTricksWork: { mm: "လှည့်ကွက်တွေ ဘာကြောင့် အလုပ်ဖြစ်လဲ။", en: "Why the tricks work." },
  hubIntro: { mm: "ကစားခြင်း နောက်ကွယ်က သင်ခန်းစာ တိုတွေ။ တစ်ခုစီ လက်တွေ့နဲ့ ဆုံးပါတယ် — အမှန်ခြစ် တစ်ခုနဲ့ မဟုတ်ပါ။ ဖတ်ရုံနဲ့ မပြောင်းလဲပါ၊ သဘာဝထဲမှာ နည်းစနစ်ကို အမည်တပ်နိုင်မှ ပြောင်းလဲပါတယ်။", en: "Short lessons behind the loop. Every lesson ends in practice, never a checkbox. Reading alone changes nothing; naming a technique in the wild does." },
  practisedOf: { mm: "လေ့ကျင့်ပြီး", en: "practised" },

  // --- Lesson beats ---
  meetIt: { mm: "တွေ့ကြည့်ပါ", en: "Meet it" },
  howItWorks: { mm: "ဘယ်လို အလုပ်လုပ်လဲ", en: "How it works" },
  theTell: { mm: "သဲလွန်စ", en: "The tell" },
  practice: { mm: "လက်တွေ့", en: "Practice" },
  carryIt: { mm: "သယ်သွားပါ", en: "Carry it" },
  readAsArrives: { mm: "ရောက်လာတဲ့ အတိုင်း ဖတ်ပါ — အခုထိ ဘာမှ မပြောသေးပါ။", en: "Read it the way it would arrive — no framing yet." },
  continue: { mm: "ဆက်သွားပါ →", en: "Continue →" },
  copied: { mm: "ကူးပြီးပါပြီ", en: "Copied" },
  copyLine: { mm: "ဒီစာကြောင်းကို ကူးပါ", en: "Copy this line" },
  toTheLoop: { mm: "ကစားခြင်းဆီ →", en: "To the loop →" },

  // --- lesson deck (every step is a card) ---
  kindConcept: { mm: "အယူအဆ", en: "Concept" },
  howQuestion: { mm: "ဒါက ဘယ်လို အလုပ်လုပ်လဲ။", en: "How does this work?" },
  tellNote: { mm: "တစ်ကြောင်းတည်းပါ။ ဒါတစ်ခုပဲ မှတ်မိရင် လုံလောက်ပါတယ်။", en: "One sentence. If you remember only this, that's enough." },
  sayThisToSomeone: { mm: "တစ်ယောက်ယောက်ကို ဒီလို ပြောပါ", en: "Say this to someone" },
  // The carry line's job, said plainly. Without this the copy button is a
  // mystery: nothing told the learner who it is for or when to use it.
  carryWhatFor: { mm: "တစ်ယောက်ယောက်က သံသယဖြစ်စရာ တစ်ခု မျှဝေတဲ့အခါ ဒီစာကြောင်းကို ကူးပြီး chat ထဲမှာ ပြန်ကပ်ပါ။ ငြင်းခုံစရာ မလိုပါ။", en: "When someone shares something suspicious, copy this line and paste it into the chat. No argument needed." },
  carryShareNote: { mm: "Sone Dauk Lay ထဲမှာ မျှဝေဖို့ ရည်ရွယ်တဲ့ တစ်ခုတည်းသော အရာပါ။ လက်ဆင့်ကမ်းပါ။", en: "The only thing in Sone Dauk Lay you're meant to share. Pass it on." },
  namedIt: { mm: "အမည်တပ်နိုင်ပြီ — အဲဒါပဲ။", en: "Named it — that's the move." },
  theMoveHere: { mm: "ဒီမှာ သုံးထားတာက", en: "The move here is" },
  pickOneToContinue: { mm: "ဆက်သွားရန် တစ်ခု ရွေးပါ", en: "Pick one to continue" },
  practiseInLoop: { mm: "ကစားခြင်းထဲမှာ လေ့ကျင့်ပါ →", en: "Practise this in the loop →" },
  backToCasebook: { mm: "မှတ်စုစာအုပ်ဆီ ပြန်သွားပါ", en: "Back to the casebook" },
  lessonFinish: { mm: "ပြီးပါပြီ →", en: "Done →" },

  // --- flashcards ---
  cardsTitle: { mm: "အယူအဆ ကတ်များ", en: "Concept cards" },
  tapToFlip: { mm: "လှန်ကြည့်ရန် နှိပ်ပါ", en: "tap to flip" },
  cardNext: { mm: "နောက်ကတ် →", en: "Next card →" },
  cardPrev: { mm: "‹ ပြန်", en: "‹ Back" },
  deckDone: { mm: "ဒီအစုံ ပြီးပါပြီ။", en: "That's the deck." },
  deckDoneNote: { mm: "ဒီစကားလုံးတွေက သင်နဲ့အတူ ပါသွားပါလိမ့်မယ်။", en: "These words travel with you." },
  // Recovers the source documents' homework intent in a form that works with no
  // teacher, no classmates and no paper — the one thing the app can actually ask
  // a teenager to do alone.
  carryIntoWorld: { mm: "သယ်သွားစရာ", en: "Take it with you" },
  carryIntoWorldBody: { mm: "ဒီအပတ် သင့် feed ထဲမှာ ဒီနည်းစနစ်တစ်ခုကို တွေ့ရင် စိတ်ထဲမှာ အမည်တပ်ကြည့်ပါ။ ဘယ်သူ့ကိုမှ ပြောစရာ မလိုပါ။ အမည်တပ်နိုင်တာကိုယ်တိုင်က ကျွမ်းကျင်မှုပါ။", en: "This week, when one of these shows up in your own feed, name it silently to yourself. You don't have to tell anyone. Being able to name it is the skill." },
  backToLesson: { mm: "သင်ခန်းစာဆီ ပြန်သွားပါ →", en: "Back to the lesson →" },

  // --- Lens ---
  lensTitle: { mm: "မှန်ဘီလူး", en: "The Lens" },
  lensSub: { mm: "အတူကြည့်ပေးတယ် · ဘယ်တော့မှ အဆုံးအဖြတ် မပေးပါ", en: "looks with you · never a verdict" },
  lensPick: { mm: "အတူကြည့်ဖို့ တစ်ခု ရွေးပါ", en: "Pick something to look at together" },
  lensSentMoney: { mm: "ငွေ လွှဲပြီးသွားပြီ →", en: "I already sent money →" },
  lensAsk: { mm: "မေးပါ", en: "Ask" },
  lensAskPlaceholder: { mm: "သင့်စကားနဲ့ မေးပါ", en: "ask in your own words" },
  lensLookAnother: { mm: "နောက်တစ်ခု ကြည့်ပါ →", en: "Look at another →" },
  lensClose: { mm: "ပိတ်ပါ", en: "Close" },
  lensHelp: { mm: "အကူအညီ", en: "Help" },
  whatYouCanCheck: { mm: "သင်ကိုယ်တိုင် စစ်နိုင်တာများ", en: "What you can check yourself" },
  whatICantKnow: { mm: "ကျွန်တော် မသိနိုင်တာ", en: "What I can't know" },

  // --- celebration ---
  rankUp: { mm: "အဆင့် တက်ပြီ", en: "rank up" },
  youreNowA: { mm: "သင် ယခု ဖြစ်ပါပြီ", en: "You're now a" },
  rankUpBody: { mm: "နည်းစနစ်တွေကို တကယ် အမည်တပ်နိုင်လို့ ရတာပါ။ မြေပုံပေါ်မှာ ပိုခက်တဲ့ အမှုတွေ ပွင့်နေနိုင်ပါတယ်။", en: "You earned it by naming techniques for real. Harder cases may be open on the map." },
  keepGoing: { mm: "ဆက်သွားပါ →", en: "Keep going →" },
  levelCleared: { mm: "အဆင့် ပြီးပြီ", en: "level cleared" },
  youCleared: { mm: "သင် ပြီးမြောက်ပါပြီ", en: "You cleared" },
  levelClearedBody: { mm: "မျက်စိ ရှင်းပါတယ်။ နောက်အဆင့်အတွက် မြေပုံဆီ ပြန်သွားပါ၊ ဒါမှမဟုတ် ဒီမှာ ဆက်ကစားပါ။", en: "That's a sharp eye. Head back to the map for the next level, or stay and play another case here." },
  nice: { mm: "ကောင်းပါတယ် →", en: "Nice →" },

  // --- Pass-and-play round (DESIGN.md §16) ---
  tableTitle: { mm: "စားပွဲဝိုင်း ကစားနည်း", en: "Table round" },
  tableSub: { mm: "သူငယ်ချင်း ၃-၄ ယောက်၊ ဖုန်းတစ်လုံး။ အင်တာနက် မလိုပါ။", en: "3-4 friends, one phone. No internet needed." },
  tableStart: { mm: "စားပွဲဝိုင်း စတင်ပါ →", en: "Start a table round →" },
  tableHowTitle: { mm: "ဘယ်လို ကစားရလဲ", en: "How it works" },
  tableHowBody: {
    mm: "လူတိုင်း ဖုန်းကို တစ်ယောက်ချင်း လျှို့ဝှက် ကြည့်ပြီး တူညီတဲ့ အဖြေတစ်ခုကို ယုံအောင် စာတစ်ကြောင်း ရေးပါတယ်။ တစ်ယောက်ကတော့ လှည့်စားသူ ဖြစ်ပြီး သက်သေနဲ့ မဟုတ်ဘဲ လှည့်ကွက်တစ်ခုနဲ့ ဖျောင်းဖျရမှာပါ။ ပြီးရင် အားလုံး အသံထွက် ဆွေးနွေးပြီး ဘယ်သူလဲ ခန့်မှန်းကြပါတယ်။",
    en: "Everyone takes the phone privately and writes one line arguing for the SAME conclusion. One of you is the Manipulator, who must persuade with a trick instead of a reason. Then you talk it out and work out who.",
  },
  playersLabel: { mm: "ကစားသမားများ", en: "Players" },
  addPlayer: { mm: "+ ကစားသမား ထည့်ပါ", en: "+ Add player" },
  removePlayer: { mm: "ဖယ်ရှားပါ", en: "Remove" },
  playerNamePlaceholder: { mm: "နာမည်", en: "Name" },
  pickHat: { mm: "ဦးထုပ် ရွေးပါ", en: "Pick a hat" },
  hatDeerstalker: { mm: "စုံထောက် ဦးထုပ်", en: "Deerstalker" },
  hatBeanie: { mm: "ဘောလုံးပါ ဦးထုပ်", en: "Bobble beanie" },
  hatNewsboy: { mm: "သတင်းသည် ဦးထုပ်", en: "Newsboy cap" },
  hatVisor: { mm: "နဖူးစည်း", en: "Visor" },
  hatTaken: { mm: "ယူပြီး", en: "taken" },
  needThreePlayers: { mm: "ကစားသမား ၃ ယောက် အနည်းဆုံး လိုပါတယ်၊ နာမည်တွေ ထည့်ပါ။", en: "You need at least 3 players, each with a name." },
  dealRound: { mm: "အခန်းကဏ္ဍ ဝေပါ →", en: "Deal the round →" },
  passTo: { mm: "ဖုန်းကို ပေးပါ", en: "Pass the phone to" },
  passGate: { mm: "သင်တစ်ယောက်တည်း မြင်ရတဲ့အခါ နှိပ်ပါ", en: "Tap when only you can see" },
  passGateWarn: { mm: "အခြားသူများ မကြည့်ပါနှင့်", en: "Everyone else, look away" },

  // Role cards. These are PRIVATE — only the player holding the phone sees
  // them — so they say the role outright. Hiding it from the player removes
  // the game.
  youAreDetective: { mm: "သင်က စုံထောက် ဖြစ်တယ်", en: "You are a Detective" },
  youAreManipulator: { mm: "သင်က လှည့်စားသူ ဖြစ်တယ်", en: "You are the Manipulator" },
  detectiveBrief: { mm: "စစ်လို့ရတဲ့ အကြောင်းပြချက်နဲ့ ဖျောင်းဖျပါ။", en: "Persuade with a reason someone can check." },
  detectiveWarn: { mm: "ဒီအထဲမှာ လှည့်စားသူ တစ်ယောက် ရှိတယ်။", en: "One of you is the Manipulator." },
  manipulatorBrief: { mm: "သက်သေနဲ့ မဟုတ်ဘဲ သင့်လှည့်ကွက်နဲ့ ဖျောင်းဖျပါ။", en: "Persuade with your technique, not a reason." },
  manipulatorWarn: { mm: "မဖမ်းမိပါစေနဲ့။", en: "Don't get caught." },
  yourTechnique: { mm: "သင့် လှည့်ကွက်", en: "Your technique" },
  techniqueLooksLike: { mm: "ဒါက ဘယ်လို ပုံစံလဲ", en: "What it looks like" },
  everyoneArgues: { mm: "အားလုံး ဖျောင်းဖျရမယ့် အချက်", en: "Everyone must argue" },
  theSituation: { mm: "အခြေအနေ", en: "The situation" },
  reasonHelpers: { mm: "စစ်လို့ရတဲ့ အကြောင်းပြချက် နမူနာများ", en: "Checkable reasons you could use" },
  techniqueHelpers: { mm: "လှည့်ကွက် အပိုင်းအစများ", en: "Trick fragments you could use" },
  writeOneLine: { mm: "စာတစ်ကြောင်း ရေးပါ", en: "Write one line" },
  doneHide: { mm: "ပြီးပြီ — ဖုံးပါ", en: "Done — hide it" },

  lineUpTitle: { mm: "စာကြောင်းအားလုံး", en: "Every line" },
  lineUpBody: { mm: "ဖုန်းကို စားပွဲပေါ် တင်ပါ။ အသံထွက် ဆွေးနွေးပါ။ သက်သေမပါဘဲ လှည့်ကွက်နဲ့ ဖျောင်းဖျနေတာ ဘယ်သူလဲ။", en: "Put the phone on the table. Talk it out. Who persuaded with a trick instead of a reason?" },
  talkThenVote: { mm: "ဆွေးနွေးပြီးရင် မဲပေးပါ →", en: "Talked it out — now vote →" },
  voteTitle: { mm: "ဘယ်သူက လှည့်စားသူလဲ", en: "Who was the Manipulator?" },
  voteGate: { mm: "မဲပေးရန် ဖုန်းကို ယူပါ", en: "Take the phone to vote" },
  lockVote: { mm: "မဲ သတ်မှတ်ပါ", en: "Lock in vote" },
  revealTitle: { mm: "လှည့်စားသူက", en: "The Manipulator was" },
  usedTechnique: { mm: "သုံးခဲ့တဲ့ လှည့်ကွက်", en: "The technique used" },
  foolCountNone: { mm: "ဘယ်သူမှ မလှည့်စားခံရပါ။", en: "Nobody was fooled." },
  foolCountOne: { mm: "တစ်ယောက် လှည့်စားခံရတယ်။", en: "One player was fooled." },
  foolCountMany: { mm: "ယောက် လှည့်စားခံရတယ်။", en: "players were fooled." },
  votedFor: { mm: "မဲပေးခဲ့သူ", en: "Who voted for whom" },
  revealNote: { mm: "ဒီအရေအတွက်က တကယ့် မဲတွေကနေ တွက်ထားတာပါ။", en: "That number comes from the votes actually cast." },
  playAgain: { mm: "နောက်တစ်ပွဲ →", en: "Play again →" },
  leaveTable: { mm: "စားပွဲမှ ထွက်ပါ", en: "Leave the table" },

  // --- footer / misc ---
  footerNote: { mm: "အန္တရာယ်အဆင့် မရှိ၊ အဆုံးအဖြတ် မရှိ — အမည်တပ်ထားတဲ့ နည်းစနစ်နဲ့ သဲလွန်စသာ။ မြန်မာစာများမှာ မူကြမ်းဖြစ်ပြီး ဌာနေစကားပြောသူ စစ်ဆေးရန် ကျန်ရှိပါသည်။", en: "No risk tiers, no verdicts — only named techniques and their tells. Burmese strings are drafts pending native-speaker review." },
} as const;

export type UIKey = keyof typeof S;

/** Reactive translator. `const t = useT(); t("check")` */
export function useT() {
  const lang = useLang();
  return (k: UIKey): string => S[k][lang];
}
