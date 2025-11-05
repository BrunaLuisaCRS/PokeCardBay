/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
/*import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import app from '@adonisjs/core/services/app'
import { join } from 'node:path'

// Página inicial


router.get('/', async ({ response }) => {
  return response.download(join(app.makePath('Paginas/Home.html')))
})

// Outras páginas
router.get('/carrinho', async ({ response }) => {
  return response.download(join(app.makePath('Paginas/Carrinho.html')))
})

router.get('/cadastro', async ({ response }) => {
  return response.download(join(app.makePath('Paginas/Cadastro.html')))
})

router.get('/comprar', async ({ response }) => {
  return response.download(join(app.makePath('Paginas/Compra.html')))
})

router.get('/login', async ({ response }) => {
  return response.download(join(app.makePath('Paginas/Login.html')))
})

router.get('/meuPerfil', async ({ response }) => {
  return response.download(join(app.makePath('Paginas/Perfil.html')))
})

router.get('/vender', async ({ response }) => {
  return response.download(join(app.makePath('Paginas/Venda.html')))
})

// API de exemplo
router.get('/api/users', async () => {
  return [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Doe', age: 25 },
  ]
})

router.get('/users/:id', async ({ response, params }: HttpContext) => {
    const userId = Number(params.id)

    for (const user of users) {
        if (user.id === userId) {
            return user
        }
    }

    return response.status(404).send({
     message: 'User not found' })
})

router.post('/users', ({ request }: HttpContext) => {
    console.log(request.body())
    return users
})*/

import router from '@adonisjs/core/services/router'

router.get('/cadastro', async ({ view }) => {
  return view.render('cadastro') // seu arquivo resources/views/cadastro.edge
})

router.get('/users', [() => import('#controllers/users_controller'), 'index'])
router.post('/users', [() => import('#controllers/users_controller'), 'store'])
