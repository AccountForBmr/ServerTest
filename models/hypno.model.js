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
}, {
    timestamps: true
})

module.exports = mongoose.model('Hypno', hypnoSchema)

/*
const _templateHypno = {
    "name": "New",
    "spawnTime": "500",
    "values": [
      {
        "type": "word",
        "imgUrl": "https://battlemageroyal.com/assets/img/logo_battlemageroyal.png",
        "width": "auto",
        "height": "auto",
        "value": "Word",
        "leaveTime": "5000",
        "position": "Random",
        "font": ["64","128"],
        "color": "Random",
        "border": "#000000",
        "gradient": "None",
        "opacity": "0.5",
        "rotation": ["-45","45"],
        "smart": "Yes",
        "animation": "None"
      }
    ],
    "selectedValue": 0,
    "selectedGradient": 0,
    "selectedGradientColor": 0,
    "selectedKeyframe": 0,
    "selectedKeyframeValue": 0
  };

*/

