import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    full_name: vine.string().minLength(3).maxLength(255),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        // Verifica se o email ja existe na tabela users
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(8).confirmed(),

  })
)