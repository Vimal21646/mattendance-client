import React from 'react';
import axios from 'axios';
import {FaPlus, FaTrash, FaSync, FaSyncAlt, FaRupeeSign} from 'react-icons/fa';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,FormGroup, Label, Input} from 'reactstrap';

class AddRole extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            addObject: {
                id: '',
                name: '',
                description: ''
            }
        }
        this.onAddRoleNameChange=this.onAddRoleNameChange.bind(this);
        this.onAddRoleDescriptionChange=this.onAddRoleDescriptionChange.bind(this);
        this.onAddBtnClicked=this.onAddBtnClicked.bind(this);

    }

    getInitialState = () => {
        return {
            addObject: {
                id: '',
                name: '',
                description: ''
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.parent.state.showAddModal}>
                <ModalHeader>
                    Add Role
                </ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label>Role name</Label>
                            <Input
                                type="text"
                                placeholder="Enter name"
                                value={this.state.addObject.name}
                                onChange={this.onAddRoleNameChange}/>
                            <br/>

                            <Label>Role description</Label>
                            <Input
                                type="text"
                                placeholder="Enter description"
                                value={this.state.addObject.description}
                                onChange={this.onAddRoleDescriptionChange}/>
                            <br/>
                        </FormGroup>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.props.parent.closeAddModal}>Close</Button>
                    <Button color="success" onClick={this.onAddBtnClicked}>Add</Button>
                </ModalFooter>
            </Modal>
        );
    }
    clearAddObject = () => {
        this.state.addObject.id = '';
        this.state.addObject.name = '';
        this.state.addObject.description = '';
    }

    //Input changes
    onAddRoleNameChange = (event) => {
        this.state.addObject.name = event.target.value;
        this.forceUpdate();
    }

    onAddRoleDescriptionChange = (event) => {
        this.state.addObject.description = event.target.value;
        this.forceUpdate();
    }
    onAddBtnClicked = () => {
        //Save department
        axios.post('https://mattendenceserver.herokuapp.com/departments', this.state.addObject)
            .then(function (response) {
                this.props.parent.closeAddModal();
                this.props.parent.refreshTable();
                console.log(response);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }
}

export default AddRole;