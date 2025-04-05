const base64Credentials = btoa("coalition:skills-test");
let patientSet = [];
fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
    method: "GET",
    headers: {
        Authorization: ` Basic ${base64Credentials}`,
        "Content-Type": "application/json",
    },
})
    .then((response) => response.json())
    .then((data) => {
        patientSet.push(...data);
        getUsers()
        userParams(0)
        showInfo(0)
        showDiagnosis(0)
        showLabRes(0)
    }
    )

const userParameters = document.getElementsByClassName('userParameters');
const diagnosticList = document.getElementById('diagnosticList');
const labResults = document.getElementById('labResults');
const usersSearch = document.getElementById('usersSearch');
const patientsTitle = document.getElementById("patients-title")
const ctx = document.getElementById('myChart');
const patients = document.getElementById('patients');
const syscValue = document.getElementById("syscValue");
const syscLevel = document.getElementById("syscLevel");
const dyslcValue = document.getElementById("dyscValue");
const dyslcLevel = document.getElementById("dyscLevel");
const respiratory = document.getElementById("respiratory");
const respLevel = document.getElementById("resp-level");
const temp = document.getElementById("temp");
const tempLevel = document.getElementById("temp-level");
const heart = document.getElementById("heart");
const heartLevel = document.getElementById("heart-level");

function getUsers() {
    let kod = ''
    for (i in patientSet) {
        kod += `<div onclick="userParams(${i}), showInfo(${i}), showDiagnosis(${i}), showLabRes(${i})" class="flex flex-w gap-2 rounded-xl py-3 lg:px-3 users">
                    <img class="w-[40px]" src="${patientSet[i].profile_picture}" />
                    <div>
                        <p class="text-base">${patientSet[i].name}</p>
                        <p class="text-sm text-[#707070]">${patientSet[i].gender}, ${patientSet[i].age}</p>
                    </div>
                </div>`
    }
    patients.innerHTML = kod
}

function showInfo(arg) {
    let kod = ''
    let selectedPatient = patientSet[arg]
    
    kod = ` <div class="flex justify-center items-center">
                <img width="200px" src="${selectedPatient.profile_picture}" alt="">
            </div>
            <h2 class="font-bold text-2xl flex justify-center items-center">${selectedPatient.name}</h2>
            <div class="flex flex-col gap-7">
                <div class="flex gap-2 items-center w-full ">
                    <img src="img/BirthIcon.png" alt="" />
                    <div>
                        <p>Date of birth</p>
                        <p>${selectedPatient.date_of_birth}</p>
                    </div>
                </div>
                <div class="flex gap-2 items-center">
                    <img src="img/FemaleIcon.png" alt="">
                    <div>
                        <p>Gender</p>
                        <p>${selectedPatient.gender}</p>
                    </div>
                </div>
                <div class="flex gap-2 items-center">
                    <img src="img/PhoneIcon.png" alt="">
                    <div>
                        <p>Contact Info.</p>
                        <p>+${selectedPatient.phone_number}</p>
                    </div>
                </div>
                <div class="flex gap-2 items-center">
                    <img src="img/PhoneIcon.png" alt="">
                    <div>
                        <p> Emergency contact</p>
                        <p>+${selectedPatient.emergency_contact}</p>
                    </div>
                </div>
                <div class="flex gap-2 items-center">
                    <img src="img/InsuranceIcon.png" alt="">
                    <div>
                        <p>Insurance Provider</p>
                        <p>${selectedPatient.insurance_type}</p>
                    </div>
                </div>
                <button class="p-3 bg-[#01F0D0] rounded-full font-bold">Show All Information</button>
            </div>` 
    for (i of userParameters) {
        i.innerHTML = kod
    } 
}

function userParams(arg) {
    let userDiagnos = patientSet[arg].diagnosis_history.slice(0, 6).reverse()
    let sysVals = graph.data.datasets[0].data = userDiagnos.map(item => item.blood_pressure.systolic.value )
    let dysVals = graph.data.datasets[1].data = userDiagnos.map(item => item.blood_pressure.diastolic.value )
    let sum = 0
    let level = ''
    for (i of sysVals) {
        sum += i          
    }

    let sysSum = Math.round(sum / sysVals.length)
    sum < 90 ? level = "Low" : 
    sysSum >= 90 && sysSum <= 129 ? level = "Normal" : 
    sysSum >= 130 && sysSum <= 139 ? level = "Higher than Average" :
    sysSum >= 140 && sysSum <= 149 ? level = "High" : level = "Very High"
    syscLevel.innerHTML = level
    syscValue.innerHTML = sysSum

    let dyscSum = 0
    let dysLevel = ''  
    for (i of dysVals) {
        dyscSum += i          
    }
    let dysSum = Math.round(dyscSum / dysVals.length)
    dysSum < 60 ? dysLevel = "Low" : 
    dysSum >= 60 && dysSum <= 85 ? dysLevel = "Normal" : 
    dysSum >= 80 && dysSum <= 119 ? dysLevel = "Higher than Average" :
    dysSum >= 120 ? dysLevel = "High" : dysLevel = "Very High"
    dyslcLevel.innerHTML = dysLevel
    dyslcValue.innerHTML = dysSum

    let respiratoryVal = userDiagnos[userDiagnos.length - 1].respiratory_rate.value
    let respLvl = userDiagnos[userDiagnos.length - 1].respiratory_rate.levels
    respiratory.innerHTML = respiratoryVal + ' bpm'
    respLevel.innerHTML = respLvl
    
    let tempVal = userDiagnos[userDiagnos.length - 1].temperature.value
    let tempLvl = userDiagnos[userDiagnos.length - 1].temperature.levels
    temp.innerHTML = tempVal + ' °F'
    tempLevel.innerHTML = tempLvl
    
    let heartVal = userDiagnos[userDiagnos.length - 1].heart_rate.value
    let heartLvl = userDiagnos[userDiagnos.length - 1].heart_rate.levels
    heart.innerHTML = heartVal + ' bpm'
    heartLevel.innerHTML = heartLvl


    graph.update()
    
}

function showDiagnosis(arg) {
    let kod = ''
    let selectedDiagnosis = patientSet[arg].diagnostic_list
    for (i in selectedDiagnosis) {
        kod += `<div class="flex justify-between text-center my-4 px-2">
                    <p class="text-left">${selectedDiagnosis[i].name}</p>
                    <p>${selectedDiagnosis[i].description}</p>
                    <p class="text-right">${selectedDiagnosis[i].status}</p>
                </div>
                <hr class="text-[#ccc]" />`
    }
    
    diagnosticList.innerHTML = kod
}
function showLabRes(arg) {
    let kod = ''
    let selectedLabRes = patientSet[arg].lab_results
    for (i of selectedLabRes) {
        kod += `<div class="flex justify-between">
                    <p>${i}</p>
                    <i class="fa-solid fa-download text-xl"></i>
                </div>`
    }
    
    labResults.innerHTML = kod
}

function findUsers() {
    patients.innerHTML = ''
    patientSet.forEach((item, i) => {
        if (item.name.toLowerCase().includes(usersSearch.value.toLowerCase())) {
            patients.innerHTML += ` <div onclick="userParams(${i}), showInfo(${i}), showDiagnosis(${i}), showLabRes(${i})" class="flex flex-w gap-2 rounded-xl py-3 lg:px-3 users">
                                            <img class="w-[40px]" src="${item.profile_picture}" />
                                        <div>
                                            <p class="text-base">${item.name}</p>
                                            <p class="text-sm text-[#707070]">${item.gender}, ${item.age}</p>
                                        </div>                        
                                    </div>`
        }
    })
}

function searchBar() {
    usersSearch.classList.toggle("hidden")
    patientsTitle.classList.toggle("hidden")
}
searchBar()

let graph = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Oct, 2023', 'Nov, 2023', 'Dec, 2023', 'Jan, 2024', 'Feb, 2024', 'Mar, 2024'],
      datasets: [
        {
        label: 'Systolic Blood Pressure',
        data: [],
        borderWidth: 4,
        borderColor: '#C26EB4',
        pointRadius: 10,
        pointBackgroundColor: '#E66FD2',
        pointBorderWidth: 1,
        pointBorderColor: '#fff',
        tension: 0.5
        },
        {
          label: 'Diastolic Blood Pressure',
          data: [],
          borderWidth: 4,
          borderColor: '#7E6CAB',
          pointRadius: 10,
          pointBackgroundColor: '#7E6CAB',
          pointBorderWidth: 1,
          pointBorderColor: '#fff',
          tension: 0.5
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: false,
          grid: {
            display: false
          }
        }
      }
    }
})