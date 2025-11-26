import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    // Cadastro
    router.get('/cadastro', async ({ view }) => {
      return view.render('cadastro') // Renderiza cadastro.edge
    })
    router.post('/cadastro', [() => import('#controllers/users_controller'), 'store'])

    // Login
    router.get('/login', async ({ view }) => {
      return view.render('login') // Renderiza login.edge
    }).as('login') // Damos um nome à rota
    router.post('/login', [() => import('#controllers/auth_controller'), 'login'])

    // Home pública (visitantes)
    router.get('/', async ({ view }) => {
      return view.render('home') // Renderiza home.edge
    })

    router.get('/meuCarrinho', async ({ view }) => {
      return view.render('carrinho') // carrinho.edge
    })
    router.get('/compra', async ({ view }) => {
      return view.render('compra') // compra.edge
    })

    router.get('/vender', async ({ view }) => {
      return view.render('venda') // venda.edge
    })
  })
  .use(middleware.guest()) // Opcional: redireciona logados para /meuPerfil

// --- ROTAS PROTEGIDAS (Usuários Logados) ---
router
  .group(() => {
  
    /*router.get('/meuPerfil', async ({ view, auth }) => {
      
      const user = auth.getUserOrFail() 
     
      return view.render('perfil', { user }) 
    }).as('perfil')*/

    // Em routes.ts, dentro do grupo de rotas "protegidas"

router.get('/meuPerfil', async ({ view, auth }) => {
  
  // Tente obter o utilizador logado
  const userOriginal = auth.user 

  // Se não houver utilizador logado (null), crie um utilizador FALSO
  const user = userOriginal || {
    full_name: 'Utilizador Falso (Teste)',
    email: 'teste@email.com',
    id: 999,
    // Adicione quaisquer outros campos que a sua página 'perfil.edge' possa precisar
  }

  // Renderize a página com o utilizador (seja ele real ou falso)
  return view.render('perfil', { user }) 
  }).as('perfil')


    router.post('/logout', [() => import('#controllers/auth_controller'), 'logout']).as('logout')
    
    // Outras rotas logadas
    
    
    // Rota de usuários 
    router.get('/users', [() => import('#controllers/users_controller'), 'index'])

    router.get('/api/search', [() => import('#controllers/card_searches_controller'), 'search'])
  })
  //.use(middleware.auth()) //  ISSO PROTEGE O GRUPO TODO