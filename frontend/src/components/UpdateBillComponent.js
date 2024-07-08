import React, { useState, useEffect } from 'react';
import { Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Button } from '@mui/material';

const UpdateBillComponent = ({ billDetails, products, onUpdateBilling }) => {
    const [discountType, setDiscountType] = useState(billDetails.discountType || 'amount');
    const [discountValue, setDiscountValue] = useState(billDetails.discountValue || 0);
    const [gstPercentage, setGstPercentage] = useState(billDetails.gstPercentage || '');
    const [totalPrice, setTotalPrice] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);

    useEffect(() => {
        const originalTotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
        setOriginalPrice(originalTotal);
        setTotalPrice(calculateTotalPrice(discountValue, discountType, gstPercentage, originalTotal));
    }, [products]);

    const calculateTotalPrice = (discountValue, discountType, gst, originalPrice) => {
        let discountedPrice = originalPrice;

        if (discountType === 'amount') {
            discountedPrice -= discountValue;
        } else if (discountType === 'percentage') {
            discountedPrice -= (originalPrice * discountValue) / 100;
        }

        const totalPriceWithGst = discountedPrice + (discountedPrice * gst) / 100;
        return totalPriceWithGst;
    };

    const handleDiscountChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setDiscountValue(value);

        const newTotalPrice = calculateTotalPrice(value, discountType, gstPercentage, originalPrice);
        setTotalPrice(newTotalPrice);
    };

    const handleDiscountTypeChange = (e) => {
        const value = e.target.value;
        setDiscountType(value);
        setDiscountValue(0); // Reset discount value when changing discount type

        const newTotalPrice = calculateTotalPrice(0, value, gstPercentage, originalPrice); // Pass 0 as discount value
        setTotalPrice(newTotalPrice);
    };

    const handleGstChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setGstPercentage(value);

        const newTotalPrice = calculateTotalPrice(discountValue, discountType, value, originalPrice);
        setTotalPrice(newTotalPrice);
    };

    const calculateDiscountPercentage = () => {
        const discountAmount = originalPrice - totalPrice;
        return originalPrice ? ((discountAmount / (originalPrice + (originalPrice * gstPercentage) / 100)) * 100).toFixed(2) : 0;
    };

    const calculateDiscountAmount = () => {
        return originalPrice - totalPrice;
    };

    const handleSavePrice = () => {
        const updatedBillDetails = {
            ...billDetails,
            discountType,
            discountValue,
            gstPercentage,
            totalPrice: parseFloat(totalPrice).toFixed(2)
        };
        onUpdateBilling(updatedBillDetails);
    };

    return (
        <>
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
                        ? `Discount Given: ₹${calculateDiscountAmount().toFixed(2)}`
                        : `Discount Given: ${calculateDiscountPercentage()}%`}
                </Typography>
                <Typography variant="body1">Total Price: ₹{totalPrice.toFixed(2)}</Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={handleSavePrice} sx={{ marginTop: 2 }}>
                Save Price
            </Button>
        </>
    );
};

export default UpdateBillComponent;
