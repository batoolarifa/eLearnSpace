import express  from 'express';
import { getAllNotifications, updateNotification } from '../controllers/notification.controller';
import {  isAuthenticated, authorizeRoles } from '../middleware/auth';
import { updateAccessToken } from '../controllers/user.controller';

const notficationRouter = express.Router();


notficationRouter.get('/get-all-notifications', updateAccessToken, isAuthenticated, authorizeRoles("admin") , getAllNotifications);

notficationRouter.put('/update-notification/:id', updateAccessToken , isAuthenticated, authorizeRoles("admin") , updateNotification);




export default notficationRouter;