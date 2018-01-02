import {hx} from '../../common/_tools.js'

var CButton = Vue.extend({
  props: {
    type: {
      type: String,
      default: 'default',
    },
    size: String, // mini
    htmlType: {
      type: String,
      default: 'button',
    },
    disabled: Boolean
  },
  computed: {
    cls () {
      var cls = []
      this.type.split(' ').forEach(function(item) {
        cls.push(`c-btn_${item}`)
      });
      
      if (this.disabled){
        cls.push('c-btn_disabled')
      }

      if (this.size === 'mini'){
        cls.push('c-btn_mini')
      }
      
      return cls
    }
  },
  render (h) {
    var params = {
      domProps: {
        type: this.htmlType,
      },
    }

    if (this.disabled){
      params.domProps['disabled'] = 'disabled'
    }

    var $btn = hx(`button.c-btn + ${this.cls.join('+')}`, params)
    var $btnTxt = hx('span', {}, [this.$slots.default])

    var $children = [$btnTxt]

    $btn.push($children)
    return $btn.resolve(h)
  }
})

Vue.component('c-button', CButton)