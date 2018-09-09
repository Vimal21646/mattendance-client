import React from 'react';
import axios from 'axios';
import {ButtonGroup, Button} from 'reactstrap';
import {FaPlus, FaTrash, FaSync} from 'react-icons/fa';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';

import AddAdvanceModal from './AddAdvance';
import UpdateAdvanceModal from './UpdateAdvance';
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import Timestamp from 'react-timestamp';

class Advances extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            selectedAdvanceId: null,
            showAddModal: false,
            showUpdateModal: false
        };
        this.child = React.createRef();
        this.employeeNameFormatter=this.employeeNameFormatter.bind(this);
        this.advanceTimestampFormatter=this.advanceTimestampFormatter.bind(this);
    }

    getInitialState = () => {
        this.setState({
            data: null,
            selectedAdvanceId: null,
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
            dataField: 'employee.id',
            text: 'Employee ID',
            sort: true
        }, {
            text: 'Employee Name',
            sort: true,
            formatter:this.employeeNameFormatter
        }, {
            dataField: 'advanceAmt',
            text: 'Advance Amount',
            sort: true
        }, {
            dataField:"advanceDate",
            text: 'Date',
            sort: true
            // ,
            // formatter: this.advanceTimestampFormatter
        }];

        const selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            selected: [this.state.selectedAdvanceId],
            onSelect: (row, isSelect, rowIndex, e) => {
                if (isSelect) {
                    this.setState(() => ({
                        selectedAdvanceId: row.id
                    }));
                } else {
                    this.setState(() => ({
                        selectedAdvanceId: null
                    }));
                }
            }
        };

        if (this.state == null || this.state.data == null) {
            return (<div id="overlay">
                <div className="center"><ReactLoading type="bars" color="#FFFF" height={'10%'} width={'10%'}/></div>
            </div>);
        }

        return (
            <div>
                <ButtonGroup className="m-10">
                    <Button color="warning" className="text-white" disabled={this.state.selectedAdvanceId === null}
                            onClick={this.openUpdateModal}><FaSync/> Update</Button>
                    <Button color="danger" disabled={this.state.selectedAdvanceId === null}
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

                <AddAdvanceModal parent={this} ref="addAdvance"/>

                <UpdateAdvanceModal parent={this} ref="updateAdvance"/>
            </div>
        );

    };

    // Keep selected row
    onRowSelect = (row, isSelected) => {

        if (isSelected) {
            this.setState({selectedAdvanceId: row.id});
        } else {
            this.setState({selectedAdvanceId: null});
        }
    }
    employeeNameFormatter=(cell, row)=>{
        return row.employee.name+' '+row.employee.surname;
    }
    //Add modal open/close
    closeAddModal = () => {
        this.setState({showAddModal: false});
        this.refs.addAdvance.clearAddObject();
    }

    openAddModal = () => {
        this.refs.addAdvance.clearAddObject();
        this.setState({showAddModal: true});
    }

    //Update modal open/close
    closeUpdateModal = () => {
        this.setState({showUpdateModal: false});
        this.refs.updateAdvance.clearUpdateObject();
    }

    openUpdateModal = () => {
        this.refs.updateAdvance.fillUpdateObject();
        this.setState({showUpdateModal: true});
    }

    //BEGIN: Delete Department
    onDeleteBtnClicked = () => {

        axios.delete('http://mattendenceserver.herokuapp.com/advances/' + this.state.selectedAdvanceId)
            .then(function (response) {
                this.refreshTable();
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }
    //END: Delete Department

    getAdvancesById = (id) => {

        for (var i in this.state.data) {
            if (this.state.data[i].id === id) {
                return this.state.data[i];
            }
        }
        return '';
    }

    advanceTimestampFormatter=(cell, row)=>{
        return <Timestamp time={row.advanceDate} utc={true} format='full'/>;
    }

    //Get table data and update the state to render
    refreshTable = () => {
        axios.get('https://mattendenceserver.herokuapp.com/advances')
            .then(function (advances) {
                this.setState(() => ({
                    data: advances.data
                }));
            }.bind(this));
    }
}

export default Advances;