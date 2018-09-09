import React from 'react';
import axios from 'axios';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Input,
    Alert,
    FormText,
    FormFeedback
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import {FaRupeeSign} from 'react-icons/fa';

import 'react-datepicker/dist/react-datepicker.css';

class AddDepartment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addObject: {
                employeeId: '',
                advanceAmt: '',
                advanceDate: new Date()
            },
            isAdvanceAmtInvalid:false
        }
        this.onAddAdvanceAmtChange = this.onAddAdvanceAmtChange.bind(this);
        this.handleAdvanceAmtDate = this.handleAdvanceAmtDate.bind(this);
        this.onAddBtnClicked = this.onAddBtnClicked.bind(this);

    }

    getInitialState = () => {
        return {
            addObject: {
                employeeId: '',
                advanceAmt: '',
                advanceDate: new Date(),
                isAdvanceAmtInvalid:false
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.parent.state.showAddAdvanceModal}>
                <ModalHeader>
                    Add Department
                </ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label>Salary</Label><br/>
                            <Input plaintext><FaRupeeSign/>{this.props.parent.state.selectedEmployeeSalary}</Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Advance Amount</Label>
                            <Input
                                type="text"
                                placeholder="Enter Amount in Rupees"
                                value={this.state.addObject.advanceAmt}
                                onChange={this.onAddAdvanceAmtChange} invalid={this.state.isAdvanceAmtInvalid}/>
                            <FormFeedback tooltip>Advance amount is greater than salary</FormFeedback>
                        </FormGroup>
                        <br/>
                        <FormGroup>
                            <Label>Advance Amount Date</Label>
                            <DatePicker className="form-control" placeholderText="Select Advance Date"
                                        onChange={this.handleAdvanceAmtDate}
                                        selected={this.state.addObject.advanceDate}
                                        dateFormat="DD/MM/YYYY"/>
                        </FormGroup>
                        <br/>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.props.parent.closeAddAdvanceModal}>Close</Button>
                    <Button color="success" onClick={this.onAddBtnClicked}>Add</Button>
                </ModalFooter>
            </Modal>
        );
    }

    clearAddObject = () => {
        this.state.addObject.employeeId = '';
        this.state.addObject.advanceAmt = '';
        this.state.addObject.advanceDate = '';
    }

    //Input changes
    onAddAdvanceAmtChange = (event) => {
        if (this.props.parent.state.selectedEmployeeSalary >= event.target.value) {
            this.state.addObject.employeeId = this.props.parent.state.selectedEmployeeId;
            this.state.addObject.advanceAmt = event.target.value;
        } else {
            this.state.isAdvanceAmtInvalid=true;
        }

        this.forceUpdate();
    }

    handleAdvanceAmtDate = (date) => {
        let addObject = this.state.addObject;
        addObject.advanceDate = date;
        this.setState({addObject: addObject});
        this.forceUpdate();
    }
    onAddBtnClicked = () => {
        //Save advances
        axios.post('https://mattendenceserver.herokuapp.com/advances', this.state.addObject)
            .then(function (response) {
                this.props.parent.closeAddAdvanceModal();
                this.props.parent.refreshTable();
                console.log(response);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }
}

export default AddDepartment;