import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";

function ensureVisualAssets() {
  const imgDir = path.join(process.cwd(), "public", "images", "catalog");
  const docsDir = path.join(process.cwd(), "public", "docs");
  fs.mkdirSync(imgDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });

  const svgTemplates: Record<
    string,
    { title: string; subtitle: string; code: string; schematic: string }
  > = {
    "cat-valves": {
      title: "INDUSTRIAL VALVES",
      subtitle: "NRV • Butterfly • Sluice • PRV • Ball • Air Vents",
      code: "INDUSTRIAL VALVES • FLOW CONTROL",
      schematic: `
        <g stroke="#111315" stroke-width="2" fill="none">
          <circle cx="240" cy="150" r="68" stroke="#d6d3cd" stroke-dasharray="3 3"/>
          <polygon points="240,70 309,110 309,190 240,230 171,190 171,110" stroke="#c87d20" stroke-width="2.5" fill="#ffffff"/>
          <circle cx="240" cy="150" r="42" stroke="#111315" stroke-width="3.5" fill="#f6f5f2"/>
          <circle cx="240" cy="150" r="26" stroke="#c87d20" stroke-width="2"/>
          <line x1="140" y1="150" x2="340" y2="150" stroke="#111315" stroke-width="2"/>
          <line x1="240" y1="45" x2="240" y2="150" stroke="#111315" stroke-width="4"/>
          <rect x="200" y="38" width="80" height="10" fill="#c87d20" stroke="#111315" stroke-width="1.5"/>
          <circle cx="240" cy="150" r="6" fill="#c87d20"/>
        </g>`,
    },
    "cat-meters": {
      title: "WATER METERS & AMR",
      subtitle: "Woltex • Multimag • Actaris • Dashmesh",
      code: "WATER METERS • DOMESTIC & BULK",
      schematic: `
        <g stroke="#111315" stroke-width="2" fill="none">
          <rect x="145" y="118" width="190" height="64" fill="#ffffff" stroke="#111315" stroke-width="3"/>
          <rect x="135" y="102" width="14" height="96" fill="#111315"/>
          <rect x="331" y="102" width="14" height="96" fill="#111315"/>
          <polygon points="240,64 282,88 282,136 240,160 198,136 198,88" fill="#f6f5f2" stroke="#c87d20" stroke-width="2.5"/>
          <rect x="210" y="98" width="60" height="22" fill="#111315"/>
          <text x="240" y="113" text-anchor="middle" fill="#c87d20" font-family="monospace" font-size="11" font-weight="bold">04829.5</text>
          <circle cx="240" cy="134" r="6" fill="#c87d20"/>
        </g>`,
    },
    "cat-steam": {
      title: "STEAM TRAPS & CONTROLS",
      subtitle: "Ball Float • Inverted Bucket • Globe Controls",
      code: "STEAM TRAPS & PROCESS CONTROLS",
      schematic: `
        <g stroke="#111315" stroke-width="2" fill="none">
          <polygon points="240,68 306,106 306,184 240,222 174,184 174,106" fill="#ffffff" stroke="#111315" stroke-width="3"/>
          <circle cx="252" cy="156" r="26" fill="#f6f5f2" stroke="#c87d20" stroke-width="3"/>
          <line x1="188" y1="176" x2="228" y2="158" stroke="#111315" stroke-width="3.5"/>
          <rect x="208" y="54" width="64" height="16" fill="#111315"/>
          <path d="M186 125 L294 125" stroke="#c87d20" stroke-width="2" stroke-dasharray="5 4"/>
        </g>`,
    },
    "prod-nrv": {
      title: "WAFER CHECK VALVE (NRV)",
      subtitle: "Dual Plate & Disc Non-Return Valve • PN10 / PN16",
      code: "NORMEX • RACER",
      schematic: `
        <g fill="none">
          <circle cx="240" cy="148" r="66" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <circle cx="240" cy="148" r="50" fill="#f6f5f2" stroke="#c87d20" stroke-width="2"/>
          <line x1="240" y1="96" x2="240" y2="200" stroke="#111315" stroke-width="5"/>
          <path d="M206 128 L230 148 L206 168" stroke="#c87d20" stroke-width="3"/>
          <path d="M274 128 L250 148 L274 168" stroke="#c87d20" stroke-width="3"/>
          <circle cx="240" cy="72" r="6" fill="#111315"/>
        </g>`,
    },
    "prod-butterfly": {
      title: "CENTRIC BUTTERFLY VALVE",
      subtitle: "Wafer & Lugged EPDM/NBR Lined • PN16",
      code: "AUDCO • KARTAR",
      schematic: `
        <g fill="none">
          <circle cx="240" cy="154" r="58" fill="#ffffff" stroke="#111315" stroke-width="4"/>
          <ellipse cx="240" cy="154" rx="20" ry="50" fill="#c87d20" fill-opacity="0.22" stroke="#c87d20" stroke-width="3"/>
          <line x1="240" y1="54" x2="240" y2="212" stroke="#111315" stroke-width="4"/>
          <rect x="212" y="44" width="56" height="12" fill="#111315"/>
          <circle cx="195" cy="108" r="5" fill="#111315"/>
          <circle cx="285" cy="108" r="5" fill="#111315"/>
          <circle cx="195" cy="200" r="5" fill="#111315"/>
          <circle cx="285" cy="200" r="5" fill="#111315"/>
        </g>`,
    },
    "prod-sluice": {
      title: "CAST IRON SLUICE VALVE",
      subtitle: "IS 14846 Rising & Non-Rising Spindle • PN 1.6",
      code: "KARTAR • AUDCO",
      schematic: `
        <g fill="none">
          <rect x="200" y="96" width="80" height="98" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <rect x="166" y="114" width="20" height="64" fill="#111315"/>
          <rect x="294" y="114" width="20" height="64" fill="#111315"/>
          <line x1="186" y1="126" x2="200" y2="126" stroke="#111315" stroke-width="3"/>
          <line x1="186" y1="166" x2="200" y2="166" stroke="#111315" stroke-width="3"/>
          <line x1="280" y1="126" x2="294" y2="126" stroke="#111315" stroke-width="3"/>
          <line x1="280" y1="166" x2="294" y2="166" stroke="#111315" stroke-width="3"/>
          <line x1="240" y1="54" x2="240" y2="155" stroke="#c87d20" stroke-width="5"/>
          <line x1="196" y1="54" x2="284" y2="54" stroke="#111315" stroke-width="5"/>
        </g>`,
    },
    "prod-airvent": {
      title: "KINETIC AIR RELEASE VALVE",
      subtitle: "Double & Single Orifice Automatic Air Vent",
      code: "AMCO • RACER",
      schematic: `
        <g fill="none">
          <path d="M190 192 L182 104 L298 104 L290 192 Z" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <rect x="174" y="88" width="132" height="16" fill="#111315"/>
          <circle cx="240" cy="148" r="24" fill="#c87d20" fill-opacity="0.25" stroke="#c87d20" stroke-width="3"/>
          <rect x="206" y="192" width="68" height="14" fill="#111315"/>
        </g>`,
    },
    "prod-prv": {
      title: "PRESSURE REDUCING VALVE",
      subtitle: "Direct Diaphragm & Piston Downstream PRV",
      code: "RACER • PENNANT",
      schematic: `
        <g fill="none">
          <polygon points="240,62 204,132 276,132" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <rect x="180" y="132" width="120" height="48" fill="#f6f5f2" stroke="#111315" stroke-width="3.5"/>
          <circle cx="240" cy="156" r="16" fill="#ffffff" stroke="#c87d20" stroke-width="3"/>
          <line x1="240" y1="156" x2="248" y2="146" stroke="#111315" stroke-width="2.5"/>
          <rect x="226" y="48" width="28" height="14" fill="#c87d20"/>
        </g>`,
    },
    "prod-ball": {
      title: "FULL BORE BALL VALVE",
      subtitle: "Forged Brass & 3-Piece SS 316 Quarter-Turn Valve",
      code: "RB ITALY • AUDCO",
      schematic: `
        <g fill="none">
          <rect x="172" y="118" width="136" height="60" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <circle cx="240" cy="148" r="24" fill="#f6f5f2" stroke="#c87d20" stroke-width="3"/>
          <circle cx="240" cy="148" r="11" fill="#111315"/>
          <path d="M240 118 L240 76 L312 76" stroke="#c87d20" stroke-width="6"/>
          <line x1="196" y1="118" x2="196" y2="178" stroke="#111315" stroke-width="2"/>
          <line x1="284" y1="118" x2="284" y2="178" stroke="#111315" stroke-width="2"/>
        </g>`,
    },
    "prod-balancing": {
      title: "HYDRONIC BALANCING VALVE",
      subtitle: "Double Regulating Variable Orifice Valve with Test Cocks",
      code: "CIM ITALY",
      schematic: `
        <g fill="none">
          <rect x="176" y="126" width="128" height="46" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <line x1="240" y1="126" x2="270" y2="76" stroke="#111315" stroke-width="5"/>
          <polygon points="256,64 290,82 280,98 246,80" fill="#c87d20"/>
          <line x1="205" y1="126" x2="205" y2="104" stroke="#c87d20" stroke-width="3"/>
          <line x1="222" y1="126" x2="222" y2="104" stroke="#c87d20" stroke-width="3"/>
        </g>`,
    },
    "prod-woltex": {
      title: "ITRON WOLTEX BULK METER",
      subtitle: "Horizontal Helical Woltmann Meter • DN50–DN500",
      code: "ITRON WOLTEX",
      schematic: `
        <g fill="none">
          <rect x="162" y="118" width="156" height="60" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <rect x="150" y="102" width="14" height="92" fill="#111315"/>
          <rect x="316" y="102" width="14" height="92" fill="#111315"/>
          <circle cx="240" cy="96" r="28" fill="#ffffff" stroke="#c87d20" stroke-width="3"/>
          <text x="240" y="100" text-anchor="middle" fill="#111315" font-family="monospace" font-size="11" font-weight="bold">WOLTEX</text>
          <line x1="185" y1="148" x2="295" y2="148" stroke="#c87d20" stroke-width="2.5" stroke-dasharray="6 4"/>
        </g>`,
    },
    "prod-multimag": {
      title: "ITRON MULTIMAG METER",
      subtitle: "Multi-Jet Magnetic Drive Super Dry Dial • DN15–DN50",
      code: "ITRON MULTIMAG",
      schematic: `
        <g fill="none">
          <polygon points="240,80 296,112 296,176 240,208 184,176 184,112" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <circle cx="240" cy="144" r="38" fill="#f6f5f2" stroke="#c87d20" stroke-width="2.5"/>
          <rect x="210" y="126" width="60" height="18" fill="#111315"/>
          <text x="240" y="139" text-anchor="middle" fill="#c87d20" font-family="monospace" font-size="11">00318.4</text>
          <circle cx="240" cy="162" r="6" fill="#c87d20"/>
        </g>`,
    },
    "prod-actaris": {
      title: "ACTARIS INDUSTRIAL METER",
      subtitle: "Precision Domestic & Bulk Water Metering System",
      code: "ACTARIS WATER METERS",
      schematic: `
        <g fill="none">
          <circle cx="240" cy="144" r="56" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <polygon points="240,96 282,120 282,168 240,192 198,168 198,120" fill="#f6f5f2" stroke="#c87d20" stroke-width="2.5"/>
          <text x="240" y="149" text-anchor="middle" fill="#111315" font-family="monospace" font-size="13" font-weight="bold">ACTARIS</text>
        </g>`,
    },
    "prod-dashmesh": {
      title: "DASHMESH ISI WATER METER",
      subtitle: "IS 779 Certified Class-B Enclosed Dry Dial Meter",
      code: "DASHMESH METERS",
      schematic: `
        <g fill="none">
          <rect x="164" y="128" width="152" height="36" fill="#f6f5f2" stroke="#111315" stroke-width="3"/>
          <circle cx="240" cy="144" r="42" fill="#ffffff" stroke="#c87d20" stroke-width="3.5"/>
          <text x="240" y="148" text-anchor="middle" fill="#111315" font-family="monospace" font-size="12" font-weight="bold">IS:779</text>
        </g>`,
    },
    "prod-floattrap": {
      title: "BALL FLOAT STEAM TRAP",
      subtitle: "Modulating Condensate Trap with Thermostatic Air Vent",
      code: "PENNANT • SPIRAX",
      schematic: `
        <g fill="none">
          <rect x="180" y="92" width="120" height="104" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <circle cx="254" cy="152" r="24" fill="#c87d20" fill-opacity="0.2" stroke="#c87d20" stroke-width="3"/>
          <line x1="196" y1="172" x2="232" y2="154" stroke="#111315" stroke-width="3.5"/>
          <line x1="180" y1="122" x2="300" y2="122" stroke="#111315" stroke-width="1.5" stroke-dasharray="4 4"/>
        </g>`,
    },
    "prod-buckettrap": {
      title: "INVERTED BUCKET STEAM TRAP",
      subtitle: "High-Pressure Intermittent Discharge Process Steam Trap",
      code: "SPIRAX • PENNANT",
      schematic: `
        <g fill="none">
          <rect x="188" y="88" width="104" height="110" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <path d="M210 176 L210 120 L270 120 L270 176" stroke="#c87d20" stroke-width="3.5"/>
          <line x1="240" y1="88" x2="240" y2="120" stroke="#111315" stroke-width="3"/>
          <rect x="178" y="80" width="124" height="12" fill="#111315"/>
        </g>`,
    },
    "prod-controlvalve": {
      title: "PROCESS GLOBE CONTROL VALVE",
      subtitle: "Pneumatic Diaphragm Actuated Modulating Control Valve",
      code: "SPIRAX • PENNANT",
      schematic: `
        <g fill="none">
          <ellipse cx="240" cy="80" rx="52" ry="22" fill="#ffffff" stroke="#111315" stroke-width="3.5"/>
          <line x1="188" y1="80" x2="292" y2="80" stroke="#c87d20" stroke-width="2.5"/>
          <line x1="240" y1="102" x2="240" y2="152" stroke="#111315" stroke-width="4"/>
          <rect x="190" y="148" width="100" height="46" fill="#f6f5f2" stroke="#111315" stroke-width="3.5"/>
          <circle cx="240" cy="171" r="10" fill="#c87d20"/>
        </g>`,
    },
  };

  for (const [key, item] of Object.entries(svgTemplates)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300" width="960" height="600">
  <defs>
    <pattern id="cadgrid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5e2dc" stroke-width="0.75"/>
    </pattern>
  </defs>
  <rect width="480" height="300" fill="#f6f5f2"/>
  <rect width="480" height="300" fill="url(#cadgrid)"/>
  <!-- Subtle Honeycomb Architectural Corner Watermark -->
  <polygon points="435,18 462,33 462,64 435,79 408,64 408,33" fill="none" stroke="#c87d20" stroke-width="1.2" stroke-opacity="0.45"/>
  <polygon points="408,64 435,79 435,110 408,125 381,110 381,79" fill="none" stroke="#111315" stroke-width="1" stroke-opacity="0.18"/>
  <!-- Top Technical Tag -->
  <text x="20" y="28" fill="#71787f" font-family="monospace" font-size="10" font-weight="bold" letter-spacing="1">${item.code}</text>
  <line x1="20" y1="36" x2="460" y2="36" stroke="#d6d3cd" stroke-width="1"/>
  ${item.schematic}
  <!-- Bottom Specification Plate -->
  <line x1="20" y1="242" x2="460" y2="242" stroke="#111315" stroke-width="1.5"/>
  <text x="20" y="264" fill="#111315" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="0.8">${item.title}</text>
  <text x="20" y="282" fill="#4a5056" font-family="monospace" font-size="10.5">${item.subtitle}</text>
  <rect x="444" y="254" width="16" height="16" fill="#c87d20"/>
</svg>`;
    fs.writeFileSync(path.join(imgDir, `${key}.svg`), svg, "utf-8");
  }
}

export async function seedDatabase() {
  ensureVisualAssets();
  console.log("✅ CAD-grade Honeycomb visual schematics regenerated.");
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
