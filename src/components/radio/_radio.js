import { hx } from "../../common/_tools";

var CRadio = Vue.extend({
    model: {
        prop: 'checkedValue',
        event: 'input',
    },
    props: {
        checkedValue: [String, Number, Boolean],
        value: {
            type: [String, Number, Boolean],
            default: true,
        },
        // label: [String, Number],
    },
    computed :{
        cls () {
            var cls = []
            if (this.checked) {
                cls.push('ion-checkmark-round')
            }
            return cls
        },
        checked(){

            if (this.isGroupParent){
                return this.$parent.checkedValue === this.value
            } else {
                return (this.checkedValue === this.value) || (this.checkedValue === true)
            }
            // return (this.checkedValue === this.value) || (this.checkedValue === true)
        },
        isGroupParent () {
          return this.$parent instanceof CRadioGroup
        },
    },
    render (h) {
        var me = this
        var params = {
        }
        //     <label class="c-cell c-check__label" for="x11">
        //         <div class="c-cell__bd">
        //             <p>cell standard</p>
        //         </div>
        //         <div class="c-cell__ft">
        //             <input type="radio" class="c-check" name="radio1" id="x11"/>
        //             <span class="c-icon-checked"></span>
        //         </div>
        //     </label>

        var $p = hx(`p`, {}, [this.$slots.default])
        var $bd = hx(`div.c-cell__bd`, {}, [$p])
        
        var $input = hx(`input.c-check`, {
            attrs: {
                type: "radio",
                // name: me.checkedValue
            },
        })
        var $span = hx(`span.c-icon-checked + ${this.cls.join('+')}`, {})

        var $ft = hx(`div.c-cell__ft`, {}, [$input, $span])

        
        var $label = hx('label.c-cell+c-check__label', {
            on: {
                click () {
                    if (me.isGroupParent){
                        me.$parent.$emit('input', me.value)
                    } else {
                        me.$emit('input', me.value)
                    }
                }
            }
        }, [$bd, $ft])
        
        // var $radio = hx(`div.c-cells+c-cells_radio`, {
        //     on: {
        //         click () {
        //             me.$emit('input', me.value)
        //         }
        //     }
        // }, [$label])
    
        return $label.resolve(h)
    }
})

var CRadioGroup = Vue.extend({
    model: {
      prop: 'checkedValue',
      event: 'input',
    },
    props: {
      checkedValue: [String, Number],
    },
    computed: {
    },
    render (h) {
      var children = this.$slots.default
  
      return hx(`div.c-radio-group+c-cells`, {}, [children]).resolve(h)
    }
  })
  

Vue.component('c-radio', CRadio)
Vue.component('c-radio-group', CRadioGroup)