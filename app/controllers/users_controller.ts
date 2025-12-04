import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user_validator' 

export default class UsersController {
  
  public async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('users/index', { users })
  }

  public async store({ request, response, session }: HttpContext) {
    try {
      // 1. Validar
      const data = await request.validateUsing(createUserValidator)
      
      console.log(' Enviando senha pro User.create...')

      await User.create({
        full_name: data.full_name,
        email: data.email,
        password: data.password 
      })

      // 6. td, redireciona pro login
      return response.redirect('/login')
    
    } catch (error) {
      // ... catch ...
      session.flashAll()
      session.flash('errors', error.messages)
      return response.redirect().back()
    }
  }
}