import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards_dbs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // ID original da API (ex: "xy1-1") - Único para não duplicar
      table.string('api_id').notNullable().unique().index()
      
      // Dados para busca e exibição
      table.string('name').notNullable().index() // Index ajuda na busca por nome
      table.string('number').notNullable()
      table.string('rarity').nullable()
      table.string('image_url').nullable() // Vamos salvar a URL da imagem pequena
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}