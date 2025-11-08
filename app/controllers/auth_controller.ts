import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.query().where('email', email).first()

    if (!user || user.password !== password) {
      return response.status(401).send({ message: 'Credenciais inválidas' })
    }

    return response.redirect('/meuPerfil')
  }
}