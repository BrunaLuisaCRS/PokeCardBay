import type { HttpContext } from '@adonisjs/core/http'
import CartItem from '#models/cart_item'

export default class CheckoutController {

  public async confirm({ auth, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    try {
        // 1. Busca os itens do carrinho
        const cartItems = await CartItem.query()
            .where('user_id', user.id)
            .preload('marketCard')

        if (cartItems.length === 0) {
            session.flash('error', 'Seu carrinho está vazio.')
            return response.redirect('/')
        }

        // 2. Remove as cartas compradas do banco a venda (market_cards)
        for (const item of cartItems) {
            if (item.marketCard) {
                await item.marketCard.delete()
            }
        }

        // 3. Limpa o carrinho do user
        await CartItem.query()
            .where('user_id', user.id)
            .delete()

        // 4. Flash Message de sucesso
        session.flash('success', 'Pagamento efetuado com sucesso')
        
        // 5. Redireciona para a Home
        return response.redirect('/')

    } catch (error) {
        console.error(error)
        session.flash('error', 'Erro ao processar o pagamento.')
        return response.redirect().back()
    }
  }
}