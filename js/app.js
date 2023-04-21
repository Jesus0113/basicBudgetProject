//Variables y selectores
const inputPresupuesto = document.querySelector('#presupuesto-input');

const agregaMontoPresupuesto = document.querySelector('#presupuesto-agg');

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregaGastos);

    agregaMontoPresupuesto.addEventListener('click', preguntarPresupuesto);


}

//Clases

class Presupuesto{
    constructor (presupuesto){
        this.presupuesto = Number(presupuesto);
        this.gastos = [];
        const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0);
        this.restante = Number(presupuesto) - gastado;
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter((gasto)=> gasto.id !== id);
        this.calcularRestante();
    }

}

class UI{
    
    insertarPresupuesto(cantidad){


        //Extraer valor
        const {presupuesto, restante} = cantidad;

        console.log(presupuesto)

        console.log(restante)

        // const presupuestoTotal = Number(inputPresupuesto.value) + presupuesto;


        //Agrega al html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

        if(presupuesto <= 0){
            document.querySelector('#btn-gasto').disabled = true;
        }else{
            document.querySelector('#btn-gasto').disabled = false;
        }


    }

    imprimirAlerta(mensaje, tipo){

        //Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')

        }else{
            divMensaje.classList.add('alert-success')
        }

        //Mensaje error
        divMensaje.textContent = mensaje;

        //Insertar en el html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quitar html
        setTimeout(()=>{
            divMensaje.remove();

        },3000)

    }
    mostrarGastos(gastos){

        this.limpiarHtml(); //elimina Html previo

        //Iterar sobre los gastos
        gastos.forEach(gasto => {

            const {cantidad, nombre, id} = gasto;

            //Crear un Li

            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = 'nombre-gasto';
            nuevoGasto.dataset.id = id;

            //Agregar el gasto al HTML

            nuevoGasto.innerHTML = `${nombre} <span class="span-gasto">$ ${cantidad}</span>`;

            //Boton para borrar gasto

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';

            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);

            //agregar el html

            gastoListado.appendChild(nuevoGasto);
            
        });
        
    }

    limpiarHtml(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){

        document.querySelector('#restante').textContent = restante;

    }

    comprobarPresupuesto(presupuestoObj){

        const { presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // comprobar 25%

        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-warning', 'alert-danger' );
            restanteDiv.classList.add('alert-success');

        }

        //Si el total es menor a 0
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            document.querySelector('#btn-gasto').disabled = true;
        }


    }
}

const ui = new UI();
let presupuesto = {};
let montoPresupuesto = 0;


//Funciones

function preguntarPresupuesto() {

    montoPresupuesto = montoPresupuesto + Number(inputPresupuesto.value);

    presupuesto = new  Presupuesto(montoPresupuesto);

    ui.insertarPresupuesto(presupuesto);

}


function agregaGastos(e){
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar

    if(nombre === '' || cantidad === ''){

        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;

    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');

        return;
    }

    //Genera objeto con el gasto

    const gasto = {nombre, cantidad, id: Date.now()};

    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Mensaje sucess
    ui.imprimirAlerta('Gasto agregado correctamente');
    
    //Imprimir los gastos

    const {gastos, restante} = presupuesto;

    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);


    //Reinicia el form
    formulario.reset();

}

function eliminarGasto(id){

    //Elimina los gastos de la clase del objeto
    presupuesto.eliminarGasto(id);
    const {gastos, restante} = presupuesto;

    //Elimina los gastos del Html
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    if(restante <= 0){
        document.querySelector('#btn-gasto').disabled = true;
    }else{
        document.querySelector('#btn-gasto').disabled = false;
    }

}