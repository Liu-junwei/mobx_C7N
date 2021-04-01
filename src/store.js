import { action, observable, computed } from 'mobx'
import moment from 'moment'

class AppStore {

    @observable time = '2019'
    @observable todos = [{
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号'

    }, {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号'
    }];

    @computed get desc() {
        return `${this.time}还有${this.todos.length}条任务待完成`
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