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
                    Update Role
                </ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label>Role name</Label>
                            <Input
                                type="text"
                                placeholder="Enter name"
                                value={this.state.updateObject.name}
                                onChange={this.onUpdateRoleNameChange}/>
                            <br/>

                            <Label>Role description</Label>
                            <Input
                                type="text"
                                placeholder="Enter description"
                                value={this.state.updateObject.description}
                                onChange={this.onUpdateRoleDescriptionChange}/>
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
        var selectedRole = this.props.parent.getRoleById(this.props.parent.state.selectedRoleId);

        this.state.updateObject = {
            id: selectedRole.id,
            name: selectedRole.name,
            description: selectedRole.description
        }
    }
    clearUpdateObject = () => {
        this.state.updateObject.id = '';
        this.state.updateObject.name = '';
        this.state.updateObject.description = '';
    }

    //Input changes
    onUpdateRoleNameChange = (event) => {
        this.state.updateObject.name = event.target.value;
        this.forceUpdate();
    }
    onUpdateRoleDescriptionChange = (event) => {
        this.state.updateObject.description = event.target.value;
        this.forceUpdate();
    }
    onUpdateBtnClicked = () => {

        //Update Role
        axios.put('https://mattendenceserver.herokuapp.com/roles/' + this.state.updateObject.id, this.state.updateObject)
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