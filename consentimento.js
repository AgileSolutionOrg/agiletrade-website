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

  /**
   * Apaga os cookies do Google Analytics (_ga e _ga_<id>). Eles sao gravados no
   * dominio raiz com ponto (".agiletrade.com.br"), entao apagar so no host nao
   * basta: tenta o host e cada dominio pai.
   */
  function apagarCookiesAnalytics() {
    var nomes = document.cookie.split(";").map(function (c) {
      return c.split("=")[0].trim();
    }).filter(function (n) {
      return n === "_ga" || n.indexOf("_ga_") === 0 || n === "_gid";
    });
    var partes = location.hostname.split(".");
    var dominios = [""];
    for (var i = 0; i < partes.length - 1; i++) {
      dominios.push("; domain=." + partes.slice(i).join("."));
    }
    nomes.forEach(function (nome) {
      dominios.forEach(function (d) {
        document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
      });
    });
  }

  function montarAviso() {
    if (document.getElementById("at-aviso-cookies")) return;
    var caixa = document.createElement("div");
    caixa.id = "at-aviso-cookies";
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
      var tinhaAceitado = ler() === "sim";
      gravar("nao");
      fechar();
      // Revogacao (LGPD art. 8 §5): o script do Analytics ja carregado nao se
      // descarrega sozinho. Apagar os cookies e recarregar e o que faz a
      // medicao parar de fato — "recusar" que segue medindo nao e revogacao.
      if (tinhaAceitado || window.__atAnalyticsCarregado) {
        // Primeiro desliga o GA ja carregado: sem isso ele regrava o cookie de
        // sessao (_ga_<id>) no unload da pagina, depois de apagado — o teste
        // de 25/10 pegou exatamente isso.
        window["ga-disable-" + ID_GA] = true;
        if (typeof window.gtag === "function") {
          window.gtag("consent", "update", { analytics_storage: "denied" });
        }
        apagarCookiesAnalytics();
        location.reload();
      }
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

  /**
   * "Preferencias de cookies": qualquer elemento com data-preferencias-cookies
   * (o link do rodape de cada pagina) reabre o aviso. A ANPD pede que revogar
   * seja tao simples quanto aceitar; antes, a unica saida era limpar os dados
   * do site no navegador.
   */
  function ligarPreferencias() {
    var gatilhos = document.querySelectorAll("[data-preferencias-cookies]");
    for (var i = 0; i < gatilhos.length; i++) {
      gatilhos[i].addEventListener("click", function (ev) {
        ev.preventDefault();
        montarAviso();
      });
    }
  }

  function iniciar() {
    ligarPreferencias();
    var escolha = ler();
    if (escolha === "sim") {
      carregarAnalytics();
      return;
    }
    if (escolha === "nao") {
      // Rede de seguranca: qualquer cookie de medicao que tenha sobrado de
      // quando a pessoa aceitava some aqui, a cada pagina aberta.
      apagarCookiesAnalytics();
      return;
    }
    montarAviso();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
