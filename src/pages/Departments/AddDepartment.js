import React from 'react';
import axios from 'axios';
import {FaPlus, FaTrash, FaSync, FaSyncAlt, FaRupeeSign} from 'react-icons/fa';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,FormGroup, Label, Input} from 'reactstrap';

class AddDepartment extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            addObject: {
                id: '',
                name: '',
                description: ''
            }
        }
        this.onAddDepartmentNameChange=this.onAddDepartmentNameChange.bind(this);
        this.onAddDepartmentDescriptionChange=this.onAddDepartmentDescriptionChange.bind(this);
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
                    Add Department
                </ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label>Department name</Label>
                            <Input
                                type="text"
                                placeholder="Enter name"
                                value={this.state.addObject.name}
                                onChange={this.onAddDepartmentNameChange}/>
                            <br/>

                            <Label>Department description</Label>
                            <Input
                                type="text"
                                placeholder="Enter description"
                                value={this.state.addObject.description}
                                onChange={this.onAddDepartmentDescriptionChange}/>
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
    onAddDepartmentNameChange = (event) => {
        this.state.addObject.name = event.target.value;
        this.forceUpdate();
    }

    onAddDepartmentDescriptionChange = (event) => {
        this.state.addObject.description = event.target.value;
        this.forceUpdate();
    }
    onAddBtnClicked = () => {
        alert(this.state.addObject.id);
        //Save department
        axios.post('https://mattendenceserver.herokuapp.com/departments', this.state.addObject)
            .then(function (response) {
                alert(this.state.addObject.id);
                this.props.parent.closeAddModal();
                this.props.parent.refreshTable();
                console.log(response);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }
}

export default AddDepartment;