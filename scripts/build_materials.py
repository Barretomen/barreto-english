from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf"
OUTPUT.mkdir(parents=True, exist_ok=True)

pdfmetrics.registerFont(TTFont("Barreto", "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("Barreto-Bold", "C:/Windows/Fonts/arialbd.ttf"))

PAGE_W, PAGE_H = A4

GENERAL = {
    "accent": colors.HexColor("#267BFF"),
    "dark": colors.HexColor("#071426"),
    "soft": colors.HexColor("#EAF2FF"),
    "label": "GENERAL ENGLISH",
}

DEV = {
    "accent": colors.HexColor("#16A765"),
    "dark": colors.HexColor("#06150D"),
    "soft": colors.HexColor("#E8F8EF"),
    "label": "ENGLISH FOR DEVELOPERS",
}


MATERIALS = [
    {
        "filename": "general-01-primeiras-conversas-a1.pdf",
        "theme": GENERAL,
        "number": "01",
        "level": "A1 - Iniciante",
        "title": "Primeiras conversas em inglês",
        "subtitle": "Cumprimentos, apresentações e o verbo to be",
        "goals": [
            "Cumprimentar alguém em situações formais e informais.",
            "Dizer seu nome, sua cidade e sua profissão.",
            "Usar am, is e are em frases simples.",
        ],
        "concepts": [
            ("Cumprimentos", "Hello e Hi significam olá. Good morning é usado pela manhã; Good afternoon, à tarde; e Good evening, à noite."),
            ("Apresentando-se", "Use I'm + nome ou profissão. Exemplo: I'm Barreto. I'm a teacher. Para origem, use I'm from + lugar."),
            ("O verbo to be", "I am (I'm), you are (you're), he/she is (he's/she's), we are (we're), they are (they're)."),
        ],
        "phrases": [
            ("Hi, I'm Ana. Nice to meet you.", "Oi, sou a Ana. Prazer em conhecer você."),
            ("I'm from Brazil.", "Eu sou do Brasil."),
            ("Are you a student?", "Você é estudante?"),
            ("Yes, I am. / No, I'm not.", "Sim, sou. / Não, não sou."),
        ],
        "exercises": [
            "Complete: I ___ from Brazil. (am / is)",
            "Complete: She ___ a teacher. (am / is)",
            "Complete: They ___ students. (is / are)",
            "Escolha a saudação para 9h: Good morning / Good evening",
            "Traduza: Oi, sou o Carlos.",
            "Traduza: Eu sou desenvolvedora.",
            "Complete: ___ you from Portugal? (Am / Are)",
            "Responda negativamente: Are you a teacher?",
            "Organize: meet / nice / you / to",
            "Escreva três frases para se apresentar.",
        ],
        "answers": [
            "1. am", "2. is", "3. are", "4. Good morning", "5. Hi, I'm Carlos.",
            "6. I'm a developer.", "7. Are", "8. No, I'm not.", "9. Nice to meet you.",
            "10. Resposta pessoal. Modelo: I'm Julia. I'm from Brazil. I'm a student.",
        ],
        "challenge": "Apresente-se em voz alta sem ler. Diga seu nome, sua cidade e o que você faz.",
    },
    {
        "filename": "general-02-rotina-presente-simples-a1-a2.pdf",
        "theme": GENERAL,
        "number": "02",
        "level": "A1-A2 - Básico",
        "title": "Rotina e presente simples",
        "subtitle": "Fale sobre seu dia com clareza",
        "goals": [
            "Descrever atividades da sua rotina.",
            "Usar do e does em perguntas.",
            "Falar sobre frequência com usually, sometimes e never.",
        ],
        "concepts": [
            ("Presente simples", "Use o verbo na forma base com I, you, we e they: I work. Com he, she e it, normalmente acrescente -s: She works."),
            ("Perguntas", "Use Do com I/you/we/they e Does com he/she/it: Do you work? Does she study? Depois de does, o verbo volta à forma base."),
            ("Frequência", "Always = sempre; usually = geralmente; sometimes = às vezes; rarely = raramente; never = nunca."),
        ],
        "phrases": [
            ("I usually wake up at seven.", "Eu geralmente acordo às sete."),
            ("She works from home.", "Ela trabalha de casa."),
            ("Do you study English every day?", "Você estuda inglês todos os dias?"),
            ("He doesn't drink coffee.", "Ele não bebe café."),
        ],
        "exercises": [
            "Complete: I ___ at home. (work / works)",
            "Complete: He ___ English. (study / studies)",
            "Complete: ___ you exercise? (Do / Does)",
            "Complete: Does she ___ coffee? (like / likes)",
            "Passe para a negativa: I work on Sundays.",
            "Passe para a negativa: She studies at night.",
            "Organize: usually / I / early / wake up",
            "Traduza: Ele trabalha de casa.",
            "Traduza: Você estuda todos os dias?",
            "Complete com uma frequência: I ___ practice English.",
            "Corrija: She don't work here.",
            "Escreva quatro frases sobre sua rotina.",
        ],
        "answers": [
            "1. work", "2. studies", "3. Do", "4. like", "5. I don't work on Sundays.",
            "6. She doesn't study at night.", "7. I usually wake up early.", "8. He works from home.",
            "9. Do you study every day?", "10. Resposta possível: usually.", "11. She doesn't work here.",
            "12. Resposta pessoal. Confira sujeito, verbo e frequência.",
        ],
        "challenge": "Grave um áudio de 30 segundos contando como começa e termina seu dia.",
    },
    {
        "filename": "general-03-situacoes-reais-a2.pdf",
        "theme": GENERAL,
        "number": "03",
        "level": "A2 - Básico superior",
        "title": "Inglês para situações reais",
        "subtitle": "Viagens, pedidos e ajuda sem travar",
        "goals": [
            "Pedir informações de maneira educada.",
            "Fazer pedidos em cafés e restaurantes.",
            "Resolver situações simples durante uma viagem.",
        ],
        "concepts": [
            ("Pedidos educados", "Could I...? e Can I...? são formas úteis. Could é um pouco mais educado: Could I have some water, please?"),
            ("Pedindo ajuda", "Use Excuse me para iniciar: Excuse me, could you help me? Para localização: Where is...? ou How do I get to...?"),
            ("Quando não entender", "Diga: Could you repeat that, please? ou Could you speak more slowly? Isso mantém a conversa em inglês."),
        ],
        "phrases": [
            ("Could I have the menu, please?", "Pode me trazer o cardápio, por favor?"),
            ("How do I get to the station?", "Como chego à estação?"),
            ("I'd like a coffee, please.", "Eu gostaria de um café, por favor."),
            ("Could you say that again?", "Pode dizer isso novamente?"),
        ],
        "exercises": [
            "Escolha a forma mais educada: Give me water. / Could I have some water, please?",
            "Complete: I'd ___ a coffee, please. (like / want)",
            "Complete: How do I get ___ the station? (at / to)",
            "Traduza: Com licença, você pode me ajudar?",
            "Traduza: Pode falar mais devagar?",
            "Organize: menu / have / could / the / I / please",
            "Escolha: Where is the bathroom? / Where the bathroom is?",
            "Complete: How much ___ this? (is / are)",
            "Responda: Would you like anything else?",
            "Corrija: I want one coffee please.",
            "Escreva um pedido completo em um restaurante.",
            "Escreva uma pergunta para encontrar a estação.",
        ],
        "answers": [
            "1. Could I have some water, please?", "2. like", "3. to", "4. Excuse me, could you help me?",
            "5. Could you speak more slowly?", "6. Could I have the menu, please?", "7. Where is the bathroom?",
            "8. is", "9. Resposta possível: No, thank you. That's all.", "10. I'd like a coffee, please.",
            "11. Resposta pessoal.", "12. Resposta possível: How do I get to the station?",
        ],
        "challenge": "Simule uma conversa: peça um café, pergunte o preço e agradeça.",
    },
    {
        "filename": "dev-01-vocabulario-essencial-a1-a2.pdf",
        "theme": DEV,
        "number": "01",
        "level": "A1-A2 - Dev básico",
        "title": "Vocabulário essencial para devs",
        "subtitle": "As palavras que aparecem todo dia no trabalho",
        "goals": [
            "Reconhecer termos frequentes em times de tecnologia.",
            "Diferenciar bug, issue, feature e fix.",
            "Usar o vocabulário em frases curtas e naturais.",
        ],
        "concepts": [
            ("Problemas", "Bug é um defeito no software. Issue pode ser um problema ou uma tarefa registrada. Fix pode ser verbo (corrigir) ou substantivo (correção)."),
            ("Mudanças", "Feature é uma funcionalidade. Update é uma atualização. Release é uma versão disponibilizada. Deploy é o envio da aplicação para um ambiente."),
            ("Código", "Branch é uma linha de desenvolvimento. Merge combina alterações. Build é o resultado do processo de compilação ou preparação."),
        ],
        "phrases": [
            ("I found a bug in the login page.", "Encontrei um bug na página de login."),
            ("The fix is ready for review.", "A correção está pronta para revisão."),
            ("We need to deploy this update.", "Precisamos fazer o deploy desta atualização."),
            ("This feature is still in development.", "Esta funcionalidade ainda está em desenvolvimento."),
        ],
        "exercises": [
            "Associe: bug - feature - deploy / funcionalidade - defeito - publicar",
            "Complete: I found an ___ in the payment flow. (issue / branch)",
            "Complete: The ___ is ready for review. (fix / bugged)",
            "Complete: We created a new ___ for this feature. (branch / release)",
            "Traduza: A build falhou.",
            "Traduza: Precisamos corrigir este bug.",
            "Escolha: make a deploy / deploy the application",
            "Escolha: open an issue / do an issue",
            "Corrija: I encountered one bug on login page.",
            "Escreva uma frase usando feature.",
            "Escreva uma frase usando update.",
            "Explique em inglês o que é um bug usando palavras simples.",
        ],
        "answers": [
            "1. bug = defeito; feature = funcionalidade; deploy = publicar", "2. issue", "3. fix", "4. branch",
            "5. The build failed.", "6. We need to fix this bug.", "7. deploy the application", "8. open an issue",
            "9. I found a bug on the login page.", "10. Resposta possível: This feature helps users reset their password.",
            "11. Resposta possível: The update is ready.", "12. Resposta possível: A bug is a problem in the software.",
        ],
        "challenge": "Abra um projeto seu e descreva uma feature, um bug e uma correção em inglês.",
    },
    {
        "filename": "dev-02-dailies-e-mensagens-a2.pdf",
        "theme": DEV,
        "number": "02",
        "level": "A2 - Dev básico superior",
        "title": "Dailies e mensagens de trabalho",
        "subtitle": "Comunique progresso, planos e bloqueios",
        "goals": [
            "Montar uma atualização curta para uma daily.",
            "Explicar um bloqueio sem traduzir literalmente.",
            "Pedir ajuda e prazo de forma profissional.",
        ],
        "concepts": [
            ("Yesterday", "Use o passado para tarefas concluídas: Yesterday, I finished the login page. I fixed the authentication bug."),
            ("Today", "Use I'm working on para trabalho em andamento e I'm going to para planos: Today, I'm working on the API."),
            ("Blockers", "Use I'm blocked by... ou I'm waiting for... Para pedir ajuda: Could you help me with...?"),
        ],
        "phrases": [
            ("Yesterday, I fixed the login issue.", "Ontem, corrigi o problema de login."),
            ("Today, I'm working on authentication.", "Hoje, estou trabalhando na autenticação."),
            ("I'm currently blocked by an API issue.", "No momento, estou bloqueado por um problema na API."),
            ("Could you take a look when you have time?", "Você poderia dar uma olhada quando tiver tempo?"),
        ],
        "exercises": [
            "Complete: Yesterday, I ___ the bug. (fix / fixed)",
            "Complete: Today, I'm working ___ the API. (in / on)",
            "Complete: I'm blocked ___ a database issue. (by / at)",
            "Traduza: Estou esperando uma resposta do cliente.",
            "Traduza: Você poderia dar uma olhada?",
            "Corrija: I'm working in this task.",
            "Corrija: Yesterday I fix the problem.",
            "Escolha a mais educada: Help me. / Could you help me with this?",
            "Complete: I should finish this ___ Friday. (by / until)",
            "Escreva uma frase sobre o que fez ontem.",
            "Escreva uma frase sobre o que fará hoje.",
            "Monte uma daily completa com três frases.",
        ],
        "answers": [
            "1. fixed", "2. on", "3. by", "4. I'm waiting for a response from the client.",
            "5. Could you take a look?", "6. I'm working on this task.", "7. Yesterday, I fixed the problem.",
            "8. Could you help me with this?", "9. by", "10-12. Respostas pessoais. Use Yesterday + passado, Today + plano e um blocker.",
        ],
        "challenge": "Grave uma daily de 40 segundos: yesterday, today e blockers.",
    },
    {
        "filename": "dev-03-commits-prs-documentacao-a2-b1.pdf",
        "theme": DEV,
        "number": "03",
        "level": "A2-B1 - Dev upper basic",
        "title": "Commits, PRs e documentação",
        "subtitle": "Escreva com clareza e leia com confiança",
        "goals": [
            "Escrever commits curtos no imperativo.",
            "Fazer sugestões educadas em code reviews.",
            "Entender palavras comuns em documentação.",
        ],
        "concepts": [
            ("Commits", "Comece com verbo no imperativo: Fix, Add, Remove, Update, Refactor. Exemplo: Fix login redirect issue."),
            ("Code review", "Prefira sugestões colaborativas: Could we simplify this? What do you think about...? Consider renaming this variable."),
            ("Documentação", "Required = obrigatório; optional = opcional; deprecated = descontinuado; returns = retorna; throws = lança um erro."),
        ],
        "phrases": [
            ("Add password reset validation", "Adiciona validação de redefinição de senha."),
            ("Could we extract this into a function?", "Poderíamos extrair isto para uma função?"),
            ("This parameter is required.", "Este parâmetro é obrigatório."),
            ("The method returns a promise.", "O método retorna uma promessa."),
        ],
        "exercises": [
            "Melhore o commit: Fixed bug of login.",
            "Melhore o commit: Adding new button.",
            "Escolha: This is bad. / Could we simplify this part?",
            "Traduza: Este parâmetro é opcional.",
            "Traduza: Este método foi descontinuado.",
            "Complete: The function ___ a string. (returns / return)",
            "Complete: This method ___ an error. (throws / plays)",
            "O que significa workaround?",
            "Transforme em sugestão: Rename this variable.",
            "Escreva um commit para remover código não utilizado.",
            "Escreva um comentário educado pedindo um teste.",
            "Explique: The token is required, but redirectUrl is optional.",
        ],
        "answers": [
            "1. Fix login bug.", "2. Add new button.", "3. Could we simplify this part?", "4. This parameter is optional.",
            "5. This method is deprecated.", "6. returns", "7. throws", "8. Uma solução temporária ou alternativa.",
            "9. Could we rename this variable?", "10. Remove unused code.", "11. Could you add a test for this case?",
            "12. O token é obrigatório, mas redirectUrl é opcional.",
        ],
        "challenge": "Revise uma mensagem de commit sua e transforme-a em uma versão curta e natural em inglês.",
    },
]


def make_styles(theme):
    base = getSampleStyleSheet()
    return {
        "cover_label": ParagraphStyle("CoverLabel", parent=base["Normal"], fontName="Barreto-Bold", fontSize=9, leading=12, textColor=theme["accent"], spaceAfter=12),
        "cover_title": ParagraphStyle("CoverTitle", parent=base["Title"], fontName="Barreto-Bold", fontSize=31, leading=35, textColor=colors.white, alignment=TA_LEFT, spaceAfter=12),
        "cover_sub": ParagraphStyle("CoverSub", parent=base["Normal"], fontName="Barreto", fontSize=14, leading=20, textColor=colors.HexColor("#C7D0DC")),
        "h1": ParagraphStyle("H1", parent=base["Heading1"], fontName="Barreto-Bold", fontSize=23, leading=28, textColor=theme["dark"], spaceAfter=14),
        "h2": ParagraphStyle("H2", parent=base["Heading2"], fontName="Barreto-Bold", fontSize=14, leading=18, textColor=theme["accent"], spaceBefore=8, spaceAfter=6),
        "body": ParagraphStyle("Body", parent=base["BodyText"], fontName="Barreto", fontSize=10.3, leading=15, textColor=colors.HexColor("#263142"), spaceAfter=7),
        "small": ParagraphStyle("Small", parent=base["BodyText"], fontName="Barreto", fontSize=8.8, leading=12, textColor=colors.HexColor("#526070")),
        "exercise": ParagraphStyle("Exercise", parent=base["BodyText"], fontName="Barreto", fontSize=10, leading=15, textColor=colors.HexColor("#253142"), spaceAfter=9),
        "answer": ParagraphStyle("Answer", parent=base["BodyText"], fontName="Barreto", fontSize=9.6, leading=14, textColor=colors.HexColor("#253142"), spaceAfter=7),
        "center": ParagraphStyle("Center", parent=base["BodyText"], fontName="Barreto", fontSize=9, leading=13, alignment=TA_CENTER, textColor=colors.HexColor("#6A7685")),
    }


def page_decor(canvas, doc, theme, title):
    canvas.saveState()
    if doc.page > 1:
        canvas.setFillColor(theme["dark"])
        canvas.rect(0, PAGE_H - 18 * mm, PAGE_W, 18 * mm, fill=1, stroke=0)
        canvas.setFont("Barreto-Bold", 8)
        canvas.setFillColor(theme["accent"])
        canvas.drawString(18 * mm, PAGE_H - 11.5 * mm, "BARRETO ENGLISH")
        canvas.setFont("Barreto", 7.5)
        canvas.setFillColor(colors.HexColor("#C1CBD6"))
        canvas.drawRightString(PAGE_W - 18 * mm, PAGE_H - 11.5 * mm, title)
    canvas.setStrokeColor(colors.HexColor("#DCE3EB"))
    canvas.line(18 * mm, 14 * mm, PAGE_W - 18 * mm, 14 * mm)
    canvas.setFont("Barreto", 7.5)
    canvas.setFillColor(colors.HexColor("#7C8794"))
    canvas.drawString(18 * mm, 9 * mm, "Material gratuito - barretoenglish")
    canvas.drawRightString(PAGE_W - 18 * mm, 9 * mm, f"{doc.page:02d}")
    canvas.restoreState()


def concept_card(title, text, styles, theme):
    table = Table([[Paragraph(title, styles["h2"]), Paragraph(text, styles["body"])]], colWidths=[42 * mm, 120 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), theme["soft"]),
        ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#C9D7E6")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return table


def build_pdf(material):
    theme = material["theme"]
    styles = make_styles(theme)
    output_path = OUTPUT / material["filename"]
    doc = BaseDocTemplate(
        str(output_path), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm,
        topMargin=24 * mm, bottomMargin=19 * mm,
        title=material["title"], author="Barreto English",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="content", frames=[frame], onPage=lambda c, d: page_decor(c, d, theme, material["title"]))])
    story = []

    cover = Table([
        [Paragraph(f"MATERIAL GRATUITO / {theme['label']} / {material['number']}", styles["cover_label"])],
        [Paragraph(material["title"], styles["cover_title"])],
        [Paragraph(material["subtitle"], styles["cover_sub"])],
        [Spacer(1, 35 * mm)],
        [Paragraph(material["level"], ParagraphStyle("Level", fontName="Barreto-Bold", fontSize=12, textColor=theme["accent"]))],
        [Paragraph("EXPLICAÇÃO + EXEMPLOS + EXERCÍCIOS + GABARITO", ParagraphStyle("Meta", fontName="Barreto", fontSize=8, leading=12, textColor=colors.HexColor("#9DABBA"), spaceBefore=8))],
    ], colWidths=[doc.width], rowHeights=[None, None, None, None, None, None])
    cover.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), theme["dark"]),
        ("LEFTPADDING", (0, 0), (-1, -1), 18 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 18 * mm),
        ("TOPPADDING", (0, 0), (-1, 0), 16 * mm),
        ("BOTTOMPADDING", (0, -1), (-1, -1), 18 * mm),
    ]))
    story.extend([Spacer(1, 22 * mm), cover, Spacer(1, 14 * mm), Paragraph("Aprenda algo útil hoje. Use ainda hoje.", styles["center"]), PageBreak()])

    story.extend([Paragraph("O que você vai aprender", styles["h1"])])
    for goal in material["goals"]:
        story.append(Paragraph(f"<font color='{theme['accent'].hexval()}'>●</font>&nbsp;&nbsp;{goal}", styles["body"]))
    story.append(Spacer(1, 6 * mm))
    for title, text in material["concepts"]:
        story.extend([concept_card(title, text, styles, theme), Spacer(1, 4 * mm)])
    story.append(PageBreak())

    story.extend([Paragraph("Frases para levar com você", styles["h1"])])
    phrase_rows = [[Paragraph("INGLÊS", styles["small"]), Paragraph("SIGNIFICADO", styles["small"])]]
    for english, portuguese in material["phrases"]:
        phrase_rows.append([Paragraph(f"<b>{english}</b>", styles["body"]), Paragraph(portuguese, styles["body"])])
    phrases = Table(phrase_rows, colWidths=[81 * mm, 81 * mm], repeatRows=1)
    phrases.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), theme["dark"]),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D6DFE8")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.extend([phrases, Spacer(1, 8 * mm), Paragraph("Pratique", styles["h1"])])
    for idx, exercise in enumerate(material["exercises"], 1):
        story.append(Paragraph(f"<b>{idx:02d}</b>&nbsp;&nbsp;{exercise}", styles["exercise"]))
    story.append(PageBreak())

    story.extend([Paragraph("Gabarito comentado", styles["h1"]), Paragraph("Confira somente depois de tentar. Errar também faz parte do aprendizado.", styles["body"]), Spacer(1, 3 * mm)])
    for answer in material["answers"]:
        story.append(Paragraph(answer, styles["answer"]))
    challenge_table = Table([[Paragraph("DESAFIO FINAL", styles["h2"]), Paragraph(material["challenge"], styles["body"])]], colWidths=[42 * mm, 120 * mm])
    challenge_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), theme["soft"]),
        ("BOX", (0, 0), (-1, -1), 1, theme["accent"]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.extend([Spacer(1, 8 * mm), KeepTogether(challenge_table), Spacer(1, 12 * mm), Paragraph("Continue praticando em barretomen.github.io/barreto-english", styles["center"])])
    doc.build(story)
    return output_path


if __name__ == "__main__":
    for item in MATERIALS:
        path = build_pdf(item)
        print(path)
