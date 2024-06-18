// src/components/OperationPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataById, updateData, orderData, cancelData, callbackData } from '../redux/operationActions';

import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { FormControl, useFormControlContext } from '@mui/base/FormControl';

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const StyledInput = styled('input')(
    ({ theme }) => `
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    outline: 0;
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }
`,
);

const HelperText = styled((props) => {
    const formControlContext = useFormControlContext();
    const [dirty, setDirty] = React.useState(false);

    React.useEffect(() => {
        if (formControlContext?.filled) {
            setDirty(true);
        }
    }, [formControlContext]);

    if (formControlContext === undefined) {
        return null;
    }

    const { required, filled } = formControlContext;
    const showRequiredError = dirty && required && !filled;

    return showRequiredError ? <p {...props}>This field is required.</p> : null;
})`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;

const OperationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.operation.data);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        address: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        dispatch(fetchDataById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                number: data.number || '',
                address: data.address || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await dispatch(updateData(id, formData));
            setMessage('Data updated successfully!');
        } catch (error) {
            setMessage('Failed to update data.');
        }
    };

    const handleOrder = async () => {
        try {
            await dispatch(orderData(id));
            setMessage('Order placed successfully!');
            navigate('/');
        } catch (error) {
            setMessage('Failed to place order.');
        }
    };

    const handleCancel = async () => {
        try {
            await dispatch(cancelData(id));
            setMessage('Order canceled successfully!');
            navigate('/');
        } catch (error) {
            setMessage('Failed to cancel order.');
        }
    };

    const handleCallback = async () => {
        try {
            await dispatch(callbackData(id));
            setMessage('Callback request sent successfully!');
            navigate('/');
        } catch (error) {
            setMessage('Failed to send callback request.');
        }
    };

    if (!data) return <div>Loading...</div>;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90vh',
            padding: '20px',
        }}>
            <Typography gutterBottom variant="h3" component="div" sx={{
                textAlign: "center",
                marginTop: '20px',
                color: 'primary.main',
                fontWeight: 'bold',
            }}>
                Operation Page
            </Typography>

            <Card sx={{ maxWidth: 345, margin: 'auto', padding: '50px' }}>
                <CardContent>
                    {message && <Alert severity={message.includes('successfully') ? 'success' : 'error'}>{message}</Alert>}
                </CardContent>
                <CardContent sx={{ margin: 'auto', padding: '0' }}>
                    <form>
                        <FormControl required>
                            <label>Name:</label>
                            <StyledInput
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Write your name here"
                            />
                            <HelperText />
                        </FormControl>
                        <FormControl required>
                            <label>Number:</label>
                            <StyledInput
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                placeholder="Write your number here"
                            />
                            <HelperText />
                        </FormControl>
                        <FormControl required>
                            <label>Address:</label>
                            <StyledInput
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Write your address here"
                            />
                            <HelperText />
                        </FormControl>
                    </form>
                </CardContent>
                <CardActions>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
                    <Button variant="contained" color="success" onClick={handleOrder}>Order</Button>
                    <Button variant="contained" color="error" onClick={handleCancel}>Cancel</Button>
                    <Button variant="contained" color="secondary" onClick={handleCallback}>Callback</Button>
                </CardActions>

            </Card>
        </div>
    );
};

export default OperationPage;
