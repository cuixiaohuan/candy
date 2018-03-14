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

class Result {
  constructor(obj) {
      this.value = obj.value;
      this.label = obj.label;
  }
}

function getObjResult (obj) {
  return new Result(obj)
}


function getRect(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

function ajax(params) {
    let { data, success, failed, progress, url, withCredentials, headers } = params

    // 创建ajax对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    // 用于清除缓存
    var random = Math.random();
    
    // 处理返回数据
    xhr.onreadystatechange = () => {

        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status <= 300) {
                try {
                    // 只支持json
                    const ret = JSON.parse(xhr.responseText);
                    success(ret);
                } catch (err) {

                    if (failed) {
                        failed(xhr.status, err);
                    }
                }
            } else {
                failed(new Error('XMLHttpRequest response status is ' + xhr.status));
            }

        }
    }

    if (xhr.upload) {
        xhr.upload.addEventListener('progress', (evt) => {
            if (evt.total == 0) return;
            const percent = Math.ceil(evt.loaded / evt.total) * 100;
            console.log('percent:', percent);

            progress(percent);
        }, false);
    }    

    xhr.open('POST', url, true);

    // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
    // Content-type 不需要手动设置，xhr会自动设置，并且会处理boundary
    // 使用ajax的时候设置Content-type不会报错，是因为在ajax内部会自动处理这些问题，
    // xhr.setRequestHeader("Content-type", "multipart/form-data");

    if (withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }

    headers = headers || {};

    Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
    });

    // data为uploader中传入的FormData格式
    xhr.send(data);
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
  getChildren,
  getObjResult,
  getRect,
  ajax
}