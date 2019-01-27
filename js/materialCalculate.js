window.onload = function(){
    document.getElementById('add_btn').onclick = addRow;
    document.getElementById('delete_btn').onclick = deleteRow;
    document.getElementById('calculate_btn').onclick = calculate;
};

function addRow() {
    var table = document.getElementById('elementTable');
    var colNum = table.getElementsByTagName('tr')[0].children.length;
    var units = document.getElementsByClassName('unit-table');
    var tr = document.createElement('tr');
    tr.className = 'unit-table';
    for(var i = 0; i < colNum; i++){
        var td = document.createElement('td');
        var text = document.createElement('input');
        text.type = units[0].getElementsByTagName("td")[i].getElementsByTagName("input")[0].getAttribute("type");
        text.name = units[0].getElementsByTagName("td")[i].getElementsByTagName("input")[0].getAttribute("name");
        td.appendChild(text);
        tr.appendChild(td);
    }
    table.appendChild(tr);
}

function deleteRow() {
    var table = document.getElementById('elementTable');
    var rowNum = table.getElementsByTagName('tr').length;
    if (rowNum > 2) {
        $('tr:last').remove()
    }
}

function calculate() {
    var table = document.getElementById('elementTable');
    var rowNum = table.rows.length;
    var totalAtomicMass = 0;
    var unitMass = 0; // raw material mass per atomicMass

    // calculate totalAtomicMass
    for (var rowIndex = 1; rowIndex < rowNum; rowIndex++) {
        var rowCells = table.rows.item(rowIndex).cells;

        var currRatio = 0;
        if (rowCells.item(4).children[0].valueAsNumber > 0) {
            currRatio = rowCells.item(4).children[0].valueAsNumber;
        } else {
            displayErrorMessage();
            return;
        }

        var atomicMass = 0;
        if (rowCells.item(1).children[0].checked) {
            if (rowCells.item(3).children[0].valueAsNumber > 0) {
                atomicMass = rowCells.item(3).children[0].valueAsNumber;
            } else {
                displayErrorMessage();
                return;
            }
        } else {
            var inputElement = rowCells.item(2).children[0].value;
            atomicMass = getElementMass(inputElement);
            if (atomicMass < 0) {
                displayErrorMessage();
                return;
            }
            rowCells.item(3).children[0].value = atomicMass;
        }
        totalAtomicMass += atomicMass * currRatio;

        if (rowCells.item(0).children[0].checked) {
            if (rowCells.item(5).children[0].valueAsNumber >= 0) {
                unitMass = rowCells.item(5).children[0].valueAsNumber / (atomicMass * currRatio);
            } else {
                displayErrorMessage();
                return;
            }
        }
    }

    if (document.getElementById('totalMassCriteria').checked) {
        if (document.getElementById('totalMass').valueAsNumber >= 0) {
            unitMass = document.getElementById('totalMass').valueAsNumber / totalAtomicMass;
        } else {
            displayErrorMessage();
            return;
        }
    }
    document.getElementById('totalMass').value = parseFloat(totalAtomicMass * unitMass).toFixed(5);

    for (var rowIndex = 1; rowIndex < rowNum; rowIndex++) {
        var rowCells = table.rows.item(rowIndex).cells;
        rowCells.item(5).children[0].value = parseFloat(rowCells.item(3).children[0].valueAsNumber
            * rowCells.item(4).children[0].valueAsNumber * unitMass).toFixed(5);
    }
}

function displayErrorMessage() {
    window.alert("Input is invalid. Please check.");
}

function getElementMass(inputElement) {
    const totalElementNum = 103;

    const elementNames = ["Hydrogen","Helium","Lithium","Beryllium","Boron","Carbon","Nitrogen","Oxygen","Fluorine","Neon",
        "Sodium","Magnesium","Aluminum","Silicon","Phosphorus","Sulfur","Chlorine","Argon","Potassium","Calcium",
        "Scandium","Titanium","Vanadium","Chromium","Manganese","Iron","Cobalt","Nickel","Copper","Zinc","Gallium",
        "Germanium","Arsenic","Selenium","Bromine","Krypton","Rubidium","Strontium","Yttrium","Zirconium","Niobium",
        "Molybdenum","Technetium","Ruthenium","Rhodium","Palladium","Silver","Cadmium","Indium","Tin","Antimony",
        "Tellurium","Iodine","Xenon","Cesium","Barium","Lanthanum","Cerium","Praseodymium","Neodymium","Promethium",
        "Samarium","Europium","Gadolinium","Terbium","Dysprosium","Holmium","Erbium","Thulium","Ytterbium","Lutetium",
        "Hafnium","Tantalum","Tungsten","Rhenium","Osmium","Iridium","Platinum","Gold","Mercury","Thallium","Lead",
        "Bismuth","Polonium","Astatine","Radon","Francium","Radium","Actinium","Thorium","Protactinium","Uranium",
        "Neptunium","Plutonium","Americium","Curium","Berkelium","Californium","Einsteinium","Fermium","Mendelevium",
        "Nobelium","Lawrencium"];

    const elementSymbols = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc",
        "Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb","Mo","Tc",
        "Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe","Cs","Ba","La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb",
        "Dy","Ho","Er","Tm","Yb","Lu","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn","Fr",
        "Ra","Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr"];

    const elementMasses = [1.0079,4.0026,6.941,9.0122,10.811,12.011,14.0067,15.9994,18.9984,20.1797,22.9898,24.305,26.9815,
        28.0855,30.9738,32.066,35.4527,39.948,39.0983,40.078,44.9559,47.88,50.9415,51.9961,54.938,55.847,58.9332,
        58.6934,63.546,65.39,69.723,72.61,74.9216,78.96,79.904,83.8,85.4678,87.62,88.9059,91.224,92.9064,95.94,97.9072,
        101.07,102.9055,106.42,107.8682,112.411,114.818,118.71,121.76,127.6,126.9045,131.29,132.9054,137.327,138.9055,
        140.115,140.9076,144.24,144.9127,150.36,151.965,157.25,158.9253,162.5,164.9303,167.26,168.9342,173.04,174.967,
        178.49,180.9479,183.84,186.207,190.23,192.22,195.08,196.9665,200.59,204.3833,207.2,208.9804,208.9824,209.9871,
        222.0176,223.0197,226.0254,227.0278,232.0381,231.0359,238.0289,237.048,244.0642,243.0614,247.0703,247.0703,
        251.0796,252.083,257.0951,258.1,259.1009,262.11];

    for (var index = 0; index < totalElementNum; ++index) {
        if (inputElement === elementNames[index] || inputElement === elementSymbols[index]) {
            return elementMasses[index];
        }
    }
    return -1;
}