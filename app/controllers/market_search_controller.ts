// app/controllers/market_search_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class MarketSearchController {
  public async search({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const query = request.input('q', '')

    // Realiza a busca na tabela 'market_cards' pelo nome
    const cards = await db
      .from('market_cards')
      .where('name', 'like', `%${query}%`) // O % busca partes do nome
      .paginate(page, 20)

    return response.json(cards)
  }
}