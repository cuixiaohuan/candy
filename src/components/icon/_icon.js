import {hx} from '../../common/_tools.js'

var CIcon = Vue.extend({
  props: {
    type: {
      type: String,
      default: 'default',
    },
    icon: String
  },
  computed: {
    cls () {
      var cls = []
      this.type.split(' ').forEach((item) => {
        cls.push(`c-icon-${item}`)
      });
      
      cls.push( this.icon )
      return cls
    }
  },
  render (h) {
    var me = this,
        $icon

    var params = {
      domProps: {
      },
    }
    
    $icon = hx(`i.${me.cls.join('+')}`)
    return $icon.resolve(h)
  }
})

Vue.component('c-icon', CIcon)