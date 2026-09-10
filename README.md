# Barreto English v2 — Dual Experience

## Identidade visual 2026

O site usa uma direção de “passaporte de comunicação”: azul internacional,
vermelho de sinalização, amarelo de orientação e superfícies claras. O modo
desenvolvedor mantém a mesma identidade em uma oficina azul-escura, com ciano
e âmbar no lugar do visual hacker genérico. A camada visual está em
`redesign.css`; `styles.css` continua responsável pela base e pelos estados das
interações.

Mudanças:
- experiência principal dark blue e refinada para inglês da vida real
- modo especial para desenvolvedores ativado pelo visitante
- transição com erro de sintaxe em Java, correção interativa, carregamento, tremor, blur e glitch
- flashbang e tela de boas-vindas ao carregar o modo dev
- identidade, tipografia, textos e conteúdo transformados no modo dev
- seção English for Developers exclusiva do modo dev
- foto do Barreto em Paris na seção Sobre
- Daily Barreto
- mini desafio adaptado a cada modo
- Dev Lab com English Debugger, Stand-up Builder, PR Review, Commit Challenge, Bug Report, Docs e Interview Builder
- terminal navegável, progresso persistente e deploy final do aprendizado
- teste de nivelamento com 10 perguntas, resultado CEFR de A1 a C2 e explicação de cada faixa
- biblioteca gratuita com seis cadernos em PDF: três de inglês geral e três para desenvolvedores
- seleção automática da melhor voz natural em inglês disponível no navegador
- newsletter com interesse em Inglês geral ou Programação
- Destrava 30 preparado para futura integração com Kiwify

## Conectar o produto da Kiwify

Depois de cadastrar o produto, abra `index.html`, procure por `data-kiwify-url=""` e cole a URL completa do checkout entre as aspas. Enquanto o endereço estiver vazio, o botão leva o visitante para a lista de espera.

## Atualizar os PDFs

Os arquivos publicados ficam em `output/pdf`. O conteúdo-fonte está em `scripts/build_materials.py` e pode ser regenerado com Python e ReportLab.

Para testar:
1. Extraia o ZIP.
2. Abra index.html.

A newsletter ainda é demonstração local. Próximos passos sugeridos:
Supabase + newsletter real + painel admin + frases diárias no banco + streak + links sociais + URL definitiva da Kiwify.
