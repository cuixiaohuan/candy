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
    disabled: Boolean,
    icon: String,
    iconPosition: {
        type: String,
        default: "left"
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cls () {
      var cls = []
      this.type.split(' ').forEach(function(item) {
        cls.push(`c-btn_${item}`)
      });
      
      if (this.disabled || this.loading){
        cls.push('c-btn_disabled')
      }

      if (this.size === 'mini'){
        cls.push('c-btn_mini')
      }

      if(this.loading){
        cls.push('c-btn_loading')
      }
      
      return cls
    }
  },
  methods: {
    triggerClick () {
      if (this.disabled || this.loading) return 
      this.$emit('click')
    }
  },
  render (h) {
    var me = this
    var params = {
      domProps: {
        type: me.htmlType,
      },
      on: {
        click(){
          me.triggerClick()
        }
      }
    }
    if (me.disabled){
      params.domProps['disabled'] = 'disabled'
    }
    
    var $btn = hx(`button.c-btn + ${me.cls.join('+')}`, params)
    var $btnTxt = null
    if(me.$slots.default) {
        $btnTxt = hx('span', {}, [me.$slots.default])        
    }

    var $children = []

    if(me.loading) {
      var $loading = hx('c-loading', {
        props: {
          size: me.size === 'mini'? 17: 20
        }
      })
      $children.push($loading)
    }

          
    if(!!me.icon) {
        var $icon = hx(`i.c-btn_icon+${me.icon}`)

        if(me.iconPosition === "left") {
            $children.push($icon)
            $children.push($btnTxt)

        } else if(me.iconPosition === "right") {
            $children.push($btnTxt)
            $children.push($icon)
        }
    } else {
        $children.push($btnTxt)
    }

    $btn.push($children)
    return $btn.resolve(h)
  }
})

Vue.component('c-button', CButton)