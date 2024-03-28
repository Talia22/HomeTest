$(document).ready(function () {
    if(localStorage.getItem("update"))
    {
        document.getElementById("id_field").disabled="false";
        var member_id= localStorage.getItem('member_id')
        var name=localStorage.getItem("name")
        var city=localStorage.getItem("city")
        var street=localStorage.getItem("street")
        var number=localStorage.getItem("number")
        var Date_of_birth=localStorage.getItem("Date_of_birth")
        var cellphone=localStorage.getItem("cellphone")
        var homePhone=localStorage.getItem("homePhone")
        document.getElementById("id_field").setAttribute('value',member_id)
        document.getElementById("name").setAttribute('value',name);
        document.getElementById("city").setAttribute('value',city);
        document.getElementById("street").setAttribute('value',street);
        document.getElementById("number").setAttribute('value',number);
        document.getElementById("Date_of_birth").setAttribute('value',Date_of_birth);
        document.getElementById("cellphone").setAttribute('value',cellphone);
        document.getElementById("homePhone").setAttribute('value',homePhone);
   
    }
    $("form[name='member_form']").validate({
        
       rules: {
           "id_field":{
                required: true,
                disabled: false,
                digits: true,
                validID: true
           },
           "name":{
            required: true,
            disabled: false
            },
           "Date_of_birth": {
               required: true,
               disabled: false,
               date: true,
               max: new Date().toISOString().slice(0,10)
           },
           "address": {
                "city": {
                    required: true
                },
                "street": {
                    required: true
                },
                "number": {
                    required: true,
                    digit: true
                }
            },
    
            "cellphone": {
                required: true,
                cellphoneIL: true
            },
            "homePhone": {
                required: true,
                homePhoneIL: true
            }
        },
        messages: {      
            "id_field": {
                required: "ID is required.",
                digits: "Please enter a valid ID number.",
                validID: "ID must not exceed 9 digits."
            },
            "name": "Name is required.",
            "Date_of_birth": {
                required: "Date of birth is required.",
                date: "Please enter a valid date.",
                max: "Date of birth must be before today."
            },
            "address.city": "City is required.",
            "address.street": "Street is required.",
            "address.number": {
                required: "Number is required.",
                digits: "Please enter a valid number."
            },
            "cellphone": {
                required: "Cellphone number is required.",
                cellphoneIL: "Please enter a valid cellphone number."
            },
            "homePhone": {
                required: "Home phone number is required.",
                homePhoneIL: "Please enter a valid home Phone number."
            }
        }
    });
});

$.validator.addMethod("cellphoneIL", function(value, element) {
    return this.optional(element) || /^(05\d)([-\s]?)(\d{3})\2(\d{4})$/.test(value);
}, "Please enter a valid cellphone number.");

$.validator.addMethod("homePhoneIL", function(value, element) {
    return this.optional(element) || /^(0[23489]{1})(-?)(\d{7})$/.test(value);
}, "Please enter a valid home phone number.");

$.validator.addMethod("validID", function(value, element) {
    return this.optional(element) || /^[0-9]{1,9}$/.test(value);
}, "Please enter a valid ID number with no more than 9 digits.");  

function submit()
{
    if(!$("#member_form").valid()) return;
    var id=$("#id_field").val();
    var dataToSend = JSON.stringify({
        id: $("#id_field").val(),
        name: $("#name").val(),
        Date_of_birth: $("#Date_of_birth").val(),
        address: {
            city: $("#city").val(),
            street: $("#street").val(),
            number: $("#number").val(),
        },
        cellphone: $("#cellphone").val(),
        homePhone: $("#homePhone").val(),
    });
    if(localStorage.getItem('update'))
   {
        $.ajax({
            type: 'PUT', 
            url:  '/Members/'+id, 
            contentType: 'application/json',
            data: dataToSend,
            processData: false,            
            encode: true,
            success: function( data, textStatus, jQxhr ){
                localStorage.clear();
                location.href = "/main";
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        })
    }
    else{
        $.ajax({
            type: 'GET',
            url: "/Members/"+$("#id_field").val(),
                success: function (result) {
                    alert("This Person Already Exist");
                    localStorage.clear();
                    location.href = "/main";
                },
                error: function()
                {
                    $.ajax({
                        type: 'POST', 
                        url: '/Members', 
                        contentType: 'application/json',
                        data: dataToSend,
                        processData: false,            
                        encode: true,
                        success: function( data, textStatus, jQxhr ){
                            localStorage.clear();
                            location.href = "/main";
                        },
                        error: function( jqXhr, textStatus, errorThrown ){
                            console.log( errorThrown );
                        }
                    })
                }
        })
    
    }
}
function cancel()
{
    localStorage.clear();
    location.href = "/main";
}






