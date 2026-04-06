// WPP_NUM é injetado pelo template via data attribute no body
let WPP_NUM = '';

function fmt(val) {
  return 'R$ ' + Number(val).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function renderCarrinho() {
  const cart = getCart();
  const content = document.getElementById('cart-content');
  const resumoItens = document.getElementById('resumo-itens');
  const resumoTotal = document.getElementById('resumo-total');
  const wppBtn = document.getElementById('whatsapp-btn');
  const actionsRow = document.getElementById('actions-row');

  if (!cart.length) {
    content.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h2>Carrinho vazio</h2>
        <p>Adicione produtos da vitrine para continuar.</p>
        <a href="/" class="btn btn-primary" style="margin-top:1.5rem;">Ver produtos</a>
      </div>`;
    resumoItens.innerHTML = '';
    resumoTotal.textContent = 'R$ 0,00';
    wppBtn.disabled = true;
    actionsRow.style.display = 'none';
    return;
  }

  actionsRow.style.display = 'block';
  wppBtn.disabled = false;

  let html = '<div class="itens-lista">';
  cart.forEach(item => {
    html += `
      <div class="item-row" id="item-${item.id}">
        <div class="item-thumb">
          ${item.imagem
            ? `<img src="${item.imagem}" alt="${item.nome}">`
            : '<div class="item-thumb-empty">🪧</div>'}
        </div>
        <div style="flex:1">
          <div class="item-nome">${item.nome}</div>
          <div class="item-preco-unit">${fmt(item.preco)} / un.</div>
        </div>
        <div class="item-controles">
          <button class="ctrl-btn" onclick="alterarQtd(${item.id}, -1)">−</button>
          <span class="item-qtd" id="qtd-${item.id}">${item.qtd}</span>
          <button class="ctrl-btn" onclick="alterarQtd(${item.id}, +1)">+</button>
        </div>
        <div class="item-subtotal" id="sub-${item.id}">${fmt(item.preco * item.qtd)}</div>
        <button class="item-del" onclick="deletarItem(${item.id})" title="Remover">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>`;
  });
  html += '</div>';
  content.innerHTML = html;

  const total = cart.reduce((s, i) => s + i.preco * i.qtd, 0);
  resumoItens.innerHTML = cart.map(item => `
    <div class="resumo-linha">
      <span>${item.qtd}× ${item.nome}</span>
      <span>${fmt(item.preco * item.qtd)}</span>
    </div>`).join('');
  resumoTotal.textContent = fmt(total);
}

function alterarQtd(id, delta) {
  updateQtd(id, delta);
  renderCarrinho();
}

function deletarItem(id) {
  removeFromCart(id);
  renderCarrinho();
}

function limparCarrinho() {
  if (confirm('Deseja limpar todos os itens do carrinho?')) {
    clearCart();
    renderCarrinho();
  }
}

async function enviarPedido() {
  const cart = getCart();
  if (!cart.length) return;

  const obs = document.getElementById('observacoes').value.trim();
  const total = cart.reduce((s, i) => s + i.preco * i.qtd, 0);

  try {
    await fetch('/api/capturar-pedido/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrf()
      },
      body: JSON.stringify({ itens: cart, total, observacoes: obs })
    });
  } catch (_) {}

  let msg = '🛒 *Pedido via Sinale*\n\n';
  cart.forEach(item => {
    msg += `• ${item.qtd}× ${item.nome} — ${fmt(item.preco * item.qtd)}\n`;
  });
  msg += `\n💰 *Total: ${fmt(total)}*`;
  if (obs) msg += `\n\n📝 *Obs:* ${obs}`;

  window.open(`https://wa.me/${WPP_NUM}?text=${encodeURIComponent(msg)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
  WPP_NUM = document.body.dataset.wpp || '';
  renderCarrinho();
  window.addEventListener('storage', renderCarrinho);
});