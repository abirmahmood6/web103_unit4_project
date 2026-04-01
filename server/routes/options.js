import express from 'express'
import { getExteriorColors, getWheels, getRoofs, getEngines } from '../controllers/options.js'

const router = express.Router()

router.get('/exterior-colors', getExteriorColors)
router.get('/wheels', getWheels)
router.get('/roofs', getRoofs)
router.get('/engines', getEngines)

export default router