import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class AddEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addObject: {
                id: '',
                name: '',
                surname: '',
                salary: '',
                advanceAmt: '',
                dateOfJoining: '',
                departmentId: '',
                roleId: ''
            },
            selectedDepartmentOption: null,
            selectedRoleOption: null
        };

        this.onAddBtnClicked = this.onAddBtnClicked.bind(this);
        this.onAddEmployeeNameChange = this.onAddEmployeeNameChange.bind(this);
        this.onAddEmployeeSurnameChange = this.onAddEmployeeSurnameChange.bind(this);
        this.onAddEmployeeDepartmentChange = this.onAddEmployeeDepartmentChange.bind(this);
        this.onAddEmployeeRoleChange = this.onAddEmployeeRoleChange.bind(this);
        this.onAddEmployeeSalaryChange = this.onAddEmployeeSalaryChange.bind(this);
        this.onAddEmployeeAdvanceChange = this.onAddEmployeeAdvanceChange.bind(this);
        this.handleDateOfJoining = this.handleDateOfJoining.bind(this);
    }

    getInitialState = () => {

        return {
            addObject: {
                id: '',
                name: '',
                surname: '',
                salary: '',
                advanceAmt: '',
                dateOfJoining: '',
                departmentId: '',
                roleId: ''
            }
        }
    }

    render() {

        return (
            <Modal isOpen={this.props.parent.state.showAddModal}>
                <ModalHeader>Add Employee</ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label>Employee Name</Label>
                            <Input
                                type="text"
                                placeholder="Enter name"
                                value={this.state.addObject.name}
                                onChange={this.onAddEmployeeNameChange}/>
                            <br/>

                            <Label>Employee Surname</Label>
                            <Input
                                type="text"
                                placeholder="Enter surname"
                                value={this.state.addObject.surname}
                                onChange={this.onAddEmployeeSurnameChange}/>
                            <br/>

                            <Label>Employee Salary</Label>
                            <Input
                                type="text"
                                placeholder="Enter salary"
                                value={this.state.addObject.salary}
                                onChange={this.onAddEmployeeSalaryChange}/>
                            <br/>

                            <Label>Employee Advance</Label>
                            <Input
                                type="text"
                                placeholder="Enter Advance"
                                value={this.state.addObject.advanceAmt}
                                onChange={this.onAddEmployeeAdvanceChange}/>
                            <br/>
                            <Label>Employee Department</Label>
                            <Select
                                name="departmentsField"
                                isClearable={true}
                                isSearchable={true}
                                value={this.state.selectedDepartmentOption}
                                options={this.props.parent.getDepartmentOptions()}
                                onChange={this.onAddEmployeeDepartmentChange}/>
                            <br/>

                            <Label>Employee Joining Date</Label>
                            <DatePicker className="form-control" placeholderText="Select Date of Joining"
                                        onChange={this.handleDateOfJoining}
                                        selected={moment(this.state.addObject.dateOfJoining)}
                                        dateFormat="DD/MM/YYYY"/>
                            <br/>
                            <Label>Employee Role</Label>
                            <Select
                                name="rolesField"
                                isClearable={true}
                                isSearchable={true}
                                value={this.state.selectedRoleOption}
                                options={this.props.parent.getRoleOptions()}
                                onChange={this.onAddEmployeeRoleChange}/>
                        </FormGroup>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.parent.closeAddModal} color="danger">Close</Button>
                    <Button color="success" onClick={this.onAddBtnClicked}>Add</Button>
                </ModalFooter>
            </Modal>
        );
    }

    clearAddObject = () => {

        this.state.addObject.id = '';
        this.state.addObject.name = '';
        this.state.addObject.surname = '';
        this.state.addObject.salary = '';
        this.state.addObject.advanceAmt = '';
        this.state.addObject.departmentId = '';
        this.state.addObject.roleId = '';
    }

    //Input changes
    onAddEmployeeNameChange = (event) => {
        this.state.addObject.name = event.target.value;
        this.forceUpdate();
    }

    onAddEmployeeSurnameChange = (event) => {
        this.state.addObject.surname = event.target.value;
        this.forceUpdate();
    }

    onAddEmployeeSalaryChange = (event) => {
        this.state.addObject.salary = event.target.value;
        this.forceUpdate();
    }
    onAddEmployeeAdvanceChange = (event) => {
        this.state.addObject.advanceAmt = event.target.value;
        this.forceUpdate();
    }

    onAddEmployeeDepartmentChange = (selection) => {
        this.setState({selectedDepartmentOption: selection});
        let addObject = this.state.addObject;

        if (selection === null) {
            addObject.departmentId = null;
        } else {
            addObject.departmentId = selection.value;
        }

        this.setState({addObject: addObject});
        this.forceUpdate();
    }

    onAddEmployeeRoleChange = (selection) => {
        this.setState({selectedRoleOption: selection});
        let addObject = this.state.addObject;

        if (selection === null) {
            addObject.roleId = null;
        } else {
            addObject.roleId = selection.value;
        }

        this.setState({addObject: addObject});
        this.forceUpdate();
    }

    handleDateOfJoining = (date) => {
        let addObject = this.state.addObject;
        addObject.dateOfJoining = date;
        this.setState({addObject: addObject});
        this.forceUpdate();
    }

    onAddBtnClicked = () => {

        //Save employee
        axios.post('http://mattendenceserver.herokuapp.com/employees/', this.state.addObject)
            .then(function (response) {
                this.props.parent.closeAddModal();
                this.props.parent.refreshTable();
                console.log(response);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }
};

export default AddEmployee;