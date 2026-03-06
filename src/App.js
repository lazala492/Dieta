import React, { useState, useEffect } from "react";

// ─── ESTILOS GLOBALES ─────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { max-width: 100vw; overflow-x: hidden; }
body { font-family: 'DM Sans', sans-serif; background: #f2efe9; }
.card { background: white; border-radius: 16px; padding: 16px 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); margin-bottom: 12px; }
.day-btn { border-radius: 20px; border: 1.5px solid #e0d8cc; background: white; padding: 6px 10px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; color: #666; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.day-btn.active { color: white; border-color: transparent; }
.day-btn:hover:not(.active) { border-color: #c0b8ac; background: #faf8f5; }
.opt-item { cursor: pointer; border-radius: 10px; padding: 10px 12px; transition: all 0.15s; border: 1.5px solid #ede8e0; background: #faf8f5; }
.opt-item:hover:not(.selected) { border-color: #c8c0b4; background: #f5f2ec; }
.opt-item.selected { border-color: transparent; }
`;

// ─── DATOS ENERGÍA ────────────────────────────────────────────────────────────
const energiaOpts = {
  alto:[
    { id: 1, label: "🍚 Arroz blanco 270g",     texto: "Arroz blanco cocido (270g) + pan barra integral 30g",                                 kcal: 413, carb: 90, prot: 11, gras: 1, tag: "arroz"     },
    { id: 2, label: "🍝 Pasta 245g",             texto: "Pasta blanca cocida (245g) + pan barra integral 30g",                                    kcal: 387, carb: 75, prot: 15, gras: 3, tag: "pasta"     },
    { id: 3, label: "🥔 Patata 380g",            texto: "Patata cocida (380g) + pan barra integral 30g",                                        kcal: 413, carb: 90, prot: 11, gras: 1, tag: "patata"    },
    { id: 4, label: "🍠 Batata 345g",            texto: "Batata asada (345g) + pan barra integral 30g",                                         kcal: 393, carb: 86, prot: 10, gras: 1, tag: "batata"    },
    { id: 5, label: "🫘 Legumbres 315g",         texto: "Lentejas/alubias/garbanzos (315g) + pan barra integral 30g",                          kcal: 441, carb: 77, prot: 31, gras: 1, tag: "legumbres" },
    { id: 6, label: "🍜 Sopa fideos 263g",        texto: "Sopa de fideos blancos cocidos (263g) + pan integral 30g",                            kcal: 420, carb: 80, prot: 16, gras: 4, tag: "sopa"      },
  ],
  medio:[
    { id: 1, label: "🍚 Arroz integral 190g ⭐", texto: "Arroz integral cocido (190g) + pan barra integral 30g",                               kcal: 295, carb: 58, prot: 9,  gras: 3, tag: "arroz"     },
    { id: 2, label: "🍝 Pasta integral 145g ⭐", texto: "Pasta integral cocida (145g) + pan barra integral 30g",                               kcal: 246, carb: 47, prot: 10, gras: 2, tag: "pasta"     },
    { id: 3, label: "🥔 Patata 220g",            texto: "Patata cocida (220g) + pan barra integral 30g",                                        kcal: 269, carb: 58, prot: 7,  gras: 1, tag: "patata"    },
    { id: 4, label: "🍠 Batata 200g",            texto: "Batata asada (200g) + pan barra integral 30g",                                         kcal: 261, carb: 56, prot: 7,  gras: 1, tag: "batata"    },
    { id: 5, label: "🫘 Legumbres 185g",         texto: "Lentejas/alubias/garbanzos (185g) + pan barra integral 30g",                          kcal: 293, carb: 51, prot: 20, gras: 1, tag: "legumbres" },
    { id: 6, label: "🍜 Sopa fideos int. 163g ⭐",texto: "Sopa de fideos integrales cocidos (163g) + pan integral 30g",                        kcal: 275, carb: 51, prot: 11, gras: 3, tag: "sopa"      },
  ],
  alto_domingo:[
    { id: 1, label: "🍚 Arroz blanco 265g",   texto: "Arroz blanco cocido (265g) + pan barra blanco 30g",                                 kcal: 409, carb: 90, prot: 10, gras: 1, tag: "arroz"     },
    { id: 2, label: "🍝 Pasta 240g",           texto: "Pasta blanca cocida (240g) + pan barra blanco 30g",                                 kcal: 387, carb: 76, prot: 14, gras: 3, tag: "pasta"     },
    { id: 3, label: "🥔 Patata 370g",          texto: "Patata cocida (370g) + pan barra blanco 30g",                                       kcal: 405, carb: 90, prot: 9,  gras: 1, tag: "patata"    },
    { id: 4, label: "🍠 Batata 335g",          texto: "Batata asada (335g) + pan barra blanco 30g",                                        kcal: 389, carb: 86, prot: 9,  gras: 1, tag: "batata"    },
    { id: 5, label: "🫘 Legumbres 310g",       texto: "Lentejas/alubias/garbanzos (310g) + pan barra blanco 30g",                         kcal: 441, carb: 78, prot: 30, gras: 1, tag: "legumbres" },
    { id: 6, label: "🍜 Sopa fideos 263g",     texto: "Sopa de fideos blancos cocidos (263g) + pan barra blanco 30g",                     kcal: 424, carb: 82, prot: 15, gras: 4, tag: "sopa"      },
  ],
  bajo:[
    { id: 1, label: "🍚 Arroz integral 120g ⭐", texto: "Arroz integral cocido (120g) + pan barra integral 30g",                              kcal: 214, carb: 42, prot: 7,  gras: 2, tag: "arroz"     },
    { id: 2, label: "🍝 Pasta integral 95g ⭐",  texto: "Pasta integral cocida (95g) + pan barra integral 30g",                               kcal: 194, carb: 36, prot: 8,  gras: 2, tag: "pasta"     },
    { id: 3, label: "🥔 Patata 140g",            texto: "Patata cocida (140g) + pan barra integral 30g",                                        kcal: 201, carb: 42, prot: 6,  gras: 1, tag: "patata"    },
    { id: 4, label: "🍠 Batata 125g",            texto: "Batata asada (125g) + pan barra integral 30g",                                         kcal: 193, carb: 40, prot: 6,  gras: 1, tag: "batata"    },
    { id: 5, label: "🫘 Legumbres 115g",         texto: "Lentejas/alubias/garbanzos (115g) + pan barra integral 30g",                          kcal: 209, carb: 37, prot: 13, gras: 1, tag: "legumbres" },
    { id: 6, label: "🍜 Sopa fideos int. 100g ⭐",texto: "Sopa de fideos integrales cocidos (100g) + pan integral 30g",                        kcal: 198, carb: 37, prot: 8,  gras: 2, tag: "sopa"      },
  ],
};

const proteinaOpts =[
  { id: 1, label: "🐟 Pescado blanco", texto: "Merluza, bacalao, dorada, lubina, rape (170g)",             kcal: 125, prot: 29, carb: 0, gras: 1,  tag: "pescBlanco"  },
  { id: 2, label: "🐠 Pescado azul",   texto: "Salmón, atún, caballa, sardinas (150g)",                    kcal: 300, prot: 30, carb: 0, gras: 20, tag: "pescAzul"    },
  { id: 3, label: "🍗 Carne blanca",   texto: "Pollo o pavo (170g)",                                       kcal: 201, prot: 39, carb: 0, gras: 5,  tag: "carneBlanca" },
  { id: 4, label: "🥩 Carne roja",     texto: "Ternera, solomillo, entrecot magro (160g)",                 kcal: 230, prot: 35, carb: 0, gras: 10, tag: "carneRoja"   },
  { id: 5, label: "🥚 Huevos",         texto: "3 huevos enteros + 2 claras — revueltos, plancha o cocidos",kcal: 278, prot: 26, carb: 3, gras: 18, tag: "huevos"      },
];

const proteinaLigeraOpts =[
  { id: 3, label: "🍗 Carne blanca",   texto: "Pollo o pavo (100g) — acompañante de legumbres",   kcal: 119, prot: 23, carb: 0, gras: 3, tag: "carneBlanca" },
  { id: 1, label: "🐟 Pescado blanco", texto: "Pescado blanco (100g) — acompañante de legumbres", kcal: 77,  prot: 17, carb: 0, gras: 1, tag: "pescBlanco"  },
  { id: 5, label: "🥚 Huevos",         texto: "1 huevo entero + 2 claras — acompañante de legumbres", kcal: 114, prot: 14, carb: 1, gras: 6, tag: "huevos"      },
];

// Descanso: raciones de 200g para maximizar proteína sin subir carbos
const proteinaOptsSabado = [
  { id: 3, label: "🍗 Carne blanca 200g", texto: "Pollo o pavo (200g) — ración extra para descanso",       kcal: 238, prot: 46, carb: 0, gras: 6,  tag: "carneBlanca" },
  { id: 1, label: "🐟 Pescado blanco 200g", texto: "Merluza, bacalao, dorada, lubina (200g)",               kcal: 145, prot: 34, carb: 0, gras: 1,  tag: "pescBlanco"  },
  { id: 5, label: "🥚 Huevos",             texto: "3 huevos enteros + 2 claras — revueltos, plancha o cocidos", kcal: 278, prot: 26, carb: 3, gras: 18, tag: "huevos" },
];

// Descanso + legumbres: 150g en vez de 100g para más proteína
const proteinaLigeraSabadoOpts = [
  { id: 3, label: "🍗 Carne blanca 150g", texto: "Pollo o pavo (150g) — acompañante de legumbres",   kcal: 185, prot: 35, carb: 0, gras: 5, tag: "carneBlanca" },
  { id: 1, label: "🐟 Pescado blanco 150g", texto: "Pescado blanco (150g) — acompañante de legumbres", kcal: 122, prot: 26, carb: 0, gras: 2, tag: "pescBlanco"  },
  { id: 5, label: "🥚 Huevos",             texto: "2 huevos enteros + 2 claras — acompañante de legumbres", kcal: 196, prot: 22, carb: 2, gras: 11, tag: "huevos" },
];

const vitaminasOpts =[
  { id: 1, label: "🥗 Ensalada verde",    texto: "Ensalada verde variada (150g)",                           kcal: 28, prot: 2, carb: 5,  gras: 0, esPrimerPlato: false },
  { id: 2, label: "🥦 Verduras al vapor", texto: "Brócoli, judías verdes, espinacas (200g)",                kcal: 48, prot: 5, carb: 7,  gras: 0, esPrimerPlato: false },
  { id: 3, label: "🍆 Verduras asadas",   texto: "Pisto, berenjena, pimientos (150g)",                      kcal: 83, prot: 2, carb: 12, gras: 3, esPrimerPlato: false },
  { id: 4, label: "🟢 Guisantes",         texto: "Guisantes salteados (100g)",                              kcal: 85, prot: 5, carb: 14, gras: 1, esPrimerPlato: false },
  { id: 5, label: "🥣 Puré de verduras",  texto: "Calabacín, zanahoria, puerro... (casero)",                kcal: 78, prot: 3, carb: 12, gras: 2, esPrimerPlato: true  },
];

const recomendacionesPorDia = {
  "Lunes":     { nivel: "medio", energia:["legumbres","batata","patata"], proteina:["pescBlanco","carneBlanca","carneRoja"],  vitaminas: [1,2,5] },
  "Martes":    { nivel: "alto",  energia: ["arroz","pasta","sopa"],        proteina:["carneBlanca","pescAzul","pescBlanco"],   vitaminas: [1,2,5] },
  "Miércoles": { nivel: "medio", energia: ["legumbres","arroz","patata"],  proteina: ["carneRoja","carneBlanca","pescBlanco"],  vitaminas:[1,2,5] },
  "Jueves":    { nivel: "medio", energia:["arroz","batata","patata"],       proteina:["carneBlanca","pescBlanco","pescAzul"],   vitaminas: [1,2,5] },
  "Viernes":   { nivel: "alto",  energia: ["arroz","pasta","sopa"],        proteina:["pescAzul","carneBlanca","pescBlanco"],   vitaminas:[1,2,5] },
  "Sábado":    { nivel: "bajo",  energia:["legumbres","batata","patata"], proteina: ["carneBlanca","huevos","pescBlanco"],     vitaminas: [1,2,5] },
  "Domingo":   { nivel: "alto",  energia: ["arroz","pasta"],           proteina:["carneBlanca","pescBlanco"],              vitaminas: [1,2,5] },
};

const cenaPorProteina = {
  "pescBlanco":  { recomendacion: "🍗 Comiste pescado blanco → Cena con carne o huevos para variar.", sugeridas:["carneBlanca","carneRoja","huevos"] },
  "pescAzul":    { recomendacion: "🍗 Comiste pescado azul → Cena con carne blanca o huevos. No repitas pescado.", sugeridas:["carneBlanca","huevos","pescBlanco"] },
  "carneBlanca": { recomendacion: "🐟 Comiste carne blanca → Cena con pescado para variedad y Omega-3.", sugeridas:["pescBlanco","pescAzul","huevos"] },
  "carneRoja":   { recomendacion: "🐟 Comiste carne roja → Cena con pescado blanco o azul.", sugeridas:["pescBlanco","pescAzul","carneBlanca"] },
  "huevos":      { recomendacion: "🍗 Comiste huevos → Cena con pescado o carne blanca para proteína completa.", sugeridas:["pescBlanco","pescAzul","carneBlanca"] },
  "legumbres":   { recomendacion: "🐟 Comiste legumbres → Cena con proteína animal completa.", sugeridas: ["pescBlanco","carneBlanca","huevos"] },
  "default":     { recomendacion: "Selecciona la proteína del mediodía para ver la recomendación de cena.", sugeridas: ["carneBlanca","pescBlanco","pescAzul"] },
};

// Desayunos id:1=huevos+tortillas, id:2=avena+pavo+pan, id:3=supl+jamón+pan, id:4=tortilla patata (sábado)
const desayunoOrdenPorDia = {
  "Lunes":     [1, 3, 2], // Gym Pull: huevos primero (saciedad + prot real), luego supl, avena última
  "Martes":    [1, 2, 3], // Doble: id:1+fruta = 514 kcal, mayor energía para día de 2275 kcal
  "Miércoles": [1, 3, 2], // Gym Piernas: huevos primero + supl 2º (máxima proteína para piernas)
  "Jueves":    [2, 1, 3], // Gym+Fútbol: avena (carbos lentos) primera para doble esfuerzo
  "Viernes":   [1, 2, 3], // Doble: igual que Martes, máximas kcal primero
  "Sábado":    [4, 1, 2], // Descanso: tortilla patata aprovechando el viernes, luego huevos
  "Domingo":   [2, 1, 3], // Partido: avena (carbos lentos pre-partido) primera
};

// MM id:1=tortas+skyr(lácteo+almidón), id:2=yogur+frutos(lácteo), id:3=sándwich pavo+pan
// Regla: si desayuno llevó pavo → sándwich pavo al final; si llevó lácteo/yogur → yogur al final
const mediaMañanaOrdenPorDesayuno = {
  1: [3, 2, 1], // Desayuno huevos+tortillas (sin pavo, sin pan-rebanada): pavo ok primero, luego yogur, skyr último (similar textura)
  2: [1, 2, 3], // Desayuno avena+PAVO+PAN: sándwich pavo ÚLTIMO (repetir pavo+pan)
  3: [2, 1, 3], // Desayuno supl+jamón+pan: yogur primero (diferente), skyr, sándwich pavo último (pan repetido)
  4: [1, 2, 3], // Desayuno tortilla patata+pan: sándwich pavo ÚLTIMO (pan repetido)
};

// Merienda id:1=yogur+fruta(lácteo), id:2=tostadas+pavo, id:3=supl(leche+whey)
// Regla: si MM llevó lácteo (skyr/yogur) → evitar yogur primero; si MM llevó pavo → tostadas+pavo al final
const meriendaOrdenPorMM = {
  1: [2, 3, 1], // MM tortas+SKYR (lácteo): tostadas+pavo primero (diferente), supl, yogur último (más parecido a skyr)
  2: [2, 3, 1], // MM YOGUR+frutos: tostadas+pavo primero (sin lácteo), supl, yogur último (repetir yogur)
  3: [1, 3, 2], // MM sándwich PAVO+PAN: yogur+fruta primero (sin pavo), supl, tostadas+pavo ÚLTIMO
};

const cenaEnergiaOpts =[
  { id: 1, label: "🍚 Arroz integral",    texto: "Arroz integral cocido + pan barra integral 30g",       kcal: 222, carb: 44, prot: 7,  gras: 2, tag: "arroz",         baseG: 130, kcalPer100: 113, prot100: 3,  carb100: 23, gras100: 1, unidad: "g cocido",  min: 80,  max: 200 },
  { id: 2, label: "🥔 Patata",            texto: "Patata cocida + pan barra integral 30g",                kcal: 193, carb: 40, prot: 6,  gras: 1, tag: "patata",        baseG: 130, kcalPer100: 88,  prot100: 2,  carb100: 20, gras100: 0, unidad: "g cocida",  min: 80,  max: 220 },
  { id: 3, label: "🍠 Batata",            texto: "Batata cocida + pan barra integral 30g",                kcal: 197, carb: 41, prot: 6,  gras: 1, tag: "batata",        baseG: 130, kcalPer100: 92,  prot100: 2,  carb100: 21, gras100: 0, unidad: "g cocida",  min: 100, max: 220 },
  { id: 4, label: "🍝 Pasta integral",    texto: "Pasta integral cocida + pan barra integral 30g",        kcal: 198, carb: 37, prot: 8,  gras: 2, tag: "pasta",         baseG: 100, kcalPer100: 121, prot100: 5,  carb100: 23, gras100: 1, unidad: "g cocida",  min: 80,  max: 180 },
  { id: 5, label: "🍜 Sopa fideos int.",    texto: "Sopa de fideos integrales cocidos + pan barra integral 30g", kcal: 198, carb: 37, prot: 8, gras: 2, tag: "sopa",         baseG: 100, kcalPer100: 121, prot100: 5,  carb100: 23, gras100: 1, unidad: "g cocidos", min: 60,  max: 200 },
  { id: 6, label: "🍝 Pasta blanca ⚡",   texto: "Pasta blanca cocida + pan barra blanco 30g",              kcal: 223, carb: 43, prot: 8,  gras: 2, tag: "pasta_bl",     baseG: 100, kcalPer100: 131, prot100: 5,  carb100: 25, gras100: 1, unidad: "g cocida",  min: 80,  max: 180, panBlanco: true },
  { id: 7, label: "🍚 Arroz blanco ⚡",   texto: "Arroz blanco ⚡ post-partido + pan barra blanco 30g",  kcal: 245, carb: 52, prot: 7,  gras: 1, tag: "arroz_bl",      baseG: 130, kcalPer100: 124, prot100: 3,  carb100: 28, gras100: 0, unidad: "g cocido",  min: 80,  max: 200, panBlanco: true },
  { id: 8, label: "🫓 Tortillas trigo ⭐", texto: "Tortillas trigo integral ⭐",                          kcal: 220, carb: 40, prot: 6,  gras: 4, tag: "tortillaTrigo", baseG: 70,  kcalPer100: 305, prot100: 8,  carb100: 57, gras100: 5, unidad: "g",         min: 35,  max: 140, peq: 35, gran: 70 },
];

// ─── CONFIG CENA POR DÍA ─────────────────────────────────────────────────────
// usarBlanco: true → arroz blanco / pasta blanca / pan blanco (días post-partido)
// usarBlanco: false → versiones integrales (días de gym o descanso)
const cenaDiaConfig = {
  "Lunes": {
    usarBlanco: false,
    tip: "🏋️ Gym Pull — carbos de absorción lenta para recuperación muscular. Integral siempre.",
    energiaOrden: {
      pescBlanco:  [3, 8, 1], pescAzul:  [1, 8, 3], carneBlanca: [3, 8, 4],
      carneRoja:   [2, 8, 3], huevos:    [8, 2, 3], legumbres:   [5, 3, 2], default: [3, 8, 1],
    },
  },
  "Martes": {
    usarBlanco: true,
    tip: "⚽ Post-partido — carbos rápidos para reponer glucógeno. Arroz blanco o pasta blanca + pan blanco.",
    energiaOrden: {
      pescBlanco:  [7, 6, 3], pescAzul:  [7, 6, 2], carneBlanca: [7, 6, 3],
      carneRoja:   [7, 6, 2], huevos:    [7, 3, 6], legumbres:   [7, 6, 3], default: [7, 6, 3],
    },
  },
  "Miércoles": {
    usarBlanco: false,
    tip: "🏋️ Gym Piernas — batata o patata para reponer glucógeno con carbos lentos y potasio. Integral.",
    energiaOrden: {
      pescBlanco:  [3, 2, 8], pescAzul:  [3, 8, 1], carneBlanca: [3, 2, 8],
      carneRoja:   [3, 2, 8], huevos:    [8, 3, 2], legumbres:   [5, 3, 2], default: [3, 2, 8],
    },
  },
  "Jueves": {
    usarBlanco: true,
    tip: "⚽ Post-partido — cena de recuperación con carbos rápidos tras el doble esfuerzo. Blanco.",
    energiaOrden: {
      pescBlanco:  [7, 6, 3], pescAzul:  [7, 6, 3], carneBlanca: [7, 6, 3],
      carneRoja:   [7, 6, 2], huevos:    [7, 3, 6], legumbres:   [7, 6, 3], default: [7, 6, 3],
    },
  },
  "Viernes": {
    usarBlanco: false,
    tip: "🏋️⚽ Doble sesión — cena especial.",
    energiaOrden: { default: [1, 4, 3] },
  },
  "Sábado": {
    usarBlanco: false,
    tip: "😴 Descanso — carbos mínimos e integrales. Tortilla de trigo o sopa de fideos integrales.",
    energiaOrden: {
      pescBlanco:  [8, 5, 3], pescAzul:  [8, 5, 2], carneBlanca: [8, 5, 3],
      carneRoja:   [8, 2, 5], huevos:    [8, 3, 2], legumbres:   [5, 3, 2], default: [8, 5, 3],
    },
  },
  "Domingo": {
    usarBlanco: true,
    tip: "⚽ Partido — cena especial.",
    energiaOrden: { default: [7, 6, 3] },
  },
};

const cenaProteinaOpts =[
  { id: 1, label: "🐟 Pescado blanco", texto: "Merluza, bacalao, dorada, lubina",  kcal: 145, prot: 34, carb: 0, gras: 1,  tag: "pescBlanco",  baseG: 200, kcalPer100: 72.5, prot100: 17, carb100: 0, gras100: 0.5, unidad: "g", min: 120, max: 280 },
  { id: 2, label: "🐠 Pescado azul",   texto: "Salmón, atún, caballa, sardinas",   kcal: 351, prot: 36, carb: 0, gras: 23, tag: "pescAzul",    baseG: 180, kcalPer100: 197,  prot100: 20, carb100: 0, gras100: 13,  unidad: "g", min: 100, max: 220 },
  { id: 3, label: "🍗 Carne blanca",   texto: "Pollo o pavo",                      kcal: 238, prot: 46, carb: 0, gras: 6,  tag: "carneBlanca", baseG: 200, kcalPer100: 119,  prot100: 23, carb100: 0, gras100: 3,   unidad: "g", min: 120, max: 280 },
  { id: 4, label: "🥩 Carne roja",     texto: "Ternera, solomillo",                kcal: 259, prot: 40, carb: 0, gras: 11, tag: "carneRoja",   baseG: 180, kcalPer100: 142,  prot100: 22, carb100: 0, gras100: 6,   unidad: "g", min: 120, max: 240 },
  { id: 5, label: "🥚 Huevos",         texto: "2 huevos enteros + 4 claras — tortilla, revuelto o plancha", kcal: 202, prot: 26, carb: 2, gras: 10, tag: "huevos", baseG: null, kcalPer100: null, prot100: null, carb100: null, gras100: null, unidad: null, min: null, max: null },
];

const postreComidaPorDia = {
  "Martes":    { label: "🍊 Fruta",          texto: "Fruta de temporada",                         kcal: 68, prot: 1,  carb: 16, gras: 0 },
  "Jueves":    { label: "🍊 Fruta",          texto: "Fruta de temporada",                         kcal: 68, prot: 1,  carb: 16, gras: 0 },
  "Viernes":   { label: "🍊 Fruta",          texto: "Fruta de temporada",                         kcal: 68, prot: 1,  carb: 16, gras: 0 },
  "Domingo":   { label: "🍊 Fruta",          texto: "Fruta de temporada — energía pre-partido",   kcal: 68, prot: 1,  carb: 16, gras: 0 },
  "Lunes":     { label: "🥛 Yogur griego 0%",texto: "Yogur griego 0% (125g)",                    kcal: 64, prot: 13, carb: 3,  gras: 0 },
  "Miércoles": { label: "🥛 Yogur griego 0%",texto: "Yogur griego 0% (125g)",                    kcal: 64, prot: 13, carb: 3,  gras: 0 },
  "Sábado":    { label: "🥛 Yogur griego 0%",texto: "Yogur griego 0% (125g)",                    kcal: 64, prot: 13, carb: 3,  gras: 0 },
};

const postreCenaPorDia = {
  "Lunes":     { texto: "🥛 Yogur griego 0% (125g)",  kcal: 64, prot: 13, carb: 3, gras: 0 },
  "Martes":    null,
  "Miércoles": { texto: "🥛 Yogur griego 0% (125g)",  kcal: 64, prot: 13, carb: 3, gras: 0 },
  "Jueves":    null,
  "Viernes":   null,
  "Sábado":    { texto: "🥛 Yogur griego 0% (125g)",  kcal: 64, prot: 13, carb: 3, gras: 0 },
  "Domingo":   { texto: "🥛 Yogur griego 0% (125g) — solo si no es hamburguesa", kcal: 64, prot: 13, carb: 3, gras: 0 },
};

// ─── DESAYUNO / MEDIA MAÑANA / MERIENDA BASE ─────────────────────────────────
const desayunoBase =[
  { id: 1, label: "🍳 Salado con huevos",       texto: "Café con leche Asturiana Suprema (125ml) + 2 tortillas trigo integral (~80g) + 2 huevos revueltos + 1 clara extra",                                              kcal: 442, prot: 29, carb: 41, gras: 18, esSupl: false },
  { id: 2, label: "🥣 Avena mixta",             texto: "Café con leche Asturiana Suprema (125ml) + porridge avena integral copos grandes (30g) con leche (60ml) + 1 rebanada pan integral (~25g) + pavo (~75g) + canela", kcal: 335, prot: 30, carb: 38, gras: 7,  esSupl: false },
  { id: 3, label: "💊 Suplementación jamón",    texto: "Café con leche Asturiana Suprema (125ml) + porridge avena integral copos grandes (30g) con leche (60ml) + 20g Whey iso + 1 rebanada pan integral (~25g) + jamón serrano (~30g)", kcal: 371, prot: 38, carb: 39, gras: 7, esSupl: true  },
];

const mediaMañanaBase =[
  { id: 1, label: "🌾 Tortas arroz + Skyr", texto: "3 tortas de arroz (~30g) + Skyr o yogur proteico (200g)",                              kcal: 233, prot: 24, carb: 32, gras: 1  },
  { id: 2, label: "🫐 Yogur + frutos secos",texto: "Yogur líquido 0% (200g) + puñado pequeño de frutos secos (15g) + 1 fruta",             kcal: 241, prot: 11, carb: 29, gras: 9  },
  { id: 3, label: "🥪 Sándwich pavo",       texto: "2 rebanadas pan integral (~50g) + 3 lonchas de pavo (~75g)",                           kcal: 226, prot: 21, carb: 22, gras: 6  },
];

const meriendaBase =[
  { id: 1, label: "🍎 Yogur + fruta",       texto: "Yogur griego 0% (200g) + 1 pieza de fruta + 1 cda crema de cacahuete (15g)",                  kcal: 275, prot: 27, carb: 26, gras: 7 },
  { id: 2, label: "🍞 Tostadas + pavo",     texto: "2 tostadas de pan blanco (~60g) + pechuga de pavo (~100g)",                                        kcal: 275, prot: 27, carb: 26, gras: 7  },
  { id: 3, label: "💊 Suplementación",      texto: "Leche Asturiana Suprema (125ml) + 20g Whey iso + 1 fruta",                                     kcal: 371, prot: 38, carb: 39, gras: 7,  esSupl: true },
];

// ─── DATOS POR DÍA ────────────────────────────────────────────────────────────
const dias =[
  {
    dia: "Lunes", emoji: "🏋️", tipoLabel: "Gym", kcalObjetivo: 1900, color: "#2d5a8a",
    nota: "Carbos moderados.",
    desayuno: desayunoBase,
    mediaMañana: mediaMañanaBase,
    merienda: meriendaBase,
  },
  {
    dia: "Martes", emoji: "🏋️⚽", tipoLabel: "Gym + Fútbol", kcalObjetivo: 2275, color: "#8a2d2d",
    nota: "Máxima energía — Carbos altos.",
    desayuno:[
      { ...desayunoBase[0] },
      { ...desayunoBase[1], texto: desayunoBase[1].texto.replace("pavo (~75g)", "pavo (~100g)"), kcal: 364, prot: 35, carb: 38, gras: 8 },
      { ...desayunoBase[2] },
    ],
    mediaMañana: [
      { ...mediaMañanaBase[2] },
      { ...mediaMañanaBase[0] },
      { ...mediaMañanaBase[1], texto: "Yogur líquido 0% (200g) + frutos secos (15g) + arándanos deshidratados (20g)", kcal: 221, prot: 10, carb: 25, gras: 9 },
    ],
    merienda: meriendaBase,
  },
  {
    dia: "Miércoles", emoji: "🏋️", tipoLabel: "Gym", kcalObjetivo: 1900, color: "#5a2d8a",
    nota: "Carbos moderados.",
    desayuno: desayunoBase,
    mediaMañana: mediaMañanaBase,
    merienda: meriendaBase,
  },
  {
    dia: "Jueves", emoji: "⚽", tipoLabel: "Fútbol", kcalObjetivo: 1900, color: "#8a5a2d",
    nota: "Carbos moderados.",
    desayuno: desayunoBase,
    mediaMañana: mediaMañanaBase,
    merienda: meriendaBase,
  },
  {
    dia: "Viernes", emoji: "🏋️⚽", tipoLabel: "Gym + Fútbol", kcalObjetivo: 2275, color: "#2d8a5a",
    nota: "Máxima energía — Carbos altos.",
    desayuno:[
      { ...desayunoBase[0] },
      { ...desayunoBase[1], texto: desayunoBase[1].texto.replace("pavo (~75g)", "pavo (~100g)"), kcal: 364, prot: 35, carb: 38, gras: 8 },
      { ...desayunoBase[2] },
    ],
    mediaMañana: [
      { ...mediaMañanaBase[2] },
      { ...mediaMañanaBase[0] },
      { ...mediaMañanaBase[1], texto: "Yogur líquido 0% (200g) + frutos secos (15g) + arándanos deshidratados (20g)", kcal: 221, prot: 10, carb: 25, gras: 9 },
    ],
    merienda: meriendaBase,
    cenaEspecial:[
      { id: 901, label: "🍳 Tortilla de patatas",    texto: "Corta ~250g (⅓ tortilla 4 huevos) + pan integral 30g + ensalada verde",        kcal: 588, prot: 33, carb: 42, gras: 32 },
      { id: 902, label: "🍗 Carne blanca completa",  texto: "Pollo o pavo (200g) + arroz blanco cocido (150g) + verduras al vapor",          kcal: 458, prot: 54, carb: 47, gras: 6  },
      { id: 903, label: "🐟 Pescado blanco",         texto: "Merluza, bacalao (200g) + batata cocida (150g) + brócoli al vapor",             kcal: 317, prot: 40, carb: 37, gras: 1  },
    ],
  },
  {
    dia: "Sábado", emoji: "😴", tipoLabel: "Descanso", kcalObjetivo: 1400, color: "#6a6a4a",
    nota: "Proteína alta, carbos bajos.",
    desayuno: [
      { ...desayunoBase[0], texto: "Café con leche Asturiana Suprema (125ml) + 1 tortilla trigo integral (~40g) + 2 huevos enteros revueltos + 1 clara extra", kcal: 331, prot: 25, carb: 24, gras: 15 },
      { ...desayunoBase[1], texto: "Café con leche Asturiana Suprema (125ml) + porridge avena integral copos grandes (30g) con leche (60ml) + pavo (~75g) + canela — sin pan", kcal: 274, prot: 28, carb: 27, gras: 6 },
      { id: 4, label: "🥔 Tortilla de patata", texto: "Café con leche Asturiana Suprema (125ml) + trozo pequeño tortilla de patata del viernes (~150g: ¼ tortilla 4 huevos) + pan integral (30g) + Skyr o yogur proteico (150g)", kcal: 436, prot: 35, carb: 38, gras: 16, esSupl: false },
    ],
    sinMediaMañana: true,
    sinMerienda: true,
  },
  {
    dia: "Domingo", emoji: "⚽", tipoLabel: "Partido", kcalObjetivo: 2275, color: "#8a2d5a",
    nota: "Máxima energía — Carbos altos, proteína ligera en comida.",
    desayuno: [
      { ...desayunoBase[0], texto: "Café con leche Asturiana Suprema (125ml) + 1 tortilla trigo integral (~60g) + 2 huevos revueltos + 1 clara extra", kcal: 397, prot: 27, carb: 34, gras: 17 },
      { ...desayunoBase[1], texto: desayunoBase[1].texto.replace("pavo (~75g)", "pavo (~100g)"), kcal: 364, prot: 35, carb: 38, gras: 8 },
    ],
    sinMediaMañana: true,
    merienda: [
      { ...meriendaBase[2] },
      { id: 4, label: "💊 Whey + agua", texto: "Agua (300ml) + 25g Whey iso — si la cena es abundante (hamburguesa)", kcal: 109, prot: 23, carb: 2, gras: 1, esSupl: true },
    ],
    cenaEspecial:[
      { id: 904, label: "🍔 Double smash burger",  texto: "Doble carne · bacon · cheddar · cebolla crujiente · BBQ · pan brioche + patatas fritas (restaurante)", kcal: 1165, prot: 55, carb: 90, gras: 65 },
      { id: 907, label: "🐠 Pescado azul + batata", texto: "Salmón, atún o caballa (180g) + batata asada (250g) + pan barra blanco (30g) + verduras al gusto",  kcal: 632,  prot: 41, carb: 63, gras: 24 },
    ],
  },
];

// ─── CONSTANTES PERSISTENCIA ─────────────────────────────────────────────────
const EMPTY_SEL = { desayuno: null, mediaMañana: null, merienda: null, energia: null, proteina: null, vitaminas: null, cena: null, cenaEnergia: null, cenaProteina: null, cenaVitaminas: null };
const esLunes = () => new Date().getDay() === 1;

// ─── FAT TRACKER ─────────────────────────────────────────────────────────────
const FatTracker = ({ onResetComidas }) => {
  const GRASA_PERDER = 9.75;
  const KCAL_TOTAL = Math.round(GRASA_PERDER * 7700);

  const [registros, setRegistros] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const[pesoHoy, setPesoHoy] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem("fat_tracker") ?? "null");
      if (r) setRegistros(r);
    } catch(e) {}
    setLoaded(true);
  },[]);

  const guardar = () => {
    if (!pesoHoy || isNaN(pesoHoy)) return;
    const nuevo = { fecha: new Date().toLocaleDateString("es-ES"), peso: parseFloat(pesoHoy), ts: Date.now() };
    const nuevos = [...registros, nuevo].sort((a,b) => a.ts - b.ts);
    setRegistros(nuevos);
    setPesoHoy("");
    setMostrarForm(false);
    try { localStorage.setItem("fat_tracker", JSON.stringify(nuevos)); } catch(e) {}
    try { localStorage.removeItem("comidas_semana"); } catch(e) {}
    if (onResetComidas) onResetComidas();
  };

  const eliminar = () => {
    const nuevos = registros.slice(0,-1);
    setRegistros(nuevos);
    try { localStorage.setItem("fat_tracker", JSON.stringify(nuevos)); } catch(e) {}
  };

  if (!loaded) return <div style={{padding:20,color:"#aaa"}}>Cargando...</div>;

  const pesoActual = registros.length > 0 ? registros[registros.length-1].peso : 78;
  const kgPerdidos = Math.max(0, 78 - pesoActual);
  const grasaPerdidaKg = parseFloat((kgPerdidos * 0.85).toFixed(2));
  const kcalAcumuladas = Math.round(grasaPerdidaKg * 7700);
  const grasaRestante = parseFloat(Math.max(0, GRASA_PERDER - grasaPerdidaKg).toFixed(2));
  const pct = Math.min(100, Math.round((kcalAcumuladas / KCAL_TOTAL) * 100));
  const semanasRestantes = Math.ceil(grasaRestante / 0.73);

  const stat = (label, valor, sub, color="#7aff9a") => (
    <div style={{background:"#0d1a0d",borderRadius:10,padding:"10px 8px",textAlign:"center",border:"1px solid #1a3a1a"}}>
      <p style={{fontSize:10,color:"#5a8a5a",marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>{label}</p>
      <p style={{fontSize:15,fontWeight:700,color}}>{valor}</p>
      {sub && <p style={{fontSize:10,color:"#3a6a3a",marginTop:2}}>{sub}</p>}
    </div>
  );

  return (
    <div style={{background:"linear-gradient(135deg,#1a2a1a,#0d1f0d)",borderRadius:16,padding:20,border:"1px solid #2a4a2a"}}>
      <p style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#7aff9a",marginBottom:4}}>📉 Objetivo: 23% → 12% grasa</p>
      <p style={{fontSize:12,color:"#5a8a5a",marginBottom:16}}>Déficit semanal ~5.600 kcal · ~0,73 kg/semana · 10–12 semanas</p>

      <div style={{background:"#0d1a0d",borderRadius:10,padding:"14px 16px",marginBottom:14,border:"1px solid #1a3a1a"}}>
        <p style={{fontSize:11,color:"#5a8a5a",marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>🔥 Déficit kcal acumulado</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
          <div>
            <span style={{fontSize:32,fontWeight:700,color:"#7aff9a"}}>{kcalAcumuladas.toLocaleString("es-ES")}</span>
            <span style={{fontSize:14,color:"#3a6a3a",marginLeft:6}}>/ {KCAL_TOTAL.toLocaleString("es-ES")} kcal</span>
          </div>
          <span style={{fontSize:14,fontWeight:700,color:"#5aaa5a"}}>{pct}%</span>
        </div>
        <div style={{background:"#0a150a",borderRadius:8,height:12,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#2a7a2a,#7aff9a)",borderRadius:8,transition:"width 0.6s ease"}}/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:16}}>
        {stat("Peso inicial","78 kg","23% grasa")}
        {stat("Peso actual",`${pesoActual} kg`,registros.length===0?"sin registro":"")}
        {stat("Grasa perdida",`${grasaPerdidaKg} kg`,`de ${GRASA_PERDER} kg`)}
        {stat("Restante",`${grasaRestante} kg`,`~${semanasRestantes} sem.`)}
      </div>

      {registros.length > 0 && (
        <div style={{background:"#0d1a0d",borderRadius:10,padding:"10px 14px",marginBottom:14,border:"1px solid #1a3a1a"}}>
          <p style={{fontSize:11,color:"#5a8a5a",marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>📊 Historial</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {registros.map((r,i) => (
              <div key={i} style={{background:"#1a2a1a",borderRadius:8,padding:"6px 10px",border:"1px solid #2a4a2a"}}>
                <p style={{fontSize:12,color:"#7aff9a",fontWeight:700}}>{r.peso} kg</p>
                <p style={{fontSize:10,color:"#3a6a3a"}}>{r.fecha}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {esLunes() && (
        <div style={{background:"#1a1a0a",border:"1px solid #4a4a1a",borderRadius:8,padding:"8px 12px",marginBottom:8}}>
          <p style={{fontSize:11,color:"#aaaa5a"}}>🔄 Es lunes — al registrar el peso se resetearán las comidas de la semana pasada.</p>
        </div>
      )}
      <div style={{display:"flex",gap:8}}>
        {!mostrarForm ? (
          <>
            <button onClick={() => setMostrarForm(true)}
              style={{flex:1,background:"#2a5a2a",border:"none",borderRadius:8,padding:"10px 0",color:"#7aff9a",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              ➕ Registrar peso hoy
            </button>
            {registros.length > 0 && (
              <button onClick={eliminar}
                style={{background:"#2a1a1a",border:"1px solid #4a2a2a",borderRadius:8,padding:"10px 12px",color:"#aa6a6a",fontSize:12,cursor:"pointer"}}>
                🗑️
              </button>
            )}
          </>
        ) : (
          <div style={{display:"flex",gap:8,flex:1}}>
            <input type="number" value={pesoHoy} onChange={e => setPesoHoy(e.target.value)}
              placeholder="Peso en kg (ej: 77.2)" step="0.1"
              style={{flex:1,background:"#0d1a0d",border:"1px solid #2a5a2a",borderRadius:8,padding:"8px 12px",color:"#7aff9a",fontSize:14}}/>
            <button onClick={guardar}
              style={{background:"#2a7a2a",border:"none",borderRadius:8,padding:"8px 16px",color:"white",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓</button>
            <button onClick={() => setMostrarForm(false)}
              style={{background:"#1a1a1a",border:"none",borderRadius:8,padding:"8px 12px",color:"#888",fontSize:13,cursor:"pointer"}}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── COMPONENTES AUXILIARES ───────────────────────────────────────────────────
const SectionHeader = ({ emoji, title, color, kcal }) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:18}}>{emoji}</span>
      <span style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color}}>{title}</span>
    </div>
    {kcal > 0 && (
      <span style={{background:color,color:"white",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700}}>
        {kcal} kcal
      </span>
    )}
  </div>
);

const SelectCard = ({ options, selKey, color, sel, setSel, onSelect }) => {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {options.map((op) => {
        const isSelected = sel[selKey]?.id === op.id;
        const handleClick = () => onSelect ? onSelect(op, isSelected) : setSel(s => ({...s,[selKey]: isSelected ? null : op}));
        const partes = op.label.trim().split(/\s+/);
        const emoji = partes.length > 1 ? partes[0] : "";
        const labelTexto = partes.length > 1 ? partes.slice(1).join(" ") : partes[0];
        return (
          <div key={op.id} onClick={handleClick}
            style={{cursor:"pointer",borderRadius:10,padding:"10px 12px",transition:"all 0.15s",
              background:isSelected?color:"#faf8f5",
              border:`1.5px solid ${isSelected?color:"#ede8e0"}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,height:26}}>
              {emoji && <span style={{fontSize:16,flexShrink:0}}>{emoji}</span>}
              <p style={{fontSize:13,fontWeight:600,color:isSelected?"white":"#333",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{labelTexto}</p>
              <span style={{fontSize:12,fontWeight:700,color:isSelected?"rgba(255,255,255,0.85)":"#999",whiteSpace:"nowrap",flexShrink:0}}>{op.kcal} kcal</span>
            </div>
            {isSelected && (
              <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.25)"}}>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.85)",lineHeight:1.5,marginBottom:7,wordBreak:"break-word"}}>{op.texto}</p>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {op.prot > 0 && <span style={{fontSize:11,color:"rgba(255,255,255,0.95)"}}>🥩 {op.prot}g prot</span>}
                  {op.carb > 0 && <span style={{fontSize:11,color:"rgba(255,255,255,0.95)"}}>🌾 {op.carb}g carb</span>}
                  {op.gras > 0 && <span style={{fontSize:11,color:"rgba(255,255,255,0.95)"}}>🥑 {op.gras}g grasas</span>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ColSelect = ({ items, selKey, color, sel, setSel, onSelect, selectedColor }) => {
  const selColor = selectedColor || "#2a7a3a";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {items.map((op) => {
        const isSelected = sel[selKey]?.id === op.id;
        const handleClick = onSelect ? () => onSelect(op, isSelected) : () => setSel(s => ({...s,[selKey]: isSelected ? null : op}));
        const partes = op.label.trim().split(/\s+/);
        const emoji = partes.length > 1 ? partes[0] : "";
        const labelCorto = (partes.length > 1 ? partes.slice(1).join(" ") : partes[0])
          .replace(/\s*\d+g\s*⭐?/g,"").replace(/\s*⭐/g," ⭐").trim();
        return (
          <div key={op.id} onClick={handleClick}
            style={{cursor:"pointer",borderRadius:9,padding:"6px 8px",transition:"all 0.15s",
              background:isSelected?selColor:"#faf8f5",
              border:`1.5px solid ${isSelected?selColor:"#ede8e0"}`,
              height:52,display:"flex",alignItems:"center",gap:5}}>
            {emoji && <span style={{fontSize:14,flexShrink:0}}>{emoji}</span>}
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:11,fontWeight:600,color:isSelected?"white":"#333",lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{labelCorto}</p>
              <p style={{fontSize:11,fontWeight:700,color:isSelected?"rgba(255,255,255,0.8)":"#999"}}>{op.kcal} kcal</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── AJUSTE DINÁMICO CENA ────────────────────────────────────────────────────
const tortillaCombinacion = (g, peq = 35, gran = 70) => {
  let best = null, bestDiff = Infinity;
  for (let np = 0; np <= 6; np++) {
    for (let ng = 0; ng <= 4; ng++) {
      const total = np * peq + ng * gran;
      if (total === 0) continue;
      const diff = Math.abs(total - g);
      if (diff < bestDiff) { bestDiff = diff; best = { np, ng, total }; }
    }
  }
  const { np, ng, total } = best;
  const partes =[];
  if (ng > 0) partes.push(`${ng} tortilla${ng>1?"s":""} grande${ng>1?"s":""} (${gran}g)`);
  if (np > 0) partes.push(`${np} tortilla${np>1?"s":""} pequeña${np>1?"s":""} (${peq}g)`);
  const diff = g - total;
  let texto = `${partes.join(" + ")} ⭐`;
  if (diff > 10) texto += ` + pan integral ${diff}g`;
  else if (diff < -5) texto += ` (${Math.abs(diff)}g menos)`;
  return { texto, gReal: total + Math.max(0, diff > 10 ? diff : 0), tieneGrande: ng > 0 };
};

const opcionConCantidad = (op) => {
  if (!op.baseG) return op;
  if (op.tag === "tortillaTrigo") {
    const { texto, tieneGrande } = tortillaCombinacion(op.baseG, op.peq || 35, op.gran || 70);
    return { ...op, label: `${op.label}`, texto: tieneGrande ? texto : texto + " + pan integral 30g" };
  }
  return {
    ...op,
    label: `${op.label} ${op.baseG}g`,
    texto: `${op.texto.split("+")[0].trim()} (${op.baseG}g) + pan integral 30g`,
  };
};

const proteinaConCantidad = (op) => {
  if (!op.baseG) return op;
  return { ...op, texto: `${op.texto} (${op.baseG}g)` };
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function DietaInteractiva() {
  const [tab, setTab] = useState("dieta");
  const [diaIdx, setDiaIdx] = useState(0);
  const [selPorDia, setSelPorDia] = useState(() => {
    const init = {};["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].forEach(d => { init[d] = {...EMPTY_SEL}; });
    return init;
  });
  const [loaded, setLoaded] = useState(false);

  // ─── PWA META TAGS ───────────────────────────────────────────────────────────
  useEffect(() => {
    document.title = "Dieta Carlos";
    const metas = [
      { name: "viewport",                              content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
      { name: "mobile-web-app-capable",                content: "yes" },
      { name: "apple-mobile-web-app-capable",          content: "yes" },
      { name: "apple-mobile-web-app-title",            content: "Dieta Carlos" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "theme-color",                           content: "#1a2a1a" },
    ];
    metas.forEach(({ name, content }) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (existing) { existing.content = content; }
      else { const m = document.createElement("meta"); m.name = name; m.content = content; document.head.appendChild(m); }
    });

    // Genera icono PNG via canvas (sin miniatura de Chrome)
    const makeIcon = (size) => {
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");
      const r = size * 0.18;
      ctx.beginPath();
      ctx.moveTo(r, 0); ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size); ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fillStyle = "#1a2a1a"; ctx.fill();
      ctx.font = `${size * 0.58}px serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("🥗", size / 2, size / 2 + size * 0.04);
      return canvas.toDataURL("image/png");
    };

    const icon192 = makeIcon(192);
    const icon512 = makeIcon(512);

    // Apple touch icon
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const l = document.createElement("link");
      l.rel = "apple-touch-icon"; l.href = icon192;
      document.head.appendChild(l);
    }

    const manifest = {
      name: "Dieta Carlos", short_name: "Dieta",
      start_url: "/", display: "standalone",
      background_color: "#1a2a1a", theme_color: "#1a2a1a",
      icons: [
        { src: icon192, sizes: "192x192", type: "image/png" },
        { src: icon512, sizes: "512x512", type: "image/png" },
      ]
    };
    const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const existing = document.querySelector('link[rel="manifest"]');
    if (existing) { existing.href = url; }
    else { const l = document.createElement("link"); l.rel = "manifest"; l.href = url; document.head.appendChild(l); }
  }, []);

  const d = dias[diaIdx];

  const sel = selPorDia[d.dia] || {...EMPTY_SEL};

  const SEL_KEYS =["desayuno","mediaMañana","merienda","energia","proteina","vitaminas","cena","cenaEnergia","cenaProteina","cenaVitaminas"];

  const serializarSel = (selPorDia) => {
    const out = {};
    Object.entries(selPorDia).forEach(([dia, sel]) => {
      out[dia] = {
        desayuno:    sel.desayuno?.id    ?? null,
        mediaMañana: sel.mediaMañana?.id ?? null,
        merienda:    sel.merienda?.id    ?? null,
        energia:     sel.energia?.id     ?? null,
        proteina:    sel.proteina?.id    ?? null,
        vitaminas:   sel.vitaminas?.id   ?? null,
        cena:        sel.cena?.id        ?? null,
      };
    });
    return out;
  };

  const buscarPorId = (id, ...arrays) => {
    for (const arr of arrays) {
      if (!arr) continue;
      const found = arr.find(o => o?.id === id);
      if (found) return found;
    }
    return null;
  };

  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem("comidas_semana") ?? "null");
      if (r) {
        const savedIds = r;
        const primerDia = Object.values(savedIds)[0] || {};
        const primerVal = Object.values(primerDia).find(v => v !== null);
        const esFormatoAntiguo = primerVal && typeof primerVal === "object" && "kcal" in primerVal;
        if (esFormatoAntiguo) {
          localStorage.removeItem("comidas_semana");
          setLoaded(true);
          return;
        }
        const allEnergiaOpts =[...(energiaOpts.alto||[]), ...(energiaOpts.medio||[]), ...(energiaOpts.bajo||[])];
        const allDesayunos =[...desayunoBase, ...dias.flatMap(d => d.desayuno||[])];
        const allMM =[...mediaMañanaBase, ...dias.flatMap(d => d.mediaMañana||[])];
        const allMerienda = [...meriendaBase, ...dias.flatMap(d => (d.merienda||[]).filter(o => !meriendaBase.find(b => b.id === o.id)))];
        const allProteina = [...proteinaOpts, ...proteinaLigeraOpts];
        const allVitaminas =[...vitaminasOpts];
        const allCenaEspecial = dias.flatMap(d => d.cenaEspecial||[]);

        const rebuilt = {};
        Object.entries(savedIds).forEach(([dia, ids]) => {
          rebuilt[dia] = {
            desayuno:     ids.desayuno     != null ? buscarPorId(ids.desayuno,    allDesayunos)   : null,
            mediaMañana:  ids.mediaMañana  != null ? buscarPorId(ids.mediaMañana, allMM)          : null,
            merienda:     ids.merienda     != null ? buscarPorId(ids.merienda,    allMerienda)    : null,
            energia:      ids.energia      != null ? buscarPorId(ids.energia,     allEnergiaOpts) : null,
            proteina:     ids.proteina     != null ? buscarPorId(ids.proteina,    allProteina)    : null,
            vitaminas:    ids.vitaminas    != null ? buscarPorId(ids.vitaminas,   allVitaminas)   : null,
            cena:         ids.cena         != null ? buscarPorId(ids.cena,        allCenaEspecial): null,
            cenaEnergia:  null,
            cenaProteina: null,
            cenaVitaminas:null,
          };
        });
        setSelPorDia(prev => ({...prev, ...rebuilt}));
      }
    } catch(e) {}
    setLoaded(true);
  },[]);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("comidas_semana", JSON.stringify(serializarSel(selPorDia))); } catch(e) {}
  }, [selPorDia, loaded]);

  const setSel = (updater) => {
    setSelPorDia(prev => {
      const newSel = typeof updater === "function" ? updater(prev[d.dia] || {...EMPTY_SEL}) : updater;
      return {...prev,[d.dia]: newSel};
    });
  };

  const handleResetComidas = () => {
    const init = {};["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].forEach(dia => { init[dia] = {...EMPTY_SEL}; });
    setSelPorDia(init);
  };

  const cambiarDia = (i) => { setDiaIdx(i); };

  const rec = recomendacionesPorDia[d.dia];
  const nivel = rec?.nivel || "medio";

  const esSabado  = d.dia === "Sábado";
  const esDomingo = d.dia === "Domingo";
  const sinMediaMañana = !!d.sinMediaMañana;
  const sinMerienda    = !!d.sinMerienda;

  const nivelEnergia = esDomingo ? "alto_domingo" : nivel;
  const energiaOptsHoy = rec.energia.map(tag => energiaOpts[nivelEnergia].find(o => o.tag === tag)).filter(Boolean);
  const legumbresSeleccionadas = sel.energia?.tag === "legumbres";

  const proteinaOpts100g =[
    { id: 1, label: "🐟 Pescado blanco", texto: "Merluza, bacalao, dorada, lubina, rape (100g)",    kcal: 77,  prot: 17, carb: 0, gras: 1,  tag: "pescBlanco"  },
    { id: 2, label: "🐠 Pescado azul",   texto: "Salmón, atún, caballa, sardinas (100g)",           kcal: 300, prot: 30, carb: 0, gras: 20,  tag: "pescAzul"    },
    { id: 3, label: "🍗 Carne blanca",   texto: "Pollo o pavo (100g)",                              kcal: 123, prot: 24, carb: 0, gras: 3,  tag: "carneBlanca" },
    { id: 4, label: "🥩 Carne roja",     texto: "Ternera, solomillo, entrecot magro (100g)",        kcal: 151, prot: 22, carb: 0, gras: 7,  tag: "carneRoja"   },
    { id: 5, label: "🥚 Huevos",         texto: "2 huevos enteros + 1 clara — revueltos o plancha", kcal: 180, prot: 16, carb: 2, gras: 12, tag: "huevos"      },
  ];
  const proteinaTop3 = rec.proteina.map(tag => (esDomingo ? proteinaOpts100g : proteinaOpts).find(o => o.tag === tag)).filter(Boolean);
  const proteinaOptsHoy = legumbresSeleccionadas
    ? (esSabado ? proteinaLigeraSabadoOpts : proteinaLigeraOpts)
    : (esSabado ? proteinaOptsSabado : proteinaTop3);
  const vitaminasSinPrimero = vitaminasOpts.filter(o => !o.esPrimerPlato && o.id !== 4);
  const vitaminasConPure =[1,2,5].map(id => vitaminasOpts.find(o => o.id === id)).filter(Boolean);
  const vitaminasOptsHoy = legumbresSeleccionadas ? vitaminasSinPrimero.slice(0,3) : vitaminasConPure;
  const mostrarVitaminas = !esDomingo;

  const comidaCompleteDomingo = esDomingo ? !!(sel.energia && sel.proteina) : false;

  const desayunoOrden = desayunoOrdenPorDia[d.dia] || [1,2,3];
  const desayunoOptsSorted = desayunoOrden.map(id => (d.desayuno||desayunoBase).find(o => o.id === id)).filter(Boolean);
  const mmOrden = sel.desayuno?.id ? (mediaMañanaOrdenPorDesayuno[sel.desayuno.id] || [1,2,3]) : [1,2,3];
  const mmOptsSorted = sinMediaMañana ?[] : mmOrden.map(id => (d.mediaMañana||mediaMañanaBase).find(o => o.id === id)).filter(Boolean);
  const meriendaOrden = sel.mediaMañana?.id ? (meriendaOrdenPorMM[sel.mediaMañana.id] || [1,2,3]) :[1,2,3];
  const meriendaDisp = d.merienda || meriendaBase;
  const meriendaOptsSorted = sinMerienda ? [] : (() => {
    const porOrden = meriendaOrden.map(id => meriendaDisp.find(o => o.id === id)).filter(Boolean);
    const extras = meriendaDisp.filter(o => !meriendaOrden.includes(o.id));
    return [...porOrden, ...extras];
  })();

  const tagEnergiaComida = sel.energia?.tag || null;
  const tagProteinaComida = sel.proteina?.tag || null;
  const protTagMedioDia = tagProteinaComida || "default";
  const logicaCena = cenaPorProteina[protTagMedioDia] || cenaPorProteina["default"];

  // normaliza tags para filtrar arroz_bl como arroz, pasta_bl como pasta
  const normalizarTag = (tag) => tag === "arroz_bl" ? "arroz" : tag === "pasta_bl" ? "pasta" : tag;
  const tagEnergiaNorm = tagEnergiaComida ? normalizarTag(tagEnergiaComida) : null;

  const diaConf = cenaDiaConfig[d.dia] || cenaDiaConfig["Lunes"];
  const usarBlanco = diaConf.usarBlanco;
  const cenaDiaTip = diaConf.tip;

  const cenaEnergiaOrdenHoy = diaConf.energiaOrden[protTagMedioDia] || diaConf.energiaOrden.default || [1, 4, 2];
  const cenaEnergiaFallbackOrder = usarBlanco ? [7, 6, 3, 2, 1, 4, 5, 8] : [1, 4, 2, 3, 5, 8, 7, 6];
  const cenaEnergiaOptsBase = cenaEnergiaOrdenHoy
    .map(id => cenaEnergiaOpts.find(o => o.id === id))
    .filter(Boolean);
  const cenaEnergiaFiltered = tagEnergiaNorm
    ? cenaEnergiaOptsBase.filter(op => normalizarTag(op.tag) !== tagEnergiaNorm)
    : cenaEnergiaOptsBase;
  const cenaEnergiaOptsRaw = (() => {
    if (cenaEnergiaFiltered.length >= 3) return cenaEnergiaFiltered.slice(0, 3);
    const usedIds = new Set(cenaEnergiaFiltered.map(o => o.id));
    const extras = cenaEnergiaFallbackOrder
      .map(id => cenaEnergiaOpts.find(o => o.id === id))
      .filter(op => op && !usedIds.has(op.id) && (!tagEnergiaNorm || normalizarTag(op.tag) !== tagEnergiaNorm));
    return [...cenaEnergiaFiltered, ...extras].slice(0, 3);
  })();
  const cenaProteinaFallbackOrder = ["carneBlanca", "pescBlanco", "pescAzul", "carneRoja", "huevos"];
  const cenaProteinaBase = logicaCena.sugeridas
    .map(tag => cenaProteinaOpts.find(o => o.tag === tag))
    .filter(Boolean);
  const cenaProteinaFiltered = tagProteinaComida
    ? cenaProteinaBase.filter(op => op.tag !== tagProteinaComida)
    : cenaProteinaBase;
  const cenaProteinaRaw = (() => {
    if (cenaProteinaFiltered.length >= 3) return cenaProteinaFiltered.slice(0, 3);
    const usedTags = new Set(cenaProteinaFiltered.map(o => o.tag));
    const extras = cenaProteinaFallbackOrder
      .map(tag => cenaProteinaOpts.find(o => o.tag === tag))
      .filter(op => op && !usedTags.has(op.tag) && (!tagProteinaComida || op.tag !== tagProteinaComida));
    return [...cenaProteinaFiltered, ...extras].slice(0, 3);
  })();
  const cenaVitaminasOpts = [1,2,5].map(id => vitaminasOpts.find(o => o.id === id)).filter(Boolean);

  const postreComidaHoy = postreComidaPorDia[d.dia] || null;
  const postreCenaData = postreCenaPorDia[d.dia] || null;

  const comidaComplete = esDomingo ? comidaCompleteDomingo : !!(sel.energia && sel.proteina && sel.vitaminas);
  const cenaComplete = !!(sel.cenaEnergia && sel.cenaProteina && sel.cenaVitaminas);

  const comidaKcal = (sel.energia?.kcal||0) + (sel.proteina?.kcal||0) + (sel.vitaminas?.kcal||0) + (comidaComplete?(postreComidaHoy?.kcal||0):0);

  const objetivo = d.kcalObjetivo;

  const kcalDesayuno  = sel.desayuno?.kcal    || desayunoOptsSorted[0]?.kcal    || 440;
  const kcalMM        = sinMediaMañana ? 0 : (sel.mediaMañana?.kcal || mmOptsSorted[0]?.kcal || 280);
  const kcalEnergia   = sel.energia?.kcal     || energiaOptsHoy[0]?.kcal        || 250;
  const kcalProteina  = sel.proteina?.kcal    || proteinaOptsHoy[0]?.kcal       || 200;
  const kcalVitaminas = mostrarVitaminas ? (sel.vitaminas?.kcal || vitaminasOptsHoy[0]?.kcal || 40) : 0;
  const kcalPostre    = postreComidaHoy?.kcal || 0;
  const kcalMerienda  = sinMerienda ? 0 : (sel.merienda?.kcal || meriendaOptsSorted[0]?.kcal || 260);

  const kcalEstimadaSinCena = kcalDesayuno + kcalMM + kcalEnergia + kcalProteina + kcalVitaminas + kcalPostre + kcalMerienda;
  const margenCena = Math.max(200, objetivo - kcalEstimadaSinCena);

  const kcalFijasCena = (cenaVitaminasOpts[0]?.kcal || 40) + (postreCenaData?.kcal || 0);
  const margenEnergiaDisp  = Math.max(80,  Math.round((margenCena - kcalFijasCena) * 0.35));
  const margenProteinaDisp = Math.max(100, margenCena - kcalFijasCena - margenEnergiaDisp);

  const PAN_INT  = { kcal: 77, prot: 3, carb: 14, gras: 1, label: "pan integral 30g" };
  const PAN_BLC  = { kcal: 80, prot: 2, carb: 16, gras: 1, label: "pan barra blanco 30g" };
  const cenaEnergiaOptsSorted = cenaEnergiaOptsRaw.map(op => {
    if (!op.baseG || !op.kcalPer100) return opcionConCantidad(op);
    const esTortilla = op.tag === "tortillaTrigo";
    let gFinal;
    if (esTortilla && legumbresSeleccionadas) {
      gFinal = 60;
    } else {
      const realKcalPer100 = op.prot100 * 4 + op.carb100 * 4 + op.gras100 * 9;
      const pan = op.panBlanco ? PAN_BLC : PAN_INT;
      const kcalDisp = Math.max(50, margenEnergiaDisp - pan.kcal);
      const gCalc = Math.round((kcalDisp / realKcalPer100) * 100 / 5) * 5;
      gFinal = Math.min(op.max, Math.max(op.min, gCalc));
    }
    const ratio = gFinal / 100;
    const { texto: tortTexto, tieneGrande } = tortillaCombinacion(gFinal, op.peq || 35, op.gran || 70);
    const pan = (esTortilla && tieneGrande) ? { kcal: 0, prot: 0, carb: 0, gras: 0 } : (op.panBlanco ? PAN_BLC : PAN_INT);
    const calcProt = Math.round(op.prot100 * ratio) + pan.prot;
    const calcCarb = Math.round(op.carb100 * ratio) + pan.carb;
    const calcGras = Math.round(op.gras100 * ratio) + pan.gras;
    const textoFinal = esTortilla
      ? (tieneGrande ? tortTexto : `${tortTexto} + ${pan.label}`)
      : `${op.texto.split("+")[0].trim()} (${gFinal}g) + ${pan.label}`;
    return {
      ...op,
      kcal: calcProt * 4 + calcCarb * 4 + calcGras * 9,
      prot: calcProt,
      carb: calcCarb,
      gras: calcGras,
      label: op.label,
      texto: textoFinal,
    };
  });

  const cenaProteinaSorted = cenaProteinaRaw.map(op => {
    if (!op.baseG || !op.kcalPer100) return proteinaConCantidad(op);
    const realKcalPer100 = op.prot100 * 4 + op.carb100 * 4 + op.gras100 * 9;
    const gCalc = Math.round((margenProteinaDisp / realKcalPer100) * 100 / 5) * 5;
    const gFinal = Math.min(op.max, Math.max(op.min, gCalc));
    const ratio = gFinal / 100;
    const calcProt = Math.round(op.prot100 * ratio);
    const calcCarb = Math.round(op.carb100 * ratio);
    const calcGras = Math.round(op.gras100 * ratio);
    return {
      ...op,
      kcal:  calcProt * 4 + calcCarb * 4 + calcGras * 9,
      prot:  calcProt,
      carb:  calcCarb,
      gras:  calcGras,
      texto: `${op.texto} (${gFinal}g)`,
    };
  });

  const cenaEnergiaActual = sel.cenaEnergia ? cenaEnergiaOptsSorted.find(o => o.id === sel.cenaEnergia.id) : null;
  const cenaProteinaActual = sel.cenaProteina ? cenaProteinaSorted.find(o => o.id === sel.cenaProteina.id) : null;

  const cenaSelKcal = sel.cena?.kcal || 0;
  const cenaColumnsKcal = (cenaEnergiaActual?.kcal||0) + (cenaProteinaActual?.kcal||0) + (sel.cenaVitaminas?.kcal||0) + (cenaComplete?(postreCenaData?.kcal||0):0);
  const cenaKcal = cenaSelKcal > 0 ? cenaSelKcal : cenaColumnsKcal;

  const totalKcal = (sel.desayuno?.kcal||0) + (sel.mediaMañana?.kcal||0) + comidaKcal + (sel.merienda?.kcal||0) + cenaKcal;
  const restante = objetivo - totalKcal;
  const pct = Math.min(100, Math.round((totalKcal / objetivo) * 100));

  const vitsProt = mostrarVitaminas ? (sel.vitaminas?.prot||0) : 0;
  const vitsCarb = mostrarVitaminas ? (sel.vitaminas?.carb||0) : 0;
  const vitsGras = mostrarVitaminas ? (sel.vitaminas?.gras||0) : 0;
  const totalProt = (sel.desayuno?.prot||0)+(sel.mediaMañana?.prot||0)+(sel.energia?.prot||0)+(sel.proteina?.prot||0)+vitsProt+(comidaComplete?(postreComidaHoy?.prot||0):0)+(sel.merienda?.prot||0)+(sel.cena?.prot||0)+(cenaEnergiaActual?.prot||0)+(cenaProteinaActual?.prot||0)+(sel.cenaVitaminas?.prot||0);
  const totalCarb = (sel.desayuno?.carb||0)+(sel.mediaMañana?.carb||0)+(sel.energia?.carb||0)+(sel.proteina?.carb||0)+vitsCarb+(comidaComplete?(postreComidaHoy?.carb||0):0)+(sel.merienda?.carb||0)+(sel.cena?.carb||0)+(cenaEnergiaActual?.carb||0)+(cenaProteinaActual?.carb||0)+(sel.cenaVitaminas?.carb||0);
  const totalGras = (sel.desayuno?.gras||0)+(sel.mediaMañana?.gras||0)+(sel.energia?.gras||0)+(sel.proteina?.gras||0)+vitsGras+(sel.merienda?.gras||0)+(sel.cena?.gras||0)+(cenaEnergiaActual?.gras||0)+(cenaProteinaActual?.gras||0)+(sel.cenaVitaminas?.gras||0);

  const handleEnergiaSelect = (op, isSelected) => {
    setSel(s => ({ ...s, energia: isSelected ? null : op, proteina: null, vitaminas: null }));
  };
  const handleCenaEnergiaSelect = (op, isSelected) => {
    setSel(s => ({ ...s, cenaEnergia: isSelected ? null : op, cena: null }));
  };
  const handleCenaSelect = (op, isSelected) => {
    setSel(s => ({ ...s, cena: isSelected ? null : op, cenaEnergia: null, cenaProteina: null, cenaVitaminas: null }));
  };

  const colGrid = (cols) => {
    const selected = cols.map(col => {
      const found = col.items.find(op => sel[col.selKey]?.id === op.id);
      return found ? {op: found, col} : null;
    }).filter(Boolean);
    const gridCols = cols.length === 2 ? "repeat(2,minmax(0,1fr))" : "repeat(3,minmax(0,1fr))";

    return (
      <div style={{marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:gridCols,gap:5,marginBottom: selected.length > 0 ? 8 : 0}}>
          {cols.map(col => (
            <div key={col.label} style={{minWidth:0}}>
              <p style={{fontSize:10,fontWeight:700,color:col.color,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6,textAlign:"center"}}>{col.label}</p>
              <ColSelect items={col.items} selKey={col.selKey} color={col.color} sel={sel} setSel={setSel}
                onSelect={col.onSelect || undefined} selectedColor={col.selectedColor}/>
            </div>
          ))}
        </div>
        {selected.map(({op, col}) => {
          const selColor = col.selectedColor || "#2a7a3a";
          const partes = op.label.trim().split(/\s+/);
          const labelCorto = (partes.length > 1 ? partes.slice(1).join(" ") : partes[0])
            .replace(/\s*\d+g\s*⭐?/g,"").replace(/\s*⭐/g," ⭐").trim();
          return (
            <div key={col.selKey} style={{background:selColor,borderRadius:10,padding:"10px 14px",marginBottom:6}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <p style={{fontSize:12,fontWeight:700,color:"white"}}>{op.label}</p>
                <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{op.kcal} kcal</span>
              </div>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.85)",lineHeight:1.5,marginBottom:7,wordBreak:"break-word"}}>{op.texto}</p>
              <div style={{display:"flex",gap:12,borderTop:"1px solid rgba(255,255,255,0.2)",paddingTop:6,flexWrap:"wrap"}}>
                {op.prot > 0 && <span style={{fontSize:11,color:"rgba(255,255,255,0.95)"}}>🥩 {op.prot}g</span>}
                {op.carb > 0 && <span style={{fontSize:11,color:"rgba(255,255,255,0.95)"}}>🌾 {op.carb}g</span>}
                {op.gras > 0 && <span style={{fontSize:11,color:"rgba(255,255,255,0.95)"}}>🥑 {op.gras}g</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#f0ede8",minHeight:"100vh",maxWidth:"100vw",overflowX:"hidden"}}>
      <style>{STYLES}</style>

      <div style={{background:"linear-gradient(135deg,#1a2a1a,#0d1f0d)",padding:"20px 20px 16px"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:"white",marginBottom:2}}>Carlos · Definición</p>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)"}}>30 años · 78 kg · 173 cm · Objetivo 12% grasa</p>

          {totalKcal > 0 && (
            <div style={{marginTop:14,background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:700,color:"white"}}>{totalKcal} kcal</span>
                <span style={{fontSize:12,color:restante>=0?"#7aff9a":"#ff7a7a"}}>
                  {restante>=0?`Quedan ${restante} kcal`:`⚠️ ${Math.abs(restante)} kcal sobre objetivo`}
                </span>
              </div>
              <div style={{background:"rgba(255,255,255,0.1)",borderRadius:6,height:8,marginBottom:8,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:pct>105?"#ff7a7a":"linear-gradient(90deg,#2a7a2a,#7aff9a)",borderRadius:6,transition:"width 0.3s"}}/>
              </div>
              <div style={{display:"flex",gap:14}}>
                {[["🥩",totalProt,"g prot","#7affb0"],["🌾",totalCarb,"g carb","#ffd080"],["🥑",totalGras,"g grasas","#ffb870"]].map(([e,v,u,c])=>(
                  <span key={e} style={{fontSize:11,color:c}}>{e} {v}{u}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"14px 14px 0"}}>
        <div style={{display:"flex",gap:8,background:"white",borderRadius:12,padding:5,boxShadow:"0 1px 5px rgba(0,0,0,0.07)",marginBottom:18}}>
          {[{id:"dieta",label:"🍽️ Dieta"},{id:"tracker",label:"📉 Progreso"}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{flex:1,padding:"10px 0",borderRadius:8,border:"none",cursor:"pointer",
                background:tab===t.id?"#2d5a2d":"transparent",
                color:tab===t.id?"white":"#888",
                fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,transition:"all 0.15s"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"0 14px 30px"}}>

        {tab === "tracker" && <FatTracker onResetComidas={handleResetComidas} />}

        {tab === "dieta" && (
          <>
            <div style={{display:"flex",gap:4,marginBottom:18,overflowX:"auto",paddingBottom:4}}>
              {dias.map((dd,i) => (
                <button key={dd.dia} className={`day-btn ${diaIdx===i?"active":""}`}
                  style={diaIdx===i?{background:dd.color}:{}}
                  onClick={() => cambiarDia(i)}>
                  {dd.emoji} {dd.dia}
                </button>
              ))}
            </div>

            <div className="card" style={{background:`${d.color}15`,border:`1px solid ${d.color}40`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:d.color}}>{d.emoji} {d.dia} — {d.tipoLabel}</p>
                  <p style={{fontSize:13,color:"#777",marginTop:3}}>{d.nota}</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{fontSize:20,fontWeight:700,color:d.color}}>{d.kcalObjetivo}</p>
                  <p style={{fontSize:11,color:"#aaa"}}>kcal objetivo</p>
                </div>
              </div>
            </div>

            <div className="card">
              <SectionHeader emoji="☀️" title="Desayuno" color="#c17f2a" kcal={sel.desayuno?.kcal||0}/>
              <SelectCard options={desayunoOptsSorted} selKey="desayuno" color="#c17f2a" sel={sel} setSel={setSel}/>
            </div>

            {!sinMediaMañana && (
              <div className="card">
                <SectionHeader emoji="🍎" title="Media Mañana" color="#5a9e4a" kcal={sel.mediaMañana?.kcal||0}/>
                {!sel.desayuno && <p style={{fontSize:12,color:"#bbb",marginBottom:10}}>Selecciona el desayuno para ver el orden recomendado</p>}
                <SelectCard options={mmOptsSorted} selKey="mediaMañana" color="#5a9e4a" sel={sel} setSel={setSel}/>
              </div>
            )}

            <div className="card">
              <SectionHeader emoji="🍽️" title="Comida" color="#2d7a4a" kcal={comidaKcal}/>
              {legumbresSeleccionadas && (
                <div style={{background:"#fff8e8",border:"1px solid #e0c060",borderRadius:8,padding:"8px 14px",marginBottom:10}}>
                  <p style={{fontSize:12,color:"#7a5a10"}}>🫘 Elegiste legumbres — proteína filtrada a opciones ligeras.</p>
                </div>
              )}
              <p style={{fontSize:12,color:"#999",marginBottom:10}}>Selecciona UNA de cada columna</p>
              {mostrarVitaminas ? colGrid([
                {label:"⚡ Energía",   items:energiaOptsHoy,    selKey:"energia",   color:"#e0a85a", onSelect:handleEnergiaSelect, selectedColor:"#c45e1a"},
                {label:"🥩 Proteína",  items:proteinaOptsHoy,   selKey:"proteina",  color:"#5a9e7a", selectedColor:"#7a1ac4"},
                {label:"🥦 Vitaminas", items:vitaminasOptsHoy,  selKey:"vitaminas", color:"#5a8fb5", selectedColor:"#1a5ec4"},
              ]) : colGrid([
                {label:"⚡ Energía",   items:energiaOptsHoy,    selKey:"energia",   color:"#e0a85a", onSelect:handleEnergiaSelect, selectedColor:"#c45e1a"},
                {label:"🥩 Proteína",  items:proteinaOptsHoy,   selKey:"proteina",  color:"#5a9e7a", selectedColor:"#7a1ac4"},
              ])}
              {comidaComplete && postreComidaHoy && (
                <div style={{background:"#f0f7f3",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                  <span style={{fontSize:13,color:"#2d6a4a"}}>🍽️ Postre: {postreComidaHoy.label} — {postreComidaHoy.texto}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#2d6a4a",marginLeft:10}}>{postreComidaHoy.kcal} kcal</span>
                </div>
              )}
            </div>

            {!sinMerienda && (
              <div className="card">
                <SectionHeader emoji="🌤️" title="Merienda" color="#8a5a2d" kcal={sel.merienda?.kcal||0}/>
                {!sinMediaMañana && !sel.mediaMañana && <p style={{fontSize:12,color:"#bbb",marginBottom:10}}>Selecciona la media mañana para ver el orden recomendado</p>}
                <SelectCard options={meriendaOptsSorted} selKey="merienda" color="#8a5a2d" sel={sel} setSel={setSel}/>
              </div>
            )}

            <div className="card">
              <SectionHeader emoji="🌙" title="Cena" color="#5a2d8a" kcal={cenaKcal}/>

              {d.cenaEspecial ? (
                <div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom: sel.cena ? 8 : 0}}>
                    {d.cenaEspecial.map((op) => {
                      const isSelected = sel.cena?.id === op.id;
                      return (
                        <div key={op.id} onClick={() => handleCenaSelect(op, isSelected)}
                          style={{cursor:"pointer",borderRadius:10,padding:"10px 14px",transition:"all 0.15s",
                            background:isSelected?"#5a2d8a":"#faf8f5",
                            border:`1.5px solid ${isSelected?"#5a2d8a":"#ede8e0"}`,
                            display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,height:46}}>
                          <p style={{fontSize:13,fontWeight:600,color:isSelected?"white":"#333",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{op.label}</p>
                          <span style={{fontSize:12,fontWeight:700,color:isSelected?"rgba(255,255,255,0.85)":"#999",whiteSpace:"nowrap",flexShrink:0}}>{op.kcal} kcal</span>
                        </div>
                      );
                    })}
                  </div>
                  {sel.cena && d.cenaEspecial.find(op => sel.cena?.id === op.id) && (
                    <div style={{background:"#5a2d8a",borderRadius:10,padding:"11px 14px"}}>
                      {(() => { const sc = d.cenaEspecial.find(op => sel.cena?.id === op.id); return (<>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <p style={{fontSize:13,fontWeight:700,color:"white",flex:1,minWidth:0}}>{sc.label}</p>
                          <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.9)",whiteSpace:"nowrap",marginLeft:8}}>{sc.kcal} kcal</span>
                        </div>
                        <p style={{fontSize:11,color:"rgba(255,255,255,0.85)",lineHeight:1.5,marginBottom:8,wordBreak:"break-word"}}>{sc.texto}</p>
                        <div style={{display:"flex",gap:12,borderTop:"1px solid rgba(255,255,255,0.25)",paddingTop:7,flexWrap:"wrap"}}>
                          {sc.prot>0 && <span style={{fontSize:11,color:"rgba(255,255,255,0.95)"}}>🥩 {sc.prot}g prot</span>}
                          {sc.carb>0 && <span style={{fontSize:11,color:"rgba(255,255,255,0.95)"}}>🌾 {sc.carb}g carb</span>}
                          {sc.gras>0 && <span style={{fontSize:11,color:"rgba(255,255,255,0.95)"}}>🥑 {sc.gras}g grasas</span>}
                        </div>
                      </>); })()}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {!comidaComplete ? (
                    <div style={{background:"#fff8e8",border:"1px dashed #e0c060",borderRadius:10,padding:"14px",textAlign:"center"}}>
                      <p style={{fontSize:13,color:"#8a6a10"}}>⬆️ Completa la comida para ver la cena personalizada</p>
                    </div>
                  ) : (
                    <>
                      <div style={{background:"#e8f4f0",border:"1px solid #a8d8c8",borderRadius:10,padding:"10px 14px",marginBottom:8}}>
                        <p style={{fontSize:12,color:"#1a5a3a",lineHeight:1.5,fontWeight:600}}>{cenaDiaTip}</p>
                      </div>
                      <div style={{background:"#f0f0ff",border:"1px solid #c8c0e8",borderRadius:10,padding:"10px 14px",marginBottom:12}}>
                        <p style={{fontSize:12,color:"#4a3a8a",lineHeight:1.5}}>{logicaCena.recomendacion}</p>
                      </div>
                      <p style={{fontSize:12,color:"#999",marginBottom:10}}>Selecciona UNA de cada columna</p>
                      {colGrid([
                        {label:"⚡ Energía",   items:cenaEnergiaOptsSorted, selKey:"cenaEnergia",   color:"#e0a85a", onSelect:handleCenaEnergiaSelect, selectedColor:"#c45e1a"},
                        {label:"🥩 Proteína",  items:cenaProteinaSorted,    selKey:"cenaProteina",  color:"#5a9e7a", selectedColor:"#7a1ac4"},
                        {label:"🥦 Vitaminas", items:cenaVitaminasOpts,     selKey:"cenaVitaminas", color:"#5a8fb5", selectedColor:"#1a5ec4"},
                      ])}
                      {cenaComplete && postreCenaData && (
                        <div style={{background:"#f0f0ff",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                          <span style={{fontSize:13,color:"#4a3a8a"}}>{postreCenaData.texto}</span>
                          {postreCenaData.kcal>0 && <span style={{fontSize:12,fontWeight:700,color:"#4a3a8a",marginLeft:10}}>{postreCenaData.kcal} kcal</span>}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {totalKcal > 0 && (
              <div className="card" style={{background:"#1a1a2a",border:"1px solid #3a3a5a"}}>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"white",marginBottom:14}}>📊 Resumen del día</p>
                {[
                  {label:"☀️ Desayuno",    kcal:sel.desayuno?.kcal,   prot:sel.desayuno?.prot,   carb:sel.desayuno?.carb,   gras:sel.desayuno?.gras},
                  {label:"🍎 Media mañana",kcal:sel.mediaMañana?.kcal, prot:sel.mediaMañana?.prot, carb:sel.mediaMañana?.carb, gras:sel.mediaMañana?.gras},
                  {label:"🍽️ Comida",      kcal:comidaKcal||null,     prot:(sel.energia?.prot||0)+(sel.proteina?.prot||0)+vitsProt+(comidaComplete?(postreComidaHoy?.prot||0):0), carb:(sel.energia?.carb||0)+(sel.proteina?.carb||0)+vitsCarb+(comidaComplete?(postreComidaHoy?.carb||0):0), gras:(sel.energia?.gras||0)+(sel.proteina?.gras||0)+vitsGras},
                  {label:"🌤️ Merienda",    kcal:sel.merienda?.kcal,   prot:sel.merienda?.prot,   carb:sel.merienda?.carb,   gras:sel.merienda?.gras},
                  {label:"🌙 Cena",        kcal:cenaKcal||null,       prot:(sel.cena?.prot||0)+(cenaProteinaActual?.prot||0)+(cenaEnergiaActual?.prot||0)+(sel.cenaVitaminas?.prot||0), carb:(sel.cena?.carb||0)+(cenaProteinaActual?.carb||0)+(cenaEnergiaActual?.carb||0)+(sel.cenaVitaminas?.carb||0), gras:(sel.cena?.gras||0)+(cenaProteinaActual?.gras||0)+(cenaEnergiaActual?.gras||0)+(sel.cenaVitaminas?.gras||0)},
                ].filter(r => r.kcal).map((r,i) => (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                    <span style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>{r.label}</span>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      {r.prot>0 && <span style={{fontSize:11,color:"#7affb0"}}>🥩 {r.prot}g</span>}
                      {r.carb>0 && <span style={{fontSize:11,color:"#ffd080"}}>🌾 {r.carb}g</span>}
                      {r.gras>0 && <span style={{fontSize:11,color:"#ffb870"}}>🥑 {r.gras}g</span>}
                      <span style={{fontSize:13,fontWeight:700,color:"white",minWidth:70,textAlign:"right"}}>{r.kcal} kcal</span>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.15)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:14,fontWeight:700,color:"white"}}>Total</span>
                    <span style={{fontSize:18,fontWeight:700,color:restante>=0?"#7aff9a":"#ff7a7a"}}>{totalKcal} / {objetivo} kcal</span>
                  </div>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                    {[["🥩 Prot",totalProt,"g","#7affb0"],["🌾 Carb",totalCarb,"g","#ffd080"],["🥑 Grasas",totalGras,"g","#ffb870"]].map(([l,v,u,c])=>(
                      <span key={l} style={{fontSize:12,fontWeight:700,color:c}}>{l}: {v}{u}</span>
                    ))}
                  </div>
                  <div style={{marginTop:10,textAlign:"center"}}>
                    <span style={{fontSize:13,fontWeight:700,color:restante===0?"#7aff9a":restante>0?"#ffd080":"#ff7a7a"}}>
                      {restante===0 ? "🎯 ¡Objetivo exacto!" : restante>0 ? `Quedan ${restante} kcal` : `⚠️ ${Math.abs(restante)} kcal por encima`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}