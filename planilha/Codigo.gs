// =====================================================================
//  Script da planilha de presentes (Google Apps Script)
//
//  Como instalar:
//  1. Crie uma planilha nova no Google Sheets (ex.: "Presentes Marinalva").
//  2. Menu Extensões → Apps Script. Apague o que estiver lá e cole este arquivo.
//  3. Salve (ícone de disquete).
//  4. Implantar → Nova implantação → engrenagem → "App da Web".
//       Executar como: Eu
//       Quem pode acessar: Qualquer pessoa
//     Clique em Implantar e autorize com sua conta Google.
//  5. Copie a "URL do app da Web" (termina em /exec) e cole em
//     CONFIG.planilhaUrl, no arquivo config.js do site.
//
//  Se alterar este script depois: Implantar → Gerenciar implantações →
//  lápis → Versão: "Nova versão" → Implantar (a URL continua a mesma).
// =====================================================================

const ABA = "Compras";
const CABECALHO = ["Data", "Presente", "ID", "Valor (R$)", "Convidado", "Recado", "Confirmado no banco?"];

function aba_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(CABECALHO);
    aba.setFrozenRows(1);
    aba.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm");
    aba.getRange("D:D").setNumberFormat("R$ #,##0.00");
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight("bold");
  }
  return aba;
}

// Quantas vezes cada presente (pelo ID) já foi comprado
function contar_() {
  const aba = aba_();
  const linhas = aba.getLastRow() - 1;
  const contagem = {};
  if (linhas < 1) return contagem;
  aba.getRange(2, 3, linhas, 1).getValues().forEach(([id]) => {
    if (id) contagem[id] = (contagem[id] || 0) + 1;
  });
  return contagem;
}

// Evita que um nome tipo "=SOMA(...)" vire fórmula na planilha
function texto_(valor, max) {
  const t = String(valor || "").slice(0, max);
  return /^[=+\-@]/.test(t) ? "'" + t : t;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// O site pede a contagem ao abrir a página
function doGet() {
  return json_({ ok: true, contagem: contar_() });
}

// O site registra uma compra quando o convidado clica em "Já fiz o Pix"
function doPost(e) {
  const trava = LockService.getScriptLock();
  trava.waitLock(10000); // um registro por vez, para não passar do limite
  try {
    const dados = JSON.parse(e.postData.contents);
    const contagem = contar_();
    const jaComprados = contagem[dados.id] || 0;
    // O convidado só chega aqui depois de pagar, então registramos mesmo se
    // outra pessoa tiver levado a última unidade segundos antes.
    const passouDoLimite = Boolean(dados.limite) && jaComprados >= dados.limite;

    aba_().appendRow([
      new Date(),
      texto_(dados.presente, 80),
      texto_(dados.id, 80),
      Number(dados.valor) || 0,
      texto_(dados.convidado, 80),
      texto_(dados.recado, 500),
      passouDoLimite ? "Item já estava esgotado — confira" : "",
    ]);
    contagem[dados.id] = jaComprados + 1;
    return json_({ ok: true, esgotado: passouDoLimite, contagem });
  } finally {
    trava.releaseLock();
  }
}
