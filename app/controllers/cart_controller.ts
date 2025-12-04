import type { HttpContext } from '@adonisjs/core/http'
import CartItem from '#models/cart_item'

export default class CartController {

  // Função auxiliar para tratar o preço (converte "10,50" ou "10.50" para número JS)
  private parsePrice(price: any): number {
    if (!price) return 0
    // Se já for número, retorna
    if (typeof price === 'number') return price
    // Se for string, remove R$, espaços e troca vírgula por ponto
    const stringPrice = String(price).replace('R$', '').trim().replace(',', '.')
    const numberPrice = parseFloat(stringPrice)
    return isNaN(numberPrice) ? 0 : numberPrice
  }

  // 1. EXIBIR O CARRINHO
  public async index({ view, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    // Busca os itens e carrega os dados da carta associada (tabela market_cards)
    const items = await CartItem.query()
      .where('user_id', user.id)
      .preload('marketCard') 
      .orderBy('created_at', 'desc')

    let subtotal = 0
    
    // Calcula o subtotal com tratamento de erro para NaN
    items.forEach(item => {
      if (item.marketCard && item.marketCard.price) {
        const price = this.parsePrice(item.marketCard.price)
        subtotal += price * item.quantity
      }
    })

    return view.render('carrinho', { items, subtotal })
  }

  // 2. ADICIONAR
  public async add({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const cardId = request.input('market_card_id')

    if (!cardId) {
        return response.badRequest({ message: 'ID da carta inválido' })
    }

    // Verifica se já tem esse item no carrinho
    const existingItem = await CartItem.query()
      .where('user_id', user.id)
      .where('market_card_id', cardId)
      .first()

    if (existingItem) {
      existingItem.quantity += 1
      await existingItem.save()
    } else {
      await CartItem.create({
        userId: user.id,
        marketCardId: cardId,
        quantity: 1
      })
    }

    return response.json({ message: 'Adicionado com sucesso!' })
  }

  // 3. REMOVER
  public async remove({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    
    await CartItem.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .delete()

    return response.redirect().back()
  }
}