import router from '@adonisjs/core/services/router'
//import AuthController from '#controllers/auth_controller'
import { join } from 'node:path'
import { middleware } from '#start/kernel'

router.get('/cadastro', async ({ view }) => {
  return view.render('cadastro')
})

router.post('/cadastro', [() => import('#controllers/users_controller'), 'store'])

router.get('/users', [() => import('#controllers/users_controller'), 'index'])
  .use(middleware.auth()) //  protege a rota

router.post('/users', [() => import('#controllers/users_controller'), 'store'])

router.get('/login', async ({ view }) => {
  return view.render('login')
})

router.post('/login', [() => import('#controllers/auth_controller'), 'login'])


// ++++++++++++++++++++++ páginas estáticas por enquanto ++++++++++++++++++++
router.get('/', async ({ response }) => {
  return response.download(join(process.cwd(), 'Paginas', 'Home.html'))
})

router.get('/meuPerfil', async ({ response }) => {
  return response.download(join(process.cwd(), 'Paginas', 'Perfil.html'))
})

router.get('/meuCarrinho', async ({ response }) => {
  return response.download(join(process.cwd(), 'Paginas', 'Carrinho.html'))
})

router.get('/compra', async ({ response }) => {
  return response.download(join(process.cwd(), 'Paginas', 'Compra.html'))
})

/* ===alguma coisa ta dando errado na venda====
router.get('/venda', async ({ response }) => {
  return response.download(join(process.cwd(), 'Paginas', 'Venda.html'))
})
  */

