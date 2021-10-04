if(getCookie("darkMode") == "true")  {
    document.documentElement.style.setProperty('--main-bg-color', "#222")
    document.documentElement.style.setProperty('--other-bg-color', "#121212")
    document.documentElement.style.setProperty('--other-bg-color2', "#272727")

    document.documentElement.style.setProperty('--main-text-color', "#D8D8D8")
    document.documentElement.style.setProperty('--other-text-color', "#bbbaba")
    document.documentElement.style.setProperty('--other-text-color2', "#999898")
    
    document.documentElement.style.setProperty('--link-color', "#1e8ad6")
    document.documentElement.style.setProperty('--hover-link-color', "#3ba0e6")
    document.documentElement.style.setProperty('--contribute-shadow-color', "rgba(255, 255, 255, 0.4)")

    document.addEventListener("DOMContentLoaded", function(){
        document.querySelector('#checkbox').checked = true;
    });
}

let savedGPAs = {
    // Semester1: {
    //     classNames: ["testingClass1"],
    //     inputtedGPAValues: ["4.0", "4.5", "5.0"],
    //     inputtedGradeValues: [100, 90, 80],
    //     setNumberOfClasses: 3
    // }
};

/* savedGPAs["name"] = {
    classNames: classNames,
    inputtedGPAValues: inputtedGPAValues,
    inputtedGradeValues: inputtedGradeValues,
    setNumberOfClasses: setNumberOfClasses
} */ 

let classNames = [];
let inputtedGPAValues = [];
let inputtedGradeValues = [];
let setNumberOfClasses = 7;

let selectedSemestersDropDown = [];
let selectedSemestersDropDown2 = [];

function setTable(numberOfClasses) {
    if(numberOfClasses > 10) numberOfClasses = 10
    if(numberOfClasses < 0) numberOfClasses = 0
    setNumberOfClasses = numberOfClasses
    document.getElementById('numrange').value = numberOfClasses
    document.getElementById('sliderrange').value = numberOfClasses
    createCookie("numOfClasses", setNumberOfClasses, 365)

    let headerRow = document.getElementById('classListRow')
    let gpaRow = document.getElementById('gpaSelectRow')
    let gradeRow = document.getElementById('gradeInputRow')

    headerRow.innerHTML = ''
    gpaRow.innerHTML = ''
    gradeRow.innerHTML = ''

    let corner = document.createElement('th')
    corner.style.borderTop = 'none';
    corner.style.borderLeft = 'none';
    headerRow.appendChild(corner)

    let titleOfGPARow = document.createElement('th')
    titleOfGPARow.style.borderLeft = '1px solid #D8D8D8;';
    titleOfGPARow.innerHTML = 'GPA Weight:'
    gpaRow.appendChild(titleOfGPARow)


    let titleOfGradeRow = document.createElement('th')
    titleOfGradeRow.style.borderLeft = '1px solid #D8D8D8;';
    titleOfGradeRow.innerHTML = 'Current Grades:'
    gradeRow.appendChild(titleOfGradeRow)

    for (let i = 0; i < parseInt(numberOfClasses); i++) {
        // Header (Class 1)
        let headerTH = document.createElement('th')
        let headerInput = document.createElement('input')
        headerInput.className = 'headerClassName'
        headerInput.type = 'text'
        if(!classNames[i]) headerInput.value = 'Class '+Math.floor(i+1)
        else headerInput.value = classNames[i]
        headerInput.onchange = function() {
            classNames[i] = headerInput.value
            createCookie("classNames", classNames, 365)
        }
        headerTH.appendChild(headerInput)
        headerRow.appendChild(headerTH)

        // DropDown (5.0)
        let dropDownTD = document.createElement('td')

        let gpaSelector = document.createElement('div')
        gpaSelector.className = "select"

        dropDownTD.appendChild(gpaSelector)
        
        let select = document.createElement('select')
        let options = ['4.0', '4.5', '5.0']
        options.forEach(value => {
            let opt = document.createElement('option')
            opt.value = value
            opt.innerHTML = value
            select.appendChild(opt)
        });

        select.onchange = function() {
            inputtedGPAValues[i] = select.value
            updateGPA()
        }

        if(inputtedGPAValues[i]) select.value = inputtedGPAValues[i]
        
        let arrow = document.createElement('div')
        arrow.className = 'select__arrow'

        gpaSelector.appendChild(select)
        gpaSelector.appendChild(arrow)
        gpaRow.appendChild(dropDownTD)

        // GradeInput (0-100)
        let gradeInputTD = document.createElement('td')
        
        let gradeInput = document.createElement('input')
        gradeInput.className = "gradeInput"
        gradeInput.type = 'number'
        gradeInput.min = 0;
        gradeInput.max = 100;
        gradeInput.value = 0;
        gradeInput.step = 0.5

        if(inputtedGradeValues[i]) gradeInput.value = inputtedGradeValues[i]

        gradeInput.onchange = function() {
            if(gradeInput.value > 100) gradeInput.value = 100
            if(gradeInput.value < 0) gradeInput.value = 0
            inputtedGradeValues[i] = gradeInput.value
            updateGPA()
        }

        gradeInputTD.appendChild(gradeInput)
        gradeRow.appendChild(gradeInputTD)
    }
}

function updateGPA() {
    for (let i = 0; i < parseInt(setNumberOfClasses); i++) {
        if(!inputtedGPAValues[i]) inputtedGPAValues[i] = "4.0"
        if(!inputtedGradeValues[i]) inputtedGradeValues[i] = "0"
    }

    weightedSimples = 0;
    unweightedSimples = 0;
    sumOfGrades = 0;
    totalGPAWeight = 0;
    let headerRow = document.getElementById('classListRow')
    let gpaRow = document.getElementById('gpaSelectRow')
    let gradeRow = document.getElementById('gradeInputRow')

    for (let i = 1; i < gradeRow.childNodes.length; i++) {
        let className = headerRow.childNodes[i].getElementsByTagName('input')[0].value
        let gpaWeight = parseFloat(gpaRow.childNodes[i].getElementsByTagName('select')[0].value)
        totalGPAWeight += gpaWeight
        let grade = parseFloat(gradeRow.childNodes[i].getElementsByTagName('input')[0].value)
        sumOfGrades += (grade)
        let weightedSimple = gpaWeight*grade*0.01
        weightedSimples += weightedSimple
        let unweightedSimple = 4*grade*0.01
        unweightedSimples += unweightedSimple
    }

    let numberOfClasses = (gradeRow.childNodes.length-1)
    let allenISDSumOfGrades = -(sumOfGrades-(numberOfClasses*100))*0.05

    document.getElementById('simpleAverage').innerHTML = "Simple Average Weighted: "+(weightedSimples/numberOfClasses).toFixed(6)
    document.getElementById('simpleAverageUnweighted').innerHTML = "Simple Average Unweighted: "+(unweightedSimples/numberOfClasses).toFixed(6)
    document.getElementById('allenISDFormulaWeighted').innerHTML = "AllenISD Formula Weighted: "+(((totalGPAWeight-allenISDSumOfGrades)/numberOfClasses)).toFixed(6)
    document.getElementById('allenISDFormulaUnweighted').innerHTML = "AllenISD Formula Unweighted: "+((((4*numberOfClasses)-allenISDSumOfGrades)/numberOfClasses)).toFixed(6)

    createCookie("inputtedGPAValues", inputtedGPAValues, 365)
    createCookie("inputtedGradeValues", inputtedGradeValues, 365)
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function setup() {

    document.styleSheets[0].insertRule(`* { transition-duration: 0.25s; transition: color 0.25s linear, border 0.25s linear, background-color 0.25s linear; }`, 0);
    
    document.querySelector("#checkbox").addEventListener("change", () => {
        var declaration = getComputedStyle(document.documentElement);

        if(declaration.getPropertyValue('--main-bg-color').replace(/\s/g, '') == "#222") {
            createCookie("darkMode", "false", 365)
            document.documentElement.style.setProperty('--main-bg-color', "#A7C7E7")
            document.documentElement.style.setProperty('--other-bg-color', "#8db8e4")
            document.documentElement.style.setProperty('--other-bg-color2', "#7cafe2")

            document.documentElement.style.setProperty('--main-text-color', "#121212")
            document.documentElement.style.setProperty('--other-text-color', "#222")
            document.documentElement.style.setProperty('--other-text-color2', "#161616")

            document.documentElement.style.setProperty('--link-color', "#0063aa")
            document.documentElement.style.setProperty('--hover-link-color', "#0072c4")
            document.documentElement.style.setProperty('--contribute-shadow-color', "rgba(255, 255, 255, 0.9)")
        } else {
            createCookie("darkMode", "true", 365)
            document.documentElement.style.setProperty('--main-bg-color', "#222")
            document.documentElement.style.setProperty('--other-bg-color', "#121212")
            document.documentElement.style.setProperty('--other-bg-color2', "#272727")

            document.documentElement.style.setProperty('--main-text-color', "#D8D8D8")
            document.documentElement.style.setProperty('--other-text-color', "#bbbaba")
            document.documentElement.style.setProperty('--other-text-color2', "#999898")
            
            document.documentElement.style.setProperty('--link-color', "#1e8ad6")
            document.documentElement.style.setProperty('--hover-link-color', "#3ba0e6")
            document.documentElement.style.setProperty('--contribute-shadow-color', "rgba(255, 255, 255, 0.4)")
            
        }
    })

    checkWindowSize()
    let savedGPAsDropDown = document.getElementById('savedGPAsDropDown')
    var checkList = document.getElementById('semestersListItems');

    let testCookie = getCookie("savedGPAs")
    if(testCookie.includes("{") && testCookie.includes('}')) {
        savedGPAs = JSON.parse(testCookie)
    } else savedGPAs = {}

    // /*
    if(get('import')) { // ahschillstudy.com/gpa/index.html?import={}

        var didError = false;
        var converted = [];
        try {
            converted = JSON.parse(unescape(get('import')))
        } catch(e) {
            didError = true;
        }
    
        if(didError || typeof converted !== "object" || Array.isArray(converted) || converted === null) {
            return;
        }
    
        Object.keys(converted).forEach(gpa => {        
            savedGPAs[gpa] = converted[gpa];
        });
        
        createCookie("savedGPAs", JSON.stringify(savedGPAs), 365)
    
        window.location.href = window.location.href.split("?")[0]
    }
    // */

    console.log(savedGPAs)

    Object.keys(savedGPAs).forEach(gpa => {
        let newOption = document.createElement('option')
        newOption.id = gpa+"~~~"
        newOption.value = gpa
        newOption.innerHTML = gpa
        savedGPAsDropDown.appendChild(newOption)

        let newDropDown = document.createElement('li')
        newDropDown.id = gpa+"|||"
        let checkBox = document.createElement('input')
        checkBox.type = 'checkbox'
        newDropDown.appendChild(checkBox)
        let newSpan = document.createElement('span')
        newSpan.innerHTML = " "+gpa
        newDropDown.appendChild(newSpan)
        checkBox.onclick = function() {
            if(checkBox.checked) selectedSemestersDropDown.push(gpa)
            else selectedSemestersDropDown = selectedSemestersDropDown.filter(a=>a!==gpa)
            var anchor = document.getElementById('semesterCheckList')
            anchor.innerHTML = selectedSemestersDropDown.length+" Selected Semester(s)";
            updateCumulativeGPA();
        }
        checkList.appendChild(newDropDown)
    })

    classNames = getCookie('classNames') || []
    if (typeof classNames == 'string') classNames = classNames.split(',')
    inputtedGPAValues = getCookie('inputtedGPAValues') || []
    if (typeof inputtedGPAValues == 'string') inputtedGPAValues = inputtedGPAValues.split(',')
    inputtedGradeValues = getCookie('inputtedGradeValues') || []
    if (typeof inputtedGradeValues == 'string') inputtedGradeValues = inputtedGradeValues.split(',')

    setNumberOfClasses = getCookie('numOfClasses')
    if(setNumberOfClasses) setTable(setNumberOfClasses)
    else setTable(0)

    updateGPA()
}

function changeCurrentGPA(savedGPAName) {
    if(savedGPAName == 'None Selected') {}
    else if(savedGPAName == 'Add Blank') {
        classNames = []
        inputtedGPAValues = []
        inputtedGradeValues = []
        createCookie("classNames", classNames, 365)
        setTable(1)
        updateGPA()
        document.getElementById('InputtedGPAName').value = "";
    }
    else if(savedGPAs[savedGPAName]) {
        classNames = savedGPAs[savedGPAName].classNames
        inputtedGPAValues = savedGPAs[savedGPAName].inputtedGPAValues
        inputtedGradeValues = savedGPAs[savedGPAName].inputtedGradeValues
        createCookie("classNames", classNames, 365)
        setTable(savedGPAs[savedGPAName].setNumberOfClasses)
        updateGPA()
        document.getElementById('InputtedGPAName').value = savedGPAName;
    } else console.log("[ERROR] Cannot find that Saved GPA.")
}

function saveGPA() {
    let InputtedGPAName = document.getElementById('InputtedGPAName').value
    if(InputtedGPAName) {
        if(!savedGPAs[InputtedGPAName]) {
            let savedGPAsDropDown = document.getElementById('savedGPAsDropDown')
            var checkList = document.getElementById('semestersListItems');

            let newOption = document.createElement('option')
            newOption.value = InputtedGPAName
            newOption.innerHTML = InputtedGPAName
            newOption.id = InputtedGPAName+"~~~"
            savedGPAsDropDown.appendChild(newOption)

            let newDropDown = document.createElement('li')
            newDropDown.id = InputtedGPAName+"|||"
            let checkBox = document.createElement('input')
            checkBox.type = 'checkbox'
            checkBox.id = InputtedGPAName + 'id'
            checkBox.onclick = function() {
                if(checkBox.checked) selectedSemestersDropDown.push(InputtedGPAName)
                else selectedSemestersDropDown = selectedSemestersDropDown.filter(a=>a!==InputtedGPAName)
                var anchor = document.getElementById('semesterCheckList')
                anchor.innerHTML = selectedSemestersDropDown.length+" Selected Semester(s)"
                updateCumulativeGPA()
            }
            newDropDown.appendChild(checkBox)
            let newSpan = document.createElement('span')
            newSpan.innerHTML = " "+InputtedGPAName
            newDropDown.appendChild(newSpan)
            checkList.appendChild(newDropDown)
        }
        console.log('InputtedGPAName: '+InputtedGPAName)
        console.log('typeof savedGPAs['+InputtedGPAName+']: '+ typeof savedGPAs[InputtedGPAName])
        savedGPAs[InputtedGPAName] = {
            classNames: classNames.filter((a, i) => {
                if(i+1 <= setNumberOfClasses) return true;
                else return false;
            }).map(a=>a),
            inputtedGPAValues: inputtedGPAValues.filter((a, i) => {
                if(i+1 <= setNumberOfClasses) return true;
                else return false;
            }).map(a=>a),
            inputtedGradeValues: inputtedGradeValues.filter((a, i) => {
                if(i+1 <= setNumberOfClasses) return true;
                else return false;
            }).map(a=>a),
            setNumberOfClasses: setNumberOfClasses
        }
        console.log('typeof savedGPAs['+InputtedGPAName+']: '+ typeof savedGPAs[InputtedGPAName])
        console.log(savedGPAs)
        createCookie("savedGPAs", JSON.stringify(savedGPAs), 365)
        notify('success', `'${InputtedGPAName}' has been saved.`)
    } else {
        notify('error', `You did not type anything into the semester name box.`)
    }
}

function deleteSemesterGPA() {
    let InputtedGPAName = document.getElementById('InputtedGPAName').value
    if(InputtedGPAName) {
        if(savedGPAs[InputtedGPAName]) {
            delete savedGPAs[InputtedGPAName]
            createCookie("savedGPAs", JSON.stringify(savedGPAs), 365)
            changeCurrentGPA('None Selected')
            checkBox = document.getElementById(InputtedGPAName + 'id')
            selectedSemestersDropDown = selectedSemestersDropDown.filter(a=>a!==checkBox)
            var anchor = document.getElementById('semesterCheckList')
            anchor.innerHTML = selectedSemestersDropDown.length+" Selected Semester(s)"
            let savedGPAsDropDown = document.getElementById('savedGPAsDropDown')
            var checkList = document.getElementById('semestersListItems');
            let toRemove = document.getElementById(InputtedGPAName+"~~~")
            let toRemove2 = document.getElementById(InputtedGPAName+"|||")
            savedGPAsDropDown.removeChild(toRemove)
            checkList.removeChild(toRemove2)
            var opts = savedGPAsDropDown.options;
            for (var opt, j = 0; opt = opts[j]; j++) {
                if (opt.id == 'NoneSelected') {
                    savedGPAsDropDown.selectedIndex = j;
                break;
                }
            }
            document.getElementById('InputtedGPAName').value = ""
            notify('success', `'${InputtedGPAName}' has been deleted.`)
        } else {
            notify('error', `Could not find '${savedSemesterName}' in savedGPAs.`)
        }
    } else {
        notify('error', `You did not type anything into the semester name box.`)
    }
}

function toggleSemestersCheckList() {
    var checkList = document.getElementById('semestersList');
    var anchor = document.getElementById('semesterCheckList')
    anchor.innerHTML = selectedSemestersDropDown.length+" Selected Semester(s)"
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
}

function openIE() {
    var ieChoose = document.getElementById('i-e-choose');
    ieChoose.style.display = "table-cell";
    var exportElem = document.getElementById('export');
    exportElem.style.display = "none";
    var importElem = document.getElementById('import');
    importElem.style.display = "none";
    var importExportHolder = document.getElementById('import-export-holder')
    importExportHolder.style.display = "flex";
}

function closeIE() {
    var ieChoose = document.getElementById('i-e-choose');
    ieChoose.style.display = "table-cell";
    var exportElem = document.getElementById('export');
    exportElem.style.display = "none";
    var importElem = document.getElementById('import');
    importElem.style.display = "none";
    var importExportHolder = document.getElementById('import-export-holder')
    importExportHolder.style.display = "none";
}

function openImport() {
    var ieChoose = document.getElementById('i-e-choose');
    ieChoose.style.display = "none";
    var importElem = document.getElementById('import');
    importElem.style.display = "table-cell";
}

function openExport() {
    var ieChoose = document.getElementById('i-e-choose');
    ieChoose.style.display = "none";
    var exportElem = document.getElementById('export');
    exportElem.style.display = "table-cell";

    generateExportOptions()
}

function generateExportOptions() {
    var exportElem = document.getElementById('export');
    exportElem.style.display = "table-cell";
    var semestersListItems2 = document.getElementById('semestersListItems2')
    removeAllChildNodes(semestersListItems2);

    Object.keys(savedGPAs).forEach((gpa, i) => {
        let newDropDown = document.createElement('li')
        newDropDown.id = gpa+"||||"
        let checkBox = document.createElement('input')
        checkBox.type = 'checkbox'
        newDropDown.appendChild(checkBox)
        let newSpan = document.createElement('span')
        newSpan.innerHTML = " "+gpa
        newDropDown.appendChild(newSpan)
        checkBox.onclick = function() {
            if(checkBox.checked) selectedSemestersDropDown2.push(gpa)
            else selectedSemestersDropDown2 = selectedSemestersDropDown2.filter(a=>a!==gpa)
            var anchor = document.getElementById('semesterCheckList2')
            anchor.innerHTML = selectedSemestersDropDown2.length+" Selected Semester(s)";
            // updateCumulativeGPA();
        }
        semestersListItems2.appendChild(newDropDown);
    })
}

function importGPAs() {
    var importBtn = document.getElementById('import-btn')
    if(importBtn.innerHTML != "Import!") return;

    var toImport = document.getElementById('import-input').value
    if(toImport.length <= 0) {
        importBtn.innerHTML = "Nothing Inputted!"
        importBtn.style.backgroundColor = "red"
        setTimeout(() => {
            importBtn.innerHTML = "Import!"
            importBtn.style.backgroundColor = "white"
        }, 1000);    
        return;
    }

    var didError = false;
    var converted = [];
    try {
        converted = JSON.parse(toImport)
    } catch(e) {
        didError = true;
    }

    if(didError || typeof converted !== "object" || Array.isArray(converted) || converted === null) {
        importBtn.innerHTML = "Invalid Import!"
        importBtn.style.backgroundColor = "red"
        setTimeout(() => {
            importBtn.innerHTML = "Import!"
            importBtn.style.backgroundColor = "white"
        }, 1000);    
        return;
    }

    Object.keys(converted).forEach(gpa => {
        if(!savedGPAs[gpa]) {
            let savedGPAsDropDown = document.getElementById('savedGPAsDropDown')
            var checkList = document.getElementById('semestersListItems');

            let newOption = document.createElement('option')
            newOption.value = gpa
            newOption.innerHTML = gpa
            newOption.id = gpa+"~~~"
            savedGPAsDropDown.appendChild(newOption)

            let newDropDown = document.createElement('li')
            newDropDown.id = gpa+"|||"
            let checkBox = document.createElement('input')
            checkBox.type = 'checkbox'
            checkBox.id = gpa + 'id'
            checkBox.onclick = function() {
                if(checkBox.checked) selectedSemestersDropDown.push(gpa)
                else selectedSemestersDropDown = selectedSemestersDropDown.filter(a=>a!==gpa)
                var anchor = document.getElementById('semesterCheckList')
                anchor.innerHTML = selectedSemestersDropDown.length+" Selected Semester(s)"
                updateCumulativeGPA()
            }
            newDropDown.appendChild(checkBox)
            let newSpan = document.createElement('span')
            newSpan.innerHTML = " "+gpa
            newDropDown.appendChild(newSpan)
            checkList.appendChild(newDropDown)
        }
        
        savedGPAs[gpa] = converted[gpa];
    })
    createCookie("savedGPAs", JSON.stringify(savedGPAs), 365)

    importBtn.innerHTML = "Imported!"
    importBtn.style.backgroundColor = "skyblue"
    setTimeout(() => {
        importBtn.innerHTML = "Import!"
        importBtn.style.backgroundColor = "white"
    }, 1000);

}

function exportGPAs() {
    var exportBtn = document.getElementById('export-btn')
    if(exportBtn.innerHTML !== "Export!") return;

    if(selectedSemestersDropDown2.length <= 0) {
        exportBtn.innerHTML = "Nothing Selected!"
        exportBtn.style.backgroundColor = "red"
        setTimeout(() => {
            exportBtn.innerHTML = "Export!"
            exportBtn.style.backgroundColor = "white"
        }, 1000);    
        return;
    }

    let toCopy = {};
    selectedSemestersDropDown2.forEach((gpa) => {
        toCopy[gpa] = savedGPAs[gpa]
    })
    toCopy = JSON.stringify(toCopy, null, 2);
    
    exportBtn.innerHTML = "Copied!"
    exportBtn.style.backgroundColor = "greenyellow"
    setTimeout(() => {
        exportBtn.innerHTML = "Export!"
        exportBtn.style.backgroundColor = "white"
    }, 1000);
  
    navigator.clipboard.writeText(toCopy);
}

function toggleSemestersCheckList2() {
    var checkList = document.getElementById('semestersList2');
    var anchor = document.getElementById('semesterCheckList2')
    anchor.innerHTML = selectedSemestersDropDown2.length+" Selected Semester(s)"
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
}

function updateCumulativeGPA() {
    let GPAWeights = [];
    let Grades = [];

    if(!selectedSemestersDropDown.length) {
        document.getElementById('simpleAverageTotal').innerHTML = "Cumulative Simple Average Weighted: 0.00"
        document.getElementById('simpleAverageUnweightedTotal').innerHTML = "Cumulative Simple Average Unweighted: 0.00"
        document.getElementById('allenISDFormulaWeightedTotal').innerHTML = "Cumulative AllenISD Formula Weighted: 0.00"
        document.getElementById('allenISDFormulaUnweightedTotal').innerHTML = "Cumulative AllenISD Formula Unweighted: 0.00"
        return;
    }

    selectedSemestersDropDown.forEach((savedSemesterName, i) => {
        if(savedGPAs[savedSemesterName]) {
            for (let l = 0; l < parseInt(savedGPAs[savedSemesterName].setNumberOfClasses); l++) {
                if(savedGPAs[savedSemesterName].inputtedGPAValues[l]) GPAWeights.push(savedGPAs[savedSemesterName].inputtedGPAValues[l])
                else GPAWeights.push("4.0")

                if(savedGPAs[savedSemesterName].inputtedGradeValues[l]) Grades.push(savedGPAs[savedSemesterName].inputtedGradeValues[l])
                else Grades.push("0")
            }
        } else {
            notify('error', `Could not find '${savedSemesterName}' in savedGPAs.`)
        }
    })

    weightedSimples = 0;
    unweightedSimples = 0;
    sumOfGrades = 0;
    totalGPAWeight = 0;

    for (let i = 0; i < GPAWeights.length; i++) {
        totalGPAWeight += parseFloat(GPAWeights[i])
        sumOfGrades += (parseFloat(Grades[i]))
        let weightedSimple = parseFloat(GPAWeights[i])*(parseFloat(Grades[i]))*0.01
        weightedSimples += weightedSimple
        let unweightedSimple = 4*(parseFloat(Grades[i]))*0.01
        unweightedSimples += unweightedSimple
    }

    let numberOfClasses = GPAWeights.length;
    let allenISDSumOfGrades = -(sumOfGrades-(numberOfClasses*100))*0.05

    document.getElementById('simpleAverageTotal').innerHTML = "Cumulative Simple Average Weighted: "+(weightedSimples/numberOfClasses).toFixed(6)
    document.getElementById('simpleAverageUnweightedTotal').innerHTML = "Cumulative Simple Average Unweighted: "+(unweightedSimples/numberOfClasses).toFixed(6)
    document.getElementById('allenISDFormulaWeightedTotal').innerHTML = "Cumulative AllenISD Formula Weighted: "+(((totalGPAWeight-allenISDSumOfGrades)/numberOfClasses)).toFixed(6)
    document.getElementById('allenISDFormulaUnweightedTotal').innerHTML = "Cumulative AllenISD Formula Unweighted: "+((((4*numberOfClasses)-allenISDSumOfGrades)/numberOfClasses)).toFixed(6)
    
}

let currentNotifications = []

function notify(type, message) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Set message
    x.innerHTML = "";
    if(type == "error") x.innerHTML += "<span style='color: #de1738; margin-right: 10px'>⚠</span>"
    else if(type == "warning") x.innerHTML += "<span style='color: #F5B301; margin-right: 10px'>⚠</span>"
    else if(type == "success") x.innerHTML += "<span style='color: #0add08; margin-right: 10px'>✓</span>"
    x.innerHTML += message

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

    // if(!currentNotifications.length) {
    //     currentNotifications.push({type: type, msg: message})
    //     sendNotification()
    // } else currentNotifications.push({type: type, msg: message})
}

// function sendNotification() {
//     if(!currentNotifications.length) return;
//     const notif = document.getElementById('notif')
//     const notifidentifier = document.getElementById('notifidentifier')
//     const notiftext = document.getElementById('notiftext')
//     const notifholder = document.getElementById('notif-holder')

//     notif.classList.add('animate-notif')
//     notifidentifier.classList.add('animate-identifier')
//     notiftext.classList.add('animate-text')
//     notif.classList.remove('hidden')
//     switch(currentNotifications[0].type) {
//         case 'success':
//             notif.style.backgroundColor = "#237563"
//             notiftext.style.color = "#237563"
//             notiftext.style.backgroundColor = "#3DB16F"
//             notifidentifier.style.color = "#237563"
//             notifidentifier.style.backgroundColor = "#3DB16F"
//             notifidentifier.innerHTML = "✓";
//             break;
//         case 'error':
//             notif.style.backgroundColor = "#B00020"
//             notiftext.style.color = "#B00020"
//             notiftext.style.backgroundColor = "#CF6679"
//             notifidentifier.style.color = "#B00020"
//             notifidentifier.style.backgroundColor = "#CF6679"
//             notifidentifier.innerHTML = "⚠";
//             break;
//         case 'warning':
//             notif.style.backgroundColor = "#F5B301"
//             notiftext.style.color = "#F5B301"
//             notiftext.style.backgroundColor = "#FED053"
//             notifidentifier.style.color = "#F5B301"
//             notifidentifier.style.backgroundColor = "#FED053"
//             notifidentifier.innerHTML = "⚠";
//             break;
//     }
//     notiftext.innerHTML = currentNotifications[0].msg;
//     setTimeout(() => {
//         notif.classList.add('hidden')
//         notif.classList.remove('animate-notif')
//         notifidentifier.classList.remove('animate-identifier')
//         notiftext.classList.remove('animate-text')
//         if(currentNotifications.length-1 > 0) {
//             setTimeout(() => {
//                 currentNotifications.shift()
//                 sendNotification()
//             }, 150);
//         } else currentNotifications.shift()
//     }, 3900);
// }

window.onresize = checkWindowSize;

function checkWindowSize() {
    if(window.innerWidth < 500) document.getElementById('notifidentifier').style.display = 'none'
    else document.getElementById('notifidentifier').style.display = 'block'
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
}