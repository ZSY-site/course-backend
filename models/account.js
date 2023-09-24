const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Account', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    head_img: {
      type: DataTypes.STRING(524),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pwd: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    slogan: {
      type: DataTypes.STRING(524),
      allowNull: true
    },
    sex: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    learn_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vip_rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vip_expired: {
      type: DataTypes.DATE,
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
    disabled: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    openid: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    unionid: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'account',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
