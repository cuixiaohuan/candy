import {hx} from '../../common/_tools.js'

var CActionsheet = Vue.extend({
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
    title: String,
    menuList: Array,
    value: {
      type: Boolean,
      default: false
    },
    isIos: {
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
    cls () {
      var cls = []
      
      if ( this.isShow ){
        cls.push('c-actionsheet_toggle')
      }
      
      return cls
    },
    maskStyle () {
      var maskStyle = {}
      if (!this.isIos) return maskStyle
      if ( this.isShow ){
        maskStyle = {
          opacity: 1
        }
      } else {
        maskStyle = {
          opacity: 0,
          display: 'none'
        }
      }

      return maskStyle
    },
    sheetStyle () {
      var sheetStyle = {}

      if (this.isIos) return sheetStyle
      if ( this.isShow ){
        sheetStyle = {
          opacity: 1
        }
      } else {
        sheetStyle = {
          opacity: 0,
          display: 'none'
        }
      }

      return sheetStyle
    }
  },
  render (h) {
    var me = this,
        $actionsheet,
        titleParams = {},
        $menuList

    if ( !!this.title ){
      titleParams = {
        domProps: {
          innerHTML: me.title
        }
      }
    }

    var $title = hx('div.c-actionsheet__title', {}, [
      hx('p.c-actionsheet__title-text', titleParams)
    ])

    var $menu = hx('div.c-actionsheet__menu', {} )

    if (!!me.menuList){
      me.menuList.forEach((item) => {
        $menu.push(hx('a.c-actionsheet__cell ', {
          domProps: {
            innerHTML: item.name
          },
          attrs: {
            href: item.href
          },
          on: {
            click () {
              me.isShow = false
            }
          }
        }))
      });
    }


    var $footer = hx('div.c-actionsheet__action', {} , [
      hx('div.c-actionsheet__cell', {
        domProps: {
          innerHTML: '取消'
        },
        on: {
          click () {
            me.isShow = false
          }
        }
      })
    ])
    

    var $content = hx(`div.c-actionsheet + ${me.cls.join('+')}`, {

    }, [
      $title,
      $menu,
      $footer
    ])

    var domName = 'div'
    if ( !this.isIos ){
      domName = 'div.c-skin_android'
    }

    $actionsheet = hx(domName, {
      style: me.sheetStyle,
      
    }).push([
      hx('div.c-mask',{
      style: me.maskStyle,
      on: {
        click () {
            me.isShow = false
        }
      }
    }), $content])

    return $actionsheet.resolve(h)
  }
})

Vue.component('c-actionsheet', CActionsheet)