import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
  declare userName: string

  @column()
  declare userEmail: string

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}