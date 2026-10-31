// Gera o código "Pix copia e cola" (BR Code estático, padrão EMV do Banco Central)
// já com o valor do presente, sem precisar de servidor nem de gateway de pagamento.

const Pix = (() => {
  // Remove acentos e caracteres fora do padrão aceito pelos bancos
  function limpar(texto, max) {
    return texto
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9 ]/g, "")
      .toUpperCase()
      .trim()
      .slice(0, max);
  }

  function campo(id, valor) {
    return id + String(valor.length).padStart(2, "0") + valor;
  }

  // CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF)
  function crc16(payload) {
    let crc = 0xffff;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let b = 0; b < 8; b++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        crc &= 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  function gerar({ chave, nome, cidade, valor, descricao = "", txid = "***" }) {
    const descLimpa = limpar(descricao, 40);
    let contaPix = campo("00", "br.gov.bcb.pix") + campo("01", chave.trim());
    // A descrição aparece no app do banco; só cabe se o campo total ficar ≤ 99
    if (descLimpa && contaPix.length + descLimpa.length + 4 <= 99) {
      contaPix += campo("02", descLimpa);
    }

    const payload =
      campo("00", "01") +
      campo("26", contaPix) +
      campo("52", "0000") +
      campo("53", "986") +
      (valor ? campo("54", Number(valor).toFixed(2)) : "") +
      campo("58", "BR") +
      campo("59", limpar(nome, 25) || "RECEBEDOR") +
      campo("60", limpar(cidade, 15) || "BRASIL") +
      campo("62", campo("05", txid)) +
      "6304";

    return payload + crc16(payload);
  }

  return { gerar, crc16 };
})();
