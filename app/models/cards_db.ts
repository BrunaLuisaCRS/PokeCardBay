import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CardsDb extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare apiId: string

  @column()
  declare name: string

  @column()
  declare number: string

  @column()
  declare rarity: string | null

  @column()
  declare imageUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}