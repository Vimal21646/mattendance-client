import React, {Component} from 'react';
import axios from 'axios';
import {CustomInput, ButtonGroup, Button} from 'reactstrap';
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

CustomCheckBox.propTypes = {id: PropTypes.any, dataArray: [], index: PropTypes.any, keyData: PropTypes.string};


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
            attendenceArray: []
        };
        this.updateEmployee = React.createRef();
        this.child = React.createRef();
        this.employeeNameFormatter = this.employeeNameFormatter.bind(this);
        this.attendenceFormatter = this.attendenceFormatter.bind(this);
        this.attendenceDayShiftFormatter = this.attendenceDayShiftFormatter.bind(this);
        this.attendenceNightFormatter = this.attendenceNightFormatter.bind(this);
        this.saveAttendence = this.saveAttendence.bind(this);
        this.rowFormatter = this.rowFormatter.bind(this);
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
            attendenceArray: []
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

    rowFormatter = (cell, row) => {
        this.state.attendenceArray.push({
            "employee_id": row.employee.id,
            "present": false,
            "dayShift": false,
            "nightShift": false,
            "attendence_date": new Date()
        });
    }
    employeeNameFormatter = (cell, row) => {
        return row.employee.name + ' ' + row.employee.surname;
    }
    saveAttendence = () => {
        /*this.state.data.map((item, i) => {
            // alert('present_'+item.employee.id);
            alert(document.getElementById('present_' + item.employee.id).value);
            let present=document.getElementById('present_' + item.employee.id).value;
            let dayShift=document.getElementById('dayShift_' + item.employee.id).value;
            let nightShift=document.getElementById('nightShift_' + item.employee.id).value;
            alert(present);
            this.state.attendenceArray.push({"employee_id": item.employee.id, "attendence_date": new Date()});
        });*/
        // alert(JSON.stringify(this.state.attendenceArray));
        // alert(JSON.stringify(this.state.attendenceArray));
    };
    priceFormatter = (cell, row) => {
        return (<div><FaRupeeSign/>{cell}</div>);
    }

    advanceAmtFormatter = (cell, row) => {
        return (<div><FaRupeeSign/>{cell}</div>);
    }

    attendenceFormatter = (cell, row, index) => {
        return (
            <CustomCheckBox id={'present_' + row.employee.id} dataArray={this.state.attendenceArray} index={index}
                            keyData={'present'}
            />);
    }
    attendenceDayShiftFormatter = (cell, row, index) => {
        return (
            <CustomCheckBox id={'dayShift_' + row.employee.id} dataArray={this.state.attendenceArray}
                            keyData={'dayShift'}
                            index={index}/>);
    }
    attendenceNightFormatter = (cell, row, index) => {
        return (<CustomCheckBox id={'nightShift_' + row.employee.id} dataArray={this.state.attendenceArray}
                                keyData={'nightShift'} index={index}/>);
    }
    getEmployees = () => {
        return axios.get('http://mattendenceserver.herokuapp.com/attendences');
    }

    //Get table data and update the state to render
    refreshTable = () => {
        axios.all([this.getEmployees()])
            .then(axios.spread(function (employees) {
                this.setState({
                    data: employees.data,
                });
            }.bind(this)));
    }
};

export default Attendence;