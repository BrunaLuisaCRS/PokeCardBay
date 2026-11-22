# 🎴 PokeCardBay

Marketplace web para compra, venda e troca de cartas do **Pokémon TCG** (Trading Card Game). O projeto reúne as telas de uma loja online — vitrine, login, cadastro, carrinho, checkout, perfil e anúncio de cartas — construídas com **HTML, CSS e JavaScript**, com um servidor **Node.js** de base para a evolução do back-end.

> ⚠️ **Status:** em desenvolvimento. O front-end (telas e estilos) está montado; a lógica em JavaScript, o banco de dados e a integração com a API do Pokémon TCG ainda fazem parte do roadmap (veja [Próximos passos](#-próximos-passos)).

---

## 📑 Sumário

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como executar](#-como-executar)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Próximos passos](#-próximos-passos)
- [Autora](#-autora)

---

## ✨ Funcionalidades

Telas já construídas na pasta `Paginas/`:

| Página | Arquivo | Descrição |
| --- | --- | --- |
| Home | `Home.html` | Vitrine com busca e carrossel de **cartas em destaque** (Swiper), cada uma com botão de compra |
| Login | `Login.html` | Acesso com e-mail e senha |
| Cadastro | `Cadastro.html` | Criação de conta (nome, e-mail, senha e confirmação de senha) |
| Carrinho | `Carrinho.html` | Lista de cartas escolhidas, controle de quantidade (+ / −) e resumo do pedido |
| Compra | `Compra.html` | Checkout com endereço de entrega (CEP, rua, número, bairro), forma de pagamento e resumo do pedido |
| Venda | `Venda.html` | Formulário para **anunciar uma carta**: nome, número, raridade (comum, incomum, rara, holo, ultra rara, secreta, promo) e valor em R$ |
| Perfil | `Perfil.html` | Área do usuário com alteração de senha, endereço e lista de "Minhas cartas à venda" |

## 🛠️ Tecnologias

- **HTML5** e **CSS3** — estrutura e estilo das páginas (`assets/css/style.css`)
- **JavaScript** — interações no front-end
- **Node.js** — servidor HTTP básico (`index.js`)
- **[Swiper](https://swiperjs.com/)** (via CDN) — carrossel de cartas em destaque
- **Dependências do `package.json`:** `dotenv`, `@vinejs/vine`, `edge.js` e `bootstrap`

## 📁 Estrutura do projeto

```
PokeCardBay/
├── .vscode/            # Configuração de debug (Chrome em localhost:8080)
├── Paginas/            # Telas do marketplace
│   ├── Home.html
│   ├── Login.html
│   ├── Cadastro.html
│   ├── Carrinho.html
│   ├── Compra.html
│   ├── Venda.html
│   └── Perfil.html
├── assets/
│   ├── css/
│   │   └── style.css   # Estilos globais
│   └── img/            # Imagens e ícones (pokébolas, Pikachu, Bulbasaur...)
├── .env-exemple        # Modelo das variáveis de ambiente
├── index.js            # Servidor Node.js
├── package.json
└── ProFuturo.txt       # Lista de tarefas futuras
```

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Git](https://git-scm.com/)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/BrunaLuisaCRS/PokeCardBay.git
cd PokeCardBay

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env a partir do modelo
cp .env-exemple .env
# (no Windows: copy .env-exemple .env)

# 4. Preencha PORT e HOST no .env (veja a seção abaixo)

# 5. Inicie o servidor
node index.js
```

### Visualizando as páginas

As telas são arquivos estáticos. Para vê-las, abra qualquer arquivo de `Paginas/` diretamente no navegador (por exemplo, `Paginas/Home.html`) ou use uma extensão como o **Live Server** do VS Code.

> O arquivo `.vscode/launch.json` já vem configurado para abrir o Chrome em `http://localhost:8080`, útil para depuração.

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (ele já está no `.gitignore`) seguindo o modelo `.env-exemple`:

```env
PORT=8080
HOST=localhost
```

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `PORT` | Porta em que o servidor vai rodar | `8080` |
| `HOST` | Endereço do servidor | `localhost` |

---

> *PokeCardBay é um projeto educacional e não possui afiliação com a Nintendo, The Pokémon Company ou Game Freak. Pokémon e os nomes das cartas são marcas de seus respectivos proprietários.*
