import {Queue} from 'bullmq';

const connection = {
    host:"localhost",
    port:6379,
}
const emialqueue = new Queue('emails', {
    connection
});

module.exports = {
    emialqueue,
    connection,
};
