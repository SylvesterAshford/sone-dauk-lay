// Client-side scam-defense logic, ported verbatim from the approved San Dauk Lay design.
// These modules run entirely in the browser (no real AI/ML) — exactly as the PRD specifies.

export type Tier = {
  label: string;
  color: string;
  face: string;
  g: boolean;
  a: boolean;
  r: boolean;
  advice: string;
};

export const CHECKS = [
  {
    title: "Pressure to act right now",
    sub: '"Urgent!", "within 24 hours", "your account will be locked"',
  },
  {
    title: "Asks for money or gift cards",
    sub: 'Transfers, fees, top-up cards, "small processing charge"',
  },
  {
    title: "Strange or shortened links",
    sub: 'bit.ly, odd domains, "click here to verify"',
  },
  {
    title: "Wants your OTP or password",
    sub: "No legitimate service ever asks for these",
  },
  {
    title: "Too good to be true",
    sub: "Prizes, lotteries, free money you never entered for",
  },
] as const;

export const RULES: { key: string; re: RegExp }[] = [
  {
    key: "Urgent pressure",
    re: /(urgent|immediately|right now|act now|within 24|expires?|last chance|hurry|suspend|locked)/i,
  },
  {
    key: "Money request",
    re: /(money|transfer|gift ?card|payment|fee\b|wire|cash|kyat|\bks\b|\$)/i,
  },
  {
    key: "Private codes",
    re: /(otp|verification code|passcode|password|\bpin\b|one[- ]time)/i,
  },
  {
    key: "Suspicious link",
    re: /(https?:\/\/|www\.|bit\.ly|tinyurl|\.xyz|click (the )?link)/i,
  },
  {
    key: "Prize bait",
    re: /(congratulations|winner|you (have )?won|prize|lottery|free gift|reward\b)/i,
  },
];

export const LESSONS = [
  {
    title: "Check the sender",
    tip: "Real organisations don’t text from random personal numbers.",
  },
  {
    title: "Protect OTP codes",
    tip: "No bank, shop, or friend legitimately needs your code. Ever.",
  },
  {
    title: "Pause money pressure",
    tip: "Urgency is the scammer’s best tool. Wait an hour — real things keep.",
  },
  {
    title: "Inspect links",
    tip: "Expand shortened links and read the real domain before tapping.",
  },
  {
    title: "Save evidence",
    tip: "Screenshot the message before you block or delete anything.",
  },
  {
    title: "Report safely",
    tip: "Tell your bank or the platform directly — never reply to the scammer.",
  },
] as const;

export const TYPES = [
  "Fake shop",
  "Phishing link",
  "OTP request",
  "Money emergency",
  "Prize message",
] as const;

export const CHANNELS = ["SMS", "Messenger", "Viber", "Email", "Phone call"] as const;

export const EXAMPLE =
  "CONGRATULATIONS! Your number won a 500,000 Ks lottery prize. To claim, reply with the OTP code we just sent you and transfer a 3,000 Ks processing fee within 24 hours: http://bit.ly/claim-prize-now";

export function tier(n: number): Tier {
  if (n === 0)
    return {
      label: "All clear",
      color: "#3f9e6e",
      face: "#dff0e4",
      g: true,
      a: false,
      r: false,
      advice:
        "No signs spotted. Still — verify senders you don’t recognise, detective.",
    };
  if (n < 3)
    return {
      label: "Be careful",
      color: "#cb8f2c",
      face: "#f5e9c8",
      g: false,
      a: true,
      r: false,
      advice:
        "Slow down. Verify the sender through another channel before you reply, click, or pay.",
    };
  return {
    label: "High risk",
    color: "#c25438",
    face: "#f3ded6",
    g: false,
    a: false,
    r: true,
    advice:
      "Do not reply, pay, click, or share codes. Block the sender and report it.",
  };
}

export function dots(score: number, color: string) {
  return [0, 1, 2, 3, 4].map((i) => ({ bg: i < score ? color : "#d5e3d8" }));
}
