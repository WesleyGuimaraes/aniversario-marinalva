// Monta a página a partir do config.js e controla o fluxo de presentear

(() => {
  const $ = (sel) => document.querySelector(sel);
  const reais = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const chaveConfigurada = CONFIG.pix.chave && CONFIG.pix.chave !== "SUA_CHAVE_PIX_AQUI";
  const planilhaAtiva = Boolean(CONFIG.planilhaUrl);

  // Quantas vezes cada item já foi presenteado (vem da planilha)
  let contagem = {};
  let categoriaAtual = "todos";
  let ordemAtual = "padrao";

  const idDe = (p) => p.nome;
  const restantes = (p) =>
    p.quantidade == null ? Infinity : Math.max(0, p.quantidade - (contagem[idDe(p)] || 0));

  // ---------- Topo ----------
  function montarTopo() {
    const nome = CONFIG.aniversariante;
    $("#titulo").textContent = CONFIG.idade ? `${nome} faz ${CONFIG.idade}!` : `Aniversário da ${nome}`;
    document.title = `Lista de presentes · ${nome}`;
    $("#btn-whats").textContent = `Avisar a ${nome} no WhatsApp`;

    const partes = [];
    if (CONFIG.data) {
      const [a, m, d] = CONFIG.data.split("-").map(Number);
      const dia = new Date(a, m - 1, d).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
      partes.push(dia.charAt(0).toUpperCase() + dia.slice(1));
    }
    if (CONFIG.horario) partes.push(CONFIG.horario);
    if (CONFIG.local) partes.push(CONFIG.local);
    $("#detalhes").textContent = partes.join(" · ");
    $("#mensagem").textContent = CONFIG.mensagem;

    $("#hero-desenhos").innerHTML = [
      Desenhos.grupo("coluna", 10, 10, 1.05),
      Desenhos.grupo("roseta", 120, 40, 0.85),
      Desenhos.grupo("bola", 200, 30, 0.95),
      Desenhos.grupo("babosa", 290, 22, 1.0),
    ].join("");
  }

  // ---------- Lista ----------
  function selo(p) {
    if (p.quantidade == null) return "";
    const r = restantes(p);
    if (r === 0) return `<span class="selo selo-esgotado">Esgotado</span>`;
    return `<span class="selo">${r === 1 ? "Resta 1" : `Restam ${r}`}</span>`;
  }

  function montarGrade() {
    const itens = PRESENTES
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => categoriaAtual === "todos" || p.categoria === categoriaAtual)
      // esgotados sempre vão para o fim; entre os demais, vale a ordem escolhida
      .sort((a, b) => {
        const esgotados = (restantes(a.p) === 0) - (restantes(b.p) === 0);
        if (esgotados) return esgotados;
        if (ordemAtual === "menor") return a.p.valor - b.p.valor || a.i - b.i;
        if (ordemAtual === "maior") return b.p.valor - a.p.valor || a.i - b.i;
        return a.i - b.i;
      });

    $("#grade").innerHTML = itens
      .map(({ p, i }) => {
        const esgotado = restantes(p) === 0;
        const figura = p.imagem
          ? `<img src="${p.imagem}" alt="${p.nome}" loading="lazy">`
          : Desenhos.svg(p.desenho);
        return `
          <article class="card${esgotado ? " esgotado" : ""}">
            <div class="card-figura cat-${p.categoria}">${figura}${selo(p)}</div>
            <div class="card-corpo">
              <h3>${p.nome}</h3>
              <p>${p.descricao}</p>
              <div class="card-rodape">
                <span class="preco">${reais(p.valor)}</span>
                ${esgotado
                  ? `<button class="btn btn-primario" disabled>Já presenteado</button>`
                  : `<button class="btn btn-primario" data-presente="${i}">Presentear</button>`}
              </div>
            </div>
          </article>`;
      })
      .join("");
  }

  async function carregarContagem() {
    if (!planilhaAtiva) return;
    try {
      const resposta = await fetch(CONFIG.planilhaUrl);
      const dados = await resposta.json();
      contagem = dados.contagem || {};
      montarGrade();
    } catch (erro) {
      console.warn("Não foi possível carregar a planilha:", erro);
    }
  }

  document.querySelector(".filtros").addEventListener("click", (e) => {
    const botao = e.target.closest(".filtro");
    if (!botao) return;
    document.querySelectorAll(".filtro").forEach((b) => b.classList.toggle("ativo", b === botao));
    categoriaAtual = botao.dataset.cat;
    montarGrade();
  });

  // "Ver a lista" desliza até a lista em vez de pular direto
  function deslizarAte(destino, duracao = 800) {
    const inicio = window.scrollY;
    const distancia = destino - inicio;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !distancia) {
      window.scrollTo(0, destino);
      return;
    }
    const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let t0 = null;
    function passo(agora) {
      if (t0 === null) t0 = agora;
      const t = Math.min((agora - t0) / duracao, 1);
      window.scrollTo(0, inicio + distancia * suave(t));
      if (t < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  $(".hero-inner .btn").addEventListener("click", (e) => {
    e.preventDefault();
    deslizarAte($("#lista").getBoundingClientRect().top + window.scrollY);
  });

  $("#ordem").addEventListener("change", (e) => {
    ordemAtual = e.target.value;
    montarGrade();
  });

  $("#grade").addEventListener("click", (e) => {
    const botao = e.target.closest("[data-presente]");
    if (botao) abrirModal(PRESENTES[botao.dataset.presente]);
  });

  $("#form-livre").addEventListener("submit", (e) => {
    e.preventDefault();
    const valor = parseFloat($("#valor-livre").value);
    if (valor > 0) abrirModal({ nome: "Contribuição livre", valor, quantidade: null, desenho: "regador" });
  });

  // ---------- Modal ----------
  let atual = null;
  let convidado = "";
  let recado = "";
  const modal = $("#modal");

  function mostrarEtapa(id) {
    ["#etapa-nome", "#etapa-pix", "#etapa-obrigado"].forEach((e) => ($(e).hidden = e !== id));
  }

  function abrirModal(presente) {
    atual = presente;
    $("#modal-titulo").textContent = presente.nome;
    $("#modal-valor").textContent = reais(presente.valor);
    mostrarEtapa("#etapa-nome");
    modal.hidden = false;
    document.body.classList.add("travado");
    setTimeout(() => $("#convidado").focus(), 50);
  }

  function fecharModal() {
    modal.hidden = true;
    document.body.classList.remove("travado");
  }

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-fechar]")) fecharModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) fecharModal();
  });

  $("#form-nome").addEventListener("submit", (e) => {
    e.preventDefault();
    convidado = $("#convidado").value.trim();
    recado = $("#recado").value.trim();
    mostrarPix();
  });

  $("#btn-voltar").addEventListener("click", () => mostrarEtapa("#etapa-nome"));

  function mostrarPix() {
    const codigo = Pix.gerar({
      chave: CONFIG.pix.chave,
      nome: CONFIG.pix.nome,
      cidade: CONFIG.pix.cidade,
      valor: atual.valor,
      descricao: atual.nome,
    });

    $("#pix-titulo").textContent = atual.nome;
    $("#pix-valor").textContent = reais(atual.valor);
    $("#pix-codigo").value = codigo;
    $("#aviso-config").hidden = chaveConfigurada;
    const paguei = $("#btn-paguei");
    paguei.disabled = false;
    paguei.textContent = "Já fiz o Pix";

    const qr = $("#qrcode");
    qr.innerHTML = "";
    if (window.QRCode) {
      new QRCode(qr, { text: codigo, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M });
    } else {
      qr.innerHTML = "<p class='dica'>Não foi possível carregar o QR Code. Use o copia e cola abaixo.</p>";
    }

    mostrarEtapa("#etapa-pix");
  }

  // Registra a compra na planilha e mostra o agradecimento
  $("#btn-paguei").addEventListener("click", async () => {
    const botao = $("#btn-paguei");
    let aviso = "";

    if (planilhaAtiva) {
      botao.disabled = true;
      botao.textContent = "Registrando…";
      try {
        // text/plain evita a checagem de CORS que o Google Apps Script não responde
        const resposta = await fetch(CONFIG.planilhaUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            id: idDe(atual),
            presente: atual.nome,
            valor: atual.valor,
            convidado,
            recado,
            limite: atual.quantidade ?? null,
          }),
        });
        const dados = await resposta.json();
        if (dados.contagem) contagem = dados.contagem;
        montarGrade();
        if (dados.esgotado) {
          aviso =
            "Seu presente foi registrado! Só um detalhe: outra pessoa escolheu esse mesmo item " +
            "enquanto você pagava. Não tem problema nenhum — se quiser, avise no WhatsApp.";
        }
      } catch (e) {
        console.warn("Falha ao registrar na planilha:", e);
        aviso = "Não conseguimos registrar o seu presente automaticamente. Por favor, avise no WhatsApp.";
      }
    }

    $("#obrigado-desenho").innerHTML = Desenhos.svg(atual.desenho);
    $("#obrigado-texto").textContent =
      aviso || `Seu presente (${atual.nome}, ${reais(atual.valor)}) foi registrado. A ${CONFIG.aniversariante} vai adorar!`;

    const whats = $("#btn-whats");
    if (CONFIG.whatsapp) {
      const texto =
        `Oi! Aqui é ${convidado} 🌵\n` +
        `Acabei de te presentear com: *${atual.nome}* (${reais(atual.valor)}).` +
        (recado ? `\n\n${recado}` : "");
      whats.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
      whats.hidden = false;
    } else {
      whats.hidden = true;
    }

    mostrarEtapa("#etapa-obrigado");
  });

  $("#btn-copiar").addEventListener("click", async () => {
    const campo = $("#pix-codigo");
    try {
      await navigator.clipboard.writeText(campo.value);
    } catch {
      campo.select();
      document.execCommand("copy");
    }
    avisar("Código Pix copiado!");
  });

  let timerToast;
  function avisar(texto) {
    const t = $("#toast");
    t.textContent = texto;
    t.classList.add("visivel");
    clearTimeout(timerToast);
    timerToast = setTimeout(() => t.classList.remove("visivel"), 2200);
  }

  montarTopo();
  montarGrade();
  carregarContagem();
})();
