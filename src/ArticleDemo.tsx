import "./article-components.css";
import { useState } from "react";

import { Typography } from "@acko/typography";
import { Button } from "@acko/button";
import { Card, CardContent, CardHeader, CardFooter } from "@acko/card";
import { Badge } from "@acko/badge";
import { Alert } from "@acko/alert";
import { Accordion } from "@acko/accordion";
import { Avatar } from "@acko/avatar";
import { Separator } from "@acko/separator";
import { Tooltip } from "@acko/tooltip";
import { Breadcrumb } from "@acko/breadcrumb";
import { NavigationWizard } from "@acko/navigation-wizard";
import { Textarea } from "@acko/textarea";
import {
  Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell,
} from "@acko/table";

/* ═══════════════════════════════════════════════════════════════════════
   TIER DEFINITIONS
   ═══════════════════════════════════════════════════════════════════════ */
type Tier = "direct" | "composed" | "organism" | "missing";

const TIER_META: Record<Tier, { label: string; dot: string; bg: string; border: string; color: string; typographyColor: "success" | "brand" | "secondary" | "error" }> = {
  direct:   { label: "Direct replacement",    dot: "var(--colorSuccess)",      bg: "var(--colorSuccessSubtle)",  border: "var(--colorSuccess)",   color: "var(--colorTextSuccess)", typographyColor: "success" },
  composed: { label: "Composed from atoms",   dot: "var(--colorPrimary)",      bg: "var(--colorPrimarySubtle)", border: "var(--colorPrimaryMuted)", color: "var(--colorTextBrand)",  typographyColor: "brand"   },
  organism: { label: "Organism — build req.", dot: "var(--colorWarning)",      bg: "var(--colorWarningSubtle)", border: "var(--colorWarning)",   color: "var(--colorWarningText)", typographyColor: "secondary" },
  missing:  { label: "Not in ACKO",          dot: "var(--colorError)",        bg: "var(--colorErrorSubtle)",   border: "var(--colorError)",     color: "var(--colorTextError)",   typographyColor: "error"   },
};

/* ═══════════════════════════════════════════════════════════════════════
   NAV DATA  (order = visual order of rows)
   ═══════════════════════════════════════════════════════════════════════ */
const NAV_ITEMS: { id: string; label: string; group: string; tier: Tier }[] = [
  { id: "sitenav",      label: "SiteHeader / Nav",               group: "Page",       tier: "missing"   },
  { id: "hero",         label: "ArticleHero",                    group: "Page",       tier: "organism"  },
  { id: "factchecked",  label: "FactCheckedBadge",               group: "Page",       tier: "missing"   },
  { id: "breadcrumb",   label: "Breadcrumb",                     group: "Page",       tier: "direct"    },
  { id: "quicksummary", label: "QuickSummary",                   group: "Page",       tier: "direct"    },
  { id: "artsummary",   label: "ArticleSummary",                 group: "Page",       tier: "missing"   },
  { id: "toc",          label: "TableOfContents",                group: "Page",       tier: "composed"  },
  { id: "sectiontitle", label: "SectionTitle",                   group: "Section",    tier: "direct"    },
  { id: "subtitle",     label: "SectionSubtitle",                group: "Section",    tier: "direct"    },
  { id: "prose",        label: "ProseBlock",                     group: "Body",       tier: "direct"    },
  { id: "callout-std",  label: "Callout (tip/warning/recap)",    group: "Body",       tier: "direct"    },
  { id: "callout-ed",   label: "Callout (editorial 5 variants)", group: "Body",       tier: "organism"  },
  { id: "quote",        label: "Quote (pull/expert/source)",     group: "Body",       tier: "missing"   },
  { id: "media",        label: "MediaBlock",                     group: "Body",       tier: "missing"   },
  { id: "stats",        label: "StatGroup",                      group: "Structured", tier: "composed"  },
  { id: "table",        label: "ComparisonTable",                group: "Structured", tier: "direct"    },
  { id: "process",      label: "ProcessFlow",                    group: "Structured", tier: "direct"    },
  { id: "keytake",      label: "KeyTakeaways",                   group: "Structured", tier: "composed"  },
  { id: "faq",          label: "FAQAccordion",                   group: "Structured", tier: "direct"    },
  { id: "glossary",     label: "Glossary",                       group: "Trust",      tier: "composed"  },
  { id: "sources",      label: "SourcesAndReferences",           group: "Trust",      tier: "composed"  },
  { id: "author",       label: "AuthorBioGroup",                 group: "Trust",      tier: "composed"  },
  { id: "editorial",    label: "EditorialAccountability",        group: "Trust",      tier: "composed"  },
  { id: "ask",          label: "AskAnExpert",                    group: "Trust",      tier: "direct"    },
  { id: "sharepost",    label: "SharePost",                      group: "Trust",      tier: "missing"   },
  { id: "related",      label: "RelatedArticles",                group: "Explore",    tier: "composed"  },
  { id: "cta",          label: "InlineCTA",                      group: "Explore",    tier: "composed"  },
  { id: "footer",       label: "Footer",                         group: "Explore",    tier: "missing"   },
];

/* ═══════════════════════════════════════════════════════════════════════
   STATUS PANELS — used instead of fake implementations
   ═══════════════════════════════════════════════════════════════════════ */
function NotInAcko({ reason, buildWith }: { reason: string; buildWith: string[] }) {
  return (
    <div style={{
      border: "1.5px dashed var(--colorError)",
      background: "var(--colorErrorSubtle)",
      borderRadius: "var(--radius2xl)",
      padding: "24px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>🚫</span>
        <Typography variant="heading-md" weight="bold" color="error">NOT IN ACKO</Typography>
      </div>
      <Typography variant="body-md" color="secondary" className="mb-20">
        {reason}
      </Typography>
      {buildWith.length > 0 && (
        <>
          <Typography variant="label-md" weight="semibold" color="error" className="block mb-10">
            To build this, you'd use:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {buildWith.map(b => (
              <li key={b} style={{ marginBottom: 8 }}>
                <Typography variant="body-sm" color="secondary"><code style={{ fontSize: 12, background: "var(--colorErrorSubtle)", padding: "3px 8px", borderRadius: "var(--radiusSm)", color: "var(--colorTextError)" }}>{b}</code></Typography>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function OrganismBuild({ reason, atoms }: { reason: string; atoms: string[] }) {
  return (
    <div style={{
      border: "1.5px dashed var(--colorWarning)",
      background: "var(--colorWarningSubtle)",
      borderRadius: "var(--radius2xl)",
      padding: "24px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>🔨</span>
        <Typography variant="heading-md" weight="bold" color="secondary">ORGANISM — BUILD REQUIRED</Typography>
      </div>
      <Typography variant="body-md" color="secondary" className="mb-20">
        {reason}
      </Typography>
      <Typography variant="label-md" weight="semibold" color="secondary" className="block mb-12">
        ACKO atoms available to compose this:
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {atoms.map(a => (
          <span key={a} style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, background: "var(--colorWarningSubtle)", color: "var(--colorWarningText)", border: "1px solid var(--colorWarning)", borderRadius: "var(--radiusSm)", padding: "4px 10px" }}>{a}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPARISON ROW
   ═══════════════════════════════════════════════════════════════════════ */
function Row({
  id, name, group, tier, mapping,
  original, acko, filterTier,
}: {
  id: string;
  name: string;
  group: string;
  tier: Tier;
  mapping: string;
  original: React.ReactNode;
  acko: React.ReactNode;
  filterTier: Tier | "all";
}) {
  if (filterTier !== "all" && filterTier !== tier) return null;
  const t = TIER_META[tier];
  return (
    <div id={id} style={{
      display: "grid",
      gridTemplateColumns: "256px 1fr 1fr",
      borderBottom: "1px solid var(--colorBorderSubtle)",
      scrollMarginTop: 108,
    }}>
      {/* ── meta ── */}
      <div style={{
        padding: "32px 24px",
        borderRight: "1px solid var(--colorBorderSubtle)",
        background: "var(--colorCardElevatedBg)",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <Typography variant="heading-sm" weight="semibold">{name}</Typography>
        <Typography variant="body-sm" color="secondary">{group}</Typography>
        <span style={{
          display: "inline-block", width: "fit-content",
          fontSize: 11, fontFamily: "monospace", fontWeight: 700,
          background: t.bg, color: t.color, border: `1px solid ${t.border}`,
          borderRadius: "var(--radiusSm)", padding: "3px 9px",
        }}>{t.label}</span>
        <Typography variant="body-sm" color="secondary" className="mt-4">{mapping}</Typography>
      </div>

      {/* ── original HTML ── */}
      <div style={{
        padding: "32px 36px",
        borderRight: "1px solid var(--colorBorderSubtle)",
        background: "var(--colorSurface)",
      }}>
        <Typography variant="overline" color="secondary" className="block mb-16">
          Original · article HTML
        </Typography>
        <div className="ds-scope">{original}</div>
      </div>

      {/* ── acko ── */}
      <div style={{ padding: "32px 36px", background: "var(--colorSurfaceRaised)" }}>
        <Typography variant="overline" color="secondary" className="block mb-16">
          ACKO design system
        </Typography>
        {acko}
      </div>
    </div>
  );
}

const FILTER_OPTIONS: { value: Tier | "all"; label: string; dot?: string }[] = [
  { value: "all",      label: "All" },
  { value: "direct",   label: "Direct replacement",    dot: TIER_META.direct.dot },
  { value: "composed", label: "Composed from atoms",   dot: TIER_META.composed.dot },
  { value: "organism", label: "Organism — build req.", dot: TIER_META.organism.dot },
  { value: "missing",  label: "Not in ACKO",           dot: TIER_META.missing.dot },
];

/* ═══════════════════════════════════════════════════════════════════════
   LEFT NAV — tier filter + legend
   ═══════════════════════════════════════════════════════════════════════ */
function LeftNav({
  filterTier,
  onFilterChange,
}: {
  filterTier: Tier | "all";
  onFilterChange: (value: Tier | "all") => void;
}) {
  return (
    <nav style={{
      position: "fixed", top: 56, left: 0, bottom: 0,
      width: 248,
      background: "var(--colorCardElevatedBg)",
      borderRight: "1px solid var(--colorBorderSubtle)",
      overflowY: "auto",
      zIndex: 18,
      paddingBottom: 60,
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ padding: "18px 18px 12px" }}>
        <Typography variant="overline" color="secondary">Filter</Typography>
      </div>
      <div style={{ padding: "0 12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
        {FILTER_OPTIONS.map(opt => {
          const isActive = filterTier === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange(opt.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 12px",
                border: "none",
                borderRadius: "var(--radiusMd)",
                cursor: "pointer",
                textAlign: "left",
                background: isActive ? "var(--colorPrimarySubtle)" : "transparent",
                borderLeft: isActive ? "2px solid var(--colorPrimary)" : "2px solid transparent",
              }}
            >
              {opt.dot && (
                <span style={{
                  width: 9, height: 9, borderRadius: "50%",
                  background: opt.dot, flexShrink: 0,
                }} />
              )}
              <Typography
                variant="label-md"
                color={isActive ? "brand" : "primary"}
                weight={isActive ? "semibold" : "regular"}
              >
                {opt.label}
              </Typography>
            </button>
          );
        })}
      </div>

      <div style={{ padding: "20px 18px 0", borderTop: "1px solid var(--colorBorderSubtle)", marginTop: "auto" }}>
        <Typography variant="caption" weight="semibold" color="secondary" className="block mb-12">Legend</Typography>
        {Object.entries(TIER_META).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: v.dot, flexShrink: 0 }} />
            <Typography variant="caption" color="secondary">{v.label}</Typography>
          </div>
        ))}
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   GROUP DIVIDER
   ═══════════════════════════════════════════════════════════════════════ */
function GroupLabel({ label, filterTier }: { label: string; filterTier: Tier | "all" }) {
  const groupName = label
    .replace("Page-level", "Page")
    .replace("Section structure", "Section")
    .replace("Body content", "Body")
    .replace("Structured information", "Structured")
    .replace("Trust closure", "Trust")
    .replace("Exploration", "Explore");
  const hasVisible = filterTier === "all" ||
    NAV_ITEMS.some(item => item.group === groupName && item.tier === filterTier);
  if (!hasVisible) return null;
  return (
    <div style={{
      padding: "14px 36px",
      background: "var(--colorCardBg)",
      borderBottom: "1px solid var(--colorBorderSubtle)",
    }}>
      <Typography variant="overline" color="secondary">{label}</Typography>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SHARED DATA
   ═══════════════════════════════════════════════════════════════════════ */
const TABLE_ROWS = [
  { feature: "Pre-existing diseases", a: "Waiting period", b: "✓ Day one",    c: "After base" },
  { feature: "Medical underwriting",  a: "Required",       b: "✗ Not needed", c: "Not needed" },
  { feature: "Portability",           a: "✓ Full",         b: "Lapses on exit", c: "Portable"  },
];

const FAQ_DATA = [
  { q: "Is group health insurance mandatory?",  a: "Yes — for establishments with 10+ workers under the ESI Act." },
  { q: "What happens to cover when I resign?",  a: "Group cover ceases on your last working day. Port within 30 days." },
];

/* ═══════════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════════ */
export default function ArticleDemo() {
  const [question, setQuestion] = useState("");
  const [filterTier, setFilterTier] = useState<Tier | "all">("all");

  return (
    <div style={{ minHeight: "100vh", background: "var(--colorSurface)" }}>

      {/* top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 20,
        background: "var(--colorTextPrimary)",
        padding: "12px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>⬡</span>
          <Typography variant="label-lg" weight="semibold" color="static">
            Article system ↔ ACKO design system · Component mapping
          </Typography>
        </div>
      </div>

        <LeftNav filterTier={filterTier} onFilterChange={setFilterTier} />

      {/* content */}
      <div style={{ marginLeft: 248, marginTop: 56 }}>

        {/* column headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "256px 1fr 1fr",
          position: "sticky", top: 56, zIndex: 17,
          background: "var(--colorCardBg)", borderBottom: "2px solid var(--colorBorderSubtle)",
        }}>
          <div style={{ padding: "12px 24px", borderRight: "1px solid var(--colorBorderSubtle)" }}>
            <Typography variant="label-lg" weight="semibold" color="secondary">Component</Typography>
          </div>
          <div style={{ padding: "12px 36px", borderRight: "1px solid var(--colorBorderSubtle)", display: "flex", alignItems: "center", gap: 10 }}>
            <span>📄</span>
            <Typography variant="label-lg" weight="semibold" color="secondary">Original — article HTML (unchanged)</Typography>
          </div>
          <div style={{ padding: "12px 36px", display: "flex", alignItems: "center", gap: 10 }}>
            <span>⬡</span>
            <Typography variant="label-lg" weight="semibold" color="secondary">ACKO design system</Typography>
          </div>
        </div>

        {/* ── PAGE LEVEL ─────────────────────────────────────────── */}
        <GroupLabel label="Page-level" filterTier={filterTier} />

        {/* 0 · SiteHeader */}
        <Row id="sitenav" name="SiteHeader / Nav" group="Page" tier="missing"
          filterTier={filterTier}
          mapping="Full-page navigation — no ACKO component exists"
          original={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "var(--ds-color-bg-primary)", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>ACKO</span>
                {["Products", "Enterprise", "About us", "Support"].map(l => (
                  <div key={l} className="c-toc-item" style={{ padding: "8px 12px", border: 0, fontSize: 14, color: "var(--ds-color-text-primary)" }}>{l} ▾</div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ padding: "7px 14px", border: "1px solid var(--ds-color-border-secondary)", borderRadius: 10, fontSize: 13 }}>Claims ▾</div>
                <div style={{ padding: "7px 14px", background: "var(--ds-color-text-primary)", color: "#fff", borderRadius: 10, fontSize: 13 }}>Login</div>
              </div>
            </div>
          }
          acko={
            <NotInAcko
              reason="The floating pill navigation bar (logo + product menus + CTA buttons) has no equivalent in the ACKO component library. It is a full site-level organism."
              buildWith={[
                "@acko/button (Claims outline + Login filled)",
                "@acko/typography (menu labels)",
                "@acko/dropdown (Products / Enterprise menus)",
                "Custom SiteHeader organism — layout, hover states, mobile collapse",
              ]}
            />
          }
        />

        {/* 1 · ArticleHero */}
        <Row id="hero" name="ArticleHero" group="Page" tier="organism"
          filterTier={filterTier}
          mapping="Partially available — Badge · Typography · Avatar · Breadcrumb all exist. Hero image container does NOT exist in ACKO."
          original={
            <>
              <div className="c-hero-eyebrow">
                <span className="c-hero-tag">Health insurance</span>
                <span>· Beginner · 12 min read</span>
              </div>
              <h1 className="c-hero-h1">Group health insurance: The complete beginner's guide</h1>
              <p className="c-hero-deck">Everything employers need to know — premiums, IRDAI mandates, and add-ons worth paying for.</p>
              <div className="c-hero-byline">
                <span><span className="c-hero-avatar">NP</span>Nikhila P S</span>
                <span><span className="c-hero-avatar">RS</span>Reviewed by Rekhit Singh</span>
              </div>
              <div className="c-hero-media">Hero image · 1280 × 480</div>
            </>
          }
          acko={
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <OrganismBuild
                reason="ArticleHero is a complex organism — it combines a category tag, headline, sub-deck, byline with avatars, and a full-width hero image. Most text/meta atoms exist in ACKO. The hero image container (1280×480, rounded corners, full-bleed) does not — ACKO has no image container, figure, or media block component."
                atoms={["@acko/badge ✓", "@acko/typography ✓", "@acko/avatar ✓", "@acko/breadcrumb ✓", "<img> HTML ✓"]}
              />
              <div style={{ border: "1.5px dashed var(--colorError)", background: "var(--colorErrorSubtle)", borderRadius: "var(--radius2xl)", padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🚫</span>
                <div>
                  <Typography variant="label-md" weight="bold" color="error" className="block mb-4">Hero image container — NOT IN ACKO</Typography>
                  <Typography variant="body-sm" color="secondary">
                    The 1280×480px full-width image block with rounded corners (radius-4xl) has no ACKO equivalent. Same gap as <strong>MediaBlock</strong> — a custom image container organism is needed.
                  </Typography>
                </div>
              </div>
            </div>
          }
        />

        {/* 1b · FactCheckedBadge */}
        <Row id="factchecked" name="FactCheckedBadge" group="Page" tier="missing"
          filterTier={filterTier}
          mapping="@acko/badge has no dark/black variant — color options are purple/green/blue/orange/pink/gray only. Pill cannot be reproduced."
          original={
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--ds-color-text-primary)", color: "#fff", borderRadius: 52, padding: "6px 12px", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
                <span style={{ fontSize: 14 }}>✓</span> FACT CHECKED
              </div>
              <div style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--ds-color-text-secondary)" }}>
                <span>Last updated: February 25, 2026</span>
                <span>|</span>
                <span>6 min read</span>
              </div>
            </div>
          }
          acko={
            <NotInAcko
              reason={`@acko/badge supports color: "purple" | "green" | "blue" | "orange" | "pink" | "gray" — no dark/black variant exists. The original uses surface/base/invert (#141414) with white text, which Badge cannot produce. The meta text (last updated · read time) can use @acko/typography, but the pill itself needs a new Badge variant or a custom token-based pill.`}
              buildWith={[
                "@acko/badge — needs a new dark/invert variant added to the component",
                "@acko/typography for the meta text (last updated · read time)",
                "OR: a custom FactCheckedPill using surface/base/invert token directly",
              ]}
            />
          }
        />

        {/* 2 · Breadcrumb */}
        <Row id="breadcrumb" name="Breadcrumb" group="Page" tier="direct"
          filterTier={filterTier}
          mapping="@acko/breadcrumb — direct 1:1 replacement"
          original={
            <nav style={{ fontSize: 12, color: "var(--ds-color-text-secondary)", display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ color: "var(--ds-color-text-info)" }}>Home</span>
              <span>›</span>
              <span style={{ color: "var(--ds-color-text-info)" }}>Insurance guides</span>
              <span>›</span>
              <span>Health insurance</span>
              <span>›</span>
              <span>Group health insurance</span>
            </nav>
          }
          acko={
            <Breadcrumb items={[
              { label: "Home", href: "#" },
              { label: "Insurance guides", href: "#" },
              { label: "Health insurance", href: "#" },
              { label: "Group health insurance" },
            ]} />
          }
        />

        {/* 3 · QuickSummary */}
        <Row id="quicksummary" name="QuickSummary" group="Page" tier="direct"
          filterTier={filterTier}
          mapping="@acko/alert · variant=info — direct replacement"
          original={
            <div className="c-quicksum">
              Group health insurance covers all employees under one policy. The employer pays the premium, and cover is active from day one — no waiting periods, no medicals.
            </div>
          }
          acko={
            <Alert variant="info" title="In a nutshell">
              Group health insurance covers all employees under one policy. The employer pays the premium, and cover is active from day one — no waiting periods, no medicals.
            </Alert>
          }
        />

        {/* 3b · ArticleSummary */}
        <Row id="artsummary" name="ArticleSummary" group="Page" tier="missing"
          filterTier={filterTier}
          mapping="Distinct from QuickSummary — violet bg, frosted glass inner card, 'Article summary' label. No ACKO equivalent."
          original={
            <div style={{ background: "#d9d8fc", borderRadius: 20, padding: "20px" }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Article summary</div>
              <div style={{ background: "rgba(255,255,255,0.8)", borderRadius: 12, padding: "14px 16px", fontSize: 14, lineHeight: 1.65, color: "var(--ds-color-text-primary)" }}>
                Starting a new job usually means you're included in your employer's group health insurance plan. This article explains how these policies work, what medical expenses they cover, and how dependents might be added.
              </div>
            </div>
          }
          acko={
            <NotInAcko
              reason="ArticleSummary is visually distinct from QuickSummary. It uses a violet (accent) background with a frosted glass inner card and an 'Article summary' heading slot. The Alert component cannot replicate this treatment — different layout, different colour role, different inner card structure."
              buildWith={[
                "@acko/tokens — surface/accent/violet/200 background",
                "@acko/card (inner frosted card — surface/white/800)",
                "@acko/typography (heading + body)",
                "Custom ArticleSummary organism — outer accent surface + inner card slot",
              ]}
            />
          }
        />

        {/* 4 · TableOfContents */}
        <Row id="toc" name="TableOfContents" group="Page" tier="composed"
          filterTier={filterTier}
          mapping="@acko/card + @acko/typography + @acko/separator — composed from atoms"
          original={
            <nav className="c-toc">
              <div className="c-toc-title">In this article</div>
              {["What is group health insurance?", "How are premiums calculated?", "Types of cover available", "Key takeaways"].map((t, i, arr) => (
                <div key={t} className="c-toc-item" style={i === arr.length - 1 ? { border: 0 } : {}}>
                  <span>{t}</span><span>›</span>
                </div>
              ))}
            </nav>
          }
          acko={
            <Card variant="default" padding="md">
              <CardHeader><Typography variant="overline" color="secondary">In this article</Typography></CardHeader>
              <CardContent>
                {["What is group health insurance?", "How are premiums calculated?", "Types of cover available", "Key takeaways"].map((t, i, arr) => (
                  <div key={t}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                      <Typography variant="body-sm" color="brand">{t}</Typography>
                      <Typography variant="caption" color="secondary">›</Typography>
                    </div>
                    {i < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          }
        />

        {/* ── SECTION STRUCTURE ──────────────────────────────────── */}
        <GroupLabel label="Section structure" filterTier={filterTier} />

        {/* 5 · SectionTitle */}
        <Row id="sectiontitle" name="SectionTitle" group="Section" tier="direct"
          filterTier={filterTier}
          mapping="@acko/typography · variant=heading-xl · as=h2"
          original={<h2 className="c-section-title">What is group health insurance and how does it work?</h2>}
          acko={<Typography variant="heading-xl" as="h2" weight="semibold">What is group health insurance and how does it work?</Typography>}
        />

        {/* 6 · SectionSubtitle */}
        <Row id="subtitle" name="SectionSubtitle" group="Section" tier="direct"
          filterTier={filterTier}
          mapping="@acko/typography · variant=body-lg · color=secondary"
          original={<p className="c-section-subtitle">Everything an employer needs to understand — coverage scope, enrolment rules and the policyholder relationship.</p>}
          acko={<Typography variant="body-lg" color="secondary">Everything an employer needs to understand — coverage scope, enrolment rules and the policyholder relationship.</Typography>}
        />

        {/* ── BODY CONTENT ───────────────────────────────────────── */}
        <GroupLabel label="Body content" filterTier={filterTier} />

        {/* 7 · ProseBlock */}
        <Row id="prose" name="ProseBlock" group="Body" tier="direct"
          filterTier={filterTier}
          mapping="@acko/typography for all text · @acko/tooltip for glossary terms"
          original={
            <div className="c-prose">
              <p>Section 146 of the <a className="ilink" href="#">Motor Vehicles Act, 1988</a> makes it unlawful to use a motor vehicle without a policy.<a className="cite" href="#">[1]</a></p>
              <h3>Who counts as a third party?</h3>
              <p>Anyone other than the driver — including <span className="gloss">pedestrians</span>, passengers, and cyclists. The <span className="istat">minimum fine is ₹2,000</span>.</p>
            </div>
          }
          acko={
            <div>
              <Typography variant="body-md" color="secondary" className="mb-10">
                Section 146 of the{" "}
                <Typography variant="body-md" color="brand" as="a" href="#">Motor Vehicles Act, 1988</Typography>{" "}
                makes it unlawful to use a motor vehicle without a policy.
                <sup style={{ fontSize: 10, color: "var(--colorTextBrand)" }}>[1]</sup>
              </Typography>
              <Typography variant="heading-sm" as="h3" weight="semibold" className="mt-12 mb-6">Who counts as a third party?</Typography>
              <Typography variant="body-md" color="secondary">
                Anyone other than the driver — including{" "}
                <Tooltip content="A person not in the insured vehicle who suffers loss.">
                  <span style={{ borderBottom: "1px dotted currentColor", cursor: "help" }}>pedestrians</span>
                </Tooltip>
                , passengers, and cyclists. The <strong>minimum fine is ₹2,000</strong>.
              </Typography>
            </div>
          }
        />

        {/* 8 · Callout standard */}
        <Row id="callout-std" name="Callout (tip · warning · recap · info)" group="Body" tier="direct"
          filterTier={filterTier}
          mapping="@acko/alert · variant = info / warning / success — direct 1:1 for 4 of 9 variants"
          original={
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="c-callout cv-tip"><span>💡</span><div><span className="c-callout-pill">Pro tip</span><div className="c-callout-body">Renew 7–10 days before expiry — the NCB is lost the moment the policy lapses.</div></div></div>
              <div className="c-callout cv-warning"><span>⚠️</span><div><span className="c-callout-pill">Warning</span><div className="c-callout-body">Motor insurance has <strong>no grace period</strong>. Driving expired = driving uninsured.</div></div></div>
              <div className="c-callout cv-recap"><span>📌</span><div><span className="c-callout-pill">In short</span><div className="c-callout-body" style={{ fontStyle: "italic" }}>Third-party cover is the legal floor. Comprehensive depends on your car's age and IDV.</div></div></div>
            </div>
          }
          acko={
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Alert variant="info"    title="Pro tip">Renew 7–10 days before expiry — the NCB is lost the moment the policy lapses.</Alert>
              <Alert variant="warning" title="Warning">Motor insurance has no grace period. Driving expired = driving uninsured.</Alert>
              <Alert variant="success" title="In short">Third-party cover is the legal floor. Comprehensive depends on your car's age and IDV.</Alert>
            </div>
          }
        />

        {/* 9 · Callout editorial */}
        <Row id="callout-ed" name="Callout (regulation · practitioner · edge_case · myth_fact · counter_argument)" group="Body" tier="organism"
          filterTier={filterTier}
          mapping="5 editorial variants not in @acko/alert. Needs 1 new CalloutEditorial organism using ACKO tokens."
          original={
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="c-callout cv-regulation"><span>⚖️</span><div><span className="c-callout-pill">Statute</span><div className="c-callout-body">"No person shall use a motor vehicle in any public place unless there is a policy in force." — MVA 1988, S.146</div></div></div>
              <div className="c-callout cv-practitioner_note"><span>👤</span><div><span className="c-callout-pill">From the field</span><div className="c-callout-body">The most expensive mistake I see is people moving their car before the surveyor arrives.</div></div></div>
              <div className="c-callout cv-counter_argument"><span>⚖</span><div><span className="c-callout-pill">The case against</span><div className="c-callout-body">For a paid-off car over 8 years old with an IDV of ₹80,000, a ₹6,000 premium is a poor ratio.</div></div></div>
            </div>
          }
          acko={
            <OrganismBuild
              reason="The 5 editorial callout variants (regulation, practitioner_note, edge_case, myth_fact, counter_argument) have no equivalent in @acko/alert — they need different colours, serif body text, and attribution lines. One new CalloutEditorial organism is required. It shares the same slot structure as Alert."
              atoms={["@acko/typography (body + overline + caption)", "@acko/tokens (semantic colour vars)", "CSS: border-left rule per variant"]}
            />
          }
        />

        {/* 10 · Quote */}
        <Row id="quote" name="Quote (pull · expert · source)" group="Body" tier="missing"
          filterTier={filterTier}
          mapping="No quote/testimonial component in ACKO. Pull and source use serif type. Expert uses avatar+card."
          original={
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <blockquote className="c-quote-pull">"The most preventable claim rejection isn't fraud — it's an outdated member list."</blockquote>
              <div className="c-quote-expert">
                <div className="c-quote-avatar">RS</div>
                <div>
                  <p className="c-quote-body">"Tribunals uphold rejections on the 24-hour notification clause alone."</p>
                  <div className="c-quote-attr">Rekhit Singh · Senior Director, ACKO</div>
                </div>
              </div>
              <div className="c-quote-source">"Motor insurance penetration in India was 6.5% in FY24."<span className="c-quote-source-attr">— IRDAI Annual Report 2023–24, p. 47</span></div>
            </div>
          }
          acko={
            <NotInAcko
              reason="ACKO has no quote, pull-quote, or testimonial component. The expert variant could partially use Card + Avatar, but pull and source quotes require serif typography and border-left styling that doesn't map to any existing ACKO component."
              buildWith={[
                "@acko/avatar (for expert attribution only)",
                "@acko/card (for expert variant only)",
                "@acko/typography — but no serif variant exists",
                "Custom QuoteBlock organism needed (3 sub-variants)",
              ]}
            />
          }
        />

        {/* 11 · MediaBlock */}
        <Row id="media" name="MediaBlock" group="Body" tier="missing"
          filterTier={filterTier}
          mapping="No image/media container component in ACKO. No <figure> equivalent."
          original={
            <figure style={{ margin: 0 }}>
              <div className="c-media-img">📊 Bar chart · Group health premium FY20–FY24</div>
              <div className="c-media-cap">Group health insurance gross premium, India, FY20–FY24</div>
              <div className="c-media-cred">Source: IRDAI Annual Report 2023–24</div>
            </figure>
          }
          acko={
            <NotInAcko
              reason="ACKO has no image container, figure, or media block component. No caption/credit typography slots exist for media. This needs a new organism."
              buildWith={[
                "HTML <figure> / <img> (semantic)",
                "@acko/typography for caption and credit text",
                "Custom MediaBlock organism — image + caption + source credit",
              ]}
            />
          }
        />

        {/* ── STRUCTURED INFORMATION ─────────────────────────────── */}
        <GroupLabel label="Structured information" filterTier={filterTier} />

        {/* 12 · StatGroup */}
        <Row id="stats" name="StatGroup (icon-cards · single-stat)" group="Structured" tier="composed"
          filterTier={filterTier}
          mapping="§20 StatBarCard pattern (cards.md) · Card default × 3 — icon → overline label → heading-lg number (24px, original spec) → body-sm description"
          original={
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="c-stat-cards">
                {[
                  { icon: "🚗", label: "FIRST OFFENCE", n: "₹2,000", d: "Fine and/or up to 3 months imprisonment" },
                  { icon: "🔄", label: "REPEAT OFFENCE", n: "₹4,000", d: "Fine and/or up to 3 months imprisonment" },
                  { icon: "🚫", label: "VEHICLE SEIZURE", n: "Impounded", d: "Until valid insurance is produced to authorities" },
                ].map(s => (
                  <div key={s.n} className="c-stat-card">
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                    <div className="c-stat-lbl" style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 11, fontWeight: 600, color: "var(--ds-color-text-primary)", marginBottom: 4 }}>{s.label}</div>
                    <div className="c-stat-num" style={{ color: "var(--ds-color-text-primary)" }}>{s.n}</div>
                    <div className="c-stat-lbl">{s.d}</div>
                  </div>
                ))}
              </div>
              <div className="c-stat-single">
                <div className="c-stat-single-num">71%</div>
                <div><div className="c-stat-single-body">of employees say group health cover is the most valued workplace benefit.</div><div className="c-stat-single-src">Mercer India Survey 2023</div></div>
              </div>
            </div>
          }
          acko={
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { icon: "🚗", label: "FIRST OFFENCE",  n: "₹2,000",    d: "Fine and/or up to 3 months imprisonment" },
                  { icon: "🔄", label: "REPEAT OFFENCE", n: "₹4,000",    d: "Fine and/or up to 3 months imprisonment" },
                  { icon: "🚫", label: "VEHICLE SEIZURE",n: "Impounded", d: "Until valid insurance is produced to authorities" },
                ].map(s => (
                  <Card key={s.n} variant="default" padding="md">
                    <CardContent>
                      {/* 56px icon slot — Figma uses illustration image, placeholder emoji here */}
                      <div style={{ width: 48, height: 48, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{s.icon}</div>
                      <Typography variant="overline" className="block mb-4">{s.label}</Typography>
                      <Typography variant="heading-lg" weight="semibold" className="block mb-6">{s.n}</Typography>
                      <Typography variant="body-sm" color="secondary">{s.d}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card variant="elevated" padding="md">
                <CardContent>
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <Typography variant="display-md" weight="bold" color="brand" className="shrink-0">71%</Typography>
                    <div>
                      <Typography variant="body-sm" color="secondary">of employees say group health cover is the most valued workplace benefit.</Typography>
                      <Typography variant="caption" color="secondary" className="block mt-4">Mercer India Survey 2023</Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          }
        />

        {/* 13 · ComparisonTable */}
        <Row id="table" name="ComparisonTable" group="Structured" tier="direct"
          filterTier={filterTier}
          mapping="@acko/table — Table · TableHeader · TableBody · TableRow · TableHead · TableCell"
          original={
            <table className="c-comparison">
              <thead><tr><th>Cover</th><th>Individual</th><th>Group policy</th><th>Top-up</th></tr></thead>
              <tbody>
                {TABLE_ROWS.map(r => (
                  <tr key={r.feature}>
                    <td>{r.feature}</td><td>{r.a}</td>
                    <td className={r.b.startsWith("✓") ? "tick" : ""}>{r.b}</td>
                    <td>{r.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          acko={
            <Table>
              <TableHeader>
                <TableRow><TableHead>Cover</TableHead><TableHead>Individual</TableHead><TableHead>Group policy</TableHead><TableHead>Top-up</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {TABLE_ROWS.map(r => (
                  <TableRow key={r.feature}>
                    <TableCell><Typography variant="body-sm" weight="semibold">{r.feature}</Typography></TableCell>
                    <TableCell><Typography variant="body-sm" color="secondary">{r.a}</Typography></TableCell>
                    <TableCell><Typography variant="body-sm" color={r.b.startsWith("✓") ? "success" : "secondary"}>{r.b}</Typography></TableCell>
                    <TableCell><Typography variant="body-sm" color="secondary">{r.c}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        />

        {/* 14 · ProcessFlow */}
        <Row id="process" name="ProcessFlow (steps · timeline)" group="Structured" tier="direct"
          filterTier={filterTier}
          mapping="@acko/navigation-wizard · variant=horizontal (steps) + variant=vertical all status=completed (timeline)"
          original={
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="c-process-steps">
                {[{ n: "STEP 1", t: "Day 0", l: "File FIR" }, { n: "STEP 2", t: "24 hrs", l: "Notify insurer" }, { n: "STEP 3", t: "Day 1–3", l: "Surveyor" }, { n: "STEP 4", t: "Day 7–21", l: "Settled" }].map(s => (
                  <div key={s.n} className="c-process-step">
                    <div className="c-process-num">{s.n}</div>
                    <div className="c-process-time">{s.t}</div>
                    <div className="c-process-label">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="c-timeline">
                {[{ y: "2019", t: "IRDAI allows standalone OD policies." }, { y: "2021", t: "COVID drives 34% spike in group cover." }, { y: "2024", t: "VAHAN integration enables real-time checks." }].map(i => (
                  <div key={i.y} className="c-timeline-item">
                    <div className="c-timeline-year">{i.y}</div>
                    <div className="c-timeline-text">{i.t}</div>
                  </div>
                ))}
              </div>
            </div>
          }
          acko={
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <Typography variant="label-sm" weight="semibold" color="secondary" className="block mb-10">
                  Horizontal process steps → <code style={{ fontSize: 11 }}>variant="horizontal"</code>
                </Typography>
                <NavigationWizard
                  variant="horizontal"
                  currentStep={1}
                  steps={[
                    { label: "File FIR",       description: "Day 0",    status: "completed" },
                    { label: "Notify insurer", description: "24 hrs",   status: "current"   },
                    { label: "Surveyor",       description: "Day 1–3",  status: "upcoming"  },
                    { label: "Settled",        description: "Day 7–21", status: "upcoming"  },
                  ]}
                />
              </div>
              <Separator />
              <div>
                <Typography variant="label-sm" weight="semibold" color="secondary" className="block mb-10">
                  Vertical timeline → <code style={{ fontSize: 11 }}>variant="vertical"</code> · all <code style={{ fontSize: 11 }}>status="completed"</code>
                </Typography>
                <NavigationWizard
                  variant="vertical"
                  currentStep={2}
                  steps={[
                    { label: "2019", description: "IRDAI allows standalone OD policies; fine raised to ₹2,000.", status: "completed" },
                    { label: "2021", description: "COVID drives 34% spike in group cover enrolment.",            status: "completed" },
                    { label: "2024", description: "VAHAN integration enables real-time insurance checks.",       status: "completed" },
                  ]}
                />
              </div>
            </div>
          }
        />

        {/* 15 · KeyTakeaways */}
        <Row id="keytake" name="KeyTakeaways" group="Structured" tier="composed"
          filterTier={filterTier}
          mapping="@acko/card secondary + @acko/typography — composed, no new component needed"
          original={
            <div className="c-keytake">
              <p className="c-keytake-intro">For most salaried employees, group cover is the most cost-efficient health cover available.</p>
              {["Pre-existing diseases covered from day one.", "Cover lapses when you leave — port within 30 days.", "Top-up plans are the cheapest way to enhance cover."].map(b => (
                <div key={b} className="c-keytake-bullet"><span style={{ color: "var(--ds-color-text-success)" }}>✓</span><span>{b}</span></div>
              ))}
            </div>
          }
          acko={
            <Card variant="demoted" padding="md">
              <CardContent>
                <Typography variant="body-sm" color="secondary" className="mb-12">For most salaried employees, group cover is the most cost-efficient health cover available.</Typography>
                {["Pre-existing diseases covered from day one.", "Cover lapses when you leave — port within 30 days.", "Top-up plans are the cheapest way to enhance cover."].map(b => (
                  <div key={b} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ color: "var(--colorSuccessText,#166534)", flexShrink: 0 }}>✓</span>
                    <Typography variant="body-sm">{b}</Typography>
                  </div>
                ))}
              </CardContent>
            </Card>
          }
        />

        {/* 16 · FAQAccordion */}
        <Row id="faq" name="FAQAccordion" group="Structured" tier="direct"
          filterTier={filterTier}
          mapping="@acko/accordion · type=single · collapsible — direct 1:1"
          original={
            <div>
              {FAQ_DATA.map(f => (
                <div key={f.q} className="c-faq-item">
                  <div className="c-faq-q"><span>{f.q}</span><span>+</span></div>
                  <div className="c-faq-a">{f.a}</div>
                </div>
              ))}
            </div>
          }
          acko={
            <Accordion type="single" collapsible items={FAQ_DATA.map(f => ({
              value: f.q,
              trigger: <Typography variant="body-md" weight="medium">{f.q}</Typography>,
              content: <Typography variant="body-sm" color="secondary">{f.a}</Typography>,
            }))} />
          }
        />

        {/* ── TRUST ──────────────────────────────────────────────── */}
        <GroupLabel label="Trust closure" filterTier={filterTier} />

        {/* 17 · Glossary */}
        <Row id="glossary" name="Glossary" group="Trust" tier="composed"
          filterTier={filterTier}
          mapping="@acko/typography dl/dt/dd pattern + inline @acko/tooltip — no new component"
          original={
            <div className="c-glossary">
              {[{ t: "Sum insured", d: "Maximum the insurer pays in a policy year." }, { t: "Loss ratio", d: "Claims as % of premiums." }, { t: "TPA", d: "Third-Party Administrator — processes claims." }, { t: "Co-pay", d: "% of each claim the insured pays first." }].map(g => (
                <div key={g.t} className="c-glossary-item">
                  <div className="c-glossary-term">{g.t}</div>
                  <div className="c-glossary-def">{g.d}</div>
                </div>
              ))}
            </div>
          }
          acko={
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              {[{ t: "Sum insured", d: "Maximum the insurer pays in a policy year." }, { t: "Loss ratio", d: "Claims as % of premiums." }, { t: "TPA", d: "Third-Party Administrator — processes claims." }, { t: "Co-pay", d: "% of each claim the insured pays first." }].map(g => (
                <div key={g.t} style={{ padding: "10px 0", borderBottom: "1px solid var(--colorBorderSubtle)" }}>
                  <Typography variant="label-lg" weight="semibold" className="block mb-3">{g.t}</Typography>
                  <Typography variant="body-sm" color="secondary">{g.d}</Typography>
                </div>
              ))}
            </div>
          }
        />

        {/* 18 · SourcesAndReferences */}
        <Row id="sources" name="SourcesAndReferences" group="Trust" tier="composed"
          filterTier={filterTier}
          mapping="@acko/typography + @acko/separator + numbered counter circles via CSS"
          original={
            <ol className="c-sources">
              {["IRDAI Health Insurance Regulations 2016 — indiacode.nic.in", "IRDAI Annual Report 2023–24, p. 61", "Mercer India Employee Benefits Survey 2023"].map(s => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          }
          acko={
            <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["IRDAI Health Insurance Regulations 2016 — indiacode.nic.in", "IRDAI Annual Report 2023–24, p. 61", "Mercer India Employee Benefits Survey 2023"].map((s, i, arr) => (
                <li key={s}>
                  <div style={{ display: "flex", gap: 10, padding: "10px 0", alignItems: "flex-start" }}>
                    <span style={{ minWidth: 22, height: 22, borderRadius: "50%", background: "var(--colorSurface)", border: "1px solid var(--colorBorder)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    <Typography variant="body-sm" color="secondary">{s}</Typography>
                  </div>
                  {i < arr.length - 1 && <Separator />}
                </li>
              ))}
            </ol>
          }
        />

        {/* 19 · AuthorBioGroup */}
        <Row id="author" name="AuthorBioGroup" group="Trust" tier="composed"
          filterTier={filterTier}
          mapping="@acko/card × N + @acko/avatar + @acko/typography — no new component"
          original={
            <div className="c-bios">
              {[{ i: "NP", n: "Nikhila P S", r: "Senior Content Editor · 6 yrs", b: "Specialises in health and motor insurance guides." }, { i: "RS", n: "Rekhit Singh", r: "Senior Director, ACKO · 11 yrs", b: "Deep expertise in group health insurance strategy." }].map(p => (
                <div key={p.n}>
                  <div className="c-bio-head"><div className="c-bio-av">{p.i}</div><div><div className="c-bio-name">{p.n}</div><div className="c-bio-role">{p.r}</div></div></div>
                  <div className="c-bio-text">{p.b}</div>
                </div>
              ))}
            </div>
          }
          acko={
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[{ i: "NP", n: "Nikhila P S", r: "Senior Content Editor · 6 yrs", b: "Specialises in health and motor insurance guides." }, { i: "RS", n: "Rekhit Singh", r: "Senior Director, ACKO · 11 yrs", b: "Deep expertise in group health insurance strategy." }].map(p => (
                <Card key={p.n} variant="default" padding="md">
                  <CardContent>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                      <Avatar initials={p.i} size="lg" />
                      <div>
                        <Typography variant="heading-sm" weight="semibold" className="block">{p.n}</Typography>
                        <Typography variant="caption" color="secondary">{p.r}</Typography>
                      </div>
                    </div>
                    <Typography variant="body-sm" color="secondary">{p.b}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        />

        {/* 20 · EditorialAccountability */}
        <Row id="editorial" name="EditorialAccountability" group="Trust" tier="composed"
          filterTier={filterTier}
          mapping="@acko/card × 3 + @acko/button (secondary/ghost/link) + @acko/typography"
          original={
            <div className="c-editorial">
              <div className="c-editorial-block"><h3 className="c-editorial-h3">Article history</h3>{[{ d: "Feb 25, 2026", n: "Added VAHAN section." }, { d: "Jun 3, 2025", n: "Original publication." }].map(h => <div key={h.d} className="c-entry"><span>{h.d}</span> · {h.n}</div>)}</div>
              <div className="c-editorial-block"><h3 className="c-editorial-h3">Was this helpful?</h3><div className="c-editorial-feedback"><button>👍 Yes</button><button>👎 No</button></div></div>
              <div className="c-editorial-block"><h3 className="c-editorial-h3">Report a correction</h3><a href="#">Submit a correction →</a></div>
            </div>
          }
          acko={
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <Card variant="default" padding="sm"><CardContent>
                <Typography variant="label-md" weight="semibold" className="block mb-8">Article history</Typography>
                {[{ d: "Feb 25, 2026", n: "Added VAHAN section." }, { d: "Jun 3, 2025", n: "Original publication." }].map(h => (
                  <div key={h.d} style={{ marginBottom: 5 }}>
                    <Typography variant="caption" color="brand" className="block">{h.d}</Typography>
                    <Typography variant="caption" color="secondary">{h.n}</Typography>
                  </div>
                ))}
              </CardContent></Card>
              <Card variant="default" padding="sm"><CardContent>
                <Typography variant="label-md" weight="semibold" className="block mb-8">Was this helpful?</Typography>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="secondary" size="sm" type="button">👍 Yes</Button>
                  <Button variant="ghost" size="sm" type="button">👎 No</Button>
                </div>
              </CardContent></Card>
              <Card variant="default" padding="sm"><CardContent>
                <Typography variant="label-md" weight="semibold" className="block mb-8">Report a correction</Typography>
                <Button variant="link" size="sm" type="button">Submit a correction →</Button>
              </CardContent></Card>
            </div>
          }
        />

        {/* 21 · AskAnExpert */}
        <Row id="ask" name="AskAnExpert" group="Trust" tier="direct"
          filterTier={filterTier}
          mapping="@acko/textarea + @acko/button — atoms only, no organism needed"
          original={
            <div>
              <p className="c-ask-intro">Editorial team reviews reader questions weekly.</p>
              <textarea className="c-ask-input" rows={3} placeholder="Your question…" />
              <button className="c-ask-submit">Submit question</button>
              <div className="c-ask-recent">Recently added
                <div>"Can I use group cover for OPD? — Jan 2026"</div>
                <div>"Does group cover include dental? — Dec 2025"</div>
              </div>
            </div>
          }
          acko={
            <div>
              <Typography variant="body-sm" color="secondary" className="mb-10">Editorial team reviews reader questions weekly.</Typography>
              <Textarea label="Your question" placeholder="Your question…" value={question} onChange={setQuestion} rows={3} maxLength={400} showCount />
              <div style={{ marginTop: 10, marginBottom: 12 }}>
                <Button variant="primary" size="sm" type="button">Submit question</Button>
              </div>
              <Typography variant="overline" color="secondary" className="block mb-6">Recently added</Typography>
              {['"Can I use group cover for OPD? — Jan 2026"', '"Does group cover include dental? — Dec 2025"'].map(q => (
                <Typography key={q} variant="body-sm" color="secondary" className="italic mb-3">{q}</Typography>
              ))}
            </div>
          }
        />

        {/* 21b · SharePost */}
        <Row id="sharepost" name="SharePost" group="Trust" tier="missing"
          filterTier={filterTier}
          mapping="Social share row — no social icon components in ACKO"
          original={
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Share this post</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["𝕏", "in", "f", "🔗"].map((icon, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--ds-color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>{icon}</div>
                ))}
              </div>
            </div>
          }
          acko={
            <NotInAcko
              reason="ACKO has no social share component and no social platform icon set (X/Twitter, LinkedIn, Facebook, Copy link). There is no button variant that renders circular icon-only social buttons."
              buildWith={[
                "@acko/button (icon-only variant, if it exists — verify)",
                "@acko/tooltip (show platform name on hover)",
                "Social SVG icons — must be sourced separately (lucide-react has no social icons)",
                "Custom SharePost organism — horizontal row with circular icon buttons",
              ]}
            />
          }
        />

        {/* ── EXPLORATION ────────────────────────────────────────── */}
        <GroupLabel label="Exploration" filterTier={filterTier} />

        {/* 22 · RelatedArticles */}
        <Row id="related" name="RelatedArticles" group="Explore" tier="composed"
          filterTier={filterTier}
          mapping="§9 ContentCard (cards.md) · Card elevated padding=none × 3 — media 16:9 → label-lg semibold title → body-sm description → caption date"
          original={
            <div className="c-related">
              {[{ t: "Buying a new car? Here are some helpful tips", d: "Thinking about buying a used car? There are a few things to consider.", date: "January 19, 2026" },
                { t: "Car insurance in India: Compare options to suit your needs", d: "When it's time to sort out your car insurance, answering the questions required is straightforward.", date: "January 19, 2026" },
                { t: "Is windscreen insurance included in car insurance?", d: "Sometimes it starts with a sharp ping – a stone hits your windscreen as you're following a truck.", date: "January 19, 2026" }].map(a => (
                <div key={a.t} className="c-related-card">
                  <div className="c-related-thumb">Image 16:9</div>
                  <div className="c-related-body">
                    <div className="c-related-title">{a.t}</div>
                    <div style={{ fontSize: 12, color: "var(--ds-color-text-secondary)", marginTop: 4, lineHeight: 1.5 }}>{a.d}</div>
                    <div className="c-related-meta" style={{ marginTop: 6 }}>{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          }
          acko={
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { t: "Buying a new car? Here are some helpful tips", d: "Thinking about buying a used car? There are a few things to consider.", date: "January 19, 2026", bg: "var(--colorCardDemotedBg)" },
                { t: "Car insurance in India: Compare options to suit your needs", d: "When it's time to sort out your car insurance, answering the questions is straightforward.", date: "January 19, 2026", bg: "var(--colorCardDemotedBg)" },
                { t: "Is windscreen insurance included in car insurance?", d: "Sometimes it starts with a sharp ping – a stone hits your windscreen as you follow a truck.", date: "January 19, 2026", bg: "var(--colorSurfaceRaised)" },
              ].map(a => (
                <Card key={a.t} variant="elevated" padding="none">
                  <div style={{ aspectRatio: "16/9", background: a.bg, borderRadius: "var(--radius4xl) var(--radius4xl) 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="caption" color="secondary">Image 16:9</Typography>
                  </div>
                  <CardContent>
                    <Typography variant="label-lg" weight="semibold" className="mb-6">{a.t}</Typography>
                    <Typography variant="body-sm" color="secondary" className="mb-8">{a.d}</Typography>
                    <Typography variant="caption" color="secondary">{a.date}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        />

        {/* 23 · InlineCTA */}
        <Row id="cta" name="InlineCTA" group="Explore" tier="composed"
          filterTier={filterTier}
          mapping="@acko/card + @acko/button secondary + @acko/typography"
          original={
            <div className="c-cta">
              <div className="c-cta-text"><strong>Continue learning</strong>Read our full guide to individual health insurance.</div>
              <button>Open guide →</button>
            </div>
          }
          acko={
            <Card variant="default" padding="md">
              <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <div>
                    <Typography variant="heading-sm" weight="semibold" className="block mb-4">Continue learning</Typography>
                    <Typography variant="body-sm" color="secondary">Read our full guide to individual health insurance.</Typography>
                  </div>
                  <Button variant="secondary" size="sm" type="button">Open guide →</Button>
                </div>
              </CardContent>
            </Card>
          }
        />

        {/* Footer */}
        <Row id="footer" name="Footer" group="Explore" tier="missing"
          filterTier={filterTier}
          mapping="Dark gradient footer — no ACKO component. 4 link columns + social icons + collapsible product accordions + compliance badges."
          original={
            <div style={{ background: "#141414", borderRadius: 16, padding: "28px 24px", color: "#fff" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, marginBottom: 24 }}>
                {["Products", "Company", "Brand hub", "Legal"].map(col => (
                  <div key={col}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10, color: "rgba(255,255,255,0.96)" }}>{col}</div>
                    {["Link 1","Link 2","Link 3"].map(l => (
                      <div key={l} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{l}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>© ACKO Technology & Services Pvt. Ltd.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["IG","LI","TW","YT","FB"].map(s => (
                    <div key={s} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "rgba(255,255,255,0.56)" }}>{s}</div>
                  ))}
                </div>
              </div>
            </div>
          }
          acko={
            <NotInAcko
              reason="The footer is a full-page organism: 4 link column groups, collapsible product accordions (Auto / Health / Travel), social icon row, ACKO logo, address, compliance badges (PCI-DSS), and a dark gradient background. No ACKO component covers any part of this at the organism level."
              buildWith={[
                "@acko/accordion (collapsible product category rows)",
                "@acko/typography (column headings, link text, legal copy)",
                "@acko/separator (divider line)",
                "@acko/tokens — surface/base/invert background",
                "Social icons — must be sourced separately (no ACKO social icon set)",
                "Custom Footer organism — dark surface, multi-column layout, social row, compliance strip",
              ]}
            />
          }
        />

        {/* ── SUMMARY CARD ───────────────────────────────────────── */}
        <div style={{ padding: "48px 36px 80px" }}>
          <Card variant="elevated" padding="md">
            <CardHeader>
              <Typography variant="heading-md" weight="semibold">Mapping summary — 28 article components</Typography>
            </CardHeader>
            <CardContent>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { tier: "direct"   as Tier, count: 9,  note: "Alert, Accordion, Table, Typography, Tooltip, Textarea+Button, Breadcrumb, NavigationWizard" },
                  { tier: "composed" as Tier, count: 9,  note: "Card + atom combos — no new components needed" },
                  { tier: "organism" as Tier, count: 2,  note: "ArticleHero, EditorialCallout (5 variants)" },
                  { tier: "missing"  as Tier, count: 6,  note: "SiteHeader, ArticleSummary, FactCheckedBadge pill, Quote, MediaBlock, SharePost, Footer" },
                ].map(s => {
                  const t = TIER_META[s.tier];
                  return (
                    <div key={s.tier} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: "var(--radius2xl)", padding: 14 }}>
                      <Typography variant="display-sm" weight="bold" color={t.typographyColor} className="block mb-4">{s.count}</Typography>
                      <Typography variant="label-md" weight="semibold" color={t.typographyColor} className="block mb-6">{t.label}</Typography>
                      <Typography variant="caption" color="secondary">{s.note}</Typography>
                    </div>
                  );
                })}
              </div>
              <Separator />
              <div style={{ marginTop: 16 }}>
                <Typography variant="label-md" weight="semibold" className="block mb-8">New components required</Typography>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { name: "SiteHeader", why: "Floating pill nav with logo, product menus, Claims + Login buttons — full site organism." },
                    { name: "ArticleSummary", why: "Violet accent surface + frosted glass inner card — distinct from Alert. Different layout, colour role, and inner slot structure." },
                    { name: "Badge (dark/invert variant)", why: "@acko/badge only has purple/green/blue/orange/pink/gray. The 'FACT CHECKED' pill uses surface/base/invert (#141414) — a new dark variant is needed." },
                    { name: "CalloutEditorial", why: "5 editorial variants (regulation, practitioner, edge_case, myth_fact, counter_argument) that don't map to @acko/alert colour tokens." },
                    { name: "QuoteBlock", why: "Pull-quote (serif, border-left), expert attribution (avatar + italic body), and document source — no quote component in ACKO." },
                    { name: "MediaBlock / Figure", why: "No image container, caption, or credit component in ACKO." },
                    { name: "SharePost", why: "Social share row — no social icon component or platform icon set in ACKO." },
                    { name: "Footer", why: "Dark gradient footer with 4 link columns, collapsible accordions, social icons, compliance badges — full page organism." },
                  ].map(c => (
                    <div key={c.name} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <code style={{ fontSize: 12, background: "var(--colorErrorSubtle)", padding: "2px 8px", borderRadius: "var(--radiusSm)", color: "var(--colorTextError)", flexShrink: 0, marginTop: 2 }}>{c.name}</code>
                      <Typography variant="body-sm" color="secondary">{c.why}</Typography>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Typography variant="caption" color="secondary">Original HTML file unchanged · All @acko/* components verified from node_modules v1.5.0</Typography>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}
