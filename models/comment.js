const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Comment', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    account_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    head_img: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    up: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    gmt_create: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gmt_modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    content_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    easy_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    logic_point: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    del: {
      type: DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'comment',
    timestamps: false
  });
};
