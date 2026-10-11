/* Documentary reference only. The existing FRBudgetCore remains the sole calculator. */
(function (w, d) {
  'use strict';
  var data = null, pending = null, root = null, currentId = '', observer = null;
  var money = function (n) { return Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var notices = {
    chuveiro: 'Chuveiro/Ducha e instalação elétrica são cadastros distintos, com R$ 80 e R$ 150 de base. Confirme infraestrutura e escopo; não some ambos para a mesma execução sem avaliação.',
    ele_chuveiro_eletrico: 'A entrada Chuveiro/Ducha tem outra base (R$ 80). Confirme a diferença de escopo antes de selecionar as duas entradas.',
    hid_filtro: 'Purificador também aparece em Eletrodomésticos (R$ 150 de base). Confirmar produto e ligações; evitar contratação duplicada.',
    ele_eletrodomesticos: 'As opções existentes não definem instalação de forno, cooktop ou coifa. TV não comprova fixação de suporte. Purificador também tem cadastro hidráulico próprio; confirme o escopo.',
    loucas: 'Cuba/Pia neste cadastro soma R$ 20 à base de R$ 150. Os cadastros Cuba/Pia e Cuba de Embutir/Sobrepor usam R$ 200. Confirmar conexões e desmontagem; não duplicar o mesmo trabalho.',
    hid_cuba_pia: 'Cuba/Pia em Louças usa base + adicional de R$ 170; este cadastro usa R$ 200. Confirmar escopo e conexões antes de escolher.',
    mar_cuba: 'Cuba/Pia em Louças usa R$ 170; este cadastro usa R$ 200. Confirmar instalação, produto e conexões.',
    fec_fechadura_eletronica: 'Sobrepor e embutir não são modalidades de preço distintas no FR atual. Avaliar recortes, porta, produto e conectividade antes da contratação.',
    portas: 'Confirmar kit ou folha, material, ferragens, recortes e instalação da fechadura. Não presumir fornecimento de produto ou ferragens.',
    pis_vinilico: 'Uso em áreas molhadas depende do sistema, produto, base e instruções do fabricante. Não presumir impermeabilidade nem uso em box. Confirmar regularização, rodapé e metragem mínima.',
    tinta: 'FR cobra por superfície pintada. Os pacotes Leroy usam área de piso do apartamento; não multiplicar nem comparar diretamente as duas unidades.',
    reforma_banheiro: 'FR não define metragem contratual neste pacote. Faixas Leroy sobrepostas não formam uma tabela contínua. Confirmar remoção, impermeabilização, revestimentos, materiais e responsabilidade técnica.',
    pac_reforma_residencial: 'Orçamento sob avaliação. O zero cadastrado não significa serviço gratuito e não inclui este escopo no total estimado. Envie o pedido para avaliação técnica.',
    cob_estrutura_madeira: 'R$ 2.800/m² é a unidade cadastrada, ainda sujeita à confirmação comercial. Não constitui erro comprovado ou preço de execução fechado.',
    cob_estrutura_ferro: 'R$ 3.500/m² é a unidade cadastrada, ainda sujeita à confirmação comercial. Não constitui erro comprovado ou preço de execução fechado.',
    cob_estrutura_steelframe: 'R$ 4.000/m² é a unidade cadastrada, ainda sujeita à confirmação comercial. Não constitui erro comprovado ou preço de execução fechado.',
    proj_bancada: 'Confirmar fabricação, mão de obra, pedra/material, recortes, transporte e instalação. Não presumir que todos esses itens estão incluídos na referência.',
    moveis: 'Confirmar fabricação, materiais, ferragens, montagem e instalação. A referência não substitui a lista de inclusões do contrato.',
    ele_tomada: 'FR descreve ponto novo/reposicionado; os kits Leroy podem tratar outro escopo. Não comparar um pacote à unidade sem validar infraestrutura e quantidades.'
  };
  function node(tag, cls, text) { var n = d.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function note(id) { return notices[id] || 'Confirmar mão de obra, materiais, equipamentos, preparação, infraestrutura, altura, remoção e descarte. Nada além do escopo confirmado deve ser presumido como incluído.'; }
  function load() {
    if (data) return Promise.resolve(data);
    if (pending) return pending;
    var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 6500);
    pending = fetch('/assets/data/price-reference-2026-10-08.json', { signal: controller.signal }).then(function (r) { if (!r.ok) throw new Error('Referência indisponível'); return r.json(); }).then(function (value) {
      if (value.version !== 1 || value.services.length !== 115 || value.references.length !== 94) throw new Error('Referência incompatível');
      data = value; return data;
    }).finally(function () { clearTimeout(timer); pending = null; });
    return pending;
  }
  function records(host, id) {
    host.replaceChildren();
    var service = w.__frCore && w.__frCore.SERVICES[id];
    host.appendChild(node('p', 'fr-price-scope', note(id)));
    if (service) {
      var selected = w.__frCore.appState.selectedServices.find(function (s) { return s.serviceId === id; });
      var item = selected || { serviceId: id, quantidade: 1, configs: {} };
      var editor = d.querySelector('[data-fr-price-service="' + id + '"]');
      if (editor) {
        var qty = d.querySelector('[data-action="updateServiceQty"]');
        var configs = {};
        d.querySelectorAll('[data-action="updateServiceConfig"][aria-pressed="true"]').forEach(function (button) { configs[button.dataset.configKey] = Number(button.dataset.optionIdx); });
        item = { serviceId: id, quantidade: Number(qty && qty.value), configs: configs };
      }
      // No reimplementation of base/additional/quantity/visit arithmetic.
      var quote = Number.isFinite(item.quantidade) && item.quantidade > 0 ? w.FRBudgetCore.calculateBudget(w.__frCore.SERVICES, { selectedServices: [item], environment: w.__frCore.appState.environment, descontoAplicado: 0, paymentMethod: '' }) : null;
      if (Number(service.preco_base) === 0) host.appendChild(node('p', null, 'FR: sob avaliação — escopo fora da referência calculada.'));
      else if (quote) host.appendChild(node('p', 'fr-price-fr', 'FR base atual: ' + money(service.preco_base) + '/' + service.unidade + '. Cenário isolado: ' + item.quantidade + ' ' + service.unidade + ', nas condições do ambiente atual, sem cupom/desconto: ' + money(quote.total) + ' (visita cobrada: ' + money(quote.visitCharged) + ').'));
      else host.appendChild(node('p', 'fr-price-fr', 'Informe uma quantidade válida no editor para consultar o cenário isolado.'));
      host.appendChild(node('p', null, 'O cenário isolado não é o total do seu orçamento. Visita de R$ 99 até R$ 450 de subtotal; isenção somente acima de R$ 450. A faixa ±12% não é pesquisa de mercado.'));
    }
    var references = data.references.filter(function (r) { return !id || r.serviceIds.includes(id); });
    if (!references.length) host.appendChild(node('p', null, 'Sem correspondência específica verificada nesta coleta. Isso não significa ausência do serviço na Leroy.'));
    references.forEach(function (r) {
      var card = node('article', 'fr-price-card');
      var link = node('a', null, r.name + ' · código ' + r.code); link.href = r.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      card.append(link, node('strong', null, r.price !== null ? 'Observado em 08/10/2026: ' + money(r.price) : 'Consultar: ' + r.observed), node('p', null, 'Unidade/modalidade: ' + r.unit), node('p', null, r.note));
      host.appendChild(card);
    });
  }
  function openService(details, id) {
    if (!details.open) return;
    var host = details.querySelector('.fr-price-results');
    host.textContent = 'Carregando referência documental…';
    load().then(function () { if (details.isConnected && details.open) records(host, id); }).catch(function () { host.replaceChildren(node('p', null, 'Referência indisponível. O orçamento permanece funcionando; feche e abra novamente para tentar.')); });
  }
  function decorateEditor() {
    d.querySelectorAll('[data-fr-price-service]:not([data-fr-price-ready])').forEach(function (host) {
      host.dataset.frPriceReady = 'true'; var id = host.dataset.frPriceService;
      host.appendChild(node('p', 'fr-price-scope', note(id)));
      var details = node('details', 'fr-price-details'); details.append(node('summary', null, 'Consultar referência Leroy e limites de escopo'), node('div', 'fr-price-results'));
      details.addEventListener('toggle', function () { openService(details, id); }); host.appendChild(details);
    });
  }
  function mount() {
    if (!w.__frCore || !d.getElementById('fr-quick-contact')) return;
    if (!root) {
      root = node('section', 'fr-price'); root.id = 'fr-price-reference'; root.setAttribute('aria-labelledby', 'fr-price-title');
      var h = node('h2', null, 'Escopo antes do preço'); h.id = 'fr-price-title';
      root.append(h, node('p', null, 'Pesquisa documental de 08/10/2026: 115 serviços FR, 94 códigos Leroy e 403 opções FR. Os preços observados não são cotações atuais por CEP. Não indicam economia ou contratos equivalentes.'));
      var details = node('details', 'fr-price-details'); details.appendChild(node('summary', null, 'Explorar o comparativo e as pendências do catálogo'));
      var body = node('div'), label = node('label', null, 'Serviço FR'), select = node('select'); select.id = 'fr-price-service-select'; label.htmlFor = select.id;
      select.appendChild(new Option('Todos os códigos Leroy da pesquisa', ''));
      Object.values(w.__frCore.SERVICES).forEach(function (s) { select.appendChild(new Option(s.nome, s.id)); });
      var results = node('div', 'fr-price-results'); results.setAttribute('aria-live', 'polite');
      select.addEventListener('change', function () { currentId = select.value; if (data) records(results, currentId); });
      body.append(label, select, results); details.appendChild(body); root.appendChild(details);
      var gaps = node('details', 'fr-price-details'); gaps.appendChild(node('summary', null, 'Novas famílias: solicitar avaliação de escopo e preço')); var gapBody = node('div'); gaps.appendChild(gapBody); root.appendChild(gaps);
      gaps.addEventListener('toggle', function () { if (!gaps.open) return; gapBody.textContent = 'Carregando…'; load().then(function () { gapBody.replaceChildren(node('p', null, 'Itens abaixo são propostas de catálogo, não ofertas ou preços FR aprovados.'));
        data.gaps.forEach(function (g) { var item = node('article', 'fr-price-card'); item.append(node('h3', null, g.family), node('p', null, g.state), node('p', null, g.recommendation), node('p', null, 'Sob avaliação de disponibilidade, escopo e preço FR. Não incluído no total calculado.'));
          var contact = node('a', null, 'Solicitar avaliação: ' + g.family), base = w.FR_SITE_CONFIG && w.FR_SITE_CONFIG.contacts.whatsapp;
          if (base) { var url = new URL(base); url.searchParams.set('text', 'Olá, Franco Romeu. Gostaria de avaliar disponibilidade, escopo e orçamento para: ' + g.family + '. Condições a confirmar: ' + g.recommendation); contact.href = url.href; contact.target = '_blank'; contact.rel = 'noopener noreferrer'; item.appendChild(contact); }
          gapBody.appendChild(item); });
        var list = node('ol'); data.priorities.forEach(function (p) { list.appendChild(node('li', null, p)); }); gapBody.appendChild(list);
      }).catch(function () { gapBody.textContent = 'Referência indisponível; tente novamente abrindo este painel.'; }); });
      details.addEventListener('toggle', function () { if (!details.open) return; results.textContent = 'Carregando…'; load().then(function () { records(results, currentId); }).catch(function () { results.textContent = 'Referência indisponível. Feche e abra para tentar; a calculadora continua funcionando.'; }); });
      d.getElementById('fr-quick-contact').after(root);
    }
    if (!observer) { observer = new MutationObserver(decorateEditor); var host = d.getElementById('step-content-container'); if (host) observer.observe(host, { childList: true, subtree: true }); }
    decorateEditor();
  }
  d.addEventListener('frCoreReady', mount); d.addEventListener('DOMContentLoaded', mount);
  d.addEventListener('input', function (e) { if (!e.target.matches('[data-action="updateServiceQty"]')) return; var panel = d.querySelector('[data-fr-price-service] .fr-price-details[open]'); if (panel && data) records(panel.querySelector('.fr-price-results'), panel.parentElement.dataset.frPriceService); });
  w.FRPriceReference = { version: 1, note: note, load: load, mount: mount };
  mount();
})(window, document);
