$(document).ready(function () {
  $.ajax({
    url: "/Members",
    success: function (result) {
      let str='';
      str="<table id='main_table'>"
      str+="<thead><tr><th>Members Name</th></tr></thead><tbody>";
      $.each(result, function (index, value) {
        str += "<tr><td> "+value.name+"</td>";
        str +="<td><button class=\"button\" id="+value.id+" onclick=\"View('"+value.id+"')\">View Information</button></td>";
        str +="<td><button class=\"button\" id="+value.id+" onclick=\"deleteMember('"+value.id+"')\">Delete Member</button></td>";
        str +="<td><button class=\"button\" id="+value.id+" onclick=\"add_covid('"+value.id+"')\">Add Covid Info</button></td>";
        str +="<td><button class=\"button\" id="+value.id+" onclick=\"view_covid('"+value.id+"')\">View Covid Info</button></td>";
      });
      str+="</tbody></table>"
      document.getElementById("upload").innerHTML=str;
         
    },
    error: function (err) {
      console.log("err", err);
    }
  });

  window.onclick = function(event) {
    if (event.target == document.getElementById('memberDetailsModal') || event.target == document.getElementById('NonVaccinatedMembersCountModal') || event.target == document.getElementById('covidDetailsModal')) {
      $(event.target).hide();
    }
  };

  $('#closeModalM').click(function() {
    $('#memberDetailsModal').hide();
  });
  $('#closeModal').click(function() {
    $('#NonVaccinatedMembersCountModal').hide();
  });
  $('#closeModalC').click(function() {
    $('#covidDetailsModal').hide();
  });


});

function NumberNonVaccinated()
{
  $.ajax({
    type: "GET",
    url: "/number_non_vaccinated",
    success: function (result) {
      var content = `<p>Number of non-vaccinated members: <strong>${result.nonVaccinatedCount}</strong></p>`;

      $('#NonVaccinatedMembers').html(content);
      $('#NonVaccinatedMembersCountModal').show(); 
      
      },
      error: function (err) {
        console.error("err", err);
      }
    
  });

}
function ActiveCovidCasesLastMonth()
{
  window.location.href='http://localhost:3001/active_covid';

}

function deleteMember(id)
{
  localStorage.setItem("member_id", id);
  $.ajax({
    type: 'DELETE',
    url: '/Members/'+id,
    success: function( data, textStatus, jQxhr ){
      localStorage.clear();
      location.reload();
    },
    error: function( jqXhr, textStatus, errorThrown ){
      localStorage.clear();
      console.log( errorThrown );
    }
  })
}

function add_covid(id)
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
      localStorage.setItem("member_id", id);
      var url='http://localhost:3001/add_covid';
      window.location.href=url
    }
  })
}

function updateMember(id)
{
  localStorage.setItem("member_id", id);
  localStorage.setItem("update", true);
  $.ajax({
    url: "/Members/"+id,
    success: function (result) {
      localStorage.setItem("name", result[0].name);
      localStorage.setItem("id", result[0].id);
      localStorage.setItem("city", result[0].address.city);
      localStorage.setItem("street", result[0].address.street);
      localStorage.setItem("number", result[0].address.number); 
      localStorage.setItem("Date_of_birth", result[0].Date_of_birth.slice(0,10));
      localStorage.setItem("cellphone", result[0].cellphone);
      localStorage.setItem("homePhone", result[0].homePhone);
      window.location.href="http://localhost:3001/add_member";
    },
    error: function (err) {
      console.log("err", err);
    }
  });

}

function view_covid(id) {
  $.ajax({
    url: "/add_covid/" + id,
    success: function (result) {
      const vaccinatedContent = result.vaccinated
      ? `<p><strong>Vaccinated:</strong> Yes</p>
        <p><strong>Doses:</strong> ${result.vaccinations.length}</p>
        
      ${result.vaccinations.map((dose, index) =>
          `<div><p><strong>Dose ${index + 1} Date:</strong> ${dose.dateReceived.slice(0, 10)}</p>
          <p><strong>Dose ${index + 1} Manufacturer:</strong> ${dose.manufacturer}</p>
          </div>`).join('')}`
        : `<p><strong>Vaccinated:</strong> No</p>`;
        
        const wasSickContent = result.wasSick
        ? `<p><strong>Sick with Covid19</strong> Yes</p>
          <p><strong>Positive Test Date:</strong> ${result.positiveTestDate.slice(0, 10)}</p>
          <p><strong>Recovery Date:</strong> ${result.recoveryDate.slice(0, 10)}</p>`
        : `<p><strong>Sick with Covid9:</strong> No</p>`;
        
        var content = `${vaccinatedContent}
        ${wasSickContent}
        <p><button class="button" id="${id}" onclick="update_covid('${id}')">Update Covid Info</button></p>`;
        $('#CovidInfoContent').html(content);
        $('#covidDetailsModal').show();
      },
      error: function (err) {
        alert("This Person Dosn't have covid info");
        console.error("err", err);
      }
    
  });
}

function update_covid(id) {
  localStorage.setItem("member_id", id);
  localStorage.setItem("update_covid", true);
  $.ajax({
    url: "/add_covid/"+id, 
    success: function (result) {
      if(result.vaccinated!=undefined)
      {
        localStorage.setItem("vaccinated", result.vaccinated.toString());
      }  
      const dosesLength = result.vaccinations?.length ?? 0;
      localStorage.setItem("dose", dosesLength.toString());
      if(result.wasSick!=undefined)
      {
        localStorage.setItem("wasSick", result.wasSick.toString());
      }
      if(result.wasSick) 
      {
        localStorage.setItem("positiveTestDate", result.positiveTestDate.slice(0,10));
        localStorage.setItem("recoveryDate", result.recoveryDate.slice(0,10));
      }
      if(result.vaccinated && result.vaccinations) 
      {
        result.vaccinations.forEach((dose, index) => {
        localStorage.setItem(`dateReceived${index + 1}`, dose.dateReceived.slice(0,10));
        localStorage.setItem(`manufacturer${index + 1}`, dose.manufacturer);
        });
      }
      window.location.href="http://localhost:3001/add_covid"; 
    },
    error: function (err) {
      console.log("err", err);
    }
  });
}

function View(id) {
  $.ajax({
    url: "/Members/" + id,
    success: function (result) {
        var content = `<p><strong>Name:</strong> ${result[0].name}</p>
                      <p><strong>ID:</strong> ${result[0].id}</p>
                      <p><strong>Date of Birth:</strong> ${result[0].Date_of_birth.slice(0,10)}</p>
                      <p><strong>Address:</strong></p>
                      <p><strong>City:</strong> ${result[0].address.city}</p>
                      <p><strong>Street:</strong> ${result[0].address.street}</p>
                      <p><strong>Number:</strong> ${result[0].address.number}</p>
                      <p><strong>Cellphone:</strong> ${result[0].cellphone}</p>
                      <p><strong>Home Phone:</strong> ${result[0].homePhone}</p>
                      <p><button class="button" id="${id}" onclick="updateMember('${id}')">Update Info</button></p>`;
          $('#MemberInfoContent').html(content);
          $('#memberDetailsModal').show();
    },
    error: function (err) {
      console.error("err", err);
    }
  });

}

                        




