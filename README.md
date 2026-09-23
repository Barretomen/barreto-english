# Barreto English

Landing page de um projeto de inglês prático, com uma área específica para developers.

O site inclui teste de nível, exercícios, ferramentas de escrita em inglês e materiais em PDF. Foi feito com HTML, CSS e JavaScript e pode ser aberto diretamente pelo `index.html`.

Os PDFs são gerados pelo script `scripts/build_materials.py`. Para os recriar, é necessário Python e ReportLab:

```bash
python scripts/build_materials.py
```

A newsletter é apenas uma demonstração local. O botão da Kiwify só fica ativo depois de configurar o respetivo URL em `index.html`.
