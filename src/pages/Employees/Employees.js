import React from 'react';

import axios from 'axios';
import {ButtonGroup,Button} from 'reactstrap';
import {FaPlus, FaTrash, FaSync} from 'react-icons/fa';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import AddEmployeeModal from './AddEmployee';
import UpdateEmployeeModal from './UpdateEmployee';

class Employees extends React.Component {
    getInitialState() {

        return {
            data: null,
            departments: null,
            selectedEmployeeId: null,
            showAddModal: false,
            showUpdateModal: false
        }
    }

    componentDidMount() {
        this.refreshTable();
    }

    render() {

        var selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            className: "selected-row",
            bgColor: 'rgb(101, 148, 255)',
            onSelect: this.onRowSelect
        };

        if (!this.state.data) {
            return (<div></div>);
        }

        return (
            <div>
                <ButtonGroup className="m-10">
                    <Button bsStyle="primary" onClick={this.openAddModal}><FaPlus/> Add</Button>
                    <Button bsStyle="warning" disabled={this.state.selectedEmployeeId === null}
                            onClick={this.openUpdateModal}><FaSync/>Update</Button>
                    <Button bsStyle="danger" disabled={this.state.selectedEmployeeId === null}
                            onClick={this.onDeleteBtnClicked}><FaTrash/>Delete</Button>
                </ButtonGroup>

                <BootstrapTable data={this.state.data}
                                striped={true}
                                hover={true}
                    //pagination={true}
                                search={true}
                                selectRow={selectRowProp}>
                    <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Employee
                        ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="name" dataSort={true}>First Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="surname">Last Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="salary" dataFormat={this.priceFormatter}>Salary</TableHeaderColumn>
                    <TableHeaderColumn dataField="departmentId"
                                       dataFormat={this.departmentFormatter}>Depertment</TableHeaderColumn>
                </BootstrapTable>

                <AddEmployeeModal parent={this} ref="addEmployee"/>

                <UpdateEmployeeModal parent={this} ref="updateEmployee"/>
            </div>
        );
    }

    // Keep selected row
    onRowSelect(row, isSelected) {
        if (isSelected) {
            this.setState({selectedEmployeeId: row.id});
        } else {
            this.setState({selectedEmployeeId: null});
        }
    }

    // Department list for Select component
    getDepartmentOptions() {
        var options = [];

        options = this.state.departments.map(function (obj) {
            var rObj = {};
            rObj['value'] = obj['id'];
            rObj['label'] = obj['name'];
            return rObj;
        });

        return options;
    }

    //Add modal open/close
    closeAddModal() {
        this.setState({showAddModal: false});
        this.refs.addEmployee.clearAddObject();
    }

    openAddModal() {
        this.refs.addEmployee.clearAddObject();
        this.setState({showAddModal: true});
    }

    //Update modal open/close
    closeUpdateModal() {
        this.setState({showUpdateModal: false});
        this.refs.updateEmployee.clearUpdateObject();
    }

    openUpdateModal() {
        this.refs.updateEmployee.fillUpdateObject();
        this.setState({showUpdateModal: true});
    }

    //BEGIN: Delete Employee
    onDeleteBtnClicked() {

        axios.delete('http://mattendenceserver.herokuapp.com/employees/' + this.state.selectedEmployeeId)
            .then(function (response) {
                this.refreshTable();
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

    //END: Delete Employee

    priceFormatter(cell, row) {
        return '<i class="glyphicon glyphicon-usd"></i> ' + cell;
    }

    departmentFormatter(cell, row) {
        return this.getDepartmentName(row.departmentId);
    }

    getDepartmentName(departmentId) {

        for (var i in this.state.departments) {
            if (this.state.departments[i].id === departmentId) {
                return this.state.departments[i].name;
            }
        }
        return '';
    }

    getEmployeeById(id) {
        for (var i in this.state.data) {
            if (this.state.data[i].id === id) {
                return this.state.data[i];
            }
        }
        return '';
    }

    getEmployees() {
        return axios.get('http://mattendenceserver.herokuapp.com/employees');
    }

    getDepartments() {
        return axios.get('http://mattendenceserver.herokuapp.com/departments');
    }

    //Get table data and update the state to render
    refreshTable() {

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