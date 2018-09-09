import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input,FormFeedback} from 'reactstrap';
import {FaRupeeSign} from "react-icons/fa";
import DatePicker from 'react-datepicker';
import moment from "moment"

import 'react-datepicker/dist/react-datepicker.css';

class UpdateDepartment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateObject: {
                id: '',
                employeeId: '',
                advanceAmt: '',
                advanceDate: new Date()
            },
            selectedAdvanceId:'',
            isAdvanceAmtInvalid:false,
            showUpdateModal: false,
        };
        this.onUpdateAdvanceAmtChange=this.onUpdateAdvanceAmtChange.bind(this);
        this.handleAdvanceAmtDate=this.handleAdvanceAmtDate.bind(this);
    }

    getInitialState = () => {
        return {
            updateObject: {
                id: '',
                employeeId: '',
                advanceAmt: '',
                advanceDate: new Date()
            }
        }
    }

    render() {

        return (
            <Modal isOpen={this.props.parent.state.showUpdateModal}>
                <ModalHeader>
                    Update Advance
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
                                value={this.state.updateObject.advanceAmt}
                                onChange={this.onUpdateAdvanceAmtChange} invalid={this.state.isAdvanceAmtInvalid}/>
                            <FormFeedback tooltip>Advance amount is greater than salary</FormFeedback>
                        </FormGroup>
                        <br/>
                        <FormGroup>
                            <Label>Advance Amount Date</Label>
                            <DatePicker className="form-control" placeholderText="Select Advance Date"
                                        onChange={this.handleAdvanceAmtDate}
                                        selected={new moment(this.state.updateObject.advanceDate)}
                                        dateFormat="DD/MM/YYYY"
                                        />
                        </FormGroup>
                        <br/>
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
        this.state.updateObject = {
            id: this.props.parent.state.selectedAdvanceId,
            advanceAmt: this.props.parent.state.selectedAdvanceAmt,
            advanceDate: this.props.parent.state.selectedAdvanceDate
        };
    }
    clearUpdateObject = () => {
        this.state.updateObject.id = null;
        this.state.updateObject.advanceAmt = '';
        // this.state.updateObject.advanceDate = null;
    }

    //Input changes
    onUpdateAdvanceAmtChange = (event) => {
        if (this.props.parent.state.selectedEmployeeSalary >= event.target.value) {
            this.state.updateObject.employeeId = this.props.parent.state.selectedEmployeeId;
            this.state.updateObject.advanceAmt = event.target.value;
        } else {
            this.state.isAdvanceAmtInvalid=true;
        }

        this.forceUpdate();
    }

    handleAdvanceAmtDate = (date) => {
        date= moment.utc(date.valueOf() + date.utcOffset() * 60000)
        let updateObject = this.state.updateObject;
        updateObject.advanceDate = date;
        this.setState({updateObject: updateObject});
    }
    onUpdateBtnClicked = () => {

        //Update Department
        axios.put('https://mattendenceserver.herokuapp.com/advances/' + this.state.updateObject.id, this.state.updateObject)
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

export default UpdateDepartment;