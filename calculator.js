
var txt_display = document.getElementById('p_result');
var txt_hist = document.getElementById('p_hist');
/*
var bn1 = document.getElementById('number_1');
var bn2 = document.getElementById('number_2');
var bn3 = document.getElementById('number_3');
var bn4 = document.getElementById('number_4');
var bn5 = document.getElementById('number_5');
var bn6 = document.getElementById('number_6');
var bn7 = document.getElementById('number_7');
var bn8 = document.getElementById('number_8');
var bn9 = document.getElementById('number_9');
var bn0 = document.getElementById('number_0');
var bnClear = document.getElementById('clear');
var bnAllclear = document.getElementById('all_clear');
var bnAdd = document.getElementById('operator_add');
var bnSubstract = document.getElementById('operator_substract');
var bnMultiply = document.getElementById('operator_multiply');
var bnDivide = document.getElementById('number_divide');
var bnResult = document.getElementById('result');
*/

var x = 0, y = "", lastbutton, operation = "", result = "", oper_symbol = "", decimal_sep = false;
const operators = [
    { operador: 'add', operId: 'operator_add', symbol: '+' },
    { operador: 'substract', operId: 'operator_substract', symbol: '-' },
    { operador: 'multiply', operId: 'operator_multiply', symbol: '*' },
    { operador: 'divide', operId: 'operator_divide', symbol: '/' }
];
const validators = ['clear', 'all_clear', 'result']

txt_display.innerHTML = 0;

//Si el usuario presiona la tecla de borrar(BackSpace)
window.addEventListener("keydown", function (e) {
    /*
     * keyCode: 8
     * keyIdentifier: "U+0008"
    */
    if (e.keyCode === 8 && document.activeElement !== 'text') {
        validate('clear');

    }
});

//Si el usuario usa el teclado solamente toma lo que corresponde
window.addEventListener('keypress', keyValidation);

function keyValidation(e) {
    if (Number.isInteger(parseInt(e.key))) {
        validate(e.key);
    } else if (operators.find(operator => e.key === operator.symbol)) {

        operation = operators.find(operator => e.key === operator.symbol).operId
        validate(operation);
    } else if (e.key === 'Enter') {
        validate('result');
    } else if (e.key === '.') {
        validate('decimal_separator')
    }
}

// Se debe poner la funcion en el div id=d_buttons
function button_click(e) {
    //Obtencion del boton que se esta presionando
    e = e || window.event; // guarda la ultima informacion ocurrida,
    //en este caso el evento click
    button = e.target || e.srcElement;

    if (button.nodeName === 'BUTTON') {
        validate(button.id);
    }
    this.blur();
}

//Valida los valores ingresados
function validate(valor) {

    lastbutton = valor;

    //Separador decimal
    //Si ya no existe un punto decimal
    if (lastbutton == 'decimal_separator') {
        if (!decimal_sep) {
            lastbutton = ".";
            decimal_sep = true;
        }
        else {
            lastbutton = "";
        }
    }

    //Verifica si el boton ingresado es un operador 
    if (operators.find(operator => lastbutton === operator.operId)) {
        operation = lastbutton;
        //Se reinicia la variable del separador decimal
        decimal_sep = false;

        //Si se presiona algun operador despues de un resultado
        if (x == "" && result !== "") {
            x = result;
        }
        //muestra en el historico el simbolo de la operacion
        oper_symbol = operators.find(operator => operation === operator.operId).symbol;
        txt_hist.innerHTML = x + ' ' + oper_symbol;

        //Si se quiere realizar calculos sin presionar el =
        if ((x !== "" || result !== "") && y !== "") {
            doMath();
        }
        //Verifica si el boton ingresado es un validador 
    } else if (validators.find(validator => validator === lastbutton)) {
        if (lastbutton == 'result') {
            doMath();
        }
        else if (lastbutton == 'all_clear') {
            allClear();
        }
        else if (lastbutton == 'clear') {
            clear();
        }
        //Se reinicia la variable del separador decimal
        decimal_sep = false;
        //Si se presiona algun operador, se continua con la segunda parte del calculo(y)
    } else if (operation == "") {
                
        //En el caso que se ingresen varios 0 seguidos 0000
        if(x==0 && lastbutton==0){        
            x=0;
        }
        //Se vacia el valor para que no se concatener con el 0
        if (x === 0 && lastbutton !== "." && lastbutton!=="") {
            x = "";
        }
        //Se concatena los numeros presionados
        x = x + "" + lastbutton;
        //Se muestra los numeros presionados
        txt_display.innerHTML = x;

    } else {
        //En el caso que se ingresen varios 0 seguidos 0000
        if(y==0 && lastbutton==0){        
            y=0;
        }
        //Se vacia el valor para que no se concatener con el 0
        if (y === 0 && lastbutton !== ".") {
            y = "";
        }
        //Se concatena los numeros presionados
        y = y + "" + lastbutton;
        if (y !== "") {
            txt_display.innerHTML = y;
        }
    }
    console.log("x " + x);
    console.log("y " + y);
    console.log("operacion " + operation);
    console.log("result " + result);
   
}


function doMath() {
    //Si inicialmente se presiona el boton de resultado
    if ((x == 0 || x == "") && operation == "") {
        result = x;
        x = 0;
    }
    //Si se quiere dividir por 0
    else if (((x == 0 || x == "") || (y == 0 || y == "")) && operation == 'operator_divide') {
        result = "Infinito";
        x = 0;
    }
    else {
        if (x == "") {
            x = 0;
        }
        if (y == "") {
            y = 0;
        }
        x = parseFloat(x);
        y = parseFloat(y);
        if (operation === 'operator_add') {
            result = x + y;
            //simbolo que se muestra en el historial del calculo
            oper_symbol = " + ";
        } else if (operation === 'operator_substract') {
            result = x - y;
            oper_symbol = " - ";

        } else if (operation === 'operator_multiply') {
            result = x * y;
            oper_symbol = " x ";

        } else if (operation === 'operator_divide') {
            result = x / y;
            oper_symbol = " / ";
        }
        //Muestra el historial del calculo
        txt_hist.innerHTML = x + oper_symbol + y + " =";
    }

    //muestra el resultado
    txt_display.innerHTML = result.toString();
    x = 0;
    y = "";
    operation = "";
}
//Se reinicia todas las variables
function allClear() {
    operation = "";
    lastbutton = "";
    x = 0;
    y = "";
    result = "";
    txt_display.innerHTML = "0";
    txt_hist.innerHTML = "";
}

//Se borra el ultimo valor ingresado
function clear() {
    //Si y es vacio o cero, se asume que la variable x es la activa
    if (y == 0 || y == "") {
        if (x !== 0 && x !== "") {
            x = x.substring(0, x.length - 1);
            txt_display.innerHTML = x;
        }
    } else {
        y = y.substring(0, y.length - 1);
        txt_display.innerHTML = y;
    }
}

