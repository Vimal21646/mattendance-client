import React from 'react';
import axios from 'axios';
import {CustomInput, ButtonGroup, Button} from 'reactstrap';
import {FaPlus, FaTrash, FaDownload, FaRupeeSign} from 'react-icons/fa';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';

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
        this.updateEmployee = React.createRef();
        this.child = React.createRef();
        this.employeeNameFormatter = this.employeeNameFormatter.bind(this);
        this.attendenceFormatter = this.attendenceFormatter.bind(this);
        this.attendenceDayShiftFormatter = this.attendenceDayShiftFormatter.bind(this);
        this.attendenceNightFormatter = this.attendenceNightFormatter.bind(this);
        this.saveAttendence = this.saveAttendence.bind(this);
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
        const columns = [
            {
                dataField: 'employee.id',
                text: 'Employee ID',
                sort: true
            }, {
                text: 'Name',
                dataField: "name",
                sort: true,
                formatter: this.employeeNameFormatter
            },
            {
                text: 'Unit',
                dataField: "employee.department.name",
                sort: true
            },
            {
                dataField: 'totalDayShift',
                isDummyField: true,
                text: "Total Day shift"
            },
            {
                dataField: 'totalNightShift',
                isDummyField: true,
                text: "Total Night shift"
            },
            {
                dataField: 'present',
                isDummyField: true,
                text: "Present Today",
                formatter: this.attendenceFormatter
            },
            {
                dataField: 'dShift',
                isDummyField: true,
                text: "Day Shift",
                formatter: this.attendenceDayShiftFormatter
            }, {
                dataField: 'nShift',
                isDummyField: true,
                text: "Night Shift",
                formatter: this.attendenceNightFormatter
            }
        ];
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
                    <Button color="success" onClick={this.saveAttendence}><FaPlus/> Save All</Button>
                    <Button color="primary" className="text-white"
                            disabled={this.state.selectedEmployeeId === null}><FaDownload/> Export as Excel</Button>

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
                                    striped
                                    hover
                                    condensed
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            </div>
        );
    };

    employeeNameFormatter = (cell, row) => {
        return row.employee.name + ' ' + row.employee.surname;
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

    saveAttendence = () => {
        let attendenceArray = [];
        this.state.data.map((item, i) => {
            // alert('present_'+item.employee.id);
            alert(document.getElementById('present_' + item.employee.id).value);
            attendenceArray.push({"employee_id": item.employee.id, "attendence_date": new Date()});
        });
    };
    priceFormatter = (cell, row) => {
        return (<div><FaRupeeSign/>{cell}</div>);
    }

    advanceAmtFormatter = (cell, row) => {
        return (<div><FaRupeeSign/>{cell}</div>);
    }

    curentSalaryFormatter = (cell, row) => {

        return (<div><FaRupeeSign/>{Number(row.salary) - Number(row.advanceAmt)}</div>);
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

    attendenceFormatter = (cell, row, index) => {
        return (
            <div className="custom-checkbox custom-control">
                <input type="checkbox" id="present_38" className="custom-control-input"/><label
                    className="custom-control-label" htmlFor="present_38"/>

            </div>);
    }
    attendenceDayShiftFormatter = (cell, row, index) => {
        return (<div><CustomInput type="checkbox" id={'dayShift_' + row.employee.id}/></div>);
    }
    attendenceNightFormatter = (cell, row, index) => {
        return (<div><CustomInput type="checkbox" id={'nightShift_' + row.employee.id}/></div>);
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
        return axios.get('http://mattendenceserver.herokuapp.com/attendences');
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