import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env' 

export default class CardSearchesController { 

  public async search({ request, response }: HttpContext) {
    // 'q' agora representa especificamente o NÚMERO da carta
    const cardNumber = request.input('q', '').trim()
    
    // Novo parâmetro opcional: Total do Set
    const setTotal = request.input('total', '').trim()
    
    const page = request.input('page', 1)
    const pageSize = 100 // Mantemos 100 para garantir que apareça na lista

    if (!cardNumber) {
      return response.badRequest({ error: 'Número da carta é obrigatório.' })
    }

    const apiKey = env.get('POKEMON_TCG_API_KEY')
    if (!apiKey) {
      return response.internalServerError({ error: 'API Key não configurada.' })
    }

    // --- CONSTRUÇÃO DA QUERY COMPOSTA ---
    
    // 1. Busca Base: Sempre pelo número (Collector Number)
    let query = `number:"${cardNumber}"`

    // 2. Filtro Opcional: Se o usuário digitou o total (ex: 198), adicionamos à busca
    // Na API, isso é o campo 'set.printedTotal'
    if (setTotal) {
        query += ` set.printedTotal:"${setTotal}"`
    }

    // Monta a URL
    // orderBy=-set.releaseDate mostra os sets mais novos primeiro
    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}&orderBy=-set.releaseDate`
    
    console.log(`[API SEARCH] Query: ${query}`) 

    try {
      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: { 'X-Api-Key': apiKey },
      })

      if (apiResponse.status === 404) {
        return { data: [], totalCount: 0, count: 0, page: 1 }
      }

      if (!apiResponse.ok) {
        const errText = await apiResponse.text().catch(() => 'Sem detalhes')
        console.error(`[API ERROR] Status: ${apiResponse.status} - ${errText}`)
        throw new Error(`Status API: ${apiResponse.status}`)
      }

      const data: any = await apiResponse.json() 
      return data

    } catch (error) {
      console.error('[API EXCEPTION]', error)
      return response.internalServerError({ error: 'Erro na busca de cartas.' })
    }
  }
}