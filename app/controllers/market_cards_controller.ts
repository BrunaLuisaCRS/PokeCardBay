import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import MarketCard from '#models/market_card'

export default class MarketCardsController {

  // 1. Busca detalhes da carta para o Preview (GET /api/market/search?id=xyz)
  public async searchApi({ request, response }: HttpContext) {
    const cardId = request.input('id') // Ex: "xy1-1"
    const apiKey = env.get('POKEMON_TCG_API_KEY')

    if (!cardId) return response.badRequest({ error: 'ID da carta necessário' })

    try {
      // Busca específica por ID na API oficial
      const url = `https://api.pokemontcg.io/v2/cards/${cardId}`
      const apiResponse = await fetch(url, {
        headers: { 'X-Api-Key': apiKey || '' }
      })

      if (!apiResponse.ok) throw new Error('Carta não encontrada')

      // Tipamos como 'any' para evitar erro de tipo "unknown"
      const json: any = await apiResponse.json()
      
      // A API retorna { data: { ... } }, então retornamos json.data
      return json.data 

    } catch (error) {
      return response.notFound({ error: 'Carta não encontrada. Verifique o ID.' })
    }
  }

  // 3. Autocomplete (MODO DEBUG)
  public async autocomplete({ request, response }: HttpContext) {
    const q = request.input('q', '').trim() 
    const apiKey = env.get('POKEMON_TCG_API_KEY')

    if (q.length < 1) return response.json([])

    try {
      // Aspas duplas para busca exata
      const queryStr = `name:"${q}*" OR number:"${q}*"`
      
      // Importante: pageSize=15 economiza banda da API
      const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(queryStr)}&pageSize=15`

      console.log(`--- TENTANDO BUSCAR: ${q} ---`)
      console.log(`URL: ${url}`)

      const apiResponse = await fetch(url, {
        headers: { 
            // Se tiver API Key, usa. Se não, vai sem (limite menor)
            ...(apiKey ? { 'X-Api-Key': apiKey } : {}) 
        },
      })

      // AQUI VAMOS DESCOBRIR O ERRO
      if (!apiResponse.ok) {
        console.error(`!!! ERRO API !!! Status: ${apiResponse.status}`)
        
        // Se for erro de servidor (500, 502, 504), avisa o front
        if (apiResponse.status >= 500) {
            return response.status(503).json({ error: 'Sistema de cartas instável. Tente mais tarde.' })
        }
        
        // Se for limite de uso (429)
        if (apiResponse.status === 429) {
            return response.status(429).json({ error: 'Muitas buscas. Aguarde 1 min.' })
        }
        
        return response.json([]) 
      }

      const json: any = await apiResponse.json()
      console.log(`Sucesso! Encontradas: ${json.data.length} cartas.`)

      const results = json.data?.map((c: any) => ({
        id: c.id,
        name: c.name,
        number: c.number,
        image: c.images?.small,
        rarity: c.rarity ?? 'Unknown'
      })) || []

      return response.json(results)

    } catch (error) {
      console.error('ERRO NO SERVIDOR:', error)
      return response.status(500).json({ error: 'Erro interno.' })
    }
  }

  // 2. Salva a venda no banco (POST /vender)
  public async store({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail() // Garante que tem usuário logado
    
    // Recebe os dados do formulário oculto + preço
    const data = request.only(['card_api_id', 'card_name', 'card_image', 'card_rarity', 'price'])

    try {
      await MarketCard.create({
        cardApiId: data.card_api_id,
        name: data.card_name,
        imageUrl: data.card_image,
        rarity: data.card_rarity,
        price: data.price,
        // Dados do Usuário Logado
        userId: user.id,
        // Mantive user.full_name como no seu original. 
        // Se der erro de TS, verifique se no seu Model User é 'fullName' ou 'full_name'
        userName: user.full_name || 'Usuário', 
        userEmail: user.email
      })

      session.flash('success', 'Anúncio criado com sucesso!')
      return response.redirect('/meuPerfil')

    } catch (error) {
      console.log(error)
      session.flash('error', 'Erro ao criar anúncio.')
      return response.redirect().back()
    }
  }
}