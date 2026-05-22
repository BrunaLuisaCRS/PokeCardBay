import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import MarketCard from '#models/market_card'

// ====================================================
// GRUPO 1: ROTAS PÚBLICAS (Visitantes)
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
// ====================================================
router.group(() => {

    // --- HOME ---
    // Busca as cartas mais caras para o carrossel antes de renderizar
    router.get('/', [() => import('#controllers/home_controller'), 'index'])

    // --- CARRINHO (CartController) ---
    // Visualizar Carrinho
    router.get('/meuCarrinho', [() => import('#controllers/cart_controller'), 'index'])

    // Adicionar ao Carrinho (AJAX)
    router.post('/cart/add', [() => import('#controllers/cart_controller'), 'add'])

    // Remover item
    router.post('/carrinho/remove/:id', [() => import('#controllers/cart_controller'), 'remove'])

    // --- COMPRA (Checkout) ---
    // 1. Exibir a tela de pagamento
    router.get('/compra', async ({ view }) => {
      return view.render('compra') 
    })

    // 2. PROCESSAR O PAGAMENTO (Esta é a rota que estava faltando/dando erro 404)
    router.post('/checkout/confirm', [() => import('#controllers/checkout_controller'), 'confirm'])

    // --- ROTAS DE VENDA (MARKETPLACE) ---
    
    // 1. Mostrar a página de venda
    router.get('/vender', async ({ view }) => {
      return view.render('venda') 
    })

    // 2. Rota auxiliar para buscar dados da API (usada pelo JS da página venda)
    router.get('/api/market/search', [() => import('#controllers/market_cards_controller'), 'searchApi'])////

    // 3. Rota para SALVAR a venda no banco de dados
    router.post('/vender', [() => import('#controllers/market_cards_controller'), 'store'])

     // Perfil atualizado
  router.get('/meuPerfil', async ({ view, auth }) => {
    const user = await auth.getUserOrFail()
    const cards = await MarketCard.query().where('userId', user.id)
    return view.render('perfil', { user, cards })
  }).as('perfil')
  
    // Logout
    router.post('/logout', [() => import('#controllers/auth_controller'), 'logout']).as('logout')

    //salvar carta no banco02
    /*router.post('/vender', async ({ request, response, auth, session }) => {
      const user = await auth.getUserOrFail()

      const card = new MarketCard()
      card.cardApiId = request.input('card_api_id')
      card.name = request.input('card_name')
      card.imageUrl = request.input('card_image')
      card.rarity = request.input('card_rarity')
      card.price = Number(request.input('price'))

      card.userId = user.id
      card.userName = user.full_name
      card.userEmail = user.email

      await card.save()

      session.flash('success', 'Carta anunciada com sucesso!')
      return response.redirect('/meuPerfil')
    })*/


    router.post('/perfil/update', [() => import('#controllers/users_controller'), 'updateProfile'])
    router.post('/perfil/password', [() => import('#controllers/users_controller'), 'updatePassword'])
    
    // API de Busca Geral (Legado/Topo)
    router.get('/api/search', [() => import('#controllers/card_searches_controller'), 'search'])

    // AUTOCOMPLETE (Para página de Venda - Banco Local)
    router.get('/api/market/autocomplete', [
      () => import('#controllers/market_cards_controller'), 'autocomplete'
    ])

    // API de Busca de Mercado
    router.get('/api/market-search', [() => import('#controllers/market_search_controller'), 'search'])

    // Listagem de usuários
    router.get('/users', [() => import('#controllers/users_controller'), 'index'])

  })
  .use(middleware.auth())