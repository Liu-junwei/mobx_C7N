

import { action, observable } from 'mobx'
import moment from 'moment'


class AppStore {
   
    @observable searchValue = ''
    @observable todos = [{
        key: '1',
        name: '周杰伦',
        age: 32,
        address: '东方明珠外滩1号'
  
    },
        {
        key: '2',
            name: '吴彦祖',
            age: 22,
            address: '西湖区湖底公园1号'
        },
        {
            key: '3',
            name: '张杰',
            age: 42,
            address: '岳麓区五一大药房'
        },
        {
            key: '4',
            name: '范冰冰',
            age: 43,
            address: '广州市白云区白云街道'
        },
        {
            key: '5',
            name: '陈奕迅',
            age: 42,
            address: '西湖区大炮台公园3号'
        },
        {
            key: '6',
            name: '李连杰',
            age: 42,
            address: '东风区火云街道'
        },
        {
            key: '7',
            name: '张含韵',
        age: 42,
            address: '成昌区百运大道88号'
        }
    ]
   
    @action changeSearch(e) {
        this.searchValue = e.target.value
    }
    @action updata(arr) {
        this.todos = arr
    }
    @action addTodo(key) {
        this.todos.push(key)
    }
    @action deleteTodo(key) {
        this.todos.pop()
    }

    @action getNow() {
        this.time = moment().format('YYYY-MM-DD HH:mm:ss')
    }
}

const store = new AppStore()

setInterval(() => {
    store.getNow()
}, 1000)
export default store