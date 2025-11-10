import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'market_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // ID interno do banco (para permitir vendas repetidas da mesma carta)
      table.increments('id')

      // Dados da Carta (Vindos da API)
      table.string('card_api_id').notNullable() // Ex: "swsh1-1"
      table.string('name').notNullable()
      table.string('image_url').notNullable()
      table.string('rarity').nullable()
      
      // Dados da Venda
      table.decimal('price', 10, 2).notNullable() // Preço estipulado pelo usuário
      
      // Dados do Usuário (Conexão)
      table.string('user_name').notNullable()
      table.string('user_email').notNullable() // Conexão via email como solicitado
      
      // Chave estrangeira (opcional mas recomendado para integridade)
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}