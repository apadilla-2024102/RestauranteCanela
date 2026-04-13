module.exports = (sequelize, DataTypes) => {
  const Promotion = sequelize.define('Promotion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM('discount', 'coupon', 'special_offer'),
      allowNull: false
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: true
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING, // for coupons
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    validFrom: {
      type: DataTypes.DATE
    },
    validTo: {
      type: DataTypes.DATE
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'id'
      }
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
    tableName: 'promotions'
  });

  Promotion.associate = (models) => {
    Promotion.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' });
  };

  return Promotion;
};