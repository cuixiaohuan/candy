import {hx, isArray, inArray} from '../../common/_tools.js'

var CCheckbox = Vue.extend({
    model: {
        prop: 'checkedValue',
        event: 'input',
    },
    props: {
        checkedValue: [String, Number, Boolean, Array],
        value: {
            type: [String, Number, Boolean],
            default: true,
        },
    },
    computed :{
        cls () {
            var cls = []
            if (this.checked) {
                cls.push('ion-ios-checkmark')
            } else {
                cls.push('ion-ios-circle-outline')
            }
            return cls
        },
        isGroupParent () {
          return this.$parent instanceof CCheckboxGroup
        },
        checked(){
            if(this.isGroupParent){
                return inArray(this.value, this.$parent.checkedValue)                
            } else if (isArray(this.checkedValue)){
                return inArray(this.value, this.checkedValue)                    
            } else {
                return (this.value === this.checkedValue) || (this.checkedValue === true)
            }
        },
    },
    render (h) {
        var me = this
        var params = {
        }

// <div class="c-cells c-cells_checkbox">
//     <label class="c-cell c-check__label" for="s11">
//         <div class="c-cell__hd">
//             <i class="c-icon-checked"></i>
//         </div>
//         <div class="c-cell__bd">
//             <p>standard is dealt for u.</p>
//         </div>
//     </label>
// </div>


        var $p = hx(`p`, {}, [me.$slots.default])
        var $bd = hx(`div.c-cell__bd`, {}, [$p])
        
        var $i = hx(`i.c-icon-checked + ${me.cls.join('+')}`)

        var $hd = hx(`div.c-cell__hd`, {}, [$i])

        
        var $label = hx('label.c-cell+c-check__label', {
            on: {
                click () {
                    console.log('me.checkedValue',me.checkedValue)
                    if(me.isGroupParent){
                        checkedValue = me.$parent.checkedValue
                        if (me.checked){
                            var idx = checkedValue.indexOf(me.value)
                            checkedValue.splice(idx, 1)
                        } else {
                            checkedValue.push(me.value)
                        }
                        me.$parent.$emit('input', checkedValue)
                        
                    } else {
                        if (isArray(me.checkedValue)){
                            checkedValue = me.checkedValue

                            if (me.checked){
                                var idx = checkedValue.indexOf(me.value)
                                checkedValue.splice(idx, 1)
                            } else {
                                checkedValue.push(me.value)
                            }
                        } else {
                            if (me.checked){
                                checkedValue = ''
                            } else {
                                checkedValue = me.value
                            }
                        }
                        me.$emit('input', checkedValue)
                    }
                }
            }
        }, [$hd, $bd])
        return $label.resolve(h)
    }
})

var CCheckboxGroup = Vue.extend({
    model: {
      prop: 'checkedValue',
      event: 'input',
    },
    props: {
      checkedValue: [String, Number, Array]
    },
    computed: {
      cls () {
        var cls = ['c-checkbox-group', 'c-cells']

        return cls
      },
    },
    render (h) {
      var children = this.$slots.default
  
      return hx(`div.${this.cls.join('+')}`, {}, [children]).resolve(h)
    }
})
  
Vue.component('c-checkbox', CCheckbox)
Vue.component('c-checkbox-group', CCheckboxGroup)
