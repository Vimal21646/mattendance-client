import React from 'react';
import axios from 'axios';
import {ButtonGroup, Button} from 'reactstrap';
import {FaPlus, FaTrash, FaSync, FaSyncAlt, FaRupeeSign} from 'react-icons/fa';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';

import AddDepartmentModal from './AddDepartment';
import UpdateDepartmentModal from './UpdateDepartment';
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import AddEmployeeModal from "../Employees/AddEmployee";

class Departments extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            data: null,
            selectedDepartmentId: null,
            showAddModal: false,
            showUpdateModal: false
        };
            this.child = React.createRef();

    }
        getInitialState = () => {
            this.setState({
                data: null,
                selectedDepartmentId: null,
                showAddModal: false,
                showUpdateModal: false
            });

    }

    componentDidMount = () => {
        this.refreshTable();
    }

    render() {
        const {SearchBar} = Search;
        const columns = [{
            dataField: 'id',
            text: 'Department ID',
            sort: true
        }, {
            dataField: 'name',
            text: 'Department Name',
            sort: true
        }, {
            dataField: 'description',
            text: 'Description',
            sort: true
        }];

        const selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            selected: [this.state.selectedDepartmentId],
            onSelect: (row, isSelect, rowIndex, e) => {
                if (isSelect) {
                    this.setState(() => ({
                        selectedDepartmentId: row.id
                    }));
                } else {
                    this.setState(() => ({
                        selectedDepartmentId: null
                    }));
                }
            }
        };

        if (this.state == null || this.state.data == null) {
            return (<div id="overlay"><div className="center"><ReactLoading type="bars" color="#FFFF" height={'10%'} width={'10%'} /></div></div>);
        }

        return (
            <div>
                <ButtonGroup className="m-10">
                    <Button color="primary" onClick={this.openAddModal}><FaPlus/> Add</Button>
                    <Button color="warning" className="text-white" disabled={this.state.selectedDepartmentId === null}
                            onClick={this.openUpdateModal}><FaSync/> Update</Button>
                    <Button color="danger" disabled={this.state.selectedDepartmentId === null}
                            onClick={this.onDeleteBtnClicked}><FaTrash/> Delete</Button>
                </ButtonGroup>

                <ToolkitProvider
                    keyField="id"
                    data={this.state.data}
                    columns={columns}
                    search>
                    {
                        props => (
                            <div>
                                <SearchBar {...props.searchProps} />
                                <hr/>
                                <BootstrapTable
                                    {...props.baseProps}
                                    selectRow={selectRowProp}
                                    striped
                                    hover
                                    condensed
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>

                <AddDepartmentModal parent={this} ref="addDepartment" />

                <UpdateDepartmentModal parent={this} ref="updateDepartment"/>
            </div>
        );

    };

    // Keep selected row
    onRowSelect = (row, isSelected) => {

        if (isSelected) {
            this.setState({selectedDepartmentId: row.id});
        } else {
            this.setState({selectedDepartmentId: null});
        }
    }

    //Add modal open/close
    closeAddModal = () => {
        this.setState({showAddModal: false});
        this.refs.addDepartment.clearAddObject();
    }

    openAddModal = () => {
        this.refs.addDepartment.clearAddObject();
        this.setState({showAddModal: true});
    }

    //Update modal open/close
    closeUpdateModal = () => {
        this.setState({showUpdateModal: false});
        this.refs.updateDepartment.clearUpdateObject();
    }

    openUpdateModal = () => {
        this.refs.updateDepartment.fillUpdateObject();
        this.setState({showUpdateModal: true});
    }

    //BEGIN: Delete Department
    onDeleteBtnClicked = () => {

        axios.delete('http://mattendenceserver.herokuapp.com/departments/' + this.state.selectedDepartmentId)
            .then(function (response) {
                this.refreshTable();
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }
    //END: Delete Department

    getDepartmentById = (id) => {

        for (var i in this.state.data) {
            if (this.state.data[i].id === id) {
                return this.state.data[i];
            }
        }
        return '';
    }

    //Get table data and update the state to render
    refreshTable = () => {
        axios.get('https://mattendenceserver.herokuapp.com/departments')
            .then(function (departments) {
                this.setState(() => ({
                    data:departments.data
                }));
            }.bind(this));
    }
}

export default Departments;