from django.urls import path
from . import views

app_name = 'loja'

urlpatterns = [
    path('', views.vitrine, name='vitrine'),
    path('produto/<slug:slug>/', views.detalhe_produto, name='produto'),
    path('carrinho/', views.carrinho, name='carrinho'),
    path('api/capturar-pedido/', views.capturar_pedido, name='capturar_pedido'),
]