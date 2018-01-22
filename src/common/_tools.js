// 获取对象深度
export const depthOf = (o) => {
  let depth = 1;
  if (o.children && o.children[0]) {
      depth = depthOf(o.children[0]) + 1;
  }
  return depth;
};

export const isArray = (o) => {
  return Object.prototype.toString.call(o) === '[object Array]'
}

export const isObject = (o) => {
  return Object.prototype.toString.call(o) === '[object Object]'
}

// function hasChildren(obj){
//   return isArray(obj.children) && obj.children.length > 0
// }

// function isChildren(obj){
//   return isArray(obj) && obj.length > 0
// }

export function inArray(obj, objList){
  return objList.indexOf(obj) !== -1
}


export function hx(tag, props={}, children=[]){
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