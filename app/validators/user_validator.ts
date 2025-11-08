import vine from '@vinejs/vine'

/**
 * Validador para criação de usuário.
 * O campo 'password' será validado para ter confirmação
 * (o campo 'password_confirmation' deve existir no formulário).
 */
export const createUserValidator = vine.compile(
  vine.object({
    full_name: vine.string().minLength(3).maxLength(255),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        // Verifica se o email já existe na tabela 'users'
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'confirmpassword' }),
    // 'password_confirmation' é inferido e obrigatório
    // por causa do .confirmed() acima.
  })
)