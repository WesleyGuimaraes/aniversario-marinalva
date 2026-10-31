// =====================================================================
//  CONFIGURAÇÃO DA LISTA — edite só este arquivo para personalizar o site
// =====================================================================

const CONFIG = {
  // Quem está fazendo aniversário
  aniversariante: "Marinalva",
  idade: null,                    // ex.: 60  (deixe null para não mostrar)
  data: "2026-11-21",             // AAAA-MM-DD
  horario: "18h30",
  local: "",                      // endereço da festa (deixe "" para não mostrar)
  mensagem:
    "Quem me conhece sabe: sou apaixonada por cactos e suculentas. " +
    "Em vez de presentes, escolha uma plantinha da lista abaixo — o valor " +
    "vem direto pra mim e vai virar o meu cantinho verde. Obrigada pelo carinho!",

  // Dados do Pix que recebe os presentes
  pix: {
    chave: "97391778168",          // CPF, e-mail, telefone (+5511999999999) ou chave aleatória
    nome: "MARINALVA VIEIRA LIMA",  // nome do titular da conta (até 25 letras)
    cidade: "ANAPOLIS",             // cidade do titular (até 15 letras) — obrigatória no Pix, não aparece no site
  },

  // WhatsApp para o convidado avisar que presenteou (só números, com DDI e DDD).
  // Deixe "" para esconder o botão.
  whatsapp: "5562991367260",

  // URL do "App da Web" da planilha Google (veja planilha/Codigo.gs).
  // Enquanto estiver "", o site funciona sem limite de quantidade e sem registro.
  planilhaUrl: "https://script.google.com/macros/s/AKfycbzSWHjqBMnmoI8NnbpQig0civiTd2g6FBUFkkyVoOqLAK3wHR5KWNzt02_YVcNJ2KMeSw/exec",
};

// ---------------------------------------------------------------------
//  Lista de presentes
//  categoria: "cactos" | "suculentas" | "cantinho"
//  desenho:   "coluna" | "bola" | "orelha" | "estrela" | "roseta"
//             | "pendente" | "arvore" | "babosa" | "terrario" | "vaso" | "regador"
//  valor:      preço em reais (ex.: 85 ou 49.90)
//  quantidade: quantas vezes o item pode ser presenteado (null = sem limite)
//  imagem:    opcional — caminho de uma foto (ex.: "fotos/mandacaru.jpg").
//             Se não tiver, o site usa o desenho.
//
//  Atenção: a planilha conta as compras pelo NOME do item. Se renomear um
//  item depois que alguém já comprou, a contagem dele recomeça do zero.
// ---------------------------------------------------------------------

const PRESENTES = [
  {
    nome: "Mandacaru",
    categoria: "cactos",
    descricao: "O símbolo do sertão: alto, resistente e florido nas noites de chuva.",
    valor: 65,
    quantidade: 2,
    desenho: "coluna",
  },
  {
    nome: "Cacto Bola-de-Ouro",
    categoria: "cactos",
    descricao: "Redondinho, com espinhos dourados. Cresce devagar e vive décadas.",
    valor: 50,
    quantidade: 2,
    desenho: "bola",
  },
  {
    nome: "Orelha-de-Coelho",
    categoria: "cactos",
    descricao: "Opuntia de folhas achatadas e pontinhos felpudos. Charmoso e fácil.",
    valor: 40,
    quantidade: 2,
    desenho: "orelha",
  },
  {
    nome: "Cacto Estrela",
    categoria: "cactos",
    descricao: "Astrophytum em forma de estrela, salpicado de pontinhos brancos.",
    valor: 25,
    quantidade: 2,
    desenho: "estrela",
  },
  {
    nome: "Echeveria Rosa",
    categoria: "suculentas",
    descricao: "A clássica roseta de folhas carnudas em tons de rosa e lilás.",
    valor: 30,
    quantidade: 2,
    desenho: "roseta",
  },
  {
    nome: "Colar-de-Pérolas",
    categoria: "suculentas",
    descricao: "Cascata de bolinhas verdes, linda em vaso pendurado.",
    valor: 30,
    quantidade: 2,
    desenho: "pendente",
  },
  {
    nome: "Árvore-de-Jade",
    categoria: "suculentas",
    descricao: "Dizem que traz prosperidade. Folhas brilhantes e tronco grossinho.",
    valor: 25,
    quantidade: 2,
    desenho: "arvore",
  },
  {
    nome: "Babosa",
    categoria: "suculentas",
    descricao: "Aloe vera: bonita no jardim e útil na farmacinha de casa.",
    valor: 20,
    quantidade: 3,
    desenho: "babosa",
  },
  {
    nome: "Terrário de Suculentas",
    categoria: "cantinho",
    descricao: "Um mini jardim no vidro, com pedrinhas e várias espécies juntas.",
    valor: 70,
    quantidade: 2,
    desenho: "terrario",
  },
  {
    nome: "Vaso de Cerâmica",
    categoria: "cantinho",
    descricao: "Vaso artesanal de barro para a planta nova ganhar casa bonita.",
    valor: 50,
    quantidade: 2,
    desenho: "vaso",
  },
  {
    nome: "Kit Jardinagem",
    categoria: "cantinho",
    descricao: "Regador de bico fino, pazinha, substrato e adubo para suculentas.",
    valor: 55,
    quantidade: 2,
    desenho: "regador",
  },
  {
    nome: "Estante do Cantinho Verde",
    categoria: "cantinho",
    descricao: "Uma ajuda maior para montar a prateleira onde tudo vai morar.",
    valor: 100,
    quantidade: 1,
    desenho: "vaso",
  },
];
