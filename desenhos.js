// Ilustrações em SVG das plantas (usadas quando o presente não tem foto)

const Desenhos = (() => {
  const C = {
    verde: "#6f9a6a",
    verdeEsc: "#4f7a52",
    verdeClaro: "#9cc29a",
    azulado: "#8fb3a6",
    rosa: "#e4a1a8",
    terracota: "#c8714f",
    terracotaEsc: "#a85a3d",
    areia: "#e9d6b8",
    espinho: "#f6eedb",
    vidro: "#cfe3e0",
  };

  const vaso = (y = 86, larg = 44) => {
    const x = 60 - larg / 2;
    return `
      <path d="M${x} ${y} h${larg} l-5 26 h${-(larg - 10)} z" fill="${C.terracota}"/>
      <rect x="${x - 3}" y="${y - 6}" width="${larg + 6}" height="9" rx="2" fill="${C.terracotaEsc}"/>`;
  };

  const espinhos = (pts) =>
    pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="${C.espinho}"/>`).join("");

  const formas = {
    coluna: () => `
      <rect x="50" y="18" width="20" height="70" rx="10" fill="${C.verde}"/>
      <path d="M50 58 h-10 a6 6 0 0 1 -6 -6 v-16 a6 6 0 0 1 12 0 v12 h4z" fill="${C.verde}"/>
      <path d="M70 50 h10 a6 6 0 0 0 6 -6 v-12 a6 6 0 0 0 -12 0 v8 h-4z" fill="${C.verde}"/>
      <rect x="58" y="22" width="4" height="62" rx="2" fill="${C.verdeEsc}" opacity=".35"/>
      <circle cx="60" cy="17" r="5" fill="${C.rosa}"/>
      ${espinhos([[54, 30], [66, 40], [54, 52], [66, 64], [54, 74], [40, 40], [80, 36]])}
      ${vaso()}`,

    bola: () => `
      <ellipse cx="60" cy="66" rx="30" ry="26" fill="${C.verde}"/>
      <path d="M60 40 v52 M45 44 q-8 22 0 44 M75 44 q8 22 0 44" stroke="${C.verdeEsc}" stroke-width="2.5" fill="none" opacity=".45"/>
      ${espinhos([[60, 48], [60, 62], [60, 76], [46, 56], [46, 72], [74, 56], [74, 72], [36, 64], [84, 64]])}
      <circle cx="60" cy="41" r="4" fill="#f2c45a"/>
      ${vaso(88, 54)}`,

    orelha: () => `
      <ellipse cx="60" cy="68" rx="14" ry="20" fill="${C.verde}"/>
      <ellipse cx="44" cy="44" rx="11" ry="15" transform="rotate(-25 44 44)" fill="${C.verdeClaro}"/>
      <ellipse cx="76" cy="40" rx="11" ry="15" transform="rotate(25 76 40)" fill="${C.verdeClaro}"/>
      ${espinhos([[56, 60], [64, 70], [56, 78], [42, 40], [46, 50], [78, 36], [74, 46]])}
      ${vaso()}`,

    estrela: () => `
      <path d="M60 46 L72 58 L88 62 L72 72 L68 88 L60 78 L52 88 L48 72 L32 62 L48 58 Z" fill="${C.azulado}"/>
      <path d="M60 46 L60 78 M32 62 L72 72 M88 62 L48 72" stroke="${C.verdeEsc}" stroke-width="1.5" opacity=".4"/>
      ${espinhos([[60, 56], [70, 64], [50, 64], [64, 74], [56, 74], [44, 62], [76, 62]])}
      <circle cx="60" cy="60" r="5" fill="#f2c45a"/>
      ${vaso(88, 54)}`,

    roseta: () => {
      const camada = (n, r, rx, ry, cor, rot0 = 0) =>
        Array.from({ length: n }, (_, i) => {
          const a = rot0 + (360 / n) * i;
          return `<ellipse cx="60" cy="${70 - r}" rx="${rx}" ry="${ry}" fill="${cor}" transform="rotate(${a} 60 70)"/>`;
        }).join("");
      return `
        <g transform="translate(0 4) scale(1 .8) translate(0 8)">
          ${camada(8, 16, 9, 16, C.azulado)}
          ${camada(8, 10, 7, 12, "#b7cfc4", 22)}
          ${camada(5, 5, 5, 8, C.rosa, 10)}
        </g>
        ${vaso(84, 50)}`;
    },

    pendente: () => {
      const fio = (x, len) =>
        Array.from({ length: len }, (_, i) =>
          `<circle cx="${x + Math.sin(i) * 2}" cy="${82 + i * 6}" r="3.2" fill="${C.verdeClaro}"/>`
        ).join("");
      return `
        <path d="M60 4 L40 50 M60 4 L80 50" stroke="${C.terracotaEsc}" stroke-width="1.5"/>
        <path d="M34 50 h52 l-6 24 h-40 z" fill="${C.terracota}"/>
        <rect x="31" y="45" width="58" height="8" rx="2" fill="${C.terracotaEsc}"/>
        ${fio(38, 5)}${fio(50, 3)}${fio(70, 4)}${fio(82, 5)}
        ${Array.from({ length: 9 }, (_, i) => `<circle cx="${38 + i * 5.5}" cy="44" r="3.5" fill="${C.verde}"/>`).join("")}`;
    },

    arvore: () => `
      <path d="M58 86 V60 L48 48 M60 64 L72 50 M58 70 L46 64" stroke="#8a6a4a" stroke-width="5" stroke-linecap="round" fill="none"/>
      ${[[44, 44], [52, 38], [42, 52], [74, 46], [80, 40], [70, 40], [44, 62], [38, 58], [60, 30], [66, 36], [54, 30]]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="${C.verde}"/><ellipse cx="${x - 1}" cy="${y - 1}" rx="3" ry="2" fill="${C.verdeClaro}"/>`)
        .join("")}
      ${vaso()}`,

    babosa: () => `
      ${[-40, -20, 0, 20, 40]
        .map((a) => `<path d="M60 86 q-6 -30 0 -60 q6 30 0 60" fill="${C.azulado}" transform="rotate(${a} 60 86)"/>`)
        .join("")}
      ${[-30, -10, 10, 30]
        .map((a) => `<path d="M60 86 q-4 -22 0 -44 q4 22 0 44" fill="${C.verde}" transform="rotate(${a} 60 86)"/>`)
        .join("")}
      ${vaso()}`,

    terrario: () => `
      <path d="M26 50 q0 -34 34 -34 q34 0 34 34 v40 a8 8 0 0 1 -8 8 h-52 a8 8 0 0 1 -8 -8 z" fill="${C.vidro}" opacity=".55" stroke="#9fbfba" stroke-width="2"/>
      <path d="M28 82 h64 v8 a8 8 0 0 1 -8 8 h-48 a8 8 0 0 1 -8 -8 z" fill="${C.areia}"/>
      <circle cx="40" cy="84" r="3" fill="#d1bfa0"/><circle cx="78" cy="86" r="2.5" fill="#d1bfa0"/>
      <rect x="44" y="58" width="9" height="26" rx="4.5" fill="${C.verde}"/>
      <ellipse cx="68" cy="78" rx="10" ry="6" fill="${C.azulado}"/>
      <ellipse cx="68" cy="75" rx="5" ry="3" fill="${C.rosa}"/>
      <path d="M34 34 q4 -10 14 -12" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>`,

    vaso: () => `
      <path d="M36 38 h48 l-8 64 h-32 z" fill="${C.terracota}"/>
      <rect x="32" y="30" width="56" height="12" rx="3" fill="${C.terracotaEsc}"/>
      <path d="M42 60 h36 M44 74 h32" stroke="${C.areia}" stroke-width="3" stroke-dasharray="4 4"/>
      <path d="M60 30 q-4 -14 -14 -18 M60 30 q4 -14 14 -18" stroke="${C.verde}" stroke-width="4" fill="none" stroke-linecap="round"/>`,

    regador: () => `
      <path d="M36 50 h40 v40 a6 6 0 0 1 -6 6 h-28 a6 6 0 0 1 -6 -6 z" fill="${C.azulado}"/>
      <path d="M76 60 L100 38" stroke="${C.azulado}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="102" cy="36" rx="5" ry="3" transform="rotate(-45 102 36)" fill="${C.verdeEsc}"/>
      <path d="M44 50 q12 -24 24 0" stroke="${C.verdeEsc}" stroke-width="4" fill="none"/>
      <path d="M14 96 h28 l-4 12 h-20 z" fill="${C.terracota}"/>
      <path d="M28 96 v-14 m0 4 q-8 -2 -8 -10 m8 6 q8 -2 8 -10" stroke="${C.verde}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  };

  function svg(tipo) {
    const desenhar = formas[tipo] || formas.vaso;
    return `<svg viewBox="0 0 120 120" aria-hidden="true">${desenhar()}</svg>`;
  }

  // Versão "crua" (sem <svg>) para compor a ilustração do topo
  function grupo(tipo, x, y, escala) {
    const desenhar = formas[tipo] || formas.vaso;
    return `<g transform="translate(${x} ${y}) scale(${escala})">${desenhar()}</g>`;
  }

  return { svg, grupo };
})();
