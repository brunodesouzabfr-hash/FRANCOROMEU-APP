/* Page the existing quote template. No financial calculations or catalog writes. */
(function (w) {
  'use strict';
  async function render(root) {
    var d = root.ownerDocument, pages = [], height = 1131, header = root.firstElementChild;
    var blocks = Array.from(root.children).slice(1), page, body, table;
    // The original footer was absolutely positioned relative to the entire quote.
    var footer = blocks.pop();
    root.style.display = 'none';
    function newPage() {
      page = d.createElement('div'); page.className = 'fr-pdf-page';
      page.style.cssText = 'position:relative;box-sizing:border-box;width:800px;height:' + height + 'px;padding:40px;background:#123f34;color:#e6d6b5;font-family:Times New Roman,serif;overflow:hidden';
      var heading = header.cloneNode(true); heading.style.marginBottom = '20px';
      var logo = heading.querySelector('img'); if (logo) logo.style.objectFit = 'contain';
      page.appendChild(heading); root.parentElement.appendChild(page);
      body = d.createElement('div'); body.style.cssText = 'overflow:visible;display:flow-root'; page.appendChild(body);
      var foot = footer.cloneNode(true); foot.style.cssText = 'position:absolute;bottom:24px;left:40px;right:40px;text-align:center;border-top:1px solid #1a6069;padding-top:10px;color:#e6d6b5;font-size:10px';
      foot.querySelectorAll('p').forEach(function (p) { p.style.margin = '4px 0'; });
      var slogan = foot.querySelector('p:last-child'); if (slogan) slogan.textContent = 'MATÉRIA · MÉTODO · EXECUÇÃO CONTROLADA';
      var counter = d.createElement('p'); counter.dataset.frPdfCounter = 'true'; foot.appendChild(counter); page.appendChild(foot);
      pages.push(page); table = null;
    }
    function fits() { return body.getBoundingClientRect().bottom <= page.getBoundingClientRect().top + height - 95; }
    function appendBlock(block) {
      var copy = block.cloneNode(true); body.appendChild(copy);
      if (!fits()) { copy.remove(); newPage(); body.appendChild(copy); }
      if (!fits()) throw new Error('Um bloco da estimativa excede uma página. Reduza o texto e tente novamente.');
    }
    newPage();
    for (var block of blocks) {
      if (block.tagName !== 'TABLE') { appendBlock(block); table = null; continue; }
      function newTable() {
        table = block.cloneNode(false); table.style.marginBottom = '16px';
        if (block.tHead) table.appendChild(block.tHead.cloneNode(true));
        table.appendChild(d.createElement('tbody')); body.appendChild(table);
      }
      newTable();
      for (var row of Array.from(block.querySelectorAll('tbody tr'))) {
        var copy = row.cloneNode(true); table.tBodies[0].appendChild(copy);
        if (!fits()) {
          copy.remove(); if (!table.tBodies[0].children.length) table.remove();
          newPage(); newTable(); table.tBodies[0].appendChild(copy);
        }
        if (!fits()) throw new Error('A descrição de um serviço excede uma página. Revise o texto antes de exportar.');
      }
    }
    var pdf = new w.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    for (var index = 0; index < pages.length; index++) {
      pages[index].querySelector('[data-fr-pdf-counter]').textContent = 'Página ' + (index + 1) + ' de ' + pages.length + ' · Estimativa orientativa, sujeita à avaliação técnica';
      var canvas = await w.html2canvas(pages[index], { scale: 1.5, backgroundColor: '#123f34', useCORS: true });
      if (index) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      canvas.width = canvas.height = 0;
    }
    return { pdf: pdf, pages: pages.length };
  }
  w.FRQuotePDF = { render: render, version: 1 };
})(window);
