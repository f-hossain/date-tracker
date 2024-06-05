"use client"
import { useState, useTransition, FormEvent, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { EventEmitter } from 'events';
import Header from "./header";
import ListCard from "./list-card";
import { Alert, Button, CircularProgress, Snackbar, Typography } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Check } from "@mui/icons-material";

export default function Collection(props : any) {
  const router = useRouter();
  const hostUrl = process.env['NEXT_PUBLIC_HOST']

  const [isPending, startTransition] = useTransition();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isAddButtonLoading, setIsAddButtonLoading] = useState(false)
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false)

  const [listData, setListData] = useState(props.lists);

  let noListsAvailable = ( !listData || !Array.isArray(listData) || listData.length == 0 )
  const [isEmpty, setIsEmpty] = useState(noListsAvailable)

  useEffect(() => {
    setIsPageLoading(true)
    noListsAvailable = ( !listData || !Array.isArray(listData) || listData.length == 0 )
    setIsPageLoading(false)
    setIsEmpty(noListsAvailable)
  }, [listData])
  

  // ==============  CONFIGURE EVENTS ===============

  const events = new EventEmitter();

  events.addListener('deleteList', (val => deleteListCallback(val)))

  const deleteListCallback = async(listId : any) => {
    setIsDeleteButtonLoading(true)

    const url = `${hostUrl}/api/list`

    const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(listId),
        headers: {
          'content-type': 'application/json'
        }
    })

    if ( response.status == 200 ) {
      startTransition(() => {
        const filtered = listData.filter( (list : any) => list.id != listId )
        setListData(filtered)

        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
        setAlertMessage("Successfully deleted a list!")
        setOpenSuccessAlert(true)
      });
    } else {
      setAlertMessage("Something went wrong. Please try again later!")
      setOpenErrorAlert(true)
    }

    setIsDeleteButtonLoading(false)
  };


  // ============== MODAL ACTIONS ==================

  // modal variables
  const [openAddModal, setOpenAddModal] = useState(false);

  // modal actions
  const handleAddModalOpen = () => {
    // events.emit('deleteList', 'test')
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const handleAddList = async(formData: any) => {
    setIsAddButtonLoading(true)

    const url = `/api/list`

    const response = await fetch(url, {
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
        const newListItem = {
            id: listItemData.id,
            title: listItemData.title,
            description: listItemData.description
        }

        setListData([...listData, newListItem])

        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
        setAlertMessage("Successfully added a new list!")
        setOpenSuccessAlert(true)
      });
    } else {
      setAlertMessage("Something went wrong. Please try again later!")
      setOpenErrorAlert(true)
    }

    setIsAddButtonLoading(false)
    handleAddModalClose()
  }


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


  return (
    <main className="flex min-h-screen flex-col items-center gap-10">
      < Header />
      <div className="flex flex-col items-center gap-5">
        <Typography>
          ♡ collections ♡
        </Typography>
        <Button size="small" onClick={handleAddModalOpen}>
          add list
        </Button>
      </div>

      { isPageLoading? (
        <div className="h-80 w-full flex justify-center items-center">
          <CircularProgress />
        </div>
        ) : ( 
        <div>
          {/* IF EMPTY STATE SHOW A MESSAGE ! */}
          { isEmpty? (
              <div className="h-80 w-full flex justify-center items-center">
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "linen",
                    // border: 0.75,
                    // borderColor: '#ffe4e4',
                    paddingX: '20px',
                    paddingY: '10px',
                    // mr: 2,
                    // display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    // fontWeight: 700,
                    // letterSpacing: '.1rem',
                    color: 'secondary'
                }}
                >
                  you have no lists !!! u should add a one c:
                </Typography> 
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 items-center px-5 pb-20 sm:px-20">
                { listData.map( (list : any, index : any) =>  <ListCard key={index} id={list.id} title={list.title} description={list.description} eventEmitter={events} loading={isDeleteButtonLoading} /> ) }
              </div>
            )
          }
        </div>)
      }

      <Dialog
        open={openAddModal}
        onClose={handleAddModalClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            handleAddList(formJson);
          },
        }}
      >
        <DialogTitle>New List</DialogTitle>
        <DialogContent>
          <div className='flex flex-col gap-3 w-96'>
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
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* SUCCESS ALERT POPUP */}
      <Snackbar open={openSuccessAlert} autoHideDuration={4000} onClose={handleSuccessAlertClose}>
        <Alert icon={<Check fontSize="inherit" />} onClose={handleSuccessAlertClose}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}
