import {hx} from '../../common/_tools.js'

var CInput = Vue.extend({
    props: {
        type: {
            type: String,
            default: 'text',
        },
        pattern: String,
        label: '',
        placeholder: '',
        title: String,
        labelWidth: String,
        hasError: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        cls () {
            
            var cls = []
            if (this.hasError) {
                cls.push('c-cell_warn')
            }
            return cls
        }
    },
    render (h) {
        var me = this
        var params = {
            domProps: {
                type: me.type,
                pattern: me.pattern,
                placeholder: me.placeholder,
                title: me.title
            },
        }

        var $inputs = hx('input.c-input', params)
        var $bd = hx('div.c-cell__bd', {}, [$inputs])

        
        var labelParams = {
            domProps: {
                innerHTML: me.label
            }
        }
        var $label = hx('label.c-label', labelParams)

        var hdParams = {}
        if(!!me.labelWidth) {
            hdParams.style = {
                width: me.labelWidth
            }
        }
        var $hd = hx('div.c-cell__hd', hdParams, [$label])

        // <div class="c-cell">
        //     <div class="c-cell__hd"><label class="c-label">qq</label></div>
        //     <div class="c-cell__bd">
        //         <input class="c-input" type="number" pattern="[0-9]*" placeholder="请输入qq号"/>
        //     </div>
        // </div>

        var $children = [$hd, $bd]
        if (me.hasError) {

            var $i = hx('i.c-icon-warn + ion-ios-information')
            var $ft = hx('div.c-cell__ft', {}, [$i])
            $children.push( $ft )
        }

        var $input = hx(`div.c-cell + ${me.cls.join("+")}`, {}, $children)

        return $input.resolve(h)
    }
})

Vue.component('c-input', CInput)