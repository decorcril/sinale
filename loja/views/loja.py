import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.conf import settings
from loja.models import Produto, Categoria, PedidoCapturado


def vitrine(request):
    categoria_slug = request.GET.get('categoria')
    categorias = Categoria.objects.all()
    produtos = Produto.objects.filter(disponivel=True)

    if categoria_slug:
        produtos = produtos.filter(categoria__slug=categoria_slug)

    context = {
        'produtos': produtos,
        'categorias': categorias,
        'categoria_ativa': categoria_slug,
        'whatsapp_number': settings.WHATSAPP_NUMBER,
    }
    return render(request, 'loja/vitrine.html', context)


def detalhe_produto(request, slug):
    produto = get_object_or_404(Produto, slug=slug, disponivel=True)

    relacionados = Produto.objects.filter(
        disponivel=True,
        categoria=produto.categoria
    ).exclude(pk=produto.pk)[:4]

    context = {
        'produto': produto,
        'relacionados': relacionados,
        'whatsapp_number': settings.WHATSAPP_NUMBER,
    }
    return render(request, 'loja/produto.html', context)


def carrinho(request):
    context = {
        'whatsapp_number': settings.WHATSAPP_NUMBER,
    }
    return render(request, 'loja/carrinho.html', context)


@require_POST
def capturar_pedido(request):
    try:
        dados = json.loads(request.body)
        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
        PedidoCapturado.objects.create(dados=dados, ip=ip)
        return JsonResponse({'status': 'ok'})
    except Exception:
        return JsonResponse({'status': 'erro'}, status=400)