import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import MarketCard from '#models/market_card'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare marketCardId: number

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- RELACIONAMENTOS ---
  
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => MarketCard)
  declare marketCard: BelongsTo<typeof MarketCard>
}