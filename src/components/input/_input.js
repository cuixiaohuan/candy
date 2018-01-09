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
        labelWidth: String
    },
    computed: {
        cls () {
        var cls = []
        this.type.split(' ').forEach(function(item) {
            cls.push(`c-btn_${item}`)
        });
        
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
                // label: me.label,
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

        var $input = hx('div.c-cell', {}, [$hd, $bd])

        return $input.resolve(h)
    }
})

Vue.component('c-input', CInput)