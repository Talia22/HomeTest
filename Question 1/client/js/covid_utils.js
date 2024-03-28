var id;
function updateVaccinationDetailsFields(DoseAmount) {
    const vaccinationDetailsContainer = $('#vaccinationRecord');
    vaccinationDetailsContainer.empty(); 
    for (let dose = 1; dose <= DoseAmount; dose++) {
        vaccinationDetailsContainer.append(`
            <fieldset class="vaccination-detail" id="vaccinationDetail${dose}">
                <legend>Vaccination Detail ${dose}</legend>
                <div class="form-group">
                    <label for="dateReceived${dose}">Date Received</label>
                    <input type="date" class="form-control" name="dateReceived${dose}" id="dateReceived${dose} placeholder="Date Received"">
                </div>
                <div class="form-group">
                    <label for="manufacturer${dose}">Manufacturer</label>
                    <input type="text" class="form-control" name="manufacturer${dose}" id="manufacturer${dose} placeholder="Manufacturer"">
                </div>
            </fieldset>
        `);
    }
    $('input[id^="dateReceived"]').each(function() {
        $(this).rules("add", {
            dateBeforeNext: true,
            messages: {
                dateBeforeNext: 'Each dose must be received before the subsequent dose.',
            }
        });
    });

    $('input[id^="dateReceived"]').each(function() {
        $(this).rules("add", {
            required: true,
            date: true,
            messages: {
                required: 'Please enter the date of vaccination.',
                date: 'Please enter a valid date.'
            }
        });
    });
    
    $('input[id^="manufacturer"]').each(function() {
        $(this).rules("add", {
            required: true, 
            messages: {
                required: 'Please enter the vaccine manufacturer.'
            }
        });
    });
}

function repopulateVaccinationDetails(DoseAmount) {
    if(localStorage.getItem("update_covid") === "true" && localStorage.getItem("vaccinated") === "true") {
        for(let i = 1; i <= DoseAmount; i++) {
            if(localStorage.getItem(`dateReceived${i}`) && localStorage.getItem(`manufacturer${i}`)) {
                $(`#dateReceived${i}`).val(localStorage.getItem(`dateReceived${i}`));
                $(`#manufacturer${i}`).val(localStorage.getItem(`manufacturer${i}`));
            }
        }

    }
}

$(document).ready(function () {
    id = localStorage.getItem("member_id");
    if(localStorage.getItem("update_covid") === "true") 
    {
        $('#vaccinated').val(localStorage.getItem("vaccinated")).change();

        //slight delay to ensure dynamic elements have been created/updated
        setTimeout(() => {
            $('#dose').val(localStorage.getItem("dose")).trigger('change');

            setTimeout(() => {
                if(localStorage.getItem("vaccinated") === "true") {
                    $('#vaccinated').prop('disabled', true);
                    const dosesCount = parseInt(localStorage.getItem("dose"), 10);
            
                    for(let i = 1; i <= dosesCount; i++) {
                        let dateReceived = localStorage.getItem(`dateReceived${i}`);
                        let manufacturer = localStorage.getItem(`manufacturer${i}`);            
                        $(`#dateReceived${i}`).val(dateReceived);
                        $(`#manufacturer${i}`).val(manufacturer);
                    }
                }
            }, 100);
        }, 100);

        if(localStorage.getItem("wasSick") === "true") 
        {
            $('#wasSick').prop('disabled', true);
            $('#wasSick').val(localStorage.getItem("wasSick")).change();
            $('#positiveTestDate').val(localStorage.getItem("positiveTestDate"));
            $('#recoveryDate').val(localStorage.getItem("recoveryDate"));
        }
        else
        {
            $('#wasSick').val(localStorage.getItem("wasSick"));
        }
    }

    $('#vaccinated').change(function() {
        const isVaccinated = $(this).val() === 'true';
        $('#doseSelection').toggle(isVaccinated); 
        if (!isVaccinated) {
            $('#vaccinationRecord').hide();
        }
    }).change(); // This will ensure the correct elements are shown/hidden when the page loads if there's a preset value.
    
    $('#dose').change(function() {
        const DoseAmount = parseInt($(this).val(), 10);
        if (!isNaN(DoseAmount)) {
            updateVaccinationDetailsFields(DoseAmount);
            $('#vaccinationRecord').show();
            repopulateVaccinationDetails(DoseAmount);
        } else {
            $('#vaccinationRecord').hide();
        }
    });

    $('#wasSick').change(function() {
        if (this.value === 'true') {
            $('#sicknessPeriod').show();
        } else {
            $('#sicknessPeriod').hide();
        }
    }).change(); 

    $("form[name='covid_form']").validate({
        rules: {
            vaccinated: "required",
            dose: {
                required: function() {
                    return $('#vaccinated').val() === 'true';
                },
                digits: true,
                min: 1,
                max: 4
            },
            dateReceived: {
                required: function() {
                    return $('#vaccinated').val() === 'true';
                },
                date: true
            },
            manufacturer: {
                required: function() {
                    return $('#vaccinated').val() === 'true';
                }
            },
            wasSick: "required",
            positiveTestDate: {
                required: function() {
                    return $('#wasSick').val() === 'true';
                },
                date: true
            },
            recoveryDate: {
                required: function() {
                    return $('#wasSick').val() === 'true';
                },
                date: true,
                greaterThan: "#positiveTestDate"
            }
        },
        messages: {
            vaccinated: "Please select whether you have been vaccinated.",
            dose: {
                required: "Please select the dose.",
                digits: "Please enter a valid dose number.",
                min: "Dose number must be between 1 and 4.",
                max: "Dose number must be between 1 and 4."
            },
            dateReceived: "Please enter the date of vaccination.",
            manufacturer: "Please enter the vaccine manufacturer.",
            wasSick: "Please select whether you have been sick.",
            positiveTestDate: "Please enter the positive test date.",
            recoveryDate: {
                required: "Please enter the recovery date.",
                greaterThan: "Recovery date most be after the positive test date."
            }
        }
    });

    $.validator.addMethod("dateBeforeNext", function(value, element, params) {
        let isValid = true;
        const thisDoseIndex = parseInt(element.name.match(/\d+/)[0], 10); 
        const nextDoseDateInput = $(`#dateReceived${thisDoseIndex + 1}`);
        if (nextDoseDateInput.length > 0) 
        {
            const thisDate = new Date(value);
            const nextDate = new Date(nextDoseDateInput.val());
            if (!isNaN(nextDate.getTime()) && thisDate >= nextDate) 
            {
                isValid = false;
            }
        }
        return this.optional(element) || isValid;
    }, 'Each dose must be received before the subsequent dose.');

    $.validator.addMethod("greaterThan", function(value, element, params) {
        if (!/Invalid|NaN/.test(new Date(value))) {
            return new Date(value) > new Date($(params).val());
        }
        return isNaN(value) && isNaN($(params).val()) || (Number(value) > Number($(params).val())); 
    }, 'Recovery date most be after the positive test date.');

    $("#covid_form").on('submit', function(e) {
        e.preventDefault(); 
        submit(); 
    });
});

function submit()
{
    if(!$("#covid_form").valid()) return;  
    var dataToSend = {
        vaccinated: $('#vaccinated').val() === 'true',
        wasSick: $('#wasSick').val() === 'true',
        vaccinations: []
    };

    if (dataToSend.vaccinated) 
    {
        $('.vaccination-detail').each(function(index) {
            dataToSend.vaccinations.push({
                dose: index + 1,
                dateReceived: $(this).find('input[name^="dateReceived"]').val(),
                manufacturer: $(this).find('input[name^="manufacturer"]').val()
            });
        });
    }

    if (dataToSend.wasSick) 
    {
        dataToSend.positiveTestDate= $('#positiveTestDate').val(),
        dataToSend.recoveryDate= $('#recoveryDate').val()
    }
    dataToSend=JSON.stringify(dataToSend);
    if(localStorage.getItem('update_covid'))
    {
        $.ajax({
            type: 'PUT', 
            url: '/add_covid/'+id,
            contentType: 'application/json',
            data: dataToSend,
            processData: false,
            encode: true,
            success: function(data, textstatus, jQxhr)
            {
                localStorage.setItem('update_covid',false);
                location.href="/main";
            },
                error: function(data, textstatus,errorThrown)
            {
                console.log(errorThrown);
            }
        })
    }
    else
    {
        $.ajax({
            type: 'GET',
            url: '/add_covid/'+id,
            success: function (result) {
                alert("This Person Already Has covid info");
                localStorage.clear();
                location.href = "/main";
            },
            error: function()
            {
                $.ajax({
                    type: 'PUT', 
                    url: '/add_covid/'+id,
                    contentType: 'application/json',
                    data: dataToSend,
                    processData: false,
                    encode: true,
                    success: function(data, textstatus, jQxhr)
                    {
                        location.href="/main";
                    },
                    error: function(data, textstatus,errorThrown)
                    {
                        console.log(errorThrown);
                    }
                })
            }
        })
    }

}

function cancel()
{
    window.location.href='http://localhost:3001/main';
}





