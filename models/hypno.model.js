const mongoose = require('mongoose')
const { Schema } = mongoose

const hypnoSchema = new Schema({
  name: {
    type: String,
    require: true
  }, 
  spawnTime: {
    type: String,
    require: true
  },
  values: {
    type: Array,
    require: true
  },
  selectedValue: {
    type: Number
  },
  selectedGradient: {
    type: Number
  },
  selectedGradientColor: {
    type: Number
  },
  selectedKeyframe: {
    type: Number
  },
  selectedKeyframeValue: {
    type: Number
  }
})

module.exports = mongoose.model('Hypno', hypnoSchema)
