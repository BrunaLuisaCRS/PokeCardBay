import vine from '@vinejs/vine'

/*
        Valida o formulário de login.
        Apenas verifica se os campos existem e estão no formato correto.
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)