import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,FormGroup, Label, Input} from 'reactstrap';

class AddEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addObject: {
                id: '',
                name: '',
                surname: '',
                salary: '',
                departmentId: ''
            },
            selectedDepartmentOption:null
        };

        this.onAddBtnClicked=this.onAddBtnClicked.bind(this);
        this.onAddEmployeeNameChange=this.onAddEmployeeNameChange.bind(this);
        this.onAddEmployeeSurnameChange=this.onAddEmployeeSurnameChange.bind(this);
        this.onAddEmployeeDepartmentChange=this.onAddEmployeeDepartmentChange.bind(this);
    }

    getInitialState() {

        return {
            addObject: {
                id: '',
                name: '',
                surname: '',
                salary: '',
                departmentId: ''
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
                            <Label>Employee name</Label>
                            <Input
                                type="text"
                                placeholder="Enter name"
                                value={this.state.addObject.name}
                                onChange={this.onAddEmployeeNameChange}/>
                            <br/>

                            <Label>Employee surname</Label>
                            <Input
                                type="text"
                                placeholder="Enter surname"
                                value={this.state.addObject.surname}
                                onChange={this.onAddEmployeeSurnameChange}/>
                            <br/>

                            <Label>Employee salary</Label>
                            <Input
                                type="text"
                                placeholder="Enter salary"
                                value={this.state.addObject.salary}
                                onChange={this.onAddEmployeeSalaryChange}/>
                            <br/>

                            <Label>Employee department</Label>
                            <Select
                                name="departmentsField"
                                isClearable={true}
                                isSearchable={true}
                                value={this.state.addObject.departmentId}
                                options={this.props.parent.getDepartmentOptions()}
                                onChange={this.onAddEmployeeDepartmentChange}/>
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

    clearAddObject() {

        this.state.addObject.id = '';
        this.state.addObject.name = '';
        this.state.addObject.surname = '';
        this.state.addObject.salary = '';
        this.state.addObject.departmentId = '';
    }

    //Input changes
    onAddEmployeeNameChange(event) {
        this.state.addObject.name = event.target.value;
        this.forceUpdate();
    }

    onAddEmployeeSurnameChange(event) {
        this.state.addObject.surname = event.target.value;
        this.forceUpdate();
    }

    onAddEmployeeSalaryChange(event) {
        this.state.addObject.salary = event.target.value;
        this.forceUpdate();
    }

    onAddEmployeeDepartmentChange(selection) {
        this.setState({ selectedDepartmentOption:selection });
        if (selection === null) {
            // this.state.addObject.departmentId = null;
            this.setState({...this.state.addObject, departmentId: null});
        } else {
            // this.state.addObject.departmentId = selection.value;
            this.setState({...this.state.addObject, departmentId: selection.value});
        }

        this.forceUpdate();
    }

    onAddBtnClicked() {

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