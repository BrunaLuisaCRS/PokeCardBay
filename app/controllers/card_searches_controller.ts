import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env' 

export default class CardSearchesController { 

  public async search({ request, response }: HttpContext) {
    const searchQuery = request.input('q')
    const pageSize = 16
    const page = request.input('page', 1)

    if (!searchQuery) {
      return response.badRequest({ error: 'Termo de busca não fornecido.' })
    }

    //  Pega a API Key
    const apiKey = env.get('POKEMON_TCG_API_KEY')
    

    if (!apiKey) {
      return response.internalServerError({ error: 'API Key não configurada no servidor.' })
    }

    const url = `https://api.pokemontcg.io/v2/cards?q=name:${searchQuery}*&pageSize=${pageSize}&page=${page}`

    try {
      console.log('[API SEARCH] A iniciar "fetch"...')
      
      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: { 
          'X-Api-Key': apiKey // Envia a chave
        },
      })
      if (!apiResponse.ok) {

        const errorBody = await apiResponse.text() 
        console.log(`[API SEARCH] Erro da API externa: ${errorBody}`)
        
        throw new Error(`Falha ao buscar dados. Status: ${apiResponse.status}`)
      }

      const data: any = await apiResponse.json() 
      return data

    } catch (error) {
      return response.internalServerError({ error: 'Erro interno ao processar a busca.' })
    }
  }
}