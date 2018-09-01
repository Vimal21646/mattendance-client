import React from 'react';
import axios from 'axios';
import {ButtonGroup, Button} from 'reactstrap';
import {FaPlus, FaTrash, FaSync} from 'react-icons/fa';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';

import AddRoleModal from './AddRole';
import UpdateRoleModal from './UpdateRole';
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";


class Roles extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            data: null,
            selectedRoleId: null,
            showAddModal: false,
            showUpdateModal: false
        };
            this.child = React.createRef();

    }
        getInitialState = () => {
            this.setState({
                data: null,
                selectedRoleId: null,
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
            text: 'Roles ID',
            sort: true
        }, {
            dataField: 'name',
            text: 'Roles Name',
            sort: true
        }, {
            dataField: 'description',
            text: 'Description',
            sort: true
        }];

        const selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            selected: [this.state.selectedRoleId],
            onSelect: (row, isSelect, rowIndex, e) => {
                if (isSelect) {
                    this.setState(() => ({
                        selectedRoleId: row.id
                    }));
                } else {
                    this.setState(() => ({
                        selectedRoleId: null
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
                    <Button color="warning" className="text-white" disabled={this.state.selectedRoleId === null}
                            onClick={this.openUpdateModal}><FaSync/> Update</Button>
                    <Button color="danger" disabled={this.state.selectedRoleId === null}
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

                <AddRoleModal parent={this} ref="addRole" />

                <UpdateRoleModal parent={this} ref="updateRole"/>
            </div>
        );

    };

    // Keep selected row
    onRowSelect = (row, isSelected) => {

        if (isSelected) {
            this.setState({selectedRoleId: row.id});
        } else {
            this.setState({selectedRoleId: null});
        }
    }

    //Add modal open/close
    closeAddModal = () => {
        this.setState({showAddModal: false});
        this.refs.addRole.clearAddObject();
    }

    openAddModal = () => {
        this.refs.addRole.clearAddObject();
        this.setState({showAddModal: true});
    }

    //Update modal open/close
    closeUpdateModal = () => {
        this.setState({showUpdateModal: false});
        this.refs.updateRole.clearUpdateObject();
    }

    openUpdateModal = () => {
        this.refs.updateRole.fillUpdateObject();
        this.setState({showUpdateModal: true});
    }

    //BEGIN: Delete Roles
    onDeleteBtnClicked = () => {

        axios.delete('http://mattendenceserver.herokuapp.com/departments/' + this.state.selectedRoleId)
            .then(function (response) {
                this.refreshTable();
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }
    //END: Delete Roles

    getRoleById = (id) => {

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
            .then(function (roles) {
                this.setState(() => ({
                    data:roles.data
                }));
            }.bind(this));
    }
}

export default Roles;