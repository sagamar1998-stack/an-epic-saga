type ArtProps = { className?: string };

const INK = "#1a1a1a";

function Art({
  className,
  children,
}: ArtProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

function Handstand({ className }: ArtProps) {
  return (
    <Art className={className}>
      <rect width="200" height="200" fill="#8eaa86" />
      <path d="M0 150 L200 138 L200 200 L0 200 Z" fill="#d4a054" />
      <path d="M0 148 C70 140 130 156 200 136" fill="none" stroke={INK} strokeWidth="4" />
      <rect x="154" y="22" width="34" height="86" fill="#f7f6f3" stroke={INK} strokeWidth="4" />
      <rect x="160" y="34" width="12" height="9" fill="#e15a3a" stroke={INK} strokeWidth="2" />
      <path d="M62 168 C70 150 78 132 86 118" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M108 172 C102 150 98 132 92 118" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="60" cy="174" rx="12" ry="7" fill="#e7b7a3" stroke={INK} strokeWidth="3" />
      <ellipse cx="112" cy="176" rx="12" ry="7" fill="#e7b7a3" stroke={INK} strokeWidth="3" />
      <circle cx="88" cy="148" r="14" fill="#e7b7a3" stroke={INK} strokeWidth="4" />
      <path d="M78 140 C84 132 96 132 100 142" fill="none" stroke={INK} strokeWidth="2" />
      <path d="M86 118 C82 96 84 78 96 64" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M78 96 h22" stroke="#e3b23c" strokeWidth="11" strokeLinecap="round" />
      <path d="M92 70 C78 48 70 36 74 22" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M98 68 C112 46 124 34 128 20" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="70" cy="18" rx="14" ry="8" fill="#e15a3a" stroke={INK} strokeWidth="3" transform="rotate(-20 70 18)" />
      <ellipse cx="132" cy="16" rx="14" ry="8" fill="#e15a3a" stroke={INK} strokeWidth="3" transform="rotate(16 132 16)" />
    </Art>
  );
}

function Poem({ className }: ArtProps) {
  return (
    <Art className={className}>
      <rect width="200" height="200" fill="#24344a" />
      <circle cx="156" cy="36" r="16" fill="#e3b23c" stroke={INK} strokeWidth="3" />
      <rect x="28" y="34" width="112" height="86" fill="#7eb6d6" stroke={INK} strokeWidth="5" />
      <path d="M40 58 H124 M40 74 H110 M40 90 H118 M46 106 H96" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="46" cy="168" r="10" fill="#e07a32" stroke={INK} strokeWidth="3" />
      <circle cx="78" cy="176" r="7" fill="#e3b23c" stroke={INK} strokeWidth="3" />
      <circle cx="104" cy="162" r="8" fill="#e07a32" stroke={INK} strokeWidth="3" />
      <path d="M18 150 C50 140 90 158 140 146" fill="none" stroke="#f7f6f3" strokeWidth="4" />
    </Art>
  );
}

function Basketball({ className }: ArtProps) {
  return (
    <Art className={className}>
      <rect width="200" height="132" fill="#7eb6d6" />
      <path d="M0 120 L200 108 L200 200 L0 200 Z" fill="#c9843a" />
      <path d="M10 150 C40 146 30 170 70 164 C100 158 90 182 140 170" fill="none" stroke={INK} strokeWidth="3" />
      <rect x="118" y="28" width="46" height="34" fill="#f7f6f3" stroke={INK} strokeWidth="4" />
      <path d="M116 64 H168" stroke="#e15a3a" strokeWidth="6" strokeLinecap="round" />
      <path d="M124 66 C128 86 156 86 160 66" fill="none" stroke={INK} strokeWidth="2" />
      <circle cx="70" cy="112" r="26" fill="#e15a3a" stroke={INK} strokeWidth="4" />
      <path d="M46 112 H94 M70 86 V138 M52 96 C70 108 70 108 88 96 M52 128 C70 116 70 116 88 128" fill="none" stroke={INK} strokeWidth="3" />
    </Art>
  );
}

function Miles({ className }: ArtProps) {
  return (
    <Art className={className}>
      <rect width="200" height="200" fill="#d5e4ee" />
      <path d="M0 78 H200 V118 H0 Z" fill="#7eb6d6" stroke={INK} strokeWidth="4" />
      <ellipse cx="60" cy="64" rx="40" ry="16" fill="#f7f6f3" opacity="0.9" />
      <ellipse cx="130" cy="52" rx="50" ry="18" fill="#f7f1de" opacity="0.85" />
      <path d="M0 150 C40 140 70 168 110 156 C150 144 170 170 200 160 V200 H0 Z" fill="#7d9a78" stroke={INK} strokeWidth="4" />
      <path d="M24 176 C50 168 48 186 74 180" fill="none" stroke={INK} strokeWidth="4" />
      <ellipse cx="46" cy="170" rx="16" ry="8" fill="#e3b23c" stroke={INK} strokeWidth="3" transform="rotate(-12 46 170)" />
      <ellipse cx="78" cy="178" rx="16" ry="8" fill="#e15a3a" stroke={INK} strokeWidth="3" transform="rotate(8 78 178)" />
    </Art>
  );
}

function Markers({ className }: ArtProps) {
  return (
    <Art className={className}>
      <rect width="200" height="200" fill="#f7f6f3" />
      <rect x="28" y="36" width="78" height="78" fill="#e15a3a" stroke={INK} strokeWidth="5" transform="rotate(-6 67 75)" />
      <rect x="78" y="48" width="86" height="70" fill="#e3b23c" stroke={INK} strokeWidth="5" transform="rotate(4 121 83)" />
      <rect x="46" y="96" width="92" height="68" fill="#7eb6d6" stroke={INK} strokeWidth="5" transform="rotate(-2 92 130)" />
      <rect x="104" y="108" width="64" height="58" fill="#7d9a78" stroke={INK} strokeWidth="5" />
    </Art>
  );
}

function Dream({ className }: ArtProps) {
  return (
    <Art className={className}>
      <rect width="200" height="200" fill="#24344a" />
      <circle cx="150" cy="42" r="18" fill="#f7f6f3" stroke={INK} strokeWidth="3" />
      <rect x="48" y="48" width="72" height="112" rx="2" fill="#6ea0c4" stroke={INK} strokeWidth="5" />
      <path d="M58 70 H108 M62 96 H100" stroke="#f7f6f3" strokeWidth="4" strokeLinecap="round" />
      <circle cx="84" cy="78" r="10" fill="#e3b23c" stroke={INK} strokeWidth="3" />
      <path d="M80 82 H88 M84 78 V86" stroke={INK} strokeWidth="2" />
      <rect x="118" y="124" width="52" height="40" fill="#f7f6f3" stroke={INK} strokeWidth="4" transform="rotate(6 144 144)" />
      <path d="M128 140 H160 M128 150 H154" stroke={INK} strokeWidth="2" />
    </Art>
  );
}

function Screen({ className }: ArtProps) {
  return (
    <Art className={className}>
      <rect width="200" height="200" fill="#d4a054" />
      <rect x="58" y="24" width="84" height="150" rx="8" fill="#1c140c" stroke={INK} strokeWidth="4" />
      <rect x="68" y="40" width="64" height="96" fill="#f7f6f3" stroke={INK} strokeWidth="3" />
      <rect x="78" y="78" width="44" height="28" fill="#e15a3a" stroke={INK} strokeWidth="3" />
      <path d="M86 92 H114" stroke="#f7f6f3" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="156" r="6" fill="#e3b23c" stroke={INK} strokeWidth="2" />
    </Art>
  );
}

function Granny({ className }: ArtProps) {
  return (
    <Art className={className}>
      <rect width="200" height="200" fill="#c47a5a" />
      <path d="M0 150 H200 V200 H0 Z" fill="#6d4a3a" />
      <rect x="40" y="36" width="120" height="120" fill="#7d9a78" stroke={INK} strokeWidth="5" />
      <rect x="58" y="54" width="84" height="84" fill="#e3b23c" stroke={INK} strokeWidth="4" />
      <rect x="76" y="72" width="48" height="48" fill="#f7f6f3" stroke={INK} strokeWidth="4" />
      <rect x="90" y="86" width="20" height="20" fill="#e15a3a" stroke={INK} strokeWidth="3" />
      <path d="M40 76 H160 M40 116 H160 M80 36 V156 M120 36 V156" stroke={INK} strokeWidth="2" />
    </Art>
  );
}

function Melody({ className }: ArtProps) {
  return (
    <Art className={className}>
      <rect width="200" height="200" fill="#efe2c0" />
      <path d="M18 30 H70 L78 70 H24 Z" fill="#d7c39a" stroke={INK} strokeWidth="4" />
      <path d="M24 78 H86 L96 130 H30 Z" fill="#e7d3a4" stroke={INK} strokeWidth="4" />
      <path d="M30 138 H104 L112 186 H36 Z" fill="#d7c39a" stroke={INK} strokeWidth="4" />
      <rect x="112" y="78" width="42" height="70" rx="6" fill="#1c140c" stroke={INK} strokeWidth="4" />
      <rect x="118" y="88" width="30" height="40" fill="#7eb6d6" stroke={INK} strokeWidth="2" />
      <path d="M160 96 C176 96 176 112 160 112" fill="none" stroke="#e3b23c" strokeWidth="4" />
      <path d="M160 86 C186 86 186 122 160 122" fill="none" stroke="#e15a3a" strokeWidth="4" />
      <path d="M160 76 C196 76 196 132 160 132" fill="none" stroke={INK} strokeWidth="4" />
    </Art>
  );
}

const WASH = ["#7d9a78", "#d4a054", "#e15a3a", "#7eb6d6", "#e3b23c", "#e7b7a3"];

function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function Blank({ className, seed }: ArtProps & { seed: string }) {
  const wash = WASH[hash(seed) % WASH.length];
  return (
    <Art className={className}>
      <rect width="200" height="200" fill={wash} />
      <path
        d="M30 40c38-12 108-10 142 6 6 34 4 92-8 122-38 12-108 8-140-8-8-32-8-88 6-120z"
        fill="#f7f6f3"
        stroke={INK}
        strokeWidth="5"
      />
      <path d="M58 132c28-6 62-4 86 6" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </Art>
  );
}

const SCENES: Record<string, (props: ArtProps) => React.JSX.Element> = {
  handstand: Handstand,
  poem: Poem,
  basketball: Basketball,
  miles: Miles,
  markers: Markers,
  dream: Dream,
  screen: Screen,
  granny: Granny,
  melody: Melody,
};

export function Illustration({
  name,
  seed = "blank",
  className,
}: {
  name?: string;
  seed?: string;
  className?: string;
}) {
  const Scene = name ? SCENES[name] : undefined;
  if (!Scene) return <Blank className={className} seed={seed} />;
  return <Scene className={className} />;
}
