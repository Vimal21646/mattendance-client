import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Button, Modal, FormGroup, Label, Input } from 'reactstrap';
import AddEmployee from "./AddEmployee";

class UpdateEmployee  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateObject: {
                id: '',
                name: '',
                surname: '',
                salary: '',
                departmentId: ''
            }
		}}
            getInitialState() {

		return {
			updateObject: {
				id: '', 
				name: '', 
				surname: '', 
				salary: '', 
				departmentId: ''
			}
		}
    }

    shouldComponentUpdate() {
    	//console.log('EU:shouldComponentUpdate');
    	//return this.props.parent.state.showUpdateModal;
    	return true;
    }

	render() {
		
		return (
			<Modal show={this.props.parent.state.showUpdateModal}>
				<Modal.Header>
					<Modal.Title>Update Employee</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<FormGroup>
							<Label>Employee name</Label>
							<Input
								type="text"
								placeholder="Enter name"
								value={this.state.updateObject.name}
								onChange={this.onUpdateEmployeeNameChange} />
							<br />
							
							<Label>Employee surname</Label>
							<Input
								type="text"
								placeholder="Enter surname"
								value={this.state.updateObject.surname}
								onChange={this.onUpdateEmployeeSurnameChange} />
							<br />
							
							<Label>Employee salary</Label>
							<Input
								type="text"
								placeholder="Enter salary"
								value={this.state.updateObject.salary}
								onChange={this.onUpdateEmployeeSalaryChange} />
							<br />
							
							<Label>Employee department</Label>
							<Select
								name="departmentsField"
								value={this.state.updateObject.departmentId}
								options={this.props.parent.getDepartmentOptions()}
								onChange={this.onUpdateEmployeeDepartmentChange} />
						</FormGroup>
					</form>						
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.parent.closeUpdateModal}>Close</Button>
					<Button bsStyle="primary" onClick={this.onUpdateBtnClicked}>Update</Button>						
				</Modal.Footer>
			</Modal>
		);
	}

	fillUpdateObject() {

    	var selectedEmployee = this.props.parent.getEmployeeById(this.props.parent.state.selectedEmployeeId);

		this.state.updateObject = {
			id: selectedEmployee.id, 
			name: selectedEmployee.name, 
			surname: selectedEmployee.surname, 
			salary: selectedEmployee.salary, 
			departmentId: selectedEmployee.departmentId
		}
	}

	clearUpdateObject() {

		this.state.updateObject.id = '';
		this.state.updateObject.name = '';
		this.state.updateObject.surname = '';
		this.state.updateObject.salary = '';
		this.state.updateObject.departmentId = '';
	}

	//Input changes
	onUpdateEmployeeNameChange(event) {
		this.state.updateObject.name = event.target.value;
		this.forceUpdate();
	}

	onUpdateEmployeeSurnameChange(event) {
		this.state.updateObject.surname = event.target.value;
		this.forceUpdate();
	}

	onUpdateEmployeeSalaryChange(event) {
		this.state.updateObject.salary = event.target.value;
		this.forceUpdate();		
	}

	onUpdateEmployeeDepartmentChange(selection) {

		if(selection === null) {
			this.state.updateObject.departmentId = null;
		}else {
			this.state.updateObject.departmentId = selection.value;
		}
		
		this.forceUpdate();		
	}
			
	onUpdateBtnClicked() {
		
		//Update employee
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