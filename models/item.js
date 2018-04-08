module.exports = function (sequelize, DataTypes) {
  const Item = sequelize.define("Item", {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    runner_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    benefactor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    raised: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    target: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM,
      values: ["Tech & Innovation", "Creative Works", "Communities"],
      allowNull: false
    },
    story: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Item
}
