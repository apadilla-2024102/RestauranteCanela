module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING,
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
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    deliveryAddress: {
      type: DataTypes.TEXT
    },
    notes: {
      type: DataTypes.TEXT
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
    tableName: 'orders'
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
  };

  return Order;
};