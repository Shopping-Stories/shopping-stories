import ActionDialog from '@components/ActionDialog';
import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import PaginationTableUsers from '@components/PaginationTableUsers';
import PaginationTableHead from '@components/PaginationTableHead';
import PaginationTableRowUsers from '@components/PaginationTableRowUsers';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
    ListUsersQuery,
    AddUserToGroupDef,
    RemoveUserFromGroupDef,
    EnableUserDef,
    DisableUserDef,
    ListGroupsForUserDef,
} from 'client/graphqlDefs';
import { User, listUsers } from 'client/types';
import { cloneWithoutTypename, flatten } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { FormEvent, useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useQuery, useMutation } from 'urql';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { get } from 'lodash';
import xlsx from 'xlsx';

const ManageUsersPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;

    const [_addUserToGroupResult, addUserToGroup] =
        useMutation(AddUserToGroupDef);
    const [_removeUserFromGroupResult, removeUserFromGroup] = useMutation(
        RemoveUserFromGroupDef,
    );

    const [_ListGroupsForUser, listGroupsForUser] = useQuery({
        query: ListGroupsForUserDef,
    });

    const [_enableUserResult, enableUser] = useMutation(EnableUserDef);

    const [_disableUserResult, disableUser] = useMutation(DisableUserDef);
    const [search, setSearch] = useState<string>('');
    const [userToEnableDisable, setUserToEnableDisable] = useState<User | null>(
        null,
    );

    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [enableDisable, setEnableDisable] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [rows, setRows] = useState<listUsers>({ Users: [] });

    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const handleOpenUpdate = () => setOpenUpdate(true);
    const handleCloseUpdate = () => setOpenUpdate(false);

    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const handleOpenEnableDisable = () => setOpenDelete(true);
    const handleCloseEnableDisable = () => setOpenDelete(false);

    const userGroups = [
        {
            value: 'User',
            label: 'User',
        },
        {
            value: 'Admin',
            label: 'Admin',
        },
        {
            value: 'Moderator',
            label: 'Moderator',
        },
    ];

    const exportRowsToSpreadSheet = () => {
        const XLSX = xlsx;
        const fileName = `userExport-${Date.now()}`;
        const flatRows = rows.Users.map((row) =>
            flatten(cloneWithoutTypename(row)),
        );
        const workSheet = XLSX.utils.json_to_sheet(flatRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, workSheet, fileName);
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    const updateForm = useFormik<{
        groupname: String;
        username: String;
    }>({
        initialValues: {
            groupname: '',
            username: '',
        },

        onSubmit: async (values, { resetForm }) => {
            setUpdating(true);
            let { groupname, username } = values;
            console.log(groupname);
            console.log(username);

            let oldgroupname = groupname;
            groupname = 'User';
            console.log(oldgroupname);
            let res = await removeUserFromGroup({
                groupname,
                username,
            });
            if (res.error) {
                console.error(res.error);
            }
            groupname = 'Moderator';
            res = await removeUserFromGroup({
                groupname,
                username,
            });
            if (res.error) {
                console.error(res.error);
            }
            groupname = 'Admin';
            res = await removeUserFromGroup({
                groupname,
                username,
            });
            if (res.error) {
                console.error(res.error);
            }
            groupname = oldgroupname;
            res = await addUserToGroup({
                groupname,
                username,
            });
            if (res.error) {
                console.error(res.error);
            } else {
                handleCloseUpdate();
                resetForm();
            }
            setUpdating(false);
        },
    });

    const handleEnableDisableUser = async (
        e?: FormEvent<HTMLFormElement> | undefined,
    ) => {
        if (e) {
            e.preventDefault();
        }
        if (userToEnableDisable) {
            setEnableDisable(true);
            const username = userToEnableDisable.Username;
            if (!userToEnableDisable.Enabled) {
                const res = await enableUser({ username });
                if (res.error) {
                    console.error(res.error);
                } else {
                    setReQuery(true);
                    handleCloseEnableDisable();
                }
            } else {
                const res = await disableUser({ username });
                if (res.error) {
                    console.error(res.error);
                } else {
                    setReQuery(true);
                    handleCloseEnableDisable();
                }
            }
            setEnableDisable(false);
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                    <Stack spacing={2}>
                        <div>
                            <Typography
                                sx={{ textAlign: 'center' }}
                                variant="h4"
                            >
                                Users
                            </Typography>
                        </div>
                        <PaginationTableUsers
                            queryDef={ListUsersQuery}
                            search={search}
                            setRows={setRows}
                            reQuery={reQuery}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            headerRow={
                                <PaginationTableHead
                                    isAdmin={isAdmin}
                                    isAdminOrModerator={isAdminOrModerator}
                                    labels={[
                                        'Username',
                                        'First name',
                                        'Last name',
                                        'Email',
                                        'Email verified?',
                                        'Enabled?',
                                    ]}
                                />
                            }
                            bodyRows={rows.Users.map((row, i) => (
                                <PaginationTableRowUsers
                                    key={i}
                                    row={row}
                                    isAdmin={isAdmin}
                                    cellValues={[
                                        row.Username,
                                        row.Attributes.map(
                                            (obj) => obj.Value,
                                        )[2],
                                        row.Attributes.map(
                                            (obj) => obj.Value,
                                        )[3],
                                        row.Attributes.map(
                                            (obj) => obj.Value,
                                        )[4],
                                        row.Attributes.map(
                                            (obj) => obj.Value,
                                        )[1],
                                        String(row.Enabled),
                                    ]}
                                    isAdminOrModerator={isAdminOrModerator}
                                    onEditClick={(row) => {
                                        updateForm.setValues({
                                            groupname: '',
                                            username: row.Username,
                                        });
                                        handleOpenUpdate();
                                    }}
                                    onEnableDisableClick={async (row) => {
                                        setUserToEnableDisable(row);
                                        handleOpenEnableDisable();
                                    }}
                                />
                            ))}
                        />
                    </Stack>
                    <div>
                        <Box textAlign="center">
                            <Button
                                sx={{ m: 2 }}
                                variant="contained"
                                startIcon={<FileDownloadIcon />}
                                onClick={exportRowsToSpreadSheet}
                            >
                                download users
                            </Button>
                        </Box>
                    </div>
                </Paper>
            </DashboardPageSkeleton>

            {/* Edit Dialog */}
            <ActionDialog
                isOpen={openUpdate}
                onClose={handleCloseUpdate}
                isSubmitting={updating}
                onSubmit={updateForm.handleSubmit}
                title={`Edit User Group`}
            >
                <DialogContentText>
                    Update any of the fields and submit.
                </DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="username"
                    label="username"
                    value={get(updateForm.values, 'username')}
                    fieldName="username"
                    formikForm={updateForm}
                />
                <Select
                    fullWidth
                    autoFocus
                    name="groupname"
                    label="groupname"
                    value={get(updateForm.values, 'groupname')}
                    onChange={updateForm.handleChange}
                >
                    <MenuItem disabled value=""></MenuItem>
                    {userGroups.map((item) => (
                        <MenuItem value={item.value}>{item.label}</MenuItem>
                    ))}
                </Select>
            </ActionDialog>

            {/* Enable/Disable Dialog */}
            <ActionDialog
                isOpen={openDelete}
                onClose={handleCloseEnableDisable}
                isSubmitting={enableDisable}
                onSubmit={handleEnableDisableUser}
                title={`Confirm status change of ${userToEnableDisable?.Username}`}
            >
                Are you sure you want to change the status of{' '}
                {userToEnableDisable && userToEnableDisable.Username}
            </ActionDialog>
        </ColorBackground>
    );
};

export default ManageUsersPage;
