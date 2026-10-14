import express from 'express'
import {
    getCustomItems, getCustomItem, createCustomItem, updateCustomItem, deleteCustomItem
} from '../controllers/customItems.js'
import { getOptions, getIncompatibilities } from '../controllers/options.js'

const router = express.Router()

router.get('/options', getOptions)
router.get('/incompatibilities', getIncompatibilities)

router.get('/customcars', getCustomItems)
router.get('/customcars/:id', getCustomItem)
router.post('/customcars', createCustomItem)
router.patch('/customcars/:id', updateCustomItem)
router.delete('/customcars/:id', deleteCustomItem)

export default router
