"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type TeamMember = {
  name: string;
  role: string;
  image: string;
  position: string;
};

// Names are deliberately kept in one small data block so the portraits never
// need to be touched when team details change.
const TEAM: TeamMember[] = [
  { name: "Khin Myat Thu", role: "Backend Developer & Presenter", image: "/team/member-04.jpg", position: "48% 38%" },
  { name: "Lin Lae Phyu", role: "Data Analysis & Presenter", image: "/team/member-02.jpg", position: "50% 34%" },
  { name: "Kay Khaing Win", role: "Frontend Developer", image: "/team/member-03.jpg", position: "50% 62%" },
  { name: "Min Bhone San", role: "AI Engineer", image: "/team/member-01.jpg", position: "50% 31%" },
  { name: "Tun Aung Lwin", role: "Fullstack Developer", image: "/team/member-05.jpg", position: "50% 51%" },
  { name: "Sai Bhone Myat Min", role: "Graphic Designer & Presenter", image: "/team/member-06.jpg", position: "50% 38%" },
];

const Arrow = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
  </svg>
);

const Close = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
    <path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
  </svg>
);

export function TeamPreview({ mm }: { mm: boolean }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openTeam = useCallback(() => {
    if (window.location.hash !== "#team") {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}#team`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      setOpen(true);
    }
  }, []);

  const closeTeam = useCallback(() => {
    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", cleanUrl);
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    const syncWithHash = () => setOpen(window.location.hash === "#team");
    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    return () => window.removeEventListener("hashchange", syncWithHash);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTeam();
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeTeam, open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="team-preview-trigger"
        onClick={openTeam}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="team-announcement"
      >
        <span className="team-preview-avatars" aria-hidden="true">
          {TEAM.slice(0, 3).map((member, index) => (
            <span key={member.image} style={{ zIndex: 3 - index }}>
              <Image src={member.image} alt="" fill sizes="28px" style={{ objectFit: "cover", objectPosition: member.position }} />
            </span>
          ))}
        </span>
        <span className="team-preview-copy">
          <small>{mm ? "ကျွန်ုပ်တို့အဖွဲ့" : "MEET THE TEAM"}</small>
          <strong>{mm ? "အဖွဲ့ဝင် ၆ ယောက်" : "Six minds · one mission"}</strong>
        </span>
        <span className="team-preview-arrow"><Arrow /></span>
      </button>

      {open && (
        <div
          id="team-announcement"
          className="team-announcement-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-announcement-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeTeam();
          }}
        >
          <div className="team-announcement-grid" aria-hidden="true" />
          <div className="team-announcement-glow team-announcement-glow-one" aria-hidden="true" />
          <div className="team-announcement-glow team-announcement-glow-two" aria-hidden="true" />

          <button ref={closeRef} type="button" className="team-announcement-close" onClick={closeTeam} aria-label={mm ? "ပိတ်ရန်" : "Close team announcement"}>
            <span>{mm ? "ပိတ်မည်" : "CLOSE"}</span>
            <Close />
          </button>

          <section className="team-announcement-panel">
            <div className="team-announcement-ticker" aria-hidden="true">
              <span>SONE DAUK LAY&nbsp;&nbsp;·&nbsp;&nbsp;TEAM REVEAL&nbsp;&nbsp;·&nbsp;&nbsp;LOOK CLOSER&nbsp;&nbsp;·&nbsp;&nbsp;</span>
              <span>SONE DAUK LAY&nbsp;&nbsp;·&nbsp;&nbsp;TEAM REVEAL&nbsp;&nbsp;·&nbsp;&nbsp;LOOK CLOSER&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            </div>

            <div className="team-announcement-intro">
              <div>
                <p className={`team-announcement-kicker ${mm ? "mm" : ""}`}>
                  {mm ? "စုံထောက်လေး · အဖွဲ့ မိတ်ဆက်" : "THE PEOPLE BEHIND THE LITTLE DETECTIVE"}
                </p>
                <h2 id="team-announcement-title" className={mm ? "mm" : "display"}>
                  {mm ? "စုံထောက်လေးရဲ့ နောက်ကွယ်က လူတွေ။" : "Meet the minds behind the mission."}
                </h2>
                <p className={mm ? "mm" : ""}>
                  {mm
                    ? "မြန်မာလူငယ်တွေအတွက် သတင်းမှန်စစ်ဆေးရေးကို ပိုနားလည်လွယ်၊ ပိုလက်တွေ့ကျအောင် အတူတကွ ဖန်တီးနေတဲ့ အဖွဲ့ပါ။"
                    : "A small team building a calmer, more practical way for young people in Myanmar to spot manipulation and decide what deserves their trust."}
                </p>
              </div>
              <div className="team-announcement-count" aria-label="Six team members">
                <strong>06</strong>
                <span>{mm ? "လူတွေ · ရည်ရွယ်ချက်တစ်ခု" : "PEOPLE · ONE SHARED INSTINCT"}</span>
              </div>
            </div>

            <div className="team-member-grid">
              {TEAM.map((member, index) => (
                <article
                  key={member.image}
                  className="team-member-card"
                  style={{ "--team-delay": `${160 + index * 80}ms` } as CSSProperties}
                >
                  <div className="team-member-photo">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      priority={index < 3}
                      sizes="(max-width: 600px) 45vw, (max-width: 1000px) 30vw, 190px"
                      style={{ objectFit: "cover", objectPosition: member.position }}
                    />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="team-member-meta">
                    <small>{mm ? "အဖွဲ့ဝင်" : "TEAM MEMBER"}</small>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="team-announcement-signoff">
              <span className="team-announcement-line" />
              <p>{mm ? "မေးခွန်းထုတ်ပါ · နီးနီးကပ်ကပ်ကြည့်ပါ · ယုံကြည်ချက်ကို ကိုယ်တိုင်ဆုံးဖြတ်ပါ" : "QUESTION IT · LOOK CLOSER · DECIDE FOR YOURSELF"}</p>
              <span className="team-announcement-dot" />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
