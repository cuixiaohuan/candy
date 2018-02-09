import { hx } from "../../common/_tools";

var CFlex = Vue.extend({
    props: {
        column: Boolean,
        wrap:  String,
        justifyContent: {
          type: String,
          default: ''
        },
        alignItems: {
          type: String,
          default: ''
        },
        alignContent: {
          type: String,
          default: ''
        },
        gutter: {
          type: [String, Number],
          default: 0
        },
        direction: {
          type: String,
          default: ''
        }
    },
    computed :{
        styleList () {

            var style = {}

            if (this.column) {
              style['flex-direction'] = 'column'
            }

            if ( !this.wrap ) {
              style['flex-wrap'] = 'wrap'
            } else {
              style['flex-wrap'] = this.wrap
            }

            if (this.justifyContent) {
              style['justify-content'] = this.justifyContent
            }

            if (this.alignItems) {
              style['align-items'] = this.alignItems
            } else {
              if (!this.column) {
                style['align-items'] = 'center'
              }
            }

            if (this.alignContent) {
              style['align-content'] = this.alignContent
            }

            const gutter = parseFloat(this.gutter)
            if (gutter) {
              style['margin'] = -(gutter / 2) + 'px'
            }

            if (this.direction) {
                style['flex-direction'] = this.direction
            }

            return style
        }
    },
    render (h) {

        var me = this,
            $flex

        $flex = hx('div.c-flex', {
            style: me.styleList
        }, me.$slots['default'])

        return $flex.resolve(h)
    }
})

var CItem = Vue.extend({
    props: {
        flex: [Boolean, String, Number],
        order: {
          type: String,
          default: ''
        },
        grow: {
          type: String,
          default: ''
        },
        shrink: {
          type: String,
          default: ''
        },
        basis: {
          type: String,
          default: ''
        },
        alignSelf: {
          type: String,
          default: ''
        },
        offset: [String, Number],
        span: [Number, String]
    },
    computed: {
        styleList () {
            var style = {}

            var gutter = parseFloat(this.$parent.gutter)
      
            if (gutter) {
              style['padding'] = (gutter / 2) + 'px'
            }
      
            if (this.flex === true) {
              style['flex'] = '1'
            } else if (this.flex !== false) {
              style['flex'] = String(this.flex)
            }
      
            if (this.order) {
              style['order'] = this.order
            }
      
            if (this.grow) {
              style['flex-grow'] = this.grow
            }
      
            if (this.shrink) {
              style['flex-shrink'] = this.shrink
            }
      
            if (this.basis) {
              style['flex-basis'] = this.basis
            }
      
            if (this.alignSelf) {
              style['align-self'] = this.alignSelf
            }

            if (this.span) {
                style["flex-grow"] = this.span
            }

            return style
        },
        clsObj () {
            var clsObj = ["c-flex__item"]
            if(this.offset){
                clsObj.push("c-flex__item-offset_"+this.offset)
            }
            return clsObj
        }
    },
    render (h) {
        var $item, 
            me = this
        
        $item = hx(`div.${this.clsObj.join("+")}`, {
            style: me.styleList
            
        }, [me.$slots['default']])
        
        return $item.resolve(h)

    }
})

Vue.component('c-flex', CFlex)

Vue.component('c-item', CItem)