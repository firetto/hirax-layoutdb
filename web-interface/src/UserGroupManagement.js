import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

function UserGroupManagementPage() {
    const [userGroups, setUserGroups] = useState([]);
    const [selectedUserGroup, setSelectedUserGroup] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        // Fetch user groups from API
        fetchUserGroups();
    }, []);

    const fetchUserGroups = () => {
        // Make API call to fetch user groups
        let input = '/api/get_user_group_list'
        fetch(input).then(
            res => res.json()
        ).then(data => {
            setUserGroups(data.result);
        })
    };

    const fetchPermissionsForGroup = (groupId) => {
        // Make API call to fetch permissions for the selected user group
        // Example API call: fetch(`/api/userGroups/${groupId}/permissions`).then(response => response.json()).then(data => setPermissions(data.permissions));
        // Replace the above line with actual API call once it's implemented
        // Mocking permissions data for demonstration
        const mockPermissions = ['Permission 1', 'Permission 2', 'Permission 3'];
        setPermissions(mockPermissions);
    };

    const handleUserGroupSelect = (event, value) => {
        // Update selected user group
        setSelectedUserGroup(value);
        if (value) {
            // Fetch permissions for the selected user group
            fetchPermissionsForGroup(value.id);
            // Reset selected permissions
            setSelectedPermissions([]);
        }
    };

    const handlePermissionSelect = (event, values) => {
        // Update selected permissions
        setSelectedPermissions(values);
    };

    const handleCreateNewGroup = () => {
        // Open modal for creating new user group
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        // Close modal for creating new user group
        setOpenModal(false);
    };

    const handleCreateGroup = () => {
        // Make API call to create new user group with selected permissions
        
        let input = '/api/new_usergroup';
        const formData = new FormData();
        formData.append('name', newGroupName);
        formData.append('permissions', selectedPermissions.join(";"));
        const requestOptions = {
            method: 'POST', 
            body: formData
        };
        fetch(input, requestOptions)
          .then(res => res.json())
          .then(data => {
            console.log("res", data);
          })
          .catch(err => {
            console.error("Err:", err);
          })
        

        // Close modal after creating group
        setOpenModal(false);
        // Clear new group name and selected permissions
        setNewGroupName('');
        setSelectedPermissions([]);
        // Refresh user groups
        fetchUserGroups();
    };

    const handleSetProperties = () => {
        // Implement functionality to set properties for the focused group


        console.log('Set properties for', selectedUserGroup);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1>User Group Management</h1>
            <div style={{ marginBottom: '20px', width: '300px' }}>
                <Autocomplete
                    options={userGroups}
                    getOptionLabel={(group) => group.name}
                    onChange={handleUserGroupSelect}
                    renderInput={(params) => <TextField {...params} label="Search User Groups" variant="outlined" />}
                />
            </div>
            {selectedUserGroup && (
                <div style={{ marginBottom: '20px', width: '300px' }}>
                    <h2>Add permissions for {selectedUserGroup.name}</h2>
                    <Autocomplete
                        multiple
                        options={permissions}
                        getOptionLabel={(permission) => permission}
                        onChange={handlePermissionSelect}
                        renderInput={(params) => <TextField {...params} label="Select Permissions" variant="outlined" />}
                    />
                </div>
            )}
            <div style={{ marginBottom: '20px' }}>
                {selectedUserGroup && (
                    <Button variant="contained" color="primary" onClick={handleSetProperties}>
                        Set Permissions
                    </Button>
                )}
            </div>
            <Button variant="contained" color="primary" onClick={handleCreateNewGroup}>
                Create New Group
            </Button>
            <Modal open={openModal} onClose={handleCloseModal}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }}>
                    <h2>Create New User Group</h2>
                    <TextField
                        label="Group Name"
                        variant="outlined"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <Autocomplete
                        multiple
                        options={permissions}
                        getOptionLabel={(permission) => permission}
                        onChange={handlePermissionSelect}
                        renderInput={(params) => <TextField {...params} label="Select Permissions" variant="outlined" />}
                        style={{ marginBottom: '10px' }}
                    />
                    <div>
                        <Button variant="contained" color="primary" onClick={handleCreateGroup}>
                            Create Group
                        </Button>
                        <Button variant="contained" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default UserGroupManagementPage;