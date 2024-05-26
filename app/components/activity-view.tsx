"use client"
import { useState, useTransition, FormEvent } from "react";
import DataTable from '@/app/components/datatable';
import Header from '@/app/components/header';
import { Alert, CircularProgress, InputLabel, OutlinedInput, Select, SelectChangeEvent, Snackbar, Typography } from '@mui/material';
import { Add, Check } from '@mui/icons-material';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import project_constants from '@/constants';


export default function ActivityView( props : any) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isAddButtonLoading, setIsAddButtonLoading] = useState(false)
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorsAlert, setOpenErrorAlert] = useState(false);

  const listTitle = props.title
  const isOwner = props.isOwner

  const tagOptions = project_constants.TAG_OPTIONS
  const priceOptions = project_constants.PRICE_OPTIONS

  // define row data
  const [rowData, setRowData] = useState(props.rows);

  // ADD MODAL
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const handleAddRow = async(formData: any) => {
    setIsAddButtonLoading(true)

    const response = await fetch(`http://localhost:3000/api/activity/${props.listId}`,{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'content-type': 'application/json'
        }
    })

    const data = await response.json()
    const listItemData = data[0]

    if ( response.status == 200 && listItemData ) {
      startTransition(() => {

        const newRow = {
            id: listItemData.id,
            completed: listItemData.completed,
            title: listItemData.title,
            description: listItemData.description,
            price: listItemData.price,
            tags_array: listItemData.tags_array
        }

        setRowData([...rowData, newRow])

        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
        setOpenSuccessAlert(true)
      });
    } else {
      setOpenErrorAlert(true)
    }

    setTags([])
    setIsAddButtonLoading(false)
    handleAddModalClose()
  }

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

  const [tags, setTags] = useState<string[]>([]);

  const handleMultiSelectChange = (event: any) => {
    const {target: { value },} = event;
    setTags(typeof value === 'string' ? value.split(',') : value);
  };

  return(
    <div>
      {/* <Header /> */}
      <div className='flex flex-col  justify-center items-center'>
        <div className="w-2/3">
          <div className='flex items-center justify-between pb-5 pt-16'>
            <Typography 
              variant="h6"
              color={"secondary"}
              sx={{
                letterSpacing: '.15rem'
              }}
            >
              {listTitle}
            </Typography>
            { isOwner? 
              <IconButton
                onClick={(event) => {
                  handleAddModalOpen();
                }}
              >
                <Add color='secondary' />
              </IconButton> : <div></div>
            }
          </div>

          <div>
            <DataTable key={props.listId} rows={rowData} setRow={setRowData} isOwner={isOwner} />
          </div>
        </div>
      </div>

      {/* add modal */}
      <Dialog
        open={openAddModal}
        onClose={handleAddModalClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            handleAddRow(formJson);
          },
        }}
      >
        <DialogTitle>New Activity</DialogTitle>
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
              disabled={isAddButtonLoading}
            />
            <TextField
              id="outlined-multiline-stati2c"
              label="description"
              name="description"
              multiline
              fullWidth
              rows={4}
              disabled={isAddButtonLoading}
            />
          </div>
          <div className='flex gap-3'>
            <TextField
            id="outlined-select-currency"
            name="price"
            select
            fullWidth
            label="price"
            disabled={isAddButtonLoading}
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
              disabled={isAddButtonLoading}
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
              id="outlined-select-currency"
              name="tags"
              value={tags}
              multiple
              fullWidth
              disabled={isAddButtonLoading}
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
          <Button color="primary" disabled={isAddButtonLoading} onClick={handleAddModalClose}>Cancel</Button>
          <Button color="secondary" disabled={isAddButtonLoading} type="submit">
            { isAddButtonLoading? <CircularProgress size="1rem" /> : "save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ERROR ALERT POPUP */}
      <Snackbar open={openErrorsAlert} autoHideDuration={4000} onClose={handleErrorAlertClose}>
        <Alert onClose={handleErrorAlertClose} severity="error">
          Something went wrong. Please try again later!
        </Alert>
      </Snackbar>

      {/* SUCCESS ALERT POPUP */}
      <Snackbar open={openSuccessAlert} autoHideDuration={4000} onClose={handleSuccessAlertClose}>
        <Alert icon={<Check fontSize="inherit" />} onClose={handleSuccessAlertClose}>
          Successfully added a new activity!
        </Alert>
      </Snackbar>
    </div>
  )
}