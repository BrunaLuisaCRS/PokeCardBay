// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash' // Mantenha
import User from '#models/user' // Mantenha

export default class AuthController {
  
  public async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // 1. Encontrar o usuário
      const user = await User.findBy('email', email)
      if (!user) {
        throw new Error('Credenciais inválidas')
      }

      // 2. Verificar a senha USANDO O HASH CORRETO (scrypt)
      // Esta é a linha que corrige tudo!
      const isValid = await hash.use('scrypt').verify(user.password, password)

      if (!isValid) {
        throw new Error('Credenciais inválidas')
      }
      
      // 6. Se chegou aqui, está tudo OK. Fazer o login.
      await auth.use('web').login(user)
      
      // 7. Redirecionar para o perfil
      return response.redirect('/meuPerfil')

    } catch (error) {
      // 8. Se qualquer um dos 'throw' acima for ativado, vem para aqui
      session.flash('error', 'Email ou senha inválidos.')
      return response.redirect().back()
    }
  }

  // O Logout permanece igual
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}