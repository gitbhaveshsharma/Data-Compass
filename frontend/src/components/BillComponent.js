import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Button } from '@mui/material';
import { useDispatch } from 'react-redux';

const BillComponent = ({ products, onUpdateBilling }) => {
    const dispatch = useDispatch();
    const [discountType, setDiscountType] = useState('amount');
    const [discountValue, setDiscountValue] = useState('');
    const [gstPercentage, setGstPercentage] = useState(5);
    const [totalPrice, setTotalPrice] = useState(calculateTotalPrice(products, 5));
    const [savedPrice, setSavedPrice] = useState(totalPrice);

    useEffect(() => {
        setTotalPrice(calculateTotalPrice(products, gstPercentage));
    }, [products, gstPercentage]);

    function calculateTotalPrice(products, gst) {
        const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
        return total + (total * gst / 100); // Add dynamic GST percentage
    }

    const handleDiscountChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setDiscountValue(value);

        let newTotalPrice = calculateTotalPrice(products, gstPercentage);
        if (discountType === 'amount') {
            newTotalPrice -= value;
        } else if (discountType === 'percentage') {
            newTotalPrice -= (newTotalPrice * value) / 100;
        }

        setTotalPrice(newTotalPrice);
        updateBillingDetails(newTotalPrice);
    };

    const handleDiscountTypeChange = (e) => {
        setDiscountType(e.target.value);
        setDiscountValue('');
        setTotalPrice(calculateTotalPrice(products, gstPercentage));
        updateBillingDetails(calculateTotalPrice(products, gstPercentage));
    };

    const handleGstChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setGstPercentage(value);
        setTotalPrice(calculateTotalPrice(products, value));
        updateBillingDetails(calculateTotalPrice(products, value));
    };

    const calculateDiscountPercentage = () => {
        const originalTotal = calculateTotalPrice(products, gstPercentage);
        const discountAmount = originalTotal - totalPrice;
        return originalTotal ? ((discountAmount / originalTotal) * 100).toFixed(2) : 0;
    };

    const calculateDiscountAmount = () => {
        const originalTotal = calculateTotalPrice(products, gstPercentage);
        return originalTotal - totalPrice;
    };

    const handleSavePrice = () => {
        setSavedPrice(totalPrice);
        const billDetails = [{
            discountType,
            discountValue: discountType === 'amount' ? discountValue : calculateDiscountAmount(),
            gstPercentage,
            totalPrice
        }];
        updateBillingDetails(totalPrice);
    };

    const updateBillingDetails = (newTotalPrice) => {
        const billDetails = {
            discountType,
            discountValue: discountType === 'amount' ? discountValue : calculateDiscountAmount(),
            gstPercentage,
            totalPrice: newTotalPrice.toFixed(2)
        };
        onUpdateBilling(billDetails);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Bill Details</Typography>
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Discount Type</FormLabel>
                    <RadioGroup row value={discountType} onChange={handleDiscountTypeChange}>
                        <FormControlLabel value="amount" control={<Radio />} label="In Amount" />
                        <FormControlLabel value="percentage" control={<Radio />} label="In Percentage" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label={`Discount ${discountType === 'amount' ? 'Amount' : 'Percentage'}`}
                    value={discountValue}
                    onChange={handleDiscountChange}
                    variant="outlined"
                    type="number"
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="GST Percentage"
                    value={gstPercentage}
                    onChange={handleGstChange}
                    variant="outlined"
                    type="number"
                />
                <Box marginTop={2}>
                    <Typography variant="body1">
                        {discountType === 'amount'
                            ? `Discount Given: ${calculateDiscountPercentage()}%`
                            : `Discount Given: $${calculateDiscountAmount().toFixed(2)}`}
                    </Typography>
                    <Typography variant="body1">Total Price: ${totalPrice.toFixed(2)}</Typography>
                </Box>
                <Button variant="contained" color="primary" onClick={handleSavePrice} sx={{ marginTop: 2 }}>
                    Save Price
                </Button>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    Saved Price: ${savedPrice.toFixed(2)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default BillComponent;
