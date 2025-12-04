import type { HttpContext } from '@adonisjs/core/http'
import MarketCard from '#models/market_card'

export default class HomeController {
  async index({ view }: HttpContext) {
    // 1. Busca as 10 cartas mais caras
    const expensiveCards = await MarketCard.query()
      .orderBy('price', 'desc')
      .limit(50)

    // 2. Filtra duplicações por nome
    const uniqueCardsMap = new Map()
    expensiveCards.forEach(card => {
      if (!uniqueCardsMap.has(card.name)) {
        uniqueCardsMap.set(card.name, card)
      }
    })

    // 3. Pega as top 10 e prepara os dados seguros para o JS da View
    const rawTopCards = Array.from(uniqueCardsMap.values()).slice(0, 10)
    
    const topCards = rawTopCards.map((card) => {
      // Serializa
      const c = card.serialize()
      
      // Cria versões "seguras" das strings para usar em funções JS onclick
      // Substitui aspas simples por (\') pra n quebrar o html
      return {
        ...c,
        safeName: c.name.replace(/'/g, "\\'"),
        safeImg: c.imageUrl.replace(/'/g, "\\'"),
        safeSeller: (c.userName || 'Vendedor').replace(/'/g, "\\'"),
        safeRarity: (c.rarity || 'Desconhecida').replace(/'/g, "\\'")
      }
    })

    return view.render('home', { topCards })
  }
}