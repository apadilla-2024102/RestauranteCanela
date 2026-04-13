module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING, // Assuming userId from auth service
      allowNull: false
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'id'
      }
    },
    items: {
      type: DataTypes.JSON, // array of { menuItemId, quantity, price }
      defaultValue: []
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'carts'
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' });
  };

  return Cart;
};