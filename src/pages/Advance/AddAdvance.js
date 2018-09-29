import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Input,
    FormFeedback
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import {FaRupeeSign} from 'react-icons/fa';

import 'react-datepicker/dist/react-datepicker.css';

class AddDepartment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addAdvanceObject: {
                employeeId: 0,
                advanceAmt: '',
                voucherNumber: '',
                advanceDate: moment(new Date())
            },
            isAdvanceAmtInvalid: false
        }
        this.onAddAdvanceAmtChange = this.onAddAdvanceAmtChange.bind(this);
        this.handleAdvanceAmtDate = this.handleAdvanceAmtDate.bind(this);
        this.onAddBtnClicked = this.onAddBtnClicked.bind(this);
        this.onVoucherNumberChange = this.onVoucherNumberChange.bind(this);
    }

    getInitialState = () => {
        return {
            addAdvanceObject: {
                employeeId: 0,
                advanceAmt: '',
                voucherNumber: '',
                advanceDate: moment(new Date()),
                isAdvanceAmtInvalid: false
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.parent.state.showAddAdvanceModal}>
                <ModalHeader>
                    Add Advance
                </ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label>Salary</Label><br/>
                            <Input plaintext><FaRupeeSign/>{this.props.parent.state.selectedEmployeeSalary}</Input>
                        </FormGroup>

                        <FormGroup>
                            <Label>Voucher Number</Label>
                            <Input
                                type="text"
                                placeholder="Enter voucher number"
                                value={this.state.addAdvanceObject.voucherNumber}
                                onChange={this.onVoucherNumberChange}/>
                            <FormFeedback tooltip>Advance amount is greater than salary</FormFeedback>
                        </FormGroup>
                        <br/>
                        <FormGroup>
                            <Label>Advance Amount</Label>
                            <Input
                                type="text"
                                placeholder="Enter Amount in Rupees"
                                value={this.state.addAdvanceObject.advanceAmt}
                                onChange={this.onAddAdvanceAmtChange} invalid={this.state.isAdvanceAmtInvalid}/>
                            <FormFeedback tooltip>Advance amount is greater than salary</FormFeedback>
                        </FormGroup>
                        <br/>
                        <FormGroup>
                            <Label>Advance Amount Date</Label>
                            <DatePicker className="form-control" placeholderText="Select Advance Date"
                                        onChange={this.handleAdvanceAmtDate}
                                        selected={this.state.addAdvanceObject.advanceDate ? moment(this.state.addAdvanceObject.advanceDate) : null}
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
        this.state.addAdvanceObject.employeeId = 0;
        this.state.addAdvanceObject.advanceAmt = '';
        this.state.addAdvanceObject.advanceDate = '';
    }

    //Input changes
    onAddAdvanceAmtChange = (event) => {
        if (this.props.parent.state.selectedEmployeeSalary >= event.target.value) {
            this.state.addAdvanceObject.employeeId = this.props.parent.state.selectedEmployeeId;
            this.state.addAdvanceObject.advanceAmt = event.target.value;
        } else {
            this.state.isAdvanceAmtInvalid = true;
        }

        this.forceUpdate();
    }

    onVoucherNumberChange = (event) => {
        let addAdvanceObject = this.state.addAdvanceObject;
        addAdvanceObject.voucherNumber = event.target.value;
        this.setState({addAdvanceObject: addAdvanceObject});
        this.forceUpdate();
    }
    handleAdvanceAmtDate = (date) => {
        let addAdvanceObject = this.state.addAdvanceObject;
        addAdvanceObject.advanceDate = date;
        this.setState({addAdvanceObject: addAdvanceObject});
        this.forceUpdate();
    }
    onAddBtnClicked = () => {
        //Save advances
        console.log(JSON.stringify(this.state.addAdvanceObject));
        axios.interceptors.request.use(request => {
            console.log('Starting Request', request)
            return request
        })
        var addAdvanceObject = this.state.addAdvanceObject;
        axios.post('https://mattendenceserver.herokuapp.com/advances', JSON.parse(JSON.stringify(this.state.addAdvanceObject)))
            .then(function (response) {
                this.props.parent.closeAddAdvanceModal();
                this.props.parent.refreshTable();
                console.log(response);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
        this.props.parent.closeAddAdvanceModal();
    }
}

export default AddDepartment;