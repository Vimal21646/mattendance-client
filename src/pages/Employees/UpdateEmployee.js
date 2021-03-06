import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Alert} from 'reactstrap';
import AddEmployee from "./AddEmployee";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";

class UpdateEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateObject: {
                id: '',
                name: '',
                surname: '',
                salary: '',
                advanceAmt: '',
                dateOfJoining: new Date(),
                departmentId: '',
                roleId: ''
            },
            showUpdateModal: false,
            selectedOption: null,
            selectedRoleOption: null,
            visible: true,
            departmentOptions: this.props.parent.getDepartmentOptions(),
            roleOptions: this.props.parent.getRoleOptions()
        };
        this.onUpdateEmployeeNameChange = this.onUpdateEmployeeNameChange.bind(this);
        this.setDepartmentOption = this.setDepartmentOption.bind(this);
        this.fillUpdateObject = this.fillUpdateObject.bind(this);
        this.clearUpdateObject = this.clearUpdateObject.bind(this);
        this.toggle = this.toggle.bind(this);
        this.setRoleOption = this.setRoleOption.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    };

    onDismiss = () => {
        this.setState({visible: false});
    }
    getInitialState = () => {
        return {
            updateObject: {
                id: '',
                name: '',
                surname: '',
                salary: '',
                advanceAmt: '',
                dateOfJoining: new Date(),
                roleId: ''
            }
        }
    };

    shouldComponentUpdate = () => {
        //console.log('EU:shouldComponentUpdate');
        return this.props.parent.state.showUpdateModal;
        // return true;
    };

    closeModal = () => {
        //console.log('EU:shouldComponentUpdate');
        this.props.parent.state.showUpdateModal = false;
        // return true;
    };

    toggle = () => {
        this.setState({
            showUpdateModal: !this.state.showUpdateModal
        });
    };

    render() {

        return (
            <Modal isOpen={this.state.showUpdateModal}>
                <ModalHeader>
                    Update Employee
                </ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label>Employee name</Label>
                            <Input
                                type="text"
                                placeholder="Enter name"
                                value={this.state.updateObject.name}
                                onChange={this.onUpdateEmployeeNameChange}/>
                            <br/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Employee surname</Label>
                            <Input
                                type="text"
                                placeholder="Enter surname"
                                value={this.state.updateObject.surname}
                                onChange={this.onUpdateEmployeeSurnameChange}/>
                            <br/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Employee salary</Label>
                            <Input
                                type="text"
                                placeholder="Enter salary"
                                value={this.state.updateObject.salary}
                                onChange={this.onUpdateEmployeeSalaryChange}/>
                            <br/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Employee Advance salary</Label>
                            <Input
                                type="text"
                                placeholder="Enter Advance salary"
                                value={this.state.updateObject.advanceAmt}
                                onChange={this.onUpdateEmployeeAdvanceAmtChange}/>
                            <br/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Employee Department</Label>
                            <Select
                                name="departmentsField"
                                value={this.state.selectedOption}
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.departmentOptions}
                                onChange={this.onUpdateEmployeeDepartmentChange}/>
                            <br/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Employee Date Of Joining</Label>
                            <DatePicker className="form-control" placeholderText="Select Date of joining"
                                        onChange={this.onUpdateDateOfJoining}
                                        selected={new moment(this.state.updateObject.dateOfJoining)}
                                        dateFormat="DD/MM/YYYY"/>
                            <br/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Employee Role</Label>
                            <Select
                                name="rolesField"
                                value={this.state.selectedRoleOption}
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.roleOptions}
                                onChange={this.onUpdateEmployeeRoleChange}/>
                        </FormGroup>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.toggle} color="danger">Close</Button>
                    <Button color="success" onClick={this.onUpdateBtnClicked}>Update</Button>
                </ModalFooter>
            </Modal>
        );
    };

    fillUpdateObject = () => {
        var selectedEmployee = this.props.parent.getEmployeeById(this.props.parent.state.selectedEmployeeId);
        this.state.updateObject = {
            id: selectedEmployee.id,
            name: selectedEmployee.name,
            surname: selectedEmployee.surname,
            salary: selectedEmployee.salary,
            advanceAmt: selectedEmployee.advanceAmt,
            dateOfJoining: selectedEmployee.dateOfJoining,
            departmentId: selectedEmployee.departmentId,
            roleId: selectedEmployee.roleId
        }
        //set the role option
        this.setRoleOption(selectedEmployee);

        //set the department option
        this.setDepartmentOption(selectedEmployee);
    };

    setDepartmentOption(selectedEmployee) {
        for (var i in this.state.departmentOptions) {
            if (this.state.departmentOptions[i].value == selectedEmployee.departmentId) {
                this.setState({selectedOption: this.state.departmentOptions[i]});
            }
        }
    }

    setRoleOption(selectedEmployee) {
        for (var i in this.state.roleOptions) {
            if (this.state.roleOptions[i].value == selectedEmployee.roleId) {
                this.setState({selectedRoleOption: this.state.roleOptions[i]});
            }
        }
    }


    clearUpdateObject = () => {
        this.state.updateObject.id = '';
        this.state.updateObject.name = '';
        this.state.updateObject.surname = '';
        this.state.updateObject.salary = '';
        this.state.updateObject.advanceAmt = '';
        this.state.updateObject.dateOfJoining = new Date();
        this.state.updateObject.departmentId = '';
        this.state.updateObject.roleId = '';
    };

    onUpdateEmployeeDepartmentChange = (selection) => {
        if (selection === null) {
            this.state.updateObject.departmentId = null;
        } else {
            this.state.updateObject.departmentId = selection.value;
        }
        this.setState({selectedOption: selection});
        this.forceUpdate();
    };
    //Input changes
    onUpdateEmployeeNameChange = (event) => {
        this.state.updateObject.name = event.target.value;
        this.forceUpdate();
    };

    onUpdateEmployeeSurnameChange = (event) => {
        this.state.updateObject.surname = event.target.value;
        this.forceUpdate();
    };

    onUpdateEmployeeSalaryChange = (event) => {
        this.state.updateObject.salary = event.target.value;
        this.forceUpdate();
    };

    onUpdateEmployeeAdvanceAmtChange = (event) => {
        if (this.state.updateObject.salary >= event.target.value) {
            this.state.updateObject.advanceAmt = event.target.value;
        } else {
            return (
                <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
                    Advacnce amount greater then salary
                </Alert>);
        }
        this.forceUpdate();
    };
    onUpdateDateOfJoining = (date) => {
        date = moment.utc(date.valueOf() + date.utcOffset() * 60000)
        let updateObject = this.state.updateObject;
        updateObject.dateOfJoining = date;
        this.setState({updateObject: updateObject});
    };

    onUpdateEmployeeRoleChange = (selection) => {
        if (selection === null) {
            this.state.updateObject.roleId = null;
        } else {
            this.state.updateObject.roleId = selection.value;
        }
        this.setState({selectedRoleOption: selection});
        this.forceUpdate();
    };


    onUpdateBtnClicked = () => {
        //Update employee
        console.log(JSON.stringify(this.state.updateObject))
        axios.put('http://mattendenceserver.herokuapp.com/employees/' + this.state.updateObject.id, this.state.updateObject)
            .then(function (response) {
                this.props.parent.closeUpdateModal();
                this.props.parent.refreshTable();
                console.log(response);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }
};

export default UpdateEmployee;