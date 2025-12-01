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

  public async updateProfile({ request, response, auth, session }: HttpContext) {
    const user = await auth.getUserOrFail()

    const fullName = request.input('full_name')
    const photo = request.file('photo', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (photo) {
      await photo.move('uploads/profile_photos', {
        name: `${user.id}.${photo.extname}`,
        overwrite: true,
      })
      user.photoUrl = `/uploads/profile_photos/${user.id}.${photo.extname}`
    }

    user.full_name = fullName
    await user.save()

    session.flash('success', 'Perfil atualizado com sucesso!')
    return response.redirect('/meuPerfil')
  }

  public async updatePassword({ request, response, auth, session }: HttpContext) {
    const user = await auth.getUserOrFail()

    const currentPassword = request.input('senha-atual')
    const newPassword = request.input('senha-nova')

    const isValid = await hash.verify(user.password, currentPassword)
    if (!isValid) {
      session.flash('error', 'Senha atual incorreta.')
      return response.redirect().back()
    }

    user.password = newPassword // será hasheada automaticamente
    await user.save()

    session.flash('success', 'Senha alterada com sucesso!')
    return response.redirect('/meuPerfil')
  }
}
