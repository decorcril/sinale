from django.contrib import admin
from loja.models import Categoria, Produto, PedidoCapturado


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nome', 'slug']
    prepopulated_fields = {'slug': ('nome',)}


@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ['nome', 'categoria', 'preco', 'disponivel', 'destaque']
    list_filter = ['disponivel', 'destaque', 'categoria']
    list_editable = ['disponivel', 'destaque', 'preco']
    search_fields = ['nome', 'descricao']


@admin.register(PedidoCapturado)
class PedidoCapturadoAdmin(admin.ModelAdmin):
    list_display = ['pk', 'criado_em', 'ip']
    readonly_fields = ['dados', 'criado_em', 'ip']