// 获取对象深度
const depthOf = (o) => {
  let depth = 1;
  if (o.children && o.children[0]) {
      depth = depthOf(o.children[0]) + 1;
  }
  return depth;
};


const isArray = (o) => {
  return Object.prototype.toString.call(o) === '[object Array]'
}


const isObject = (o) => {
  return Object.prototype.toString.call(o) === '[object Object]'
}

// function hasChildren(obj){
//   return isArray(obj.children) && obj.children.length > 0
// }

// function isChildren(obj){
//   return isArray(obj) && obj.length > 0
// }

function inArray(obj, objList){
  return objList.indexOf(obj) !== -1
}

function hx(tag, props={}, children=[]){
  if (tag.indexOf('.') !== -1){
    var [realTag, className] = tag.split('.')
    tag = realTag

    if (className !== ''){
      var classList = className.split('+')

      if (!props['class']){
        props['class'] = {}
      }
      
      classList.forEach(_=>{
        props['class'][_.trim()] = true
      })
    }
  }
  return new VVNode(tag, props, children)
}

// 简化createElement嵌套写法
class VVNode{
  constructor(tag, props={}, children = []){
    this.tag = tag
    this.props = props
    this.children = children
  }
  push(vnode) {
    if (isArray(vnode)){
      this.children.push(...vnode)
    }
    else {
      if (vnode){
        this.children.push(vnode)
      }
    }
    
    return this
  }
  resolve(h) {
    var children = this.children.map(child=>{
      if (child instanceof VVNode){
        return child.resolve(h)
      }
      else {
        return child
      }
    })
    return h(this.tag, this.props, children)
  }
}



function deepClone(obj) {
  if (obj === undefined){
    return undefined
  }
  return JSON.parse(JSON.stringify(obj))
}



function globalClick(exclude, callback){
  var func = _=>{
    var $$target = _.target
    
    while ($$target.parentNode != null){
      $$target = $$target.parentNode

      if ($$target === exclude){
        return false
      }
    }

    try{
      callback()
    }
    catch (ex){}
  }

  // pc 端
  window.addEventListener('click', _=>{
    func(_)
  })

  // 移动端
  window.addEventListener('touchstart', _=>{
    func(_)
  }, false)
}

function isdef(o){
  return o !== undefined
}

function getChildren(instance, Ctor) {
  while (instance = instance.$parent) {
    if (instance instanceof Ctor) {
      return instance
    }
  }

  return null
}

export {
  depthOf,
  isArray,
  isObject,
  inArray,
  hx,
  deepClone,
  globalClick,
  isdef,
  getChildren
}