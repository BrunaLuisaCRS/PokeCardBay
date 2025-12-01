import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// ====================================================
// GRUPO 1: ROTAS PÚBLICAS (Visitantes)
// Apenas quem NÃO está logado pode acessar aqui.
// Se estiver logado, o 'middleware.guest' redireciona para a Home.
// ====================================================
router.group(() => {
  
    // Login
    router.get('/login', async ({ view }) => {
      return view.render('login')
    }).as('login')
    router.post('/login', [() => import('#controllers/auth_controller'), 'login'])

    // Cadastro
    router.get('/cadastro', async ({ view }) => {
      return view.render('cadastro')
    })
    router.post('/cadastro', [() => import('#controllers/users_controller'), 'store'])

  })
  .use(middleware.guest())


// ====================================================
// GRUPO 2: ROTAS PROTEGIDAS (Usuários Logados)
// Quem tentar acessar aqui sem login será mandado para /login
// ====================================================
router.group(() => {

    // Home
    router.get('/', async ({ view }) => {
      return view.render('home') 
    })

    // Rotas de Compra
    router.get('/meuCarrinho', async ({ view }) => {
      return view.render('carrinho') 
    })
    router.get('/compra', async ({ view }) => {
      return view.render('compra') 
    })

    // --- ROTAS DE VENDA (MARKETPLACE) ---
    
    // 1. Mostrar a página de venda
    router.get('/vender', async ({ view }) => {
      return view.render('venda') 
    })

    // 2. Rota auxiliar para buscar dados da API (usada pelo JS da página venda)
    // Atenção: Esta rota chama o 'MarketCardsController' e o método 'searchApi'
    router.get('/api/market/search', [() => import('#controllers/market_cards_controller'), 'searchApi'])

    // 3. Rota para SALVAR a venda no banco de dados
    router.post('/vender', [() => import('#controllers/market_cards_controller'), 'store'])

    // ------------------------------------

    // Perfil
    router.get('/meuPerfil', async ({ view, auth }) => {
      const user = auth.getUserOrFail() 
      return view.render('perfil', { user }) 
    }).as('perfil')

    // Logout
    router.post('/logout', [() => import('#controllers/auth_controller'), 'logout']).as('logout')

    router.post('/perfil/update', [() => import('#controllers/users_controller'), 'updateProfile'])
    router.post('/perfil/password', [() => import('#controllers/users_controller'), 'updatePassword'])
    
    // API de Busca Geral (Barra de pesquisa do topo)
    router.get('/api/search', [() => import('#controllers/card_searches_controller'), 'search'])

    // AUTOCOMPLETE + BUSCA POR NOME / NÚMERO
    router.get('/api/market/autocomplete', [
      () => import('#controllers/market_cards_controller'),'autocomplete'])

    // Listagem de usuários
    router.get('/users', [() => import('#controllers/users_controller'), 'index'])

  })
  .use(middleware.auth()) // <--- Protege tudo aqui dentro