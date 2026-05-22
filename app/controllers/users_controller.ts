import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user_validator'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  
  public async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('users/index', { users })
  }

  public async store({ request, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(createUserValidator)

      console.log('👀 Enviando senha CRUA para o User.create...')

      await User.create({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      })

      return response.redirect('/login')
    
    } catch (error) {
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

    user.password = newPassword // Hash feito automaticamente pelo model
    await user.save()

    session.flash('success', 'Senha alterada com sucesso!')
    return response.redirect('/meuPerfil')
  }
}
