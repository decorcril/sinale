document.addEventListener('DOMContentLoaded', function() {
  var el = document.getElementById('produto-data');
  var produtoId = parseInt(el.dataset.id);
  var produtoNome = el.dataset.nome;
  var produtoPreco = parseFloat(el.dataset.preco.replace(',', '.'));
  var produtoImagem = el.dataset.imagem || '';
  var qtdAtual = 1;

  document.getElementById('qtd-menos').addEventListener('click', function() {
    qtdAtual = Math.max(1, qtdAtual - 1);
    document.getElementById('qtd').textContent = qtdAtual;
  });

  document.getElementById('qtd-mais').addEventListener('click', function() {
    qtdAtual += 1;
    document.getElementById('qtd').textContent = qtdAtual;
  });

  document.getElementById('add-btn').addEventListener('click', function() {
    var cart = getCart();
    var idx = cart.findIndex(function(i) { return i.id === produtoId; });
    if (idx >= 0) {
      cart[idx].qtd += qtdAtual;
    } else {
      cart.push({ id: produtoId, nome: produtoNome, preco: produtoPreco, imagem: produtoImagem, qtd: qtdAtual });
    }
    saveCart(cart);
    showToast(qtdAtual + 'x ' + produtoNome + ' adicionado ao carrinho');

    var btn = document.getElementById('add-btn');
    btn.classList.add('ok');
    btn.textContent = '✓ Adicionado';
    setTimeout(function() {
      btn.classList.remove('ok');
      btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> Adicionar ao Carrinho';
    }, 1500);
  });
});