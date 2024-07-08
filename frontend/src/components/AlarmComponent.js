import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AlarmComponent = ({ open, onClose, onSave }) => {
    const [alarmTime, setAlarmTime] = useState('');
    const [alarmMessage, setAlarmMessage] = useState('');

    const handleSave = () => {
        onSave({ time: new Date(alarmTime), message: alarmMessage });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Set Alarm</DialogTitle>
            <DialogContent>
                <TextField
                    label="Alarm Time"
                    type="datetime-local"
                    value={alarmTime}
                    onChange={(e) => setAlarmTime(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Alarm Message"
                    value={alarmMessage}
                    onChange={(e) => setAlarmMessage(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlarmComponent;
