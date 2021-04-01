
import 'choerodon-ui/dist/choerodon-ui.css';
import 'choerodon-ui/dist/choerodon-ui-pro.css';
import 'choerodon-ui/dist/choerodon-ui-demo-data-mock.min.js';
import React from 'react';

import { Table, Input, Popconfirm } from 'choerodon-ui';


const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

@inject('store') @observer
class EditableTable extends React.Component {

    constructor(props) {

        super(props);
        const { store } = this.props
        this.state = { store }

        this.columns = [{
            title: 'name',
            dataIndex: 'name',
            width: '25%',
            render: (text, record) => this.renderColumns(text, record, 'name'),
        }, {
            title: 'age',
            dataIndex: 'age',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'age'),
        }, {
            title: 'address',
            dataIndex: 'address',
            width: '40%',
            render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
                const { editable } = record;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ? (
                                <span>
                                    <a onClick={() => this.save(record.key)}>Save</a>
                                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                                        <a>Cancel</a>
                                    </Popconfirm>
                                </span>
                            )
                                : <a onClick={() => this.edit(record.key)}>Edit</a>
                        }
                    </div>
                );
            },
        }];

        this.cacheData = store.todos.map(item => ({ ...item }));
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
        const newData = [...this.state.store];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.state.store.updata(newData)
        }
    }

    edit(key) {
        const newData = [...this.state.store];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.state.store.updata(newData)
        }
    }

    save(key) {
        const newData = [...this.state.store];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            this.state.store.updata(newData)
            this.cacheData = newData.map(item => ({ ...item }));
        }
    }

    cancel(key) {
        const newData = [...this.state.store];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
            delete target.editable;
            this.state.store.updata(newData)
        }
    }

    render() {
        return <Table bordered dataSource={this.state.store} columns={this.columns} />;
    }
}
export default EditableTable;

