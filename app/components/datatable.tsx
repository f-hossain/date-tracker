"use client"
import * as React from 'react';
import { useState, useTransition, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Button, CircularProgress, InputLabel, OutlinedInput, Select, SelectChangeEvent, Snackbar } from '@mui/material';
import { Check, Favorite, FavoriteBorder } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import project_constants from '@/constants';

export default function DataTable( props : any ) {
  const router = useRouter();
  const hostUrl = process.env['NEXT_PUBLIC_HOST']

  const [isPending, startTransition] = useTransition();
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false)
  const [isEditButtonLoading, setIsEditButtonLoading] = useState(false)
  const isOwner = props.isOwner

  const tagOptions = project_constants.TAG_OPTIONS
  const priceOptions = project_constants.PRICE_OPTIONS
  

  // row variables
  const [rowId, setRowId] = React.useState(0)
  const [activityTitle, setActivityTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  // const [tags, setTags] = React.useState([]);

  // modal variables
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

  // modal actions
  const handleEditModalOpen = (event: any, cellValues: any) => {
    setRowId(cellValues.row.id)
    setActivityTitle(cellValues.row.title)
    setDescription(cellValues.row.description)
    setPrice(cellValues.row.price)
    setTags(cellValues.row.tags_array)
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
  };

  const handleEditRow = async(formData: any) => {
    setIsEditButtonLoading(true)

    const url = `${hostUrl}/api/activity/${rowId}`

    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: {
        'content-type': 'application/json'
      }
    })

    const data = await response.json()
    const listItemData = data[0]

    if ( response.status == 200 && listItemData ) {
      startTransition(() => {
        props.setRow( ( (prevRows : any ) => {
          return prevRows.map((row : any) =>
            row.id == rowId ? { ...row, title: listItemData.title, description: listItemData.description, listItemData: formData.price, tags_array: listItemData.tags_array} : row,
          );
        }))
  
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
        setAlertMessage("Successfully updated an activity!")
        setOpenSuccessAlert(true)
      });
    } else {
      setAlertMessage("Something went wrong. Please try again later!")
      setOpenErrorAlert(true)
    }

    setIsEditButtonLoading(false)
    handleEditModalClose();
  }

  const handleDeleteModalOpen = (event: any, cellValues: any) => {
    setActivityTitle(cellValues.row.title)
    setRowId(cellValues.row.id)
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
  };

  const handleDeleteRow = async() => {
    setIsDeleteButtonLoading(true)

    const url = `${hostUrl}/api/activity/${rowId}`

    const response = await fetch(url, {
      method: 'DELETE',
      // body: JSON.stringify(rowId),
      headers: {
        'content-type': 'application/json'
      }
    })

    if ( response.status == 200 ) {
      startTransition(() => {
        const filtered = props.rows.filter( (row : any) => row.id != rowId )
        props.setRow(filtered)
  
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
        setAlertMessage("Successfully deleted an activity!")
        setOpenSuccessAlert(true)
      });
    } else {
      setAlertMessage("Something went wrong. Please try again later!")
      setOpenErrorAlert(true)
    }
    setIsDeleteButtonLoading(false)
    handleDeleteModalClose()
  };

  // status column click
  const handleCompletionClick = async(event: any, cellValues: any) => {
    const formData = { completed: !cellValues.row.completed }
    cellValues.row.completed = !cellValues.row.completed

    const url = `${hostUrl}/api/activity/${cellValues.row.id}`

    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: {
        'content-type': 'application/json'
      }
    })

    if ( response.status !== 200 ) {
      setAlertMessage("Something went wrong. Please try again later!")
      setOpenErrorAlert(true)
    }
  };


    // ========== ALERT OPTIONS ==============

    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorsAlert, setOpenErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("")
  
    const handleSuccessAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
          return;
      }
      setOpenSuccessAlert(false);
    };
  
    const handleErrorAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
          return;
      }
      setOpenErrorAlert(false);
    };


  // COLUMN DEFS
  const columns: GridColDef[] = [
    { 
      field: 'completed', 
      headerName: '♡ status ♡', 
      width: 85,
      headerAlign: 'center',
      align:'center',
      sortable: false,
      renderCell: (cellValues) => {
        return (
          // <IconButton 
          //   onClick={(event: any) => {
          //     handleCompletionClick(event, cellValues);
          // }}>
          //   { cellValues.row.completed ? <Favorite color='primary' /> : <FavoriteBorder color='primary' />}
          // </IconButton>

          <div>
            { isOwner ? 
              <IconButton 
              onClick={(event: any) => {
                handleCompletionClick(event, cellValues);
            }}>
              { cellValues.row.completed ? <Favorite color='primary' /> : <FavoriteBorder color='primary' />}
            </IconButton> :
            <div>
              { cellValues.row.completed ? <Favorite color='primary' /> : <FavoriteBorder color='primary' />}
            </div>}
          </div>
        )
      }
    },
    { 
      field: 'title', 
      headerName: '♡ activity ♡', 
      width: 140, 
      headerAlign: 'center', 
      align:'left' 
    },
    { 
      field: 'description', 
      headerName: '♡ description ♡', 
      flex: 0.4,
      headerAlign: 'center', 
      sortable: false 
    },
    { 
      field: 'price', 
      headerName: '♡ price ♡', 
      width: 85, 
      headerAlign: 'center', 
      align:'center' 
    },
    { 
      field: 'tags_array', 
      headerName: '♡ tags ♡', 
      flex: 0.3,
      headerAlign: 'center',
      sortable: false,
      renderCell: (cellValues) => {
        return (
          <div className='flex gap-1'>
            { cellValues.row.tags_array.map( (tag: any, index : any) => <Chip key={index} label={tag} color="primary" size="small" variant="outlined" /> )}
          </div>
        )
      }
    },
    {
      field: "actions",
      headerName: '♡ actions ♡',
      flex: 0.3,
      headerAlign: 'center',
      align:'center',
      sortable: false,
      renderCell: (cellValues) => {
        return (
          <div className='flex gap-1'>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={(event) => {
                handleEditModalOpen(event, cellValues);
              }}
            >
              edit
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={(event) => {
                handleDeleteModalOpen(event, cellValues);
              }}
            >
              delete
            </Button>
          </div>
        );
      }
    }
  ];

  const handleMultiSelectChange = (event: any) => {
    const { target: { value } } = event;
    setTags(typeof value === 'string' ? value.split(',') : value);
  }

  return (
    <div style={{ width: '100%' }} >
      {/* DATA TABLE */}
      <DataGrid
        // autoHeight
        rows={props.rows}
        columns={columns}
        columnVisibilityModel={{
          // Hide columns status and traderName, the other columns will remain visible
          // completed: isOwner,
          actions: isOwner,
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
          // sorting: {
          //   sortModel: [{ field: 'id', sort: 'desc' }],
          // },
        }}
        pageSizeOptions={[10]}
        localeText={{
          noRowsLabel: 'there are no activities to display :c add one !!'
        }}
        sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
             outline: "none !important",
          },
       }}
      />

      {/* DELETE MODAL */}
      <Dialog
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete activity?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete <i>{activityTitle}</i> ? This action cannot be undone. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="primary" disabled={isDeleteButtonLoading} onClick={handleDeleteModalClose}>Cancel</Button>
          <Button variant="text" color="secondary" disabled={isDeleteButtonLoading} onClick={handleDeleteRow} autoFocus>
            {/* Confirm */}
            { isDeleteButtonLoading? <CircularProgress size="1rem" /> : "confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog
        open={openEditModal}
        onClose={handleEditModalClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            console.log(formJson)
            handleEditRow(formJson);
          },
        }}
      >
        <DialogTitle>Edit Activity</DialogTitle>
        <DialogContent>
          <div className='flex flex-col gap-3 pb-3 w-96'>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="title"
              label="title"
              fullWidth
              variant="outlined"
              defaultValue={activityTitle}
              disabled={isEditButtonLoading}
            />
            <TextField
              id="outlined-multiline-stati2c"
              label="description"
              name="description"
              multiline
              fullWidth
              rows={4}
              defaultValue={description}
              disabled={isEditButtonLoading}
            />
          </div>
          <div className='flex gap-3'>
            <TextField
            id="outlined-select-currency"
            name="price"
            select
            fullWidth
            label="price"
            defaultValue={price}
            disabled={isEditButtonLoading}
            >
              {priceOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-select-currency"
              name="tags"
              select
              fullWidth
              label="activity type"
              defaultValue={tags[0]}
              disabled={isEditButtonLoading}
              SelectProps={{
                multiple: true,
                value: tags,
                onChange: handleMultiSelectChange
              }}
            >
              {tagOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            {/* <Select
              id="outlined-select-tags"
              name="tags"
              value={tags}
              multiple
              fullWidth
              disabled={isEditButtonLoading}
              // input={<OutlinedInput label="activity type" />}
              onChange={handleMultiSelectChange}
              
            >
              {tagOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}

            </Select> */}

          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" disabled={isEditButtonLoading} onClick={handleEditModalClose}>Cancel</Button>
          <Button color="secondary" disabled={isEditButtonLoading} type="submit">
            { isEditButtonLoading? <CircularProgress size="1rem" /> : "save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ERROR ALERT POPUP */}
      <Snackbar open={openErrorsAlert} autoHideDuration={4000} onClose={handleErrorAlertClose}>
        <Alert onClose={handleErrorAlertClose} severity="error">
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* SUCCESS ALERT POPUP */}
      <Snackbar open={openSuccessAlert} autoHideDuration={4000} onClose={handleSuccessAlertClose}>
        <Alert icon={<Check fontSize="inherit" />} onClose={handleSuccessAlertClose}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}