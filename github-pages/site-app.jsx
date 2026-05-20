/* global React, ReactDOM */
// Lux & Co. Consulting — site preview
// One component, three visual variants. Internal SPA: home, module:N, empresa.

const { useState, useMemo, useEffect } = React;

// ---------------------------------------------------------------------------
// Variant config — colors, fonts, density. Same structure, different soul.
// ---------------------------------------------------------------------------
const VARIANTS = {
  editorial: {
    name: "Editorial",
    bg: "#f3ede0",
    bgAlt: "#ebe3d2",
    ink: "#0e1f33",
    inkSoft: "#3a4a60",
    gold: "#a47e2c",
    goldSoft: "#c9a961",
    rule: "rgba(14,31,51,0.18)",
    cardBg: "#faf6ec",
    cardBorder: "rgba(164,126,44,0.25)",
    serif: "'Cormorant Garamond', 'Times New Roman', serif",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    accentLine: "#a47e2c",
    chipBg: "rgba(164,126,44,0.10)",
    chipText: "#5a4416",
    fieldBg: "rgba(14,31,51,0.04)",
    fieldBorder: "rgba(14,31,51,0.18)",
  },
  dark: {
    name: "Dark Luxe",
    bg: "#0a1628",
    bgAlt: "#0e1d33",
    ink: "#ebe0c8",
    inkSoft: "#aab7c9",
    gold: "#c9a961",
    goldSoft: "#a47e2c",
    rule: "rgba(201,169,97,0.30)",
    cardBg: "#0f2138",
    cardBorder: "rgba(201,169,97,0.20)",
    serif: "'Cormorant Garamond', 'Times New Roman', serif",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    accentLine: "#c9a961",
    chipBg: "rgba(201,169,97,0.12)",
    chipText: "#c9a961",
    fieldBg: "rgba(255,255,255,0.04)",
    fieldBorder: "rgba(201,169,97,0.25)",
  },
  minimal: {
    name: "Minimal",
    bg: "#ffffff",
    bgAlt: "#f6f4ef",
    ink: "#0a1628",
    inkSoft: "#5a6373",
    gold: "#b88b3e",
    goldSoft: "#d4b878",
    rule: "rgba(10,22,40,0.10)",
    cardBg: "#ffffff",
    cardBorder: "rgba(10,22,40,0.08)",
    serif: "'Inter Tight', 'Inter', system-ui, sans-serif",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    accentLine: "#b88b3e",
    chipBg: "rgba(10,22,40,0.04)",
    chipText: "#0a1628",
    fieldBg: "#f6f4ef",
    fieldBorder: "rgba(10,22,40,0.10)",
  },
};

// ---------------------------------------------------------------------------
// Logo (gold flame + Lux & Co.) — drawn inline so colors adapt
// ---------------------------------------------------------------------------
function FlameMark({ color, size = 36 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 48 54" fill="none" aria-hidden="true">
      <path d="M24 4 C26 12 32 16 32 26 C32 33 28 38 24 40 C20 38 16 33 16 26 C16 18 22 14 24 4 Z"
        stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <path d="M24 14 C25 20 28 22 28 28 C28 33 26 36 24 37 C22 36 20 33 20 28 C20 23 23 21 24 14 Z"
        stroke={color} strokeWidth="1.1" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

function Logo({ v, compact = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <FlameMark color={v.gold} size={compact ? 28 : 36} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: v.serif, fontSize: compact ? 22 : 26, color: v.ink, letterSpacing: "0.01em", fontWeight: 500 }}>
          Lux <span style={{ fontStyle: "italic", color: v.gold }}>&amp;</span> Co.
        </div>
        <div style={{ fontFamily: v.sans, fontSize: 9, letterSpacing: "0.32em", color: v.gold, marginTop: 4, textTransform: "uppercase" }}>
          Consulting
        </div>
      </div>
    </div>
  );
}

// Decorative gold thin frame used in editorial / dark variants
function GoldFrame({ v, children, style }) {
  return (
    <div style={{
      position: "relative",
      padding: 20,
      ...style,
    }}>
      <div style={{
        position: "absolute", inset: 8,
        border: `1px solid ${v.gold}`, opacity: 0.7,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 12,
        border: `1px solid ${v.gold}`, opacity: 0.35,
        pointerEvents: "none",
      }} />
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------
function Eyebrow({ v, children, align = "left" }) {
  return (
    <div style={{
      fontFamily: v.sans, fontSize: 10, letterSpacing: "0.32em",
      color: v.gold, textTransform: "uppercase", fontWeight: 500,
      display: "flex", alignItems: "center", gap: 12, justifyContent: align === "center" ? "center" : "flex-start",
    }}>
      <span style={{ width: 24, height: 1, background: v.gold, opacity: 0.7 }} />
      <span>{children}</span>
      {align === "center" && <span style={{ width: 24, height: 1, background: v.gold, opacity: 0.7 }} />}
    </div>
  );
}

function SectionTitle({ v, children, align = "left", size = 44 }) {
  return (
    <h2 style={{
      fontFamily: v.serif, fontSize: size, lineHeight: 1.05,
      color: v.ink, margin: 0, fontWeight: 400,
      letterSpacing: "-0.01em", textAlign: align,
      textWrap: "balance",
    }}>{children}</h2>
  );
}

// ---------------------------------------------------------------------------
// HEADER (top nav + lang toggle)
// ---------------------------------------------------------------------------
function Header({ v, t, lang, setLang, goTo, page }) {
  const items = [
    ["modulos", "#modulos"],
    ["caderno", "#caderno"],
  ];
  return (
    <header style={{
      padding: "22px 56px",
      borderBottom: `1px solid ${v.rule}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: v.bg, position: "sticky", top: 0, zIndex: 5,
    }}>
      <button onClick={() => goTo("home")}
        style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}>
        <Logo v={v} compact />
      </button>
      <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {items.map(([key, anchor]) => (
          <a key={key}
            href={anchor || "#"}
            onClick={(e) => {
              if (key === "empresa") { e.preventDefault(); goTo("empresa"); }
              else if (page !== "home") { e.preventDefault(); goTo("home", anchor); }
            }}
            style={{
              fontFamily: v.sans, fontSize: 12, letterSpacing: "0.06em",
              color: v.inkSoft, textDecoration: "none", textTransform: "uppercase",
              fontWeight: 500,
            }}>{t.nav[key]}</a>
        ))}
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          fontFamily: v.mono, fontSize: 10, letterSpacing: "0.1em",
          padding: "4px 8px", border: `1px solid ${v.rule}`, borderRadius: 999,
          marginLeft: 8,
        }}>
          {["pt", "en"].map((l) => (
            <button key={l}
              onClick={() => setLang(l)}
              style={{
                background: lang === l ? v.gold : "transparent",
                color: lang === l ? v.bg : v.inkSoft,
                border: 0, padding: "3px 8px", borderRadius: 999,
                cursor: "pointer", textTransform: "uppercase",
                fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit",
                fontWeight: 600,
              }}>{l}</button>
          ))}
        </div>
      </nav>
    </header>
  );
}

// ---------------------------------------------------------------------------
// HERO CREST — stylized circular badge inspired by the Lux&Co. coaster logo.
// Drawn inline so it blends with each variant's background instead of dropping
// a hard-edged photo with a white box around it.
// ---------------------------------------------------------------------------
function HeroCrest({ v, variant }) {
  // Crest is always the dark navy + gold disc — but the SURROUND adapts.
  const discBg = "#0a1628";
  const discGold = "#c9a961";
  const surround = variant === "dark" ? "transparent"
    : variant === "editorial" ? "transparent"
    : "transparent";
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: surround, position: "relative",
    }}>
      {/* no decorative outer frame — crest sits clean on the page */}
      <svg viewBox="0 0 400 480" style={{ width: "82%", height: "82%" }} aria-label="Lux & Co. crest">
        <defs>
          <radialGradient id="discTexture" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#13243d" />
            <stop offset="60%" stopColor="#0a1628" />
            <stop offset="100%" stopColor="#060e1c" />
          </radialGradient>
        </defs>
        {/* disc */}
        <circle cx="200" cy="220" r="190" fill="url(#discTexture)" />
        {/* concentric gold rings */}
        <circle cx="200" cy="220" r="180" fill="none" stroke={discGold} strokeWidth="1.2" opacity="0.85" />
        <circle cx="200" cy="220" r="172" fill="none" stroke={discGold} strokeWidth="0.8" opacity="0.55" />
        {/* flame mark */}
        <g transform="translate(200 130)">
          <path d="M0 -32 C 10 -8 32 6 32 38 C 32 60 18 76 0 80 C -18 76 -32 60 -32 38 C -32 8 -10 -10 0 -32 Z"
            stroke={discGold} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
          <path d="M0 -16 C 6 0 18 8 18 30 C 18 46 10 58 0 60 C -10 58 -18 46 -18 30 C -18 12 -6 4 0 -16 Z"
            stroke={discGold} strokeWidth="1.2" fill="none" strokeLinejoin="round" />
        </g>
        {/* wordmark */}
        <text x="200" y="270" textAnchor="middle"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fill: discGold, letterSpacing: "0.01em", fontWeight: 500 }}>
          Lux <tspan fontStyle="italic">&amp;</tspan> Co.
        </text>
        {/* divider with side dashes */}
        <g transform="translate(200 295)">
          <line x1="-70" y1="0" x2="-30" y2="0" stroke={discGold} strokeWidth="1" />
          <line x1="30" y1="0" x2="70" y2="0" stroke={discGold} strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fill: discGold, letterSpacing: "0.42em", fontWeight: 500 }}>
            CONSULTING
          </text>
        </g>
        {/* tagline */}
        <text x="200" y="330" textAnchor="middle"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 18, fill: discGold, opacity: 0.92 }}>
          Think sharp. Move smart.
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
function Hero({ v, t, variant }) {
  const [h1l1, h1l2] = t.hero.title.split("\n");
  return (
    <section style={{
      padding: "96px 56px 80px",
      background: variant === "dark" ? v.bg : v.bg,
      borderBottom: `1px solid ${v.rule}`,
      position: "relative",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          {t.hero.eyebrow && <Eyebrow v={v}>{t.hero.eyebrow}</Eyebrow>}
          <h1 style={{
            fontFamily: v.serif, fontSize: 72, lineHeight: 1.05,
            color: v.ink, margin: t.hero.eyebrow ? "28px 0 24px" : "0 0 24px", fontWeight: 400,
            letterSpacing: "-0.02em", textWrap: "balance",
          }}>
            {h1l1}<br />
            <span style={{ fontStyle: "italic", color: v.gold }}>{h1l2}</span>
          </h1>
          {t.hero.sub && (
            <p style={{
              fontFamily: v.sans, fontSize: 18, lineHeight: 1.55,
              color: v.inkSoft, maxWidth: 520, margin: "0 0 36px",
            }}>{t.hero.sub}</p>
          )}
          {(t.hero.ctaConsultoria || t.hero.ctaMentor || t.hero.ctaContato) && (
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {t.hero.ctaConsultoria && (
                <a href="#consultoria" style={{
                  fontFamily: v.sans, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "16px 28px", background: v.ink, color: v.bg,
                  textDecoration: "none", fontWeight: 500,
                }}>{t.hero.ctaConsultoria}</a>
              )}
              {t.hero.ctaMentor && (
                <a href="#sobre" style={{
                  fontFamily: v.sans, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "16px 28px", background: "transparent", color: v.ink,
                  textDecoration: "none", fontWeight: 500,
                  border: `1px solid ${v.ink}`,
                }}>{t.hero.ctaMentor}</a>
              )}
              {t.hero.ctaContato && (
                <a href="#contato" style={{
                  fontFamily: v.sans, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "16px 28px", background: "transparent", color: v.gold,
                  textDecoration: "none", fontWeight: 500,
                  border: `1px solid ${v.gold}`,
                }}>{t.hero.ctaContato}</a>
              )}
            </div>
          )}
        </div>
        <div style={{ position: "relative", aspectRatio: "4/5" }}>
          {/* Custom rendered crest — no photographic logo so background stays harmonious across variants */}
          <HeroCrest v={v} variant={variant} />
        </div>
      </div>
      {/* tagline strip */}
      <div style={{
        marginTop: 80, paddingTop: 28, borderTop: `1px solid ${v.rule}`,
        display: "flex", justifyContent: "center", alignItems: "center",
      }}>
        <span style={{ fontFamily: v.serif, fontStyle: "italic", fontSize: 18, color: v.inkSoft }}>
          Think sharp. Move smart.
        </span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ABOUT (mentor)
// ---------------------------------------------------------------------------
function About({ v, t, variant }) {
  return (
    <section id="sobre" style={{
      padding: "100px 56px",
      background: variant === "minimal" ? v.bgAlt : v.bg,
      borderBottom: `1px solid ${v.rule}`,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{
            aspectRatio: "4/5", overflow: "hidden",
            border: variant === "minimal" ? `1px solid ${v.rule}` : `1px solid ${v.gold}`,
            background: v.bgAlt,
          }}>
            <img src="brand/founder.png" alt="Mentor"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: variant === "dark" ? "brightness(0.92) saturate(0.9)" : "none" }} />
          </div>
          {variant === "editorial" && (
            <div style={{
              position: "absolute", left: -22, top: -22, width: "60%", height: "60%",
              border: `1px solid ${v.gold}`, opacity: 0.4, pointerEvents: "none",
            }} />
          )}
        </div>
        <div>
          <Eyebrow v={v}>{t.about.eyebrow}</Eyebrow>
          <SectionTitle v={v}>{t.about.title}</SectionTitle>
          <div style={{ marginTop: 28 }}>
            {t.about.bodyParas.map((p, i) => (
              <p key={i} style={{
                fontFamily: v.sans, fontSize: 17, lineHeight: 1.65, color: v.inkSoft,
                margin: "0 0 16px", maxWidth: 560,
              }}>{p}</p>
            ))}
          </div>
          <div style={{
            marginTop: 32, paddingTop: 28, borderTop: `1px solid ${v.rule}`,
          }}>
            {t.about.methodEyebrow && (
              <div style={{
                fontFamily: v.mono, fontSize: 11, letterSpacing: "0.24em",
                color: v.gold, textTransform: "uppercase", marginBottom: 20,
              }}>{t.about.methodEyebrow}</div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {t.about.stats.map(([n, l], i) => (
                <div key={i}>
                  <div style={{ fontFamily: v.serif, fontSize: 44, color: v.gold, lineHeight: 1, fontWeight: 400 }}>{n}</div>
                  <div style={{ fontFamily: v.sans, fontSize: 12, color: v.inkSoft, marginTop: 8, letterSpacing: "0.04em", lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{
            marginTop: 28, padding: "24px 28px",
            background: v.chipBg, borderLeft: `2px solid ${v.gold}`,
          }}>
            <div style={{ fontFamily: v.serif, fontStyle: "italic", fontSize: 22, lineHeight: 1.45, color: v.ink, textWrap: "balance" }}>
              “{t.about.pullquote}”
            </div>
          </div>
          {t.about.brands && (
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${v.rule}`, display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontFamily: v.mono, fontSize: 10, letterSpacing: "0.24em", color: v.inkSoft, textTransform: "uppercase" }}>Trajetória</span>
              {t.about.brands.map((b, i) => (
                <span key={i} style={{ fontFamily: v.serif, fontSize: 22, color: v.ink, letterSpacing: "0.02em" }}>{b}</span>
              ))}
            </div>
          )}
          <div style={{
            marginTop: 28, fontFamily: v.serif, fontStyle: "italic",
            fontSize: 15, color: v.gold,
          }}>{t.about.signature}</div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CONSULTANCY (Sobre a Consultoria)
// ---------------------------------------------------------------------------
function Consultancy({ v, t, variant }) {
  return (
    <section id="consultoria" style={{
      padding: "120px 56px",
      background: variant === "dark" ? v.bgAlt : v.bg,
      borderBottom: `1px solid ${v.rule}`,
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Eyebrow v={v} align="center">{t.consultancy.eyebrow}</Eyebrow>
          <h2 style={{
            fontFamily: v.serif, fontSize: 72, lineHeight: 1.05,
            color: v.ink, margin: "24px 0 0", fontWeight: 400, letterSpacing: "-0.02em",
          }}>
            <span style={{ fontStyle: "italic", color: v.gold }}>{t.consultancy.welcome}</span>
          </h2>
        </div>
        <div>
          {t.consultancy.bodyParas.map((p, i) => {
            const isHighlight = i === 1;
            return (
              <p key={i} style={{
                fontFamily: isHighlight ? v.serif : v.sans,
                fontSize: isHighlight ? 26 : 18,
                lineHeight: isHighlight ? 1.35 : 1.7,
                color: isHighlight ? v.ink : v.inkSoft,
                fontStyle: isHighlight ? "italic" : "normal",
                margin: isHighlight ? "32px 0" : "0 0 22px",
                textAlign: isHighlight ? "center" : "left",
                textWrap: "pretty",
                maxWidth: isHighlight ? 540 : "100%",
                marginLeft: isHighlight ? "auto" : 0,
                marginRight: isHighlight ? "auto" : 0,
                paddingTop: isHighlight ? 24 : 0,
                paddingBottom: isHighlight ? 24 : 0,
                borderTop: isHighlight ? `1px solid ${v.rule}` : "none",
                borderBottom: isHighlight ? `1px solid ${v.rule}` : "none",
              }}>{p}</p>
            );
          })}
        </div>
        <div style={{
          marginTop: 72, paddingTop: 40, borderTop: `1px solid ${v.rule}`,
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: v.serif, fontSize: 26, lineHeight: 1.4, color: v.ink,
            fontStyle: "italic", maxWidth: 620, margin: "0 auto", textWrap: "balance",
          }}>
            “{t.consultancy.quote}”
          </div>
          <div style={{
            marginTop: 18, fontFamily: v.mono, fontSize: 11,
            letterSpacing: "0.24em", color: v.gold, textTransform: "uppercase",
          }}>
            — {t.consultancy.quoteAuthor}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MENTORSHIP (intro to method)
// ---------------------------------------------------------------------------
function Mentorship({ v, t, variant }) {
  return (
    <section id="mentoria" style={{
      padding: "100px 56px",
      background: variant === "dark" ? v.bgAlt : variant === "editorial" ? v.bg : v.bg,
      borderBottom: `1px solid ${v.rule}`,
    }}>
      <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 60px" }}>
        <Eyebrow v={v} align="center">{t.mentorship.eyebrow}</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <SectionTitle v={v} align="center" size={52}>{t.mentorship.title}</SectionTitle>
        </div>
        <p style={{
          fontFamily: v.sans, fontSize: 18, lineHeight: 1.6,
          color: v.inkSoft, marginTop: 24,
        }}>{t.mentorship.lead}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: v.rule, border: `1px solid ${v.rule}` }}>
        {t.mentorship.pillars.map(([title, desc], i) => (
          <div key={i} style={{ background: v.bg, padding: "40px 36px" }}>
            <div style={{
              fontFamily: v.mono, fontSize: 11, color: v.gold,
              letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18,
            }}>0{i + 1}</div>
            <div style={{
              fontFamily: v.serif, fontSize: 26, color: v.ink,
              fontWeight: 400, marginBottom: 14, letterSpacing: "-0.01em",
            }}>{title}</div>
            <div style={{ fontFamily: v.sans, fontSize: 15, lineHeight: 1.55, color: v.inkSoft }}>{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MODULES grid (clickable)
// ---------------------------------------------------------------------------
function Modules({ v, t, openModule, variant }) {
  return (
    <section id="modulos" style={{
      padding: "100px 56px",
      background: variant === "minimal" ? v.bg : v.bgAlt,
      borderBottom: `1px solid ${v.rule}`,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "end", marginBottom: 56 }}>
        <div>
          <Eyebrow v={v}>{t.modules.eyebrow}</Eyebrow>
          <div style={{ marginTop: 20 }}>
            <SectionTitle v={v} size={48}>{t.modules.title}</SectionTitle>
          </div>
        </div>
        <p style={{ fontFamily: v.sans, fontSize: 16, lineHeight: 1.65, color: v.inkSoft, margin: 0, maxWidth: 540 }}>
          {t.modules.sub}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {t.modules.items.map((m, i) => (
          <button key={i}
            onClick={() => openModule(i)}
            style={{
              background: v.cardBg,
              border: `1px solid ${v.cardBorder}`,
              padding: "32px 28px",
              textAlign: "left", cursor: "pointer",
              transition: "transform .18s, box-shadow .18s, border-color .18s",
              fontFamily: "inherit", color: "inherit",
              display: "flex", flexDirection: "column", gap: 14, minHeight: 240,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = v.gold;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = v.cardBorder;
              e.currentTarget.style.transform = "translateY(0)";
            }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <span style={{ fontFamily: v.serif, fontSize: 56, color: v.gold, lineHeight: 0.9, fontWeight: 400 }}>{m.n}</span>
              <span style={{ fontFamily: v.mono, fontSize: 10, color: v.inkSoft, letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "right", lineHeight: 1.5, paddingTop: 8, maxWidth: "60%" }}>
                {m.subtitle}
              </span>
            </div>
            <div style={{ height: 1, background: v.rule }} />
            <div style={{ fontFamily: v.serif, fontSize: 24, color: v.ink, lineHeight: 1.15, fontWeight: 400, letterSpacing: "-0.01em" }}>
              {m.title}
            </div>
            <div style={{ fontFamily: v.sans, fontSize: 14, lineHeight: 1.55, color: v.inkSoft, flex: 1 }}>
              {m.short}
            </div>
            <div style={{ fontFamily: v.sans, fontSize: 12, color: v.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
              {t.detail.objective} →
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// NOTEBOOK
// ---------------------------------------------------------------------------
function Notebook({ v, t, variant }) {
  const items = t.notebook.items || [];
  return (
    <section id="caderno" style={{
      padding: "100px 56px",
      background: variant === "dark" ? v.bg : variant === "editorial" ? v.bgAlt : v.bgAlt,
      borderBottom: `1px solid ${v.rule}`,
    }}>
      <div style={{ textAlign: "center", marginBottom: 56, maxWidth: 760, margin: "0 auto 56px" }}>
        <Eyebrow v={v} align="center">{t.notebook.eyebrow}</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <SectionTitle v={v} align="center" size={48}>{t.notebook.title}</SectionTitle>
        </div>
        <p style={{ fontFamily: v.sans, fontSize: 16, lineHeight: 1.65, color: v.inkSoft, marginTop: 20 }}>
          {t.notebook.lead}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            border: `1px solid ${v.cardBorder}`,
            background: v.cardBg,
            padding: 36,
            display: "flex", flexDirection: "column", gap: 20,
            boxShadow: variant === "dark" ? "0 30px 60px rgba(0,0,0,0.32)" : "0 24px 50px rgba(14,31,51,0.08)",
          }}>
            <div style={{
              fontFamily: v.mono, fontSize: 10, letterSpacing: "0.2em",
              color: v.gold, textTransform: "uppercase",
            }}>
              {item.tag}
            </div>
            <div>
              <div style={{ fontFamily: v.serif, fontSize: 32, color: v.ink, lineHeight: 1.1, fontWeight: 400, letterSpacing: "-0.01em" }}>
                {item.name}
              </div>
              <div style={{ fontFamily: v.sans, fontStyle: "italic", fontSize: 14, color: v.inkSoft, marginTop: 6 }}>
                {item.subtitle}
              </div>
            </div>
            <p style={{ fontFamily: v.sans, fontSize: 15, lineHeight: 1.65, color: v.inkSoft, margin: 0 }}>
              {item.lead}
            </p>

            {/* mock card */}
            <div style={{
              marginTop: 4, padding: 22,
              background: variant === "dark" ? "rgba(255,255,255,0.02)" : v.chipBg,
              border: `1px solid ${v.rule}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 12, borderBottom: `1px solid ${v.rule}` }}>
                <div style={{ fontFamily: v.mono, fontSize: 9, letterSpacing: "0.2em", color: v.gold, textTransform: "uppercase" }}>
                  {item.mock.label}
                </div>
                <div style={{ fontFamily: v.mono, fontSize: 9, color: v.inkSoft, letterSpacing: "0.05em" }}>
                  {item.mock.date}
                </div>
              </div>
              <div style={{ fontFamily: v.serif, fontSize: 19, color: v.ink, marginTop: 14, fontWeight: 400, lineHeight: 1.25 }}>
                {item.mock.title}
              </div>
              <div style={{ fontFamily: v.sans, fontSize: 10, color: v.inkSoft, marginTop: 6, letterSpacing: "0.18em" }}>
                {item.mock.sub}
              </div>
              <div style={{ marginTop: 16, paddingLeft: 12, borderLeft: `2px solid ${v.gold}`, fontFamily: v.serif, fontStyle: "italic", fontSize: 14, color: v.ink, lineHeight: 1.45 }}>
                "{item.mock.quote}"
              </div>
            </div>

            {/* frameworks list */}
            <div style={{ marginTop: 4, borderTop: `1px solid ${v.rule}` }}>
              {(item.frameworks || []).map((f, j) => (
                <div key={j} style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  gap: 16,
                  padding: "16px 0",
                  borderBottom: `1px solid ${v.rule}`,
                  alignItems: "baseline",
                }}>
                  <div style={{
                    fontFamily: v.mono, fontSize: 10, letterSpacing: "0.18em",
                    color: v.gold, textTransform: "uppercase", fontWeight: 600,
                  }}>
                    {f.code}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{
                        fontFamily: v.serif, fontSize: 17, color: v.ink,
                        fontWeight: 500, letterSpacing: "-0.005em",
                      }}>{f.name}</span>
                      <span style={{
                        fontFamily: v.mono, fontSize: 9, letterSpacing: "0.18em",
                        textTransform: "uppercase", color: v.inkSoft,
                      }}>{f.domain}</span>
                    </div>
                    <div style={{
                      fontFamily: v.sans, fontSize: 13.5, lineHeight: 1.55,
                      color: v.inkSoft,
                    }}>
                      {f.line}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {item.download ? (
              <div style={{ marginTop: 8, paddingTop: 18, borderTop: `1px solid ${v.rule}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div style={{ fontFamily: v.mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: v.inkSoft }}>
                  {item.download.note}
                </div>
                <a href={item.download.href} download={item.download.filename}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    padding: "10px 18px",
                    background: v.gold, color: v.bg,
                    fontFamily: v.sans, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
                    fontWeight: 600, textDecoration: "none",
                    border: `1px solid ${v.gold}`,
                  }}>
                  <span>↓</span>
                  <span>{item.download.label}</span>
                </a>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SERVICES tiers (Pessoal / Empresa / Pacote)
// ---------------------------------------------------------------------------
function Services({ v, t, goTo, variant }) {
  return (
    <section style={{ padding: "100px 56px", background: v.bg, borderBottom: `1px solid ${v.rule}` }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <Eyebrow v={v} align="center">{t.services.eyebrow}</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <SectionTitle v={v} align="center" size={48}>{t.services.title}</SectionTitle>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {t.services.tiers.map((s, i) => (
          <div key={i} style={{
            border: `1px solid ${i === 0 ? v.gold : v.rule}`,
            background: i === 0 ? v.cardBg : "transparent",
            padding: "36px 32px", display: "flex", flexDirection: "column", gap: 16,
            position: "relative", minHeight: 280,
          }}>
            <div style={{
              fontFamily: v.mono, fontSize: 10, letterSpacing: "0.2em",
              color: i === 0 ? v.gold : v.inkSoft, textTransform: "uppercase",
              padding: "4px 10px", border: `1px solid ${i === 0 ? v.gold : v.rule}`,
              alignSelf: "flex-start", borderRadius: 999,
            }}>
              {s.tag}
            </div>
            <div style={{ fontFamily: v.serif, fontSize: 30, color: v.ink, lineHeight: 1.1, fontWeight: 400, letterSpacing: "-0.01em" }}>
              {s.name}
            </div>
            <div style={{ fontFamily: v.sans, fontSize: 15, lineHeight: 1.6, color: v.inkSoft, flex: 1 }}>
              {s.desc}
            </div>
            <button onClick={() => {
              if (s.target === "modulos") {
                document.querySelector("#modulos")?.scrollIntoView({ behavior: "smooth" });
              } else {
                goTo("empresa");
              }
            }}
              style={{
                background: "transparent", border: 0, padding: 0, cursor: "pointer",
                fontFamily: v.sans, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase",
                color: i === 0 ? v.gold : v.ink, textAlign: "left", fontWeight: 500,
              }}>{s.cta}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CONTACT
// ---------------------------------------------------------------------------
function Contact({ v, t, variant }) {
  return (
    <section id="contato" style={{
      padding: "100px 56px",
      background: variant === "dark" ? v.bgAlt : variant === "editorial" ? v.bgAlt : v.bg,
      borderBottom: `1px solid ${v.rule}`,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        <div>
          <Eyebrow v={v}>{t.contact.eyebrow}</Eyebrow>
          <div style={{ marginTop: 20 }}>
            <SectionTitle v={v} size={56}>{t.contact.title}</SectionTitle>
          </div>
          <p style={{ fontFamily: v.sans, fontSize: 18, lineHeight: 1.6, color: v.inkSoft, marginTop: 24, maxWidth: 480 }}>
            {t.contact.lead}
          </p>
          <div style={{ marginTop: 40 }}>
            {t.contact.ways.map(([k, val, href], i) => {
              const inner = (
                <>
                  <span style={{ fontFamily: v.mono, fontSize: 11, letterSpacing: "0.2em", color: v.gold, textTransform: "uppercase" }}>{k}</span>
                  <span style={{ fontFamily: v.sans, fontSize: 15, color: v.ink }}>{val}</span>
                </>
              );
              const rowStyle = {
                padding: "16px 0", borderBottom: `1px solid ${v.rule}`,
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                gap: 16, textDecoration: "none", color: "inherit",
              };
              return href ? (
                <a key={i} href={href} target="_blank" rel="noopener" style={rowStyle}>{inner}</a>
              ) : (
                <div key={i} style={rowStyle}>{inner}</div>
              );
            })}
          </div>
          {t.contact.calendly && (
            <a href={t.contact.calendly} target="_blank" rel="noopener" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              marginTop: 28, padding: "14px 24px",
              background: v.gold, color: v.bg,
              fontFamily: v.sans, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
              fontWeight: 600, textDecoration: "none",
            }}>
              <span>📅</span><span>{t.contact.calendlyLabel}</span>
            </a>
          )}
          {t.contact.patronage && (
            <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${v.rule}` }}>
              <div style={{
                fontFamily: v.mono, fontSize: 10, letterSpacing: "0.24em",
                color: v.gold, textTransform: "uppercase", marginBottom: 14,
              }}>{t.contact.patronage.eyebrow}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href={t.contact.patronage.sponsorMail} style={{
                  padding: "12px 20px", border: `1px solid ${v.gold}`,
                  color: v.gold, textDecoration: "none",
                  fontFamily: v.sans, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500,
                }}>{t.contact.patronage.sponsor}</a>
                <a href={t.contact.patronage.speakingMail} style={{
                  padding: "12px 20px", border: `1px solid ${v.ink}`,
                  color: v.ink, textDecoration: "none",
                  fontFamily: v.sans, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500,
                }}>{t.contact.patronage.speaking}</a>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const subject = encodeURIComponent("Contato pelo site — " + (fd.get("name") || ""));
            const body = encodeURIComponent(
              "Nome: " + (fd.get("name") || "") + "\n" +
              "E-mail: " + (fd.get("email") || "") + "\n" +
              "WhatsApp: " + (fd.get("whats") || "") + "\n\n" +
              "Mensagem:\n" + (fd.get("message") || "")
            );
            window.location.href = "mailto:contact.luxco.consulting@gmail.com?subject=" + subject + "&body=" + body;
          }}
          style={{
            background: v.cardBg, border: `1px solid ${v.cardBorder}`,
            padding: 36, display: "flex", flexDirection: "column", gap: 18,
          }}>
          {[
            ["name", "text"],
            ["email", "email"],
            ["whats", "tel"],
          ].map(([f, type]) => (
            <label key={f} style={{ display: "block" }}>
              <div style={{ fontFamily: v.mono, fontSize: 10, letterSpacing: "0.2em", color: v.gold, textTransform: "uppercase", marginBottom: 8 }}>
                {t.contact.formFields[f]}
              </div>
              <input type={type} name={f} required={f !== "whats"}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: v.fieldBg,
                  border: `1px solid ${v.fieldBorder}`,
                  fontFamily: v.sans, fontSize: 15, color: v.ink,
                  outline: "none", boxSizing: "border-box",
                }} />
            </label>
          ))}
          <label style={{ display: "block" }}>
            <div style={{ fontFamily: v.mono, fontSize: 10, letterSpacing: "0.2em", color: v.gold, textTransform: "uppercase", marginBottom: 8 }}>
              {t.contact.formFields.message}
            </div>
            <textarea rows={4} name="message"
              style={{
                width: "100%", padding: "12px 14px",
                background: v.fieldBg,
                border: `1px solid ${v.fieldBorder}`,
                fontFamily: v.sans, fontSize: 15, color: v.ink,
                outline: "none", resize: "vertical", boxSizing: "border-box",
              }} />
          </label>
          <button type="submit"
            style={{
              padding: "16px 28px", background: v.ink, color: v.bg,
              border: 0, fontFamily: v.sans, fontSize: 13,
              letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer", marginTop: 8, fontWeight: 500,
            }}>{t.contact.formFields.send}</button>
        </form>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------------
function Footer({ v, t }) {
  return (
    <footer style={{
      padding: "48px 56px 36px", background: v.bg,
      borderTop: `1px solid ${v.rule}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 28, borderBottom: `1px solid ${v.rule}` }}>
        <Logo v={v} compact />
        <div style={{ fontFamily: v.serif, fontStyle: "italic", fontSize: 18, color: v.gold }}>{t.footer.tagline}</div>
      </div>
      <div style={{
        marginTop: 24, display: "flex", justifyContent: "space-between",
        fontFamily: v.mono, fontSize: 10, letterSpacing: "0.18em",
        color: v.inkSoft, textTransform: "uppercase",
      }}>
        <span>{t.footer.rights}</span>
        <span>Sydney, Australia · Worldwide</span>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// MODULE DETAIL page
// ---------------------------------------------------------------------------
function ModuleDetail({ v, t, idx, goTo, variant }) {
  const m = t.modules.items[idx];
  return (
    <div style={{ background: v.bg }}>
      <section style={{
        padding: "80px 56px 60px",
        background: variant === "dark" ? v.bgAlt : v.bgAlt,
        borderBottom: `1px solid ${v.rule}`,
      }}>
        <button onClick={() => goTo("home", "#modulos")}
          style={{
            background: "none", border: 0, cursor: "pointer", padding: 0,
            fontFamily: v.sans, fontSize: 13, color: v.gold,
            letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500,
            marginBottom: 36,
          }}>{t.detail.back}</button>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "start" }}>
          <div style={{
            fontFamily: v.serif, fontSize: 180, color: v.gold,
            lineHeight: 0.85, fontWeight: 400, letterSpacing: "-0.04em",
          }}>{m.n}</div>
          <div>
            <Eyebrow v={v}>{m.subtitle}</Eyebrow>
            <h1 style={{
              fontFamily: v.serif, fontSize: 72, color: v.ink, lineHeight: 1.0,
              margin: "20px 0 28px", fontWeight: 400, letterSpacing: "-0.02em",
              textWrap: "balance",
            }}>{m.title}</h1>
            <p style={{ fontFamily: v.sans, fontSize: 18, lineHeight: 1.55, color: v.inkSoft, maxWidth: 620, margin: 0 }}>
              {m.short}
            </p>
          </div>
        </div>
      </section>
      <section style={{ padding: "80px 56px", borderBottom: `1px solid ${v.rule}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64 }}>
          <div>
            <Eyebrow v={v}>{t.detail.objective}</Eyebrow>
          </div>
          <p style={{ fontFamily: v.serif, fontSize: 28, lineHeight: 1.4, color: v.ink, margin: 0, fontWeight: 400, letterSpacing: "-0.01em", textWrap: "balance" }}>
            {m.objective}
          </p>
        </div>
      </section>
      <section style={{ padding: "80px 56px", background: v.bgAlt, borderBottom: `1px solid ${v.rule}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64 }}>
          <div>
            <Eyebrow v={v}>{t.detail.themes}</Eyebrow>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: v.rule, border: `1px solid ${v.rule}` }}>
            {m.themes.map((th, i) => (
              <div key={i} style={{
                background: v.bg, padding: "28px 24px",
                fontFamily: v.serif, fontSize: 22, color: v.ink, fontWeight: 400, letterSpacing: "-0.01em",
                display: "flex", alignItems: "center", gap: 18,
              }}>
                <span style={{ fontFamily: v.mono, fontSize: 11, letterSpacing: "0.2em", color: v.gold }}>
                  · {String(i + 1).padStart(2, "0")}
                </span>
                <span>{th}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: "80px 56px", textAlign: "center" }}>
        <SectionTitle v={v} align="center" size={42}>{t.detail.cta}</SectionTitle>
        <div style={{ marginTop: 28 }}>
          <button onClick={() => goTo("home", "#contato")}
            style={{
              padding: "16px 32px", background: v.ink, color: v.bg,
              border: 0, fontFamily: v.sans, fontSize: 13,
              letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer", fontWeight: 500,
            }}>{t.hero.ctaPrimary}</button>
        </div>
        {/* prev / next module */}
        <div style={{
          marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18,
          textAlign: "left", maxWidth: 720, margin: "64px auto 0",
        }}>
          {[idx - 1, idx + 1].map((j, i) => {
            const next = t.modules.items[(j + 6) % 6];
            return (
              <button key={i}
                onClick={() => goTo(`module:${(j + 6) % 6}`)}
                style={{
                  background: "transparent", border: `1px solid ${v.rule}`,
                  padding: "20px 24px", textAlign: i === 0 ? "left" : "right",
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                <div style={{ fontFamily: v.mono, fontSize: 10, letterSpacing: "0.2em", color: v.gold, textTransform: "uppercase" }}>
                  {i === 0 ? "← Anterior" : "Próximo →"}
                </div>
                <div style={{ fontFamily: v.serif, fontSize: 22, color: v.ink, marginTop: 8, fontWeight: 400 }}>
                  {next.n} · {next.title}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EMPRESA placeholder ("Em breve")
// ---------------------------------------------------------------------------
function EmpresaPage({ v, t, goTo, variant }) {
  return (
    <div style={{ background: v.bg, minHeight: 1200 }}>
      <section style={{ padding: "80px 56px 60px", background: v.bgAlt, borderBottom: `1px solid ${v.rule}` }}>
        <button onClick={() => goTo("home")}
          style={{
            background: "none", border: 0, cursor: "pointer", padding: 0,
            fontFamily: v.sans, fontSize: 13, color: v.gold,
            letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500,
            marginBottom: 36,
          }}>{t.detail.back}</button>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <Eyebrow v={v}>{t.nav.empresa}</Eyebrow>
            <h1 style={{
              fontFamily: v.serif, fontSize: 84, color: v.ink, lineHeight: 1.0,
              margin: "20px 0 24px", fontWeight: 400, letterSpacing: "-0.02em",
              textWrap: "balance",
            }}>
              Em <span style={{ fontStyle: "italic", color: v.gold }}>breve</span>.
            </h1>
            <p style={{ fontFamily: v.sans, fontSize: 19, lineHeight: 1.55, color: v.ink, maxWidth: 560, margin: "0 0 16px", fontWeight: 500 }}>
              O básico, bem feito.
            </p>
            <p style={{ fontFamily: v.sans, fontSize: 16, lineHeight: 1.65, color: v.inkSoft, maxWidth: 560, margin: 0 }}>
              Antes de qualquer transformação, organização funciona pelo fundamento: pessoas, processos, decisão e ritmo. A Lux &amp; Co. for Teams traduz a mesma metodologia da mentoria pessoal para times, lideranças e fundadores, com diagnóstico organizacional, desenvolvimento de lideranças e programas sob medida. Deixe seu contato e receba em primeira mão.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => goTo("home", "#contato")}
                style={{
                  padding: "16px 28px", background: v.ink, color: v.bg, border: 0,
                  fontFamily: v.sans, fontSize: 13, letterSpacing: "0.08em",
                  textTransform: "uppercase", cursor: "pointer", fontWeight: 500,
                }}>Quero ser avisado</button>
              <a href="mailto:contact.luxco.consulting@gmail.com?subject=Quero%20ser%20patrocinador%20%2F%20apoiador"
                style={{
                  padding: "16px 28px", background: "transparent", color: v.gold, border: `1px solid ${v.gold}`,
                  fontFamily: v.sans, fontSize: 13, letterSpacing: "0.08em",
                  textTransform: "uppercase", textDecoration: "none", fontWeight: 500,
                }}>Quero ser patrocinador / apoiador</a>
              <a href="mailto:contact.luxco.consulting@gmail.com?subject=Convite%20para%20palestra"
                style={{
                  padding: "16px 28px", background: "transparent", color: v.ink, border: `1px solid ${v.ink}`,
                  fontFamily: v.sans, fontSize: 13, letterSpacing: "0.08em",
                  textTransform: "uppercase", textDecoration: "none", fontWeight: 500,
                }}>Palestras (convites)</a>
            </div>
          </div>
          <div style={{
            border: `1px solid ${v.gold}`, padding: 24, position: "relative",
            aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              position: "absolute", inset: 32, border: `1px solid ${v.gold}`, opacity: 0.4,
            }} />
            <div style={{ textAlign: "center", padding: 32 }}>
              <div style={{ fontFamily: v.mono, fontSize: 11, letterSpacing: "0.3em", color: v.gold, textTransform: "uppercase", marginBottom: 18 }}>
                Próximo lançamento
              </div>
              <div style={{ fontFamily: v.serif, fontSize: 36, color: v.ink, lineHeight: 1.1, fontWeight: 400, letterSpacing: "-0.01em" }}>
                Lux &amp; Co. <span style={{ fontStyle: "italic", color: v.gold }}>for Teams</span>
              </div>
              <div style={{ marginTop: 24, fontFamily: v.sans, fontSize: 14, color: v.inkSoft, lineHeight: 1.6 }}>
                Diagnóstico organizacional · Desenvolvimento de lideranças · Programas sob medida · Pacote integrado pessoa + negócio
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN APP
// ---------------------------------------------------------------------------
function SiteApp({ variant = "editorial", initialLang = "pt" }) {
  const v = VARIANTS[variant];
  const [lang, setLang] = useState(initialLang);
  const [page, setPage] = useState("home");
  const t = window.LUX_CONTENT[lang];

  const goTo = (p, anchor) => {
    setPage(p);
    requestAnimationFrame(() => {
      if (anchor) {
        const el = document.querySelector(anchor);
        el?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    });
  };

  const openModule = (i) => goTo(`module:${i}`);

  return (
    <div style={{
      background: v.bg, color: v.ink,
      fontFamily: v.sans, minHeight: "100%",
    }}>
      <Header v={v} t={t} lang={lang} setLang={setLang} goTo={goTo} page={page} />
      {page === "home" && (
        <>
          <Hero v={v} t={t} variant={variant} />
          <Consultancy v={v} t={t} variant={variant} />
          <About v={v} t={t} variant={variant} />
          <Mentorship v={v} t={t} variant={variant} />
          <Modules v={v} t={t} openModule={openModule} variant={variant} />
          <Notebook v={v} t={t} variant={variant} />
          <Services v={v} t={t} goTo={goTo} variant={variant} />
          <Contact v={v} t={t} variant={variant} />
        </>
      )}
      {page.startsWith("module:") && (
        <ModuleDetail v={v} t={t} idx={parseInt(page.split(":")[1], 10)} goTo={goTo} variant={variant} />
      )}
      {page === "empresa" && (
        <EmpresaPage v={v} t={t} goTo={goTo} variant={variant} />
      )}
      <Footer v={v} t={t} />
    </div>
  );
}

window.SiteApp = SiteApp;
window.VARIANTS = VARIANTS;
