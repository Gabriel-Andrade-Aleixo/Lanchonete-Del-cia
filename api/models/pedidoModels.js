module.exports = (sequelize, DataTypes) => {
    const Pedido = sequelize.define('Pedido', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      cliente_nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pendente'
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'pedidos',
      timestamps: true
    });
  
    Pedido.associate = (models) => {
      Pedido.belongsToMany(models.Cardapio, {
        through: 'PedidoItens',
        foreignKey: 'pedidoId',
        otherKey: 'cardapioId'
      });
    };
  
    return Pedido;
  };
  