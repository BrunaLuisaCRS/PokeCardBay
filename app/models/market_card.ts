import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class MarketCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cardApiId: string

  @column()
  declare name: string

  @column()
  declare imageUrl: string

  @column()
  declare rarity: string | null

  @column()
  declare price: number

  @column()
  declare userName: string | null

  @column()
  declare userEmail: string | null

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relacionamento com User
  @belongsTo(() => User, { foreignKey: 'userId' })
  public user?: BelongsTo<typeof User>
}