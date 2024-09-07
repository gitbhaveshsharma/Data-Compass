//modal/CallAttempt

const mongoose = require('mongoose');

const CallAttemptSchema = new mongoose.Schema({
  attemptsNumber: {
    type: String,
    enum: ['attempt 1', 'attempt 2', 'attempt 3', 'attempt 4', 'attempt 5'],
    required: true
  },
  callStatus: {
    type: String,
    enum: [
      'NOANSWER',
      'ANSWER',
      'FLOW_ANSWER',
      'FAILED',
      'BUSY',
      'REJECTED',
      'NOROUTE',
      'BUSY_CHANNEL1',
      'BUSY_CHANNEL2',
      'FAILED_CHANNEL1',
      'FAILED_CHANNEL2',
      'NOANSWER_CHANNEL1',
      'NOANSWER_CHANNEL2',
      'MAXUSE',
      'FLOW_UNASSIGNED',
      'FLOW_PAUSED',
      'FLOW_NOT_PUBLISHED',
      'FLOW_UNREACHABLE',
      'QUEUE_TIMEOUT',
      'OBD_TIMEOUT',
      'CANCEL',
      'BRIDGE_UNAVAILABLE',
      'NO_INCOMING_CLI',
      'INCOMING_DISCONNECTED',
      'RING_TIMEOUT',
      'FLOW_EXECUTED',
      'OUTGOING_RESTRICTED'
    ],
    required: true
  },
  callDescription: {
    type: String,
    enum: [
      'The call was not answered by the callee (dialled number).',
      'The call was answered by the callee (dialled number).',
      'An incoming call landed successfully on the Flow.',
      'The call initiation failed.',
      'The callee (dialled number) was busy.',
      'The call was rejected by the callee (dialled number).',
      'No dialling route was available for the ‘TO’ number.',
      'The first dialled number was busy when the call was initiated.',
      'The first dialled number was answered while the second dialled number was busy.',
      'The call initiation failed for the first dialled number.',
      'The first dialled number was answered while the call initiation failed for the second dialled number.',
      'The call was not answered by the first dialled number.',
      'The first dialled number was answered while the call was not answered by the second dialled number.',
      'The call was not initiated as the channel capacity reached its maximum limit.',
      'There was no DID number assigned to the flow which was supposed to be triggered by the outbound call.',
      'The flow triggered by the outbound call is in the Pause state.',
      'The flow triggered by the outbound call was not published.',
      'The flow triggered by the outbound call was not reachable.',
      'The queued calls were not initiated due to queue timeout.',
      'The outbound call timeout was due to set values in OBD API.',
      'The call was rejected by the caller.',
      'The Bridge number was inactive when the call was initiated.',
      'Miss call option is enabled for incoming calls.',
      'For incoming calls where the operator doesn\'t send a CLI (Caller ID, which is an alias for DID or Bridge Number).',
      'The incoming call was disconnected.',
      'The incoming call timed out while executing non-telephony widgets.',
      'Complete execution of flows without telephony widgets.',
      'The number does not have outgoing call facilities.'
    ],
    required: true
  },
  departmentLevel: {
    type: String,
    enum: ['flead', 'verify', 'rework', 'rto'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  dataId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Data'
  }
});

module.exports = mongoose.model('CallAttempt', CallAttemptSchema);
