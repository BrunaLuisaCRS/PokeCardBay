import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
// 1. Importe seu validador
import { createUserValidator } from '#validators/user_validator' 
// 2. Importe o serviço de hash
import hash from '@adonisjs/core/services/hash' 

export default class UsersController {
  
  public async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('users/index', { users })
  }

  public async store({ request, response, session }: HttpContext) {
    try {
      // 1. Validar os dados (full_name, email, password)
      const data = await request.validateUsing(createUserValidator)

      // 2. Criar o hash USANDO SCRYPT
      const hashedPassword = await hash.use('scrypt').make(data.password)

      // 3. Criar o usuário USANDO A SENHA HASHEADA
      await User.create({
        full_name: data.full_name,
        email: data.email,
        password: hashedPassword  // <-- PONTO CRÍTICO!
      })

      // 6. Deu tudo certo, redirecione para o login
      return response.redirect('/login')
    
    } catch (error) {
      // 7. Se o validador falhar, ele joga um erro.
      // Nós o pegamos aqui e redirecionamos de volta com os erros.
      session.flashAll() // Repopula os campos (full_name, email)
      session.flash('errors', error.messages) // Envia os erros de validação
      return response.redirect().back()
    }
  }
}