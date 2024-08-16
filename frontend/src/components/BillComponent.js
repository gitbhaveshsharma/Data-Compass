import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Divider,
    Chip,
    Typography,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Box,
    Button,
    Select,
    MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

const BillComponent = ({ products, onUpdateBilling }) => {
    const [discountType, setDiscountType] = useState('amount');
    const [discountValue, setDiscountValue] = useState(0);
    const [gstPercentage, setGstPercentage] = useState(12);
    const [totalPrice, setTotalPrice] = useState(0);
    const [savedPrice, setSavedPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // Default payment method
    const [transactionId, setTransactionId] = useState('');
    const [transactionIdError, setTransactionIdError] = useState('');

    useEffect(() => {
        const originalTotal = calculateOriginalPrice(products);
        setTotalPrice(
            calculateTotalPrice(discountValue, discountType, gstPercentage, originalTotal)
        );
        setSavedPrice(calculateTotalPrice(discountValue, discountType, gstPercentage, originalTotal)); // Initially set savedPrice to the totalPrice
    }, [products]);

    const calculateOriginalPrice = (products) => {
        return products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    };

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

        const originalTotal = calculateOriginalPrice(products);
        const newTotalPrice = calculateTotalPrice(value, discountType, gstPercentage, originalTotal);
        setTotalPrice(newTotalPrice);
    };

    const handleDiscountTypeChange = (e) => {
        const value = e.target.value;
        setDiscountType(value);
        setDiscountValue(0); // Reset discount value when changing discount type

        const originalTotal = calculateOriginalPrice(products);
        const newTotalPrice = calculateTotalPrice(0, value, gstPercentage, originalTotal); // Pass 0 as discount value
        setTotalPrice(newTotalPrice);
    };

    const handleGstChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setGstPercentage(value);

        const originalTotal = calculateOriginalPrice(products);
        const newTotalPrice = calculateTotalPrice(discountValue, discountType, value, originalTotal);
        setTotalPrice(newTotalPrice);
    };

    const calculateDiscountPercentage = () => {
        const originalTotal = calculateOriginalPrice(products);
        const discountAmount = originalTotal - totalPrice;
        return originalTotal
            ? ((discountAmount / (originalTotal + (originalTotal * gstPercentage) / 100)) * 100).toFixed(
                2
            )
            : 0;
    };

    const calculateDiscountAmount = () => {
        const originalTotal = calculateOriginalPrice(products);
        return originalTotal - totalPrice;
    };

    const handleSavePrice = () => {
        if (paymentMethod !== 'COD' && !transactionId) {
            setTransactionIdError('Transaction ID is required for non-COD payment methods.');
            return;
        }
        setTransactionIdError('');

        
        const updatedBillDetails = {
            discountType,
            discountValue,
            gstPercentage,
            totalPrice: parseFloat(totalPrice).toFixed(2),
            paymentMethod,
            transactionId: paymentMethod !== 'COD' ? transactionId : '', // Only save transactionId if payment method is not COD
        };
        setSavedPrice(totalPrice); // Update savedPrice when saving
        onUpdateBilling(updatedBillDetails);
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        if (e.target.value === 'COD') {
            setTransactionId(''); // Clear transaction ID if COD is selected
            setTransactionIdError('');
        }
    };

    const handleTransactionIdChange = (e) => {
        setTransactionId(e.target.value);
        if (e.target.value) {
            setTransactionIdError('');
        }
    };

    return (
        <Root>
            <Card>
                <CardContent>
                    <Typography variant="h5">Bill Details</Typography>
                    <Typography variant="body1">Discount Type: {discountType}</Typography>
                    <Typography variant="body1">Discount Value: {discountValue}</Typography>
                    <Typography variant="body1">GST Percentage: {gstPercentage}</Typography>
                    <Typography variant="body1">Payment Method: {paymentMethod}</Typography>
                    <Typography variant="body1">Transaction ID: {transactionId || 'NA'}</Typography>
                    <Typography variant="body1">Saved Price: ₹{savedPrice.toFixed(2)}</Typography>
                    <Divider>
                        <Chip label="Set Bill Amounts" size="large" />
                    </Divider>
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
                    <FormControl fullWidth margin="normal">
                        <FormLabel>Payment Method</FormLabel>
                        <Select value={paymentMethod} onChange={handlePaymentMethodChange}>
                            <MenuItem value="COD">Cash on Delivery</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Debit Card">Debit Card</MenuItem>
                            <MenuItem value="Net Banking">Net Banking</MenuItem>
                            <MenuItem value="UPI">UPI</MenuItem>
                        </Select>
                    </FormControl>
                    {paymentMethod !== 'COD' && (
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Transaction ID"
                            value={transactionId}
                            onChange={handleTransactionIdChange}
                            variant="outlined"
                            error={!!transactionIdError}
                            helperText={transactionIdError || 'Please enter the transaction ID if not using COD.'}
                        />
                    )}
                    <Box marginTop={2}>
                        <Typography variant="body1">
                            {discountType === 'amount'
                                ? `Discount Given: ₹${calculateDiscountAmount().toFixed(2)}`
                                : `Discount Given: ${calculateDiscountPercentage()}%`}
                        </Typography>
                        <Typography variant="body1">Total Price: ₹{totalPrice.toFixed(2)}</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSavePrice}
                        sx={{ marginTop: 2 }}
                        disabled={paymentMethod !== 'COD' && !transactionId} // Disable button if transactionId is required but not provided
                    >
                        Save Price
                    </Button>
                </CardContent>
            </Card>
        </Root>
    );
};

export default BillComponent;
