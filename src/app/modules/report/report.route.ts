import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { reportController } from "./report.controller";




const route = Router()



route.post('/create-report/:type' , checkAuth(...Object.values(Role)) , reportController.createReport)



// get all report post (admin)
route.get('/get-all-post-report' , checkAuth(Role.ADMIN) , reportController.getAllPostReport)


// get all report user(admin)
route.get('/get-all-user-report' , checkAuth(Role.ADMIN) , reportController.getAllUserReport) 


// get count of reports 
route.get('/count-of-reports' , checkAuth(Role.ADMIN) , reportController.countOfReport)


// get all reports using by post id 
route.get('/allReportDetails/:postId' , checkAuth(Role.ADMIN) , reportController.getReportsByPostId)


export const ReportRouter = route