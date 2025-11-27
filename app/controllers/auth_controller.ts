import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class AuthController {
  
  public async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    console.log('\n--- DIAGNÓSTICO DE LOGIN ---')
    console.log(`1. Tentando logar com: ${email}`)
    console.log(`2. Senha digitada: ${password}`)

    try {
      const user = await User.findBy('email', email)
      
      if (!user) {
        console.log('❌ FALHA: Usuário não encontrado no banco.')
        session.flash('error', 'Usuário não existe.')
        return response.redirect().back()
      }

      console.log(`3. Usuário encontrado (ID: ${user.id})`)
      console.log(`4. Hash que está salvo no banco: ${user.password}`)

      // Verifica se o hash parece um hash Scrypt válido
      const isScrypt = user.password.startsWith('$scrypt$')
      console.log(`5. O formato do hash no banco parece Scrypt? ${isScrypt ? 'SIM' : 'NÃO'}`)

      console.log('6. Tentando verificar senha...')
      const isValid = await hash.use('scrypt').verify(user.password, password)
      
      console.log(`✅ RESULTADO DA VERIFICAÇÃO: ${isValid}`)

      if (!isValid) {
        console.log('❌ FALHA: A senha não bate com o hash.')
        console.log('   DICA: Se o passo 5 foi SIM e aqui deu FALSE, é Hashing Duplo ou senha errada.')
        throw new Error('Senha inválida')
      }
      
      await auth.use('web').login(user)
      console.log('🚀 SUCESSO: Login realizado, redirecionando...')
      return response.redirect('/meuPerfil')

    } catch (error) {
      session.flash('error', 'Email ou senha inválidos.')
      return response.redirect().back()
    }
  }
  
  // Logout...
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}