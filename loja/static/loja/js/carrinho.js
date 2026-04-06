const CART_KEY = 'sinale_carrinho_v1';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateBadge();
}

function addToCart(produto) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === produto.id);
  if (idx >= 0) {
    cart[idx].qtd += 1;
    if (produto.imagem) cart[idx].imagem = produto.imagem;
  } else {
    cart.push({ ...produto, qtd: 1 });
  }
  saveCart(cart);
  showToast(produto.nome + ' adicionado ao carrinho');
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function updateQtd(id, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx < 0) return;
  cart[idx].qtd = Math.max(1, cart[idx].qtd + delta);
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function updateBadge() {
  const total = getCart().reduce((s, i) => s + i.qtd, 0);
  const el = document.getElementById('header-count');
  if (el) el.textContent = total;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function getCsrf() {
  const m = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
  return m ? m.pop() : '';
}

document.addEventListener('DOMContentLoaded', function() {
  updateBadge();
});