'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'A value for "Title" is required'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'A value for "Author" is required'
        }
      }
    },
    genre: DataTypes.STRING,
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        custom(value) {
          if (value && !/\d+/gm.test(value)){
            throw new Error('An integer is required for the value "year"')
          }
        }
        // isInt: {
        //   msg: 'An integer is required for the value "Year"'
        // }
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};