/**
 * Consentimento de cookies e carregamento condicional do Google Analytics.
 *
 * Antes disto o GA4 era carregado direto no <head>, sem perguntar nada — e a
 * Politica de Privacidade promete o contrario. Aqui o Analytics so entra na
 * pagina DEPOIS do "Aceitar": enquanto nao houver escolha, nenhum script de
 * medicao e baixado e nenhum cookie de medicao e criado.
 *
 * A escolha fica no localStorage do proprio visitante. Toda leitura e escrita
 * esta dentro de try/catch: em aba privada, ou com dados do site bloqueados, o
 * acesso ao localStorage LANCA excecao, e um erro ai derrubaria o resto do
 * script — a pessoa ficaria com o aviso na tela para sempre, sem conseguir
 * fechar.
 *
 * Trocar por aviso simples (GA4 sempre ligado, banner so informando) e uma
 * decisao de negocio: mede mais visitas, mas e defensavel so se a ANPD aceitar
 * legitimo interesse para medicao de audiencia. Como esta, nao depende disso.
 */
(function () {
  "use strict";

  var CHAVE = "at_consentimento_analytics";
  var ID_GA = "G-M1P1K8PHWL";

  function ler() {
    try {
      return window.localStorage.getItem(CHAVE);
    } catch (e) {
      return null;
    }
  }

  function gravar(valor) {
    try {
      window.localStorage.setItem(CHAVE, valor);
    } catch (e) {
      // Sem onde guardar: o aviso volta na proxima visita. Preferivel a quebrar.
    }
  }

  function carregarAnalytics() {
    if (window.__atAnalyticsCarregado) return;
    window.__atAnalyticsCarregado = true;

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID_GA;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", ID_GA, { anonymize_ip: true });
  }

  function montarAviso() {
    var caixa = document.createElement("div");
    caixa.setAttribute("role", "dialog");
    caixa.setAttribute("aria-live", "polite");
    caixa.setAttribute("aria-label", "Aviso sobre cookies");
    caixa.style.cssText = [
      "position:fixed",
      "left:16px",
      "right:16px",
      "bottom:16px",
      "z-index:9999",
      "max-width:760px",
      "margin:0 auto",
      "background:#ffffff",
      "color:#44474f",
      "border:1px solid #e2e2e6",
      "border-radius:16px",
      "box-shadow:0 12px 32px rgba(0,0,0,.18)",
      "padding:20px",
      "font:14px/1.6 Inter,system-ui,sans-serif",
      "display:flex",
      "flex-wrap:wrap",
      "gap:16px",
      "align-items:center",
      "justify-content:space-between",
    ].join(";");

    var texto = document.createElement("p");
    texto.style.cssText = "margin:0;flex:1 1 320px;min-width:260px";
    texto.innerHTML =
      "Usamos uma ferramenta de medição de audiência para entender como as pessoas chegam até aqui. " +
      'Ela só é carregada se você aceitar. Detalhes na <a href="privacidade.html" style="color:#c00011">Política de Privacidade</a>.';

    var botoes = document.createElement("div");
    botoes.style.cssText = "display:flex;gap:10px;flex:0 0 auto";

    function botao(rotulo, principal) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = rotulo;
      b.style.cssText = principal
        ? "background:#c00011;color:#fff;border:0;border-radius:8px;padding:11px 22px;font-weight:700;cursor:pointer"
        : "background:#fff;color:#44474f;border:1px solid #c4c6d0;border-radius:8px;padding:11px 22px;font-weight:600;cursor:pointer";
      return b;
    }

    var recusar = botao("Recusar", false);
    var aceitar = botao("Aceitar", true);

    function fechar() {
      if (caixa.parentNode) caixa.parentNode.removeChild(caixa);
    }

    recusar.addEventListener("click", function () {
      gravar("nao");
      fechar();
    });
    aceitar.addEventListener("click", function () {
      gravar("sim");
      fechar();
      carregarAnalytics();
    });

    botoes.appendChild(recusar);
    botoes.appendChild(aceitar);
    caixa.appendChild(texto);
    caixa.appendChild(botoes);
    document.body.appendChild(caixa);
  }

  function iniciar() {
    var escolha = ler();
    if (escolha === "sim") {
      carregarAnalytics();
      return;
    }
    if (escolha === "nao") return;
    montarAviso();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
