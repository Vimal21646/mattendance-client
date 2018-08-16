import React from 'react';
import axios from 'axios';
import {ButtonGroup, Button} from 'reactstrap';
import {FaPlus, FaTrash, FaSync, FaSyncAlt, FaRupeeSign} from 'react-icons/fa';
import BootstrapTable from 'react-bootstrap-table-next';

import AddEmployeeModal from './AddEmployee';
import UpdateEmployeeModal from './UpdateEmployee';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';

class Employees extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            departments: null,
            selectedEmployeeId: null,
            showAddModal: false,
            showUpdateModal: false
        };
        this.departmentFormatter = this.departmentFormatter.bind(this);
        this.getDepartmentName = this.getDepartmentName.bind(this);
        this.updateEmployee = React.createRef();
        this.child = React.createRef();
        this.closeUpdateModal = this.closeUpdateModal.bind(this);
    };

    getInitialState = () => {
        this.setState({
            data: null,
            departments: null,
            selectedEmployeeId: null,
            showAddModal: false,
            showUpdateModal: false
        });
    };

    componentDidMount = () => {
        this.refreshTable();
    };

    render = () => {
        const {SearchBar} = Search;
        const columns = [{
            dataField: 'id',
            text: 'Employee ID',
            sort: true
        }, {
            dataField: 'name',
            text: 'First Name',
            sort: true
        }, {
            dataField: 'surname',
            text: 'Last Name',
            sort: true
        }, {
            dataField: 'salary',
            text: 'Salary',
            formatter: this.priceFormatter,
            sort: true
        }, {
            dataField: 'departmentId',
            text: 'Depertment',
            formatter: this.departmentFormatter,
            sort: true
        }];

        const selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            selected: [this.state.selectedEmployeeId],
            onSelect: (row, isSelect, rowIndex, e) => {
                if (isSelect) {
                    this.setState(() => ({
                        selectedEmployeeId: row.id
                    }));
                } else {
                    this.setState(() => ({
                        selectedEmployeeId: null
                    }));
                }
            }
        };

        if (this.state == null || this.state.data == null) {
            return (<div>hi..... </div>);
        }

        return (
            <div>
                <ButtonGroup className="m-10">
                    <Button color="primary" onClick={this.openAddModal}><FaPlus/> Add</Button>
                    <Button color="warning" className="text-white" disabled={this.state.selectedEmployeeId === null}
                            onClick={this.openUpdateModal}><FaSyncAlt/> Update</Button>
                    <Button color="danger" disabled={this.state.selectedEmployeeId === null}
                            onClick={this.onDeleteBtnClicked}><FaTrash/> Delete</Button>
                </ButtonGroup>
                <ToolkitProvider
                    keyField="id"
                    data={this.state.data}
                    columns={columns}
                    search>
                    {
                        props => (
                            <div>
                                <SearchBar {...props.searchProps} />
                                <hr/>
                                <BootstrapTable
                                    {...props.baseProps}
                                    selectRow={selectRowProp}
                                    striped
                                    hover
                                    condensed
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
                <AddEmployeeModal parent={this} ref="addEmployee"/>

                <UpdateEmployeeModal parent={this} ref={this.updateEmployee}/>
            </div>
        );
    };

    // Department list for Select component
    getDepartmentOptions = () => {
        var options = [];
        options = this.state.departments.map(function (obj) {
            var rObj = {};
            rObj['value'] = obj['id'];
            rObj['label'] = obj['name'];
            return rObj;
        });

        return options;
    };

    //Add modal open/close
    closeAddModal = () => {
        this.setState({showAddModal: false});
        this.refs.addEmployee.clearAddObject();
    };

    openAddModal = () => {
        this.refs.addEmployee.clearAddObject();
        this.setState({showAddModal: true});
    };

    //Update modal open/close
    closeUpdateModal = () => {
        this.updateEmployee.current.state.showUpdateModal = false;
        this.updateEmployee.current.clearUpdateObject();

    };

    openUpdateModal = () => {
        alert("--10--");
        this.updateEmployee.current.state.showUpdateModal = true;
        this.setState({showUpdateModal: true});
        this.updateEmployee.current.fillUpdateObject();
    };

    //BEGIN: Delete Employee
    onDeleteBtnClicked = () => {
        axios.delete('http://mattendenceserver.herokuapp.com/employees/' + this.state.selectedEmployeeId)
            .then(function (response) {
                this.refreshTable();
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    };

    //END: Delete Employee

    priceFormatter = (cell, row) => {
        return (<div><FaRupeeSign/>{cell}</div>);
    }

    departmentFormatter = (cell, row) => {
        return this.getDepartmentName(row.departmentId);
    }

    getDepartmentName = (departmentId) => {
        for (var i in this.state.departments) {
            if (this.state.departments[i].id === departmentId) {
                return this.state.departments[i].name;
            }
        }
        return '';
    }

    getEmployeeById = (id) => {
        for (var i in this.state.data) {
            if (this.state.data[i].id === id) {
                return this.state.data[i];
            }
        }
        return '';
    }

    getEmployees = () => {
        return axios.get('http://mattendenceserver.herokuapp.com/employees');
    }

    getDepartments = () => {
        return axios.get('http://mattendenceserver.herokuapp.com/departments');
    }

    //Get table data and update the state to render
    refreshTable = () => {
        axios.all([this.getEmployees(), this.getDepartments()])
            .then(axios.spread(function (employees, departments) {
                this.setState({
                    data: employees.data,
                    departments: departments.data
                });
            }.bind(this)));
    }
};

export default Employees;