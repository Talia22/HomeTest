const Member = require('../models/Members.js');


module.exports = {

    createMember: function (req, res) {
        if(!req.body){
            return res.sendStatus(400).send("Missing Info");
        }   
        if(!req.body.name||!req.body.id||!req.body.Date_of_birth||!req.body.cellphone||!req.body.homePhone )
        {
            return res.sendStatus(400).send("Missing Info");
        }
        if(!req.body.address || !req.body.address.city || !req.body.address.street|| !req.body.address.number)
        {
            return res.sendStatus(400).send("Missing Info");
        }
        if(req.body.Date_of_birth> new Date().toISOString().slice(0,10))
        {
            return res.sendStatus(400).send("Date of birth cant be in the future.");
        }
        const cellRegex = /^(05\d)([-]?)(\d{3})\2(\d{4})$/;
        if (!cellRegex.test(req.body.cellphone)) {
            return res.status(400).send("Invalid cellphone number." );
        }
    
        const homePhoneRegex = /(0[23489]{1})(-?)(\d{7})$/;
        if (!homePhoneRegex.test(req.body.homePhone)) {
            return res.status(400).send("Invalid homePhone number.");
        }
        const temp_member = {
            "id" : req.body.id,
            "name" : req.body.name,
            "Date_of_birth" : req.body.Date_of_birth,
            "address": {
                "city": req.body.address.city,
                "street": req.body.address.street,
                "number": req.body.address.number
            },
            "cellphone" : req.body.cellphone,
            "homePhone" : req.body.homePhone,
        };
        Member.findOne({ "id": req.body.id }, function(err, member) {
            if (member) {
                return res.status(400).send("Member already exits");
            }
            else {
                const member = new Member(temp_member);
                member.save().then(member=>
                    res.status(201).send(member)
                ).catch(e=>res.status(400).send(e))
            }
        })
    },
    updateMember: function (req, res) {
        if(!req.params.id)
            return res.sendStatus(400).send("No ID.");
        const temp_member = {
            "id" : req.body.id,
            "name" : req.body.name,
            "Date_of_birth" : req.body.Date_of_birth,
            "address": {
                "city": req.body.address.city,
                "street": req.body.address.street,
                "number": req.body.address.number
            },
            "cellphone" : req.body.cellphone,
            "homePhone" : req.body.homePhone,
        };
        if(req.body.covid != undefined){
            temp_member['covid'] = req.body.covid; 
        }
        Member.findOneAndUpdate({"id":req.params.id}, req.body, { new: true, runValidators: true }).then(member => {
        if (!member) {
            return res.status(404).send("Member not found")
        }
        else {
            res.send(member)
        }
    }).catch(e => res.status(400).send(e))
    },
    getMembers: function (req, res){
        Member.find().then(Members => res.send(Members)).catch(e => res.status(500).send(e));
    },
    getMember: function (req, res) {
        Member.find({id: req.params.id}).then(member =>
        {
            if(member.length>0)
                res.status(200).send(member)
            else
            res.status(400).send("Member not found") 
        }
        ).catch(e=> res.status(400).send(e))
    },
    deleteMember: function (req, res) {
        if(!req.params.id)
            return res.sendStatus(400).send("No ID.");
            Member.deleteOne({ id: req.params.id }, function(err) {
            if (!err) {
                res.status(200).send("Member deleted");
            }
            else {
                res.status(500).send("Error deleting member.")
            }
        });
    },
    
    addCovidInfoToMember: function (req, res) {
        const { vaccinated, vaccinations, wasSick, positiveTestDate, recoveryDate } = req.body;
        if (vaccinated === undefined || wasSick === undefined) {
            return res.status(400).send("vaccinated and wasSick fields are required.");
        }
        if (typeof vaccinated !== 'boolean' || typeof wasSick !== 'boolean') {
            return res.status(400).send("vaccinated and wasSick must be boolean values.");
        }
        if (vaccinated && (vaccinations === undefined || !Array.isArray(vaccinations) || vaccinations.length === 0)) {
            return res.status(400).send("Valid vaccinations info is required for vaccinated members.");
        }
        if (wasSick && (!positiveTestDate || !recoveryDate)) {
            return res.status(400).send("Positive test date and recovery date are required for members who were sick.");
        }

        if (positiveTestDate && recoveryDate && new Date(positiveTestDate) > new Date(recoveryDate)) {
            return res.status(400).send("Positive test date must be before the recovery date.");
        }
        const covidUpdate = {
            "covidInfo.vaccinated": vaccinated,
            "covidInfo.vaccinations": vaccinations,
            "covidInfo.wasSick": wasSick,
            "covidInfo.positiveTestDate": positiveTestDate,
            "covidInfo.recoveryDate": recoveryDate
        };
        Member.findOneAndUpdate({"id":req.params.id}, { $push: covidUpdate }, { new: true, runValidators: true}).then(member => {
            if (!member) {
                return res.status(404).send("Member not found.")
            }
            else {
                res.send(member)
            }
        }).catch(e => res.status(400).send(e))
    },

    UpdateCovidInfoToMember: function (req, res) {
        const { vaccinated, vaccinations, wasSick, positiveTestDate, recoveryDate } = req.body;

        const covidUpdate = {
            "covidInfo.vaccinated": vaccinated,
            "covidInfo.vaccinations": vaccinations,
            "covidInfo.wasSick": wasSick,
            "covidInfo.positiveTestDate": positiveTestDate,
            "covidInfo.recoveryDate": recoveryDate
        };
        Member.findOneAndUpdate({"id":req.params.id}, { $set: covidUpdate }, { new: true, runValidators: true}).then(member => {
            if (!member) {
                return res.status(404).send("Member not found.")
            }
            else {
                res.send(member)
            }
        }).catch(e => res.status(400).send(e))

    },
    getCovidInfo: function (req, res) {
        const { id } = req.params;
        Member.findOne({ "id": id })
            .then(member => {
                if (!member) {
                    return res.status(404).send("Member not found." );
                } else if (!member.covidInfo) {
                    return res.status(404).send("COVID information not found for this member." );
                } else {
                    res.status(200).send(member.covidInfo);
                }
            })
            .catch(e => res.status(500).send(e));
    },
    getNumberNonVaccinated(req, res) {
        Member.countDocuments({ "covidInfo.vaccinated": false })
            .then(count => {
                res.status(200).send({ nonVaccinatedCount: count });
            })
            .catch(e => {
                res.status(500).send(e);
            });
    },

    getActiveCovidCasesLastMonth(req, res) {
        try {
            const today = new Date();
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
            Member.find({
                $or: [
                    { "covidInfo.positiveTestDate": { $gte: monthAgo, $lte: today } },
                    { "covidInfo.recoveryDate": { $gte: monthAgo, $lte: today } }
                ]
            }, 'covidInfo.positiveTestDate covidInfo.recoveryDate').exec()
            .then(membersWithCovidLastMonth => {
                let dailyCounts = {};
                
                membersWithCovidLastMonth.forEach(member => {
                    const start = new Date(Math.max(new Date(member.covidInfo.positiveTestDate), monthAgo));
                    const end = member.covidInfo.recoveryDate ? new Date(member.covidInfo.recoveryDate) : today;
                    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
                        const dateString = day.toISOString().slice(0, 10);
                        if (!dailyCounts[dateString]) {
                            dailyCounts[dateString] = 0;
                        }
                        dailyCounts[dateString]++;
                    }
                });
    
                const result = Object.keys(dailyCounts).map(date => ({
                    date: date,
                    activeCases: dailyCounts[date]
                })).sort((a, b) => a.date.localeCompare(b.date));
    
                res.status(200).send(result);
            })
            .catch(e => {
                res.status(500).send(e);
            });
        } catch (e) {
            res.status(500).send(e);
        }
    },


};

