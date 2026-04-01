export const SULAMERICA_KNOWLEDGE_BASE = `
# Base de Conhecimento - Assistência Funeral SulAmérica (PV Corretora)

## Visão Geral do Produto
Assistência Funeral SulAmérica é um plano de assistência funeral completo, com cobertura em todo o Brasil. A família não paga nada por fora. Inclui R$ 50.000 em caso de morte acidental, telemedicina e desconto em farmácias.

## Planos e Preços

### Individual - R$ 29,90/mês
- Apenas o titular
- Telemedicina inclusa
- Desconto em farmácias

### Titular + Cônjuge - R$ 59,90/mês
- Titular e cônjuge
- Telemedicina para os dois
- Desconto em farmácias

### Familiar - R$ 59,90/mês
- Titular, cônjuge e filhos até 21 anos
- Telemedicina para toda a família
- Desconto em farmácias

### Familiar Ampliado - R$ 89,90/mês
- Titular, cônjuge, filhos até 21 anos, pai, mãe, sogro e sogra
- Telemedicina para toda a família
- Desconto em farmácias

## Adicionais
- Cada filho ACIMA de 21 anos: +R$ 8,00/mês por filho
- Cada dependente extra (irmãos, netos, genro, nora, etc.): +R$ 10,00/mês por dependente

## Regra de Idade
- O TITULAR deve ter até 74 anos para contratar
- Acima de 74 anos, a pessoa deve ser incluída como DEPENDENTE em uma apólice cujo titular tenha até 74 anos

## Lógica de Seleção de Plano (para cotação)
1. Se incluir PAIS ou SOGROS → Familiar Ampliado (R$ 89,90)
2. Se incluir CÔNJUGE + FILHOS até 21 → Familiar (R$ 59,90)
3. Se incluir apenas CÔNJUGE (sem filhos) → Titular + Cônjuge (R$ 59,90)
4. Se incluir apenas FILHOS até 21 (sem cônjuge) → Familiar (R$ 59,90)
5. Se não incluir ninguém → Individual (R$ 29,90)
Depois soma: filhos acima de 21 × R$ 8,00 + dependentes extras × R$ 10,00

## Exemplos de Cotação
- Titular 40 anos, sozinho = R$ 29,90/mês
- Titular 35 anos + cônjuge = R$ 59,90/mês
- Titular 42 anos + cônjuge + 2 filhos (8 e 15 anos) = R$ 59,90/mês
- Titular 50 anos + cônjuge + 1 filho de 25 anos = R$ 59,90 + R$ 8,00 = R$ 67,90/mês
- Titular 55 anos + cônjuge + filhos + pais + sogros = R$ 89,90/mês
- Titular 60 anos + cônjuge + pais + 2 filhos (25 e 28) + 1 dependente extra = R$ 89,90 + R$ 16,00 + R$ 10,00 = R$ 115,90/mês

## Coberturas e Benefícios Inclusos em TODOS os Planos

### Assistência Funeral (Todo o Brasil)
- Translado nacional
- Ornamentação completa
- Duas coroas de flores
- Urnas exclusivas
- Tanatopraxia (preparação do corpo)
- Sepultamento em gaveta, carneiro ou cova
- Cremação inclusa
- Certidão de óbito
- Taxas cemiteriais inclusas
- Taxa de exumação inclusa

### Benefícios Extras
- R$ 50.000 em caso de morte acidental
- Telemedicina (individual: para o titular / familiar: para toda a família)
- Desconto em farmácias e medicamentos

### Destaque Principal
"A família não paga nada por fora!" - Todo o serviço funeral está coberto, sem custos adicionais.

## Formas de Pagamento
- Boleto
- PIX
- Débito
- Cartão de crédito
- SEM taxa de adesão

## Processo de Contratação (4 etapas)
1. Documentação e proposta são enviadas ANTES de qualquer pagamento
2. Cliente recebe a proposta e analisa todos os detalhes com calma
3. Após revisar e aprovar, cliente faz o pagamento para ativar as coberturas
4. Cliente recebe acesso ao Portal do Cliente SulAmérica

## Opções de Proteção Complementar (Cross-sell)
Para quem quer proteção ainda mais completa:
- Seguro de vida por morte natural
- Seguro para descoberta de doenças graves
- Cobertura para cirurgias
- Diária de internação hospitalar
- E muito mais!

## Quebra de Objeções Comuns

### "É muito caro"
→ A partir de R$ 29,90/mês. Menos de R$ 1 por dia. Um funeral particular custa de R$ 5.000 a R$ 15.000. Com o plano, a família não paga NADA por fora.

### "Já tenho plano funeral"
→ Nosso plano inclui R$ 50.000 em caso de morte acidental + telemedicina + desconto em farmácias. Confira se o seu oferece tudo isso.

### "Sou jovem, não preciso"
→ Acidentes não escolhem idade. O plano cobre morte acidental com R$ 50.000 de indenização. E a telemedicina é um benefício que você usa todo mês.

### "Não confio em seguro"
→ SulAmérica tem mais de 125 anos de mercado. É a maior seguradora independente do Brasil. Você recebe a proposta ANTES de pagar qualquer coisa.

### "Preciso pensar"
→ Posso fazer uma cotação rápida sem compromisso? Assim você vê o valor exato e decide com calma. Lembrando: não tem taxa de adesão.

### "Meu marido/esposa precisa decidir junto"
→ O plano Titular + Cônjuge é R$ 59,90 e já inclui telemedicina para os dois! Posso enviar a proposta para vocês analisarem juntos?

### "Não tenho dinheiro agora"
→ Não tem taxa de adesão. R$ 29,90/mês no cartão ou débito. E o custo de NÃO ter é muito maior — um funeral particular chega a R$ 15.000.

### "Vou ver depois"
→ A proposta é enviada antes de qualquer pagamento. Não tem compromisso. Posso preparar agora e você analisa quando quiser?
`;
