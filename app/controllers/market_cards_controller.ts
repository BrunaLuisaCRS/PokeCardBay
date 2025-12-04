import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import MarketCard from '#models/market_card'
import CardsDb from '#models/cards_db' // Importando o banco local de cartas

export default class MarketCardsController {

  // 1. Busca detalhes da carta (Usado internamente ou para validação)
  public async searchApi({ request, response }: HttpContext) {
    const cardId = request.input('id') 
    const apiKey = env.get('POKEMON_TCG_API_KEY')

    if (!cardId) return response.badRequest({ error: 'ID da carta necessário' })

    try {
      // 1º Tenta buscar no banco local (mais rápido)
      const localCard = await CardsDb.findBy('api_id', cardId)
      
      if (localCard) {
         return {
            id: localCard.apiId,
            name: localCard.name,
            number: localCard.number,
            images: { small: localCard.imageUrl, large: localCard.imageUrl }, 
            rarity: localCard.rarity
         }
      }

      // 2º Fallback para API oficial se não achar no local (opcional)
      const url = `https://api.pokemontcg.io/v2/cards/${cardId}`
      const apiResponse = await fetch(url, {
        headers: { 'X-Api-Key': apiKey || '' }
      })

      if (!apiResponse.ok) throw new Error('Carta não encontrada')
      const json: any = await apiResponse.json()
      return json.data 

    } catch (error) {
      return response.notFound({ error: 'Carta não encontrada.' })
    }
  }

  // 3. Autocomplete (BUSCA NO BANCO LOCAL PARA O DROPDOWN)
  public async autocomplete({ request, response }: HttpContext) {
    const q = request.input('q', '').trim() 

    if (q.length < 1) return response.json([])

    try {
      // Busca no banco local (cards_dbs)
      // Procura pelo nome OU pelo número da carta
      const cards = await CardsDb.query()
        .where('name', 'like', `%${q}%`)
        .orWhere('number', 'like', `${q}%`)
        .orderBy('name', 'asc')
        // Limite removido conforme solicitado, retornará todos os resultados encontrados

      // Mapeia para o formato que o JavaScript (venda.edge) espera
      const results = cards.map(c => ({
        id: c.apiId,
        name: c.name,
        number: c.number,
        image: c.imageUrl,
        rarity: c.rarity || 'Desconhecida'
      }))

      return response.json(results)

    } catch (error) {
      console.error('ERRO NO BANCO LOCAL:', error)
      return response.status(500).json({ error: 'Erro ao buscar no banco local.' })
    }
  }

  // 2. Salva a venda no banco (POST /vender)
  public async store({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    // Captura os dados do formulário
    const data = request.only(['card_api_id', 'card_name', 'card_image', 'card_rarity', 'price'])

    try {
      await MarketCard.create({
        cardApiId: data.card_api_id,
        name: data.card_name,
        imageUrl: data.card_image,
        rarity: data.card_rarity,
        price: data.price,
        userId: user.id,
        // Mantendo user.full_name conforme solicitado
        // (Certifique-se que no model User existe essa propriedade ou coluna)
        userName: user.full_name || 'Usuário', 
        userEmail: user.email
      })

      session.flash('success', 'Anúncio criado com sucesso!')
      
      // Redireciona de volta para a página de vender para continuar cadastrando
      return response.redirect('/vender')

    } catch (error) {
      console.log(error)
      session.flash('error', 'Erro ao criar anúncio.')
      return response.redirect().back()
    }
  }
}