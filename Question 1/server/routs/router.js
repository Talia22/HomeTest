
const express = require('express');
Member = require('../models/Members.js');
memberRoutes = require('./Members');



var router = express.Router();

//Members
router.post('/Members', memberRoutes.createMember);
router.put('/Members/:id', memberRoutes.updateMember);
router.get('/Members/:id', memberRoutes.getMember);
router.get('/Members', memberRoutes.getMembers);
router.delete('/Members/:id', memberRoutes.deleteMember);

//covid
router.post('/add_covid/:id', memberRoutes.addCovidInfoToMember);
router.put('/add_covid/:id', memberRoutes.UpdateCovidInfoToMember);
router.get('/add_covid/:id', memberRoutes.getCovidInfo);

router.get('/number_non_vaccinated', memberRoutes.getNumberNonVaccinated);
router.get('/active_cases_last_month', memberRoutes.getActiveCovidCasesLastMonth);

module.exports = router;




