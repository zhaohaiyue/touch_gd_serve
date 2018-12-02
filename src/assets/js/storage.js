let storage = {
    /**
     * [claer description] 清空本地存储的数据
     * @param {*} key [description] key值
     */
    clear(key) {
      return localStorage.clear(key)
    },
    /**
     * [get description] 获取本地存储的数据
     * @param  {[type]} key [description] key值
     * @return {[type]}      [description] 返回数据本地存储的数据
     */
    get(key) {
      let item = localStorage.getItem(key);
      if (item && item != 'undefined') {
        return JSON.parse(item);
      } else {
        return '';
      }
    },
    /**
     * [set description]保存数据到本地
     * @param {[type]} key [description]key值
     * @param {[type]} val  [description]要保存的数据
     */
    set(key, val) {
      return localStorage.setItem(key, JSON.stringify(val))
    },
    /**
     * [delete description]删除本地数据
     * @param {*} key 
     */
    delete(key) {
      return localStorage.removeItem(key);
    },
    /**
     * [getAll description]获取本地所有数据
     */
    getAll() {
      let books = [];
      let items = Object.keys(localStorage);
      for (var i = 0; i < items.length; i++) {
        if (items[i] !== 'user' || items[i] != 'token') {
          console.log(items[i]);
          if (localStorage[items[i]] != 'undefined') {
            books.push(JSON.parse(localStorage[items[i]]));
          }
        }
      }
      return books;
    },
    /**
     * [update description] 更新已有数据
     * @param  {[type]} name   [description] 数据对应的key值
     * @param  {[type]} key    [description] 属性值key
     * @param  {[type]} addVal [description] 要保存到字段的数据
     * @return {[type]}        [description]
     */
    // update(name = '', key = '', addVal = '') {
    //   let oldVal = storage.find(name) || '';
    //   oldVal[key] = addVal;
    //   storage.save(name, oldVal)
    // }
  };
  export default storage
  