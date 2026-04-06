from django.db import migrations, models
from django.utils.text import slugify


def gerar_slugs(apps, schema_editor):
    Produto = apps.get_model('loja', 'Produto')
    for p in Produto.objects.all():
        base = slugify(p.nome)
        slug = base
        n = 1
        while Produto.objects.filter(slug=slug).exclude(pk=p.pk).exists():
            slug = f'{base}-{n}'
            n += 1
        p.slug = slug
        p.save()


class Migration(migrations.Migration):

    dependencies = [
        ('loja', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='produto',
            name='slug',
            field=models.SlugField(blank=True, default='', unique=False),
        ),
        migrations.RunPython(gerar_slugs, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='produto',
            name='slug',
            field=models.SlugField(unique=True),
        ),
    ]