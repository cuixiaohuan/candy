import {hx} from '../../common/_tools.js'

var CInput = Vue.extend({
    props: {
        value: [String, Number],
        type: {
            type: String,
            default: 'text',
        },
        pattern: String, // 正则
        label: '',  
        placeholder: '',
        title: String,  // zh
        labelWidth: String,
        labelIcon: String,
        hasError: {
            type: Boolean,
            default: false
        },
        rows: Number,
        trim: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        cls () {
            
            var cls = []
            if (this.hasError) {
                cls.push('c-cell_warn')
            }
            if (this.$slots['right']) {
                cls.push('c-cell_vcode')
            }
            // if (this.$slots['left']) {
            //     cls.push('c-check__label')
            // }
            return cls
        }
    },
    render (h) {
        var me = this

        var params = {
            domProps: {
                placeholder: this.placeholder || '',
                title: this.title || '',
                value: this.value
            },
            attrs: {
                readonly: this.readonly || false,
                disabled: this.disabled || false
            },
            on: {
                input (e) {
                    me.$emit('input', e.target.value)
                },
                change (e) {
                    me.$emit('change', e)
                },
                focus (e) {
                    me.$emit('focus', e)
                },
                blur (e) {
                    me.$emit('blur', e)
        
                    if (me.trim){
                        me.$emit('input', e.target.value.trim())
                    }
                }
            }
        }

        if(this.type === 'phone'){
            params.domProps.pattern = /^1\d{10}$/
        } else if (!!this.pattern) {
            params.domProps.pattern = this.pattern
        }
        

        var $inputs, $label
        // debugger
        if (me.type === 'textarea'){
            params.attrs.rows = me.rows
            // if ( me.maxlength ) {
                
            // }
            $inputs = hx(`textarea.c-textarea`, params)
        } else {
            params.domProps.type = this.type
            
            $inputs = hx('input.c-input', params)
        }

        var $bd = hx('div.c-cell__bd', {}, [$inputs])

        var hdParams = {}
        if(!!me.labelWidth) {
            hdParams.style = {
                width: me.labelWidth
            }
        }
        var $hd = hx('div.c-cell__hd', hdParams)
        
        if (me.label ){
            var labelParams = {
                domProps: {
                    innerHTML: me.label
                }
            }
            $label = hx('label.c-label', labelParams)   
            
            $hd.push($label)
        } else if (me.labelIcon) {

            $label = hx(`i.c-icon-success + c-label + ${me.labelIcon}`)  
            
            $hd.push($label)            
        } 


        var $input = hx(`div.c-cell + ${me.cls.join("+")}`, {}).push([$hd, $bd])
        
        if (me.hasError) {

            $input.push( hx('div.c-cell__ft', {}, [hx('i.c-icon-warn + ion-ios-information')]) )
        } else {
            if (me.$slots['right']) {
                $input.push( hx('div.c-cell__ft + c-vcode-img', {}, [this.$slots['right']]) )
            }

            // if (me.$slots['left']) {
            //     $input.push( hx('div.c-cell__ft + c-vcode-img', {}, [this.$slots['right']]) )

            // }

        }

        return $input.resolve(h)
    }
})

Vue.component('c-input', CInput)