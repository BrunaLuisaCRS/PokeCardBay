// import type { HttpContext } from '@adonisjs/core/http'

/*export default class UsersController {
}*/

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  public async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('users/index', { users })
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only(['full_name', 'email', 'password'])
    
    // validação simples de senha confirmada
    const confirmPassword = request.input('confirmpassword')
    if (data.password !== confirmPassword) {
      return response.badRequest({ error: 'As senhas não coincidem' })
    }

    await User.create(data)
    return response.redirect('/login')
  }
}