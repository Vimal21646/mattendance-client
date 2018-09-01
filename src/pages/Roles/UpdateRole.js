import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input} from 'reactstrap';


class UpdateRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateObject: {
                id: '',
                name: '',
                description: ''
            },
            showUpdateModal: false,
        };
    }

    getInitialState = () => {
        return {
            updateObject: {
                id: '',
                name: '',
                description: ''
            }
        }
    }

    render() {

        return (
            <Modal isOpen={this.props.parent.state.showUpdateModal}>
                <ModalHeader>
                    Update Department
                </ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label>Department name</Label>
                            <Input
                                type="text"
                                placeholder="Enter name"
                                value={this.state.updateObject.name}
                                onChange={this.onUpdateDepartmentNameChange}/>
                            <br/>

                            <Label>Department description</Label>
                            <Input
                                type="text"
                                placeholder="Enter description"
                                value={this.state.updateObject.description}
                                onChange={this.onUpdateDepartmentDescriptionChange}/>
                            <br/>
                        </FormGroup>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.props.parent.closeUpdateModal}>Close</Button>
                    <Button color="success" onClick={this.onUpdateBtnClicked}>Update</Button>
                </ModalFooter>
            </Modal>
        );
    }

    fillUpdateObject = () => {
        var selectedDepartment = this.props.parent.getDepartmentById(this.props.parent.state.selectedDepartmentId);

        this.state.updateObject = {
            id: selectedDepartment.id,
            name: selectedDepartment.name,
            description: selectedDepartment.description
        }
    }
    clearUpdateObject = () => {
        this.state.updateObject.id = '';
        this.state.updateObject.name = '';
        this.state.updateObject.description = '';
    }

    //Input changes
    onUpdateDepartmentNameChange = (event) => {
        this.state.updateObject.name = event.target.value;
        this.forceUpdate();
    }
    onUpdateDepartmentDescriptionChange = (event) => {
        this.state.updateObject.description = event.target.value;
        this.forceUpdate();
    }
    onUpdateBtnClicked = () => {

        //Update Department
        axios.put('https://mattendenceserver.herokuapp.com/departments/' + this.state.updateObject.id, this.state.updateObject)
            .then(function (response) {
                this.props.parent.closeUpdateModal();
                this.props.parent.refreshTable();
                console.log(response);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

}

export default UpdateRole;