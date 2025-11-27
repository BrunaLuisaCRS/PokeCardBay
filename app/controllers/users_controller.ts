import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
// 1. Importe seu validador
import { createUserValidator } from '#validators/user_validator' 
// 2. Importe o serviço de hash

export default class UsersController {
  
  public async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('users/index', { users })
  }

  public async store({ request, response, session }: HttpContext) {
    try {
      // 1. Validar
      const data = await request.validateUsing(createUserValidator)

      // --- ALTERAÇÃO AQUI ---
      // NÃO FAÇA O HASH MANUALMENTE.
      // Vamos testar se o Model faz isso sozinho.
      
      console.log('👀 Enviando senha CRUA para o User.create...')

      // 3. Criar usuário com a SENHA PURA
      await User.create({
        full_name: data.full_name,
        email: data.email,
        password: data.password // <--- Mande a senha original (12345678)
      })

      // 6. Deu tudo certo, redirecione para o login
      return response.redirect('/login')
    
    } catch (error) {
      // ... seu catch ...
      session.flashAll()
      session.flash('errors', error.messages)
      return response.redirect().back()
    }
  }
}