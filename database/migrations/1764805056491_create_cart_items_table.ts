import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Relacionamento: De quem é este item?
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      
      // Relacionamento: Qual carta está sendo comprada?
      table.integer('market_card_id').unsigned().references('id').inTable('market_cards').onDelete('CASCADE')
      
      // Quantidade de cartas iguais
      table.integer('quantity').defaultTo(1)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}