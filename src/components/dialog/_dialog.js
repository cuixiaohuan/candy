import {hx} from '../../common/_tools.js'

var CDialog = Vue.extend({
  model: {
    prop: 'value',
    event: 'input',
  },
  data(){
    return {
      isShow: this.show
    }
  },
  props: {
    title: String, // 标题
    message: String, //提示内容
    confirmMessage: String, // 确定按钮
    cancelMessage: String, // 取消按钮
    minHeight: String,
    value: { 
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    },
    maskCloseable: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value (val) {
        this.isShow = val
    },
    isShow(val) {
      if(!val){
        this.$emit('input', val)
      }
    }
  },
  computed: {
    dialogStyle () {
      var dialogStyle = {}

      if ( !this.isShow ){
        dialogStyle = {
          opacity: 0,
          display: 'none'
        }
      } else {
        dialogStyle = {
          opacity: 1
        }
      }

      
      return dialogStyle
    }
  },
  render (h) {
    var me = this,
        $dialog = hx('div.c-dialog')
    
    if ( me.title ){

      var $hd = hx('div.c-dialog__hd', {})

      $hd.push(hx('strong.c-dialog__title', {
        domProps: {
          innerHTML: me.title
        }
      }))

      $dialog.push( $hd )
    }


    if (me.message) {
      var $bd = hx('div.c-dialog__bd', {
        domProps: {
          innerHTML: me.message
        },
        style: {
          minHeight:  me.minHeight || 'auto'
        }
      })

      $dialog.push($bd)
    }
    var $ft 
    if (me.confirmMessage || me.cancelMessage) {
      $ft = hx('div.c-dialog__ft')

      if (me.cancelMessage) {
        $ft.push([
          hx('div.c-dialog__btn + c-dialog__btn_default', {
            domProps: {
              innerHTML: me.cancelMessage
            },
            on: {
              click () {
                me.$emit('cancel')
              }
            }
          })
        ])
      }
      
      if (me.confirmMessage) {
        $ft.push([
          hx('div.c-dialog__btn + c-dialog__btn_primary', {
            domProps: {
              innerHTML: me.confirmMessage
            },
            on: {
              click () {
                me.$emit('confirm')
              }
            }
          })
        ])
      }

      $dialog.push($ft)
    }
  
    let className = ""
    if (me.type === 2) {
        className = "c-skin_android"
    }  
    var $content = hx(`div.${className}`, {
      style: me.dialogStyle
    }).push([
        hx('div.c-mask', {
          on: {
            click () {
              if ( me.maskCloseable ){
                me.$emit('input', false)
              }
            }
          }
        }),
        $dialog
    ])

    return $content.resolve(h)
  }
})

Vue.component('c-dialog', CDialog)