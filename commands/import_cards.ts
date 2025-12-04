import { BaseCommand, args } from '@adonisjs/core/ace'
import CardsDb from '#models/cards_db'
import env from '#start/env'

export default class ImportCards extends BaseCommand {
  static commandName = 'import:cards'
  static description = 'Importa cartas para o banco local (Resume suportado)'

  static options = {
    startApp: true
  }

  // Define um argumento opcional: a página inicial
  @args.string({ description: 'Número da página para começar', required: false })
  declare startPage: string

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async run() {
    // Se o usuário digitou um número, usa ele. Se não, começa do 1.
    let page = this.startPage ? parseInt(this.startPage) : 1
    
    // REDUZIDO DE 250 PARA 100 (Mais estabilidade)
    const pageSize = 100 
    const apiKey = env.get('POKEMON_TCG_API_KEY')
    
    let hasMore = true
    let totalImported = 0
    let errorsInARow = 0

    this.logger.info(`=== Iniciando Importação na PÁGINA ${page} ===`)
    this.logger.info(`Tamanho do lote: ${pageSize} cartas por vez`)

    while (hasMore) {
      try {
        this.logger.info(`Baixando página ${page}...`)

        const url = `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${pageSize}`
        
        const response = await fetch(url, {
          headers: { ...(apiKey ? { 'X-Api-Key': apiKey } : {}) }
        })

        // --- TRATAMENTO DE ERROS ---
        
        // Erro 429: Rate Limit (Muitas requisições)
        if (response.status === 429) {
          this.logger.warning('Rate Limit (429)! Esperando 60 segundos...')
          await this.sleep(60000)
          continue // Tenta a MESMA página de novo
        }

        // Erro 404, 500, 502, 504 (Erros de Servidor)
        if (!response.ok) {
          this.logger.error(`Erro na API (Status ${response.status}) na página ${page}`)
          errorsInARow++
          
          if (errorsInARow >= 3) {
            this.logger.fatal('Muitos erros seguidos. Parando para segurança.')
            this.logger.info(`>>> PARA CONTINUAR, RODE: node ace import:cards ${page}`)
            break
          }
          
          this.logger.warning('Tentando novamente em 10 segundos...')
          await this.sleep(10000)
          continue
        }

        // --- SUCESSO ---
        errorsInARow = 0 // Reseta contador de erro
        const json: any = await response.json()
        const cards = json.data

        // Se veio vazio, acabou as cartas
        if (!cards || cards.length === 0) {
          hasMore = false
          this.logger.success('Todas as cartas foram importadas!')
          break
        }

        // Salva no banco
        for (const card of cards) {
          await CardsDb.updateOrCreate({ apiId: card.id }, {
            apiId: card.id,
            name: card.name,
            number: card.number,
            rarity: card.rarity || 'Desconhecida',
            imageUrl: card.images.small
          })
        }

        totalImported += cards.length
        this.logger.success(`Página ${page} OK. (+${cards.length} cartas).`)

        page++
        
        // Delay de segurança entre páginas
        await this.sleep(1500) 

      } catch (error) {
        this.logger.error('Erro Fatal de Conexão: ' + error.message)
        this.logger.info(`>>> PARA CONTINUAR, RODE: node ace import:cards ${page}`)
        break
      }
    }
  }
}