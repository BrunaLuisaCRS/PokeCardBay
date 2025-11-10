import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env' 

export default class CardSearchesController { 

  public async search({ request, response }: HttpContext) {
    // 'q' vem do input de Número (ex: 117)
    const cardNumber = request.input('q', '').trim()
    // 'total' vem do input de Total (ex: 146)
    const setTotal = request.input('total', '').trim()
    
    const page = request.input('page', 1)
    
    // Paginação de 100 para garantir que encontramos a carta na lista,
    // pois números baixos (ex: 1) existem em centenas de sets.
    const pageSize = 100 

    if (!cardNumber) {
      return response.badRequest({ error: 'Número da carta é obrigatório.' })
    }

    const apiKey = env.get('POKEMON_TCG_API_KEY')
    if (!apiKey) {
      return response.internalServerError({ error: 'API Key não configurada.' })
    }

    // --- 1. LÓGICA INTELIGENTE DE NÚMEROS ---
    const numberQueries: string[] = []
    
    // Busca Exata (ex: "117")
    // Aspas são cruciais para a API tratar como string exata e não número parcial
    numberQueries.push(`number:"${cardNumber}"`)

    // Se for numérico, adiciona variação com zero à esquerda (ex: "0117")
    // A API às vezes guarda "117", às vezes "0117". Isso cobre ambos os casos.
    if (/^\d+$/.test(cardNumber)) {
        numberQueries.push(`number:"0${cardNumber}"`)
    }

    // Junta com OR: (number:"117" OR number:"0117")
    const numberClause = `(${numberQueries.join(' OR ')})`

    // --- 2. FILTRO DE TOTAL DO SET ---
    let setClause = ''
    if (setTotal) {
        // Se o total for fornecido, filtramos também por ele.
        // Importante: set.printedTotal geralmente funciona melhor SEM aspas para números na API.
        // Ex: set.printedTotal:146
        setClause = ` set.printedTotal:${setTotal}`
    }

    // --- 3. QUERY FINAL ---
    // Exemplo: (number:"117" OR number:"0117") set.printedTotal:146
    const query = `${numberClause}${setClause}`

    // Monta URL
    // orderBy=-set.releaseDate ordena do mais recente para o mais antigo
    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}&orderBy=-set.releaseDate`
    
    console.log(`[API SEARCH] Query: ${query}`) 

    try {
      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: { 'X-Api-Key': apiKey },
      })

      // Se a API não encontrar nada (404), retornamos vazio em vez de erro
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