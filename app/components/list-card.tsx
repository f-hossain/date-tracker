"use client"
import { Fragment, useEffect, useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import project_constants from '@/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, CircularProgress, IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { Check } from '@mui/icons-material';

export default function OutlinedCard( props : any ) {
    const hostUrl = process.env['NEXT_PUBLIC_HOST']

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    

    const shareList = () => {
        const url = `${hostUrl}/view/${props.id}`
        navigator.clipboard.writeText(url).then( function(x) {
            setOpenSuccessAlert(true);
        })
    }

    const handleDeleteModalOpen = () => {
        setOpenDeleteModal(true);
    };
    
    const handleDeleteModalClose = () => {
        setOpenDeleteModal(false);
    };
    
    const handleDeleteList = () => {
        props.eventEmitter.emit('deleteList', props.id)
        // handleDeleteModalClose()
    };

    useEffect( () => {
        if (!props.loading && openDeleteModal ) {
            handleDeleteModalClose()
        }
    }, [props.loading])
    
    const handleSuccessAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSuccessAlert(false);
    };
    

  return (
    <div className='transition hover:shadow-lg hover:shadow-rose-50 duration-500'>
        <Box sx={{ minWidth: 275, }}>
            <Card variant="outlined">
                <CardContent>
                    <div className='flex justify-center items-center w-full pb-4'>
                        <Typography 
                            variant="h6" 
                            component="div" 
                            color="secondary" 
                            sx={{
                                borderBottom: 0.75,
                                borderColor: '#ffe4e4',
                                paddingX: '10px',
                                paddingBottom: '2px',
                                // mr: 2,
                                // display: { xs: 'none', md: 'flex' },
                                // fontFamily: 'monospace',
                                // fontWeight: 700,
                                // letterSpacing: '.1rem',
                                // color: 'white'
                            }}
                        >
                            {props.title}
                        </Typography>
                    </div>
                    <Typography 
                        variant="body2"
                        noWrap={true}
                        align="center"
                        sx={{
                            // borderBottom: 0.75,
                            // borderColor: '#ffe4e4',
                            paddingY: '5px',
                            // mr: 2,
                            // display: { xs: 'none', md: 'flex' },
                            // fontFamily: 'monospace',
                            // fontWeight: 200,
                            // letterSpacing: '.1rem',
                            // color: 'white'
                        }}
                    >
                        {props.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <div className='w-full flex justify-center items-center'>
                        <Button color="secondary" size="small"><Link href={`/list/${props.id}`}>view</Link></Button>
                        <Button size="small" onClick={shareList}>share</Button>
                        <Button size="small"onClick={handleDeleteModalOpen}>delete</Button>
                    </div>
                </CardActions>
            </Card>
        </Box>
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
                    Are you sure you want to delete <i>{props.title}</i> ? This action cannot be undone. 
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="primary" disabled={props.loading} onClick={handleDeleteModalClose}>Cancel</Button>
                <Button variant="text" color="secondary" disabled={props.loading} onClick={handleDeleteList} autoFocus>
                    { props.loading? <CircularProgress size="1rem" /> : "confirm"}
                </Button>
            </DialogActions>
        </Dialog>

        {/* LINK SHARING ALERT */}
        <Snackbar open={openSuccessAlert} autoHideDuration={4000} onClose={handleSuccessAlertClose}>
            <Alert icon={<Check fontSize="inherit" />} onClose={handleSuccessAlertClose}>
                list url copied to clipboard!
            </Alert>
        </Snackbar>
    </div>
  );
}

