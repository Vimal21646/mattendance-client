import React, {Component} from 'react';
import axios from 'axios';
import {CustomInput, ButtonGroup, Button} from 'reactstrap';
import { AlertList } from "react-bs-notifier";
import {FaPlus, FaTrash, FaDownload, FaRupeeSign} from 'react-icons/fa';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';

import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import * as PropTypes from "prop-types";

class CustomCheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            index: props.index,
            dataArray: props.dataArray,
            keyData: props.keyData
        };
    };

    render() {
        return (<div className="custom-checkbox custom-control" align="center">
            <input type="checkbox" id={this.props.id} className="custom-control-input"
                   value={this.state.isChecked}/><label
            className="custom-control-label" htmlFor={this.props.id} onClick={this.handleCheckBoxClick}/>
        </div>);
    }

    handleCheckBoxClick = () => {
        this.setState({
            isChecked: !this.state.isChecked
        });
        this.state.dataArray[this.state.index][this.state.keyData] = !this.state.isChecked;
    }
}

CustomCheckBox.propTypes = {id: PropTypes.any, dataArray: PropTypes.any, index: PropTypes.any, keyData: PropTypes.string};


class Attendence extends React.Component {

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
            selectedEmployeeSalary: '',
            attendanceArray: [],
            alerts: [],
            position: "top-right",
            timeout: 0
        };
        this.updateEmployee = React.createRef();
        this.child = React.createRef();
        this.employeeNameFormatter = this.employeeNameFormatter.bind(this);
        this.attendanceFormatter = this.attendanceFormatter.bind(this);
        this.attendanceDayShiftFormatter = this.attendanceDayShiftFormatter.bind(this);
        this.attendanceNightFormatter = this.attendanceNightFormatter.bind(this);
        this.saveAttendance = this.saveAttendance.bind(this);
        this.rowFormatter = this.rowFormatter.bind(this);
        this.onAlertDismissed=this.onAlertDismissed.bind(this);
        this.generate=this.generate.bind(this);
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
            selectedEmployeeSalary: '',
            attendanceArray: []
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
                sort: true,
                formatter: this.rowFormatter
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
                formatter: this.attendanceFormatter
            },
            {
                dataField: 'dShift',
                isDummyField: true,
                text: "Day Shift",
                formatter: this.attendanceDayShiftFormatter
            }, {
                dataField: 'nShift',
                isDummyField: true,
                text: "Night Shift",
                formatter: this.attendanceNightFormatter
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
                <AlertList
                    position={this.state.position}
                    alerts={this.state.alerts}
                    timeout={this.state.timeout}
                    dismissTitle="Done...!"
                    onDismiss={this.onAlertDismissed.bind(this)}/>

                <ButtonGroup className="m-10">
                    <Button color="success" onClick={this.saveAttendance}><FaPlus/> Save All</Button>
                    <Button color="primary" className="text-white"
                            disabled={this.state.selectedEmployeeId === null}><FaDownload/> Export as Excel</Button>

                </ButtonGroup>
                <ToolkitProvider
                    keyField="employee.id"
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

    rowFormatter = (cell, row) => {
        this.state.attendanceArray.push({
            "employeeId": row.employee.id,
            "present": false,
            "dayShift": false,
            "nightShift": false,
            "attendenceDate": new Date()
        });
        return row.employee.id;
    };
    employeeNameFormatter = (cell, row) => {
        return row.employee.name + ' ' + row.employee.surname;
    };

    onAlertDismissed(alert) {
        const alerts = this.state.alerts;

        // find the index of the alert that was dismissed
        const idx = alerts.indexOf(alert);

        if (idx >= 0) {
            this.setState({
                // remove the alert from the array
                alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
            });
        }
    }

    generate(type,newMessage) {
        const newAlert ={
            id: (new Date()).getTime(),
            type: type,
            headline: `${type}!`,
            message: newMessage
        };

        this.setState({
            alerts: [...this.state.alerts, newAlert]
        });
    }

    saveAttendance = () => {
        axios.post('https://mattendenceserver.herokuapp.com/attendences', this.state.attendanceArray)
            .then(function (response) {
                this.refreshTable();
                console.log(response);
                this.generate("success","Attendance saved successfuly!");
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    };

    attendanceFormatter = (cell, row, index) => {
        return (
            <CustomCheckBox id={'present_' + row.employee.id} dataArray={this.state.attendanceArray} index={index}
                            keyData={'present'}/>);
    };
    attendanceDayShiftFormatter = (cell, row, index) => {
        return (
            <CustomCheckBox id={'dayShift_' + row.employee.id} dataArray={this.state.attendanceArray}
                            keyData={'dayShift'}
                            index={index}/>);
    };
    attendanceNightFormatter = (cell, row, index) => {
        return (<CustomCheckBox id={'nightShift_' + row.employee.id} dataArray={this.state.attendanceArray}
                                keyData={'nightShift'} index={index}/>);
    };
    getEmployees = () => {
        return axios.get('http://mattendenceserver.herokuapp.com/attendences');
    };

    //Get table data and update the state to render
    refreshTable = () => {
        axios.all([this.getEmployees()])
            .then(axios.spread(function (employees) {
                this.setState({
                    data: employees.data,
                });
            }.bind(this)));
    };
};

export default Attendence;