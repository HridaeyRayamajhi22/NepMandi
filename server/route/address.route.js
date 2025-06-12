import { Router } from 'express'
import auth from '../middleware/auth.js'
import { addAddressController, deleteAddresscontroller, getAddressController, updateAddressController } from '../controllers/address.controller.js'

const addressRouter = Router()

addressRouter.post('/create',addAddressController)
addressRouter.get("/get",getAddressController)
addressRouter.put('/update',updateAddressController)
addressRouter.delete("/disable",deleteAddresscontroller)


export default addressRouter