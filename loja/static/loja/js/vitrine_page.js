function handleAdd(btn, id, nome, preco, imagem) {
  addToCart({ id, nome, preco, imagem: imagem || '' });
  btn.classList.add('ok');
  btn.textContent = '✓';
  setTimeout(function() {
    btn.classList.remove('ok');
    btn.textContent = '+';
  }, 1200);
}