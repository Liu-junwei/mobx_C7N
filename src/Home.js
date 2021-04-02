import './App.css'
import 'choerodon-ui/dist/choerodon-ui.css';
import 'choerodon-ui/dist/choerodon-ui-pro.css';
import 'choerodon-ui/dist/choerodon-ui-demo-data-mock.min.js';
import React from 'react';
import { inject, observer } from 'mobx-react'

import { Table, Input, Popconfirm, Button } from 'choerodon-ui';


const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input className='editInput' value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

@inject('store') @observer
class EditableTable extends React.Component {

    constructor(props) {

        super(props);
        const { store } = this.props
        let cacheData = store.todos.map(item => ({ ...item }));
        this.state = { store, cacheData }

        this.columns = [{
            title: '姓名',
            align: 'center',
            dataIndex: 'name',
            width: '25%',
            render: (text, record) => this.renderColumns(text, record, 'name'),
        }, {
            title: '年龄',
            dataIndex: 'age',
            align: 'center',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'age'),
        }, {
            title: '地址',
            align: 'center',
            dataIndex: 'address',
            width: '30%',
            render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: '操作',
            width: '40%',
            dataIndex: 'operation',
            align: 'center',
            render: (text, record) => {
                const { editable } = record;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ? (
                                <span>
                                    <Button type="primary" onClick={() => this.save(record.key)}>保存</Button>
                                </span>
                            )
                                : <Button type="primary" onClick={() => this.edit(record.key)}>编辑</Button>
                        }
                        <Popconfirm title="确认删除吗?" onConfirm={() => this.delete(record.key)}>
                            <Button type="primary">删除</Button>
                        </Popconfirm>

                    </div>
                );
            },
        }];


    }

    renderColumns(text, record, column) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }

    handleChange(value, key, column) {
        const newData = [...this.state.cacheData];
        const news = [...this.state.store.todos]
        const target = newData.filter(item => key === item.key)[0];
        const targets = news.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ cacheData: newData })
        }
        if (targets) {
            targets[column] = value;
            this.state.store.updata(news)
        }

    }

    edit(key) {
        const newData = [...this.state.cacheData];
        const target = newData.filter(item => key === item.key)[0];
        const targets = newData.filter(item => item.editable === true)[0];
        if (targets) {
            alert('请先保存未保存项！')
            return false
        }
        if (target) {
            target.editable = true;
            this.setState({ cacheData: newData })
        }
    }

    save(key) {
        const newData = [...this.state.cacheData];
        const newDatas = [...this.state.store.todos];
        const target = newData.filter(item => key === item.key)[0];
        const targets = newDatas.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            delete targets.editable;

            this.setState({ cacheData: newData })
        }
    }

    delete(key) {
        const newData = [...this.state.cacheData];
        const news = [...this.state.store.todos];

        for (let i = 0; i < newData.length; i++) {
            if (newData[i].key === key) {
                newData.splice(i, 1)
                break;
            }
        }
        for (let j = 0; j < news.length; j++) {
            if (news[j].key === key) {
                news.splice(j, 1)
                break;
            }
        }
        this.setState({ cacheData: newData })
        this.state.store.updata(news)


    }
    add(key) {
        const newData = [...this.state.cacheData];
        const news = [...this.state.store.todos];
        let keys = news[news.length - 1].key + 1

        newData.push({ key: keys, name: '', age: '', address: '' })
        newData[newData.length - 2].editable = false
        newData[newData.length - 1].editable = true

        news.push({ key: keys, name: "", age: '', address: '' })
        news[news.length - 2].editable = false
        news[news.length - 1].editable = true

        this.setState({ cacheData: newData })
        this.state.store.updata(news)

    }

    changeSearch(e) {
        this.state.store.changeSearch(e)
    }
    clickSearch() {
        let newData = [...this.state.store.todos];
        let searchName = this.state.store.searchValue

        let reg = new RegExp(searchName);
        newData = newData.filter((item) => { return reg.test(item.name) });
        this.setState({ cacheData: newData })

    }
   
    render() {

        return (
            <div>
                <div style={{ margin: '10px 5px' }}>
                    <Input
                        style={{ width: "150px" }}
                        value={this.state.store.searchValue}
                        onChange={this.changeSearch.bind(this)}
                        placeholder='请输入姓名'
                    />
                    <Button
                        style={{ marginRight: '20px' }}
                        shape="circle"
                        funcType="flat"
                        icon="search"

                        onClick={this.clickSearch.bind(this)}
                    />
                    <Button onClick={() => this.add()} funcType="raised">新增成员</Button>

                </div>

                <Table
                    style={{ width: '500px' }}
                    filterBar={false}
                    bordered
                    dataSource={this.state.cacheData}
                    columns={this.columns}

                />
            </div>

        )
    }
}
export default EditableTable;

