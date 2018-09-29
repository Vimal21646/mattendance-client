import React from 'react';
import axios from 'axios';
import {ButtonGroup, Button} from 'reactstrap';
import {FaPlus, FaTrash, FaSync, FaSyncAlt, FaRupeeSign} from 'react-icons/fa';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';

import AddEmployeeModal from './AddEmployee';
import UpdateEmployeeModal from './UpdateEmployee';
import AddAdvances from './../Advance/AddAdvance';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import Timestamp from "react-timestamp";

class Employees extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            departments: null,
            roles: null,
            selectedEmployeeId: null,
            showAddModal: false,
            showUpdateModal: false,
            showAddAdvanceModal: false,
            selectedEmployeeSalary: ''
        };
        this.departmentFormatter = this.departmentFormatter.bind(this);
        this.dateOfJoiningFormatter = this.dateOfJoiningFormatter.bind(this);
        this.getDepartmentName = this.getDepartmentName.bind(this);
        this.roleFormatter = this.roleFormatter.bind(this);
        this.getRoleName = this.getRoleName.bind(this);
        this.updateEmployee = React.createRef();
        this.child = React.createRef();
        this.closeUpdateModal = this.closeUpdateModal.bind(this);
        this.curentSalaryFormatter = this.curentSalaryFormatter.bind(this);
        this.employeeNameFormatter = this.employeeNameFormatter.bind(this);
    };

    getInitialState = () => {
        this.setState({
            data: null,
            departments: null,
            roles: null,
            selectedEmployeeId: null,
            showAddModal: false,
            showUpdateModal: false,
            showAddAdvanceModal: false,
            selectedEmployeeSalary: ''
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
            dataField:'name',
            text: 'Name',
            sort: true,
            formatter: this.employeeNameFormatter
        }, {
            dataField: 'salary',
            text: 'Monthly Salary',
            formatter: this.priceFormatter,
            sort: true
        }, {
            dataField: 'advanceAmt',
            text: 'Total Advance',
            formatter: this.advanceAmtFormatter,
            sort: true
        }, {
            dataField:'netSalary',
            text: 'Net Salary',
            formatter: this.curentSalaryFormatter,
            sort: true
        }, {
            dataField: 'departmentId',
            text: 'Department',
            formatter: this.departmentFormatter,
            sort: true
        }, {
            dataField: 'dateOfJoining',
            text: 'Date of Joining',
            formatter: this.dateOfJoiningFormatter,
            sort: true
        }, {
            dataField: 'roleId',
            text: 'Role',
            formatter: this.roleFormatter,
            sort: true
        }];

        const selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            selected: [this.state.selectedEmployeeId],
            onSelect: (row, isSelect, rowIndex, e) => {
                if (isSelect) {
                    this.setState(() => ({
                        selectedEmployeeId: row.id,
                        selectedEmployeeSalary: row.salary
                    }));
                } else {
                    this.setState(() => ({
                        selectedEmployeeId: null,
                        selectedEmployeeSalary: null
                    }));
                }
            }
        };

        if (this.state == null || this.state.data == null) {
            return (<div id="overlay">
                <div className="center"><ReactLoading type="bars" color="#FFFF" height={'10%'} width={'10%'}/></div>
            </div>);
        }

        return (
            <div>
                <ButtonGroup className="m-10">
                    <Button color="primary" onClick={this.openAddModal}><FaPlus/> Add</Button>
                    <Button color="warning" className="text-white" disabled={this.state.selectedEmployeeId === null}
                            onClick={this.openUpdateModal}><FaSyncAlt/> Update</Button>
                    <Button color="danger" disabled={this.state.selectedEmployeeId === null}
                            onClick={this.onDeleteBtnClicked}><FaTrash/> Delete</Button>
                    <Button color="primary" onClick={this.openAddAdvance}
                            disabled={this.state.selectedEmployeeId === null}><FaPlus/> Add Advance</Button>
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
                <AddAdvances parent={this} ref="addAdvance"/>
                <UpdateEmployeeModal parent={this} ref={this.updateEmployee}/>
            </div>
        );
    };

    employeeNameFormatter = (cell, row) => {
        return row.name + ' ' + row.surname;
    }
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

    getRoleOptions = () => {
        var options = [];
        options = this.state.roles.map(function (obj) {
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
    closeAddAdvanceModal = () => {
        this.setState({showAddAdvanceModal: false});
        this.refs.addAdvance.clearAddObject();
        this.refreshTable();
    };
    openAddModal = () => {
        this.refs.addEmployee.clearAddObject();
        this.setState({showAddModal: true});
    };

    openAddAdvance = () => {
        this.refs.addAdvance.clearAddObject();
        this.setState({showAddAdvanceModal: true});
    }
    //Update modal open/close
    closeUpdateModal = () => {
        this.updateEmployee.current.state.showUpdateModal = false;
        this.updateEmployee.current.clearUpdateObject();

    };

    openUpdateModal = () => {
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

    advanceAmtFormatter = (cell, row) => {
        return (<div><FaRupeeSign/>{cell}</div>);
    }

    curentSalaryFormatter = (cell, row) => {
        return (<div><FaRupeeSign/>{row.netSalary}</div>);
    }

    departmentFormatter = (cell, row) => {
        return this.getDepartmentName(row.departmentId);
    }

    dateOfJoiningFormatter = (cell, row) => {
        return <Timestamp time={new Date(row.dateOfJoining)} utc={true} format='date'/>;
    }

    getDepartmentName = (departmentId) => {
        for (var i in this.state.departments) {
            if (this.state.departments[i].id === departmentId) {
                return this.state.departments[i].name;
            }
        }
        return '';
    }

    roleFormatter = (cell, row) => {
        return this.getRoleName(row.roleId);
    }

    getRoleName = (roleId) => {
        for (var i in this.state.roles) {
            if (this.state.roles[i].id === roleId) {
                return this.state.roles[i].name;
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

    getRoles = () => {
        return axios.get('http://mattendenceserver.herokuapp.com/roles');
    }


    //Get table data and update the state to render
    refreshTable = () => {
        axios.all([this.getEmployees(), this.getDepartments(), this.getRoles()])
            .then(axios.spread(function (employees, departments, roles) {
                this.setState({
                    data: employees.data,
                    departments: departments.data,
                    roles: roles.data
                });
            }.bind(this)));
    }
};

export default Employees;