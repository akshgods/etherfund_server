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
    runner: {
      type: DataTypes.STRING,
      allowNull: false
    },
    runner_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    beneficiary: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contractAddress: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cardImgUrl: {
      type: DataTypes.STRING
    },
    storyImgUrl: {
      type: DataTypes.STRING
    },
    startDate: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date(),
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    raised: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
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
      type: DataTypes.TEXT
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Item
}
