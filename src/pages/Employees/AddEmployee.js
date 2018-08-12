import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import {Button, Modal, FormGroup, Label, Input} from 'reactstrap';

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
            }
        };

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
            <Modal show={this.props.parent.state.showAddModal}>
                <Modal.Header>
                    <Modal.Title>Add Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                                value={this.state.addObject.departmentId}
                                options={this.props.parent.getDepartmentOptions()}
                                onChange={this.onAddEmployeeDepartmentChange}/>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.parent.closeAddModal}>Close</Button>
                    <Button bsStyle="primary" onClick={this.onAddBtnClicked}>Add</Button>
                </Modal.Footer>
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

        if (selection === null) {
            this.state.addObject.departmentId = null;
        } else {
            this.state.addObject.departmentId = selection.value;
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