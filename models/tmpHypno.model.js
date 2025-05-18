const mongoose = require('mongoose')
const { Schema } = mongoose

const tmpHypnoSchema = new Schema({
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
  },
  createdAt: {
    type: Date
  }
})

module.exports = mongoose.model('TmpHypno', tmpHypnoSchema)
