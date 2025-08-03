 // Base de datos local para almacenar los registros
        const datosCenso = [];
        
        // Elementos del DOM
        const formularioCenso = document.getElementById('formularioCenso');
        const inputNombre = document.getElementById('nombre');
        const inputApellido = document.getElementById('apellido');
        const inputFechaNacimiento = document.getElementById('fechaNacimiento');
        const inputSexo = document.getElementById('sexo');
        const inputLugarNacimiento = document.getElementById('lugarNacimiento');
        const listaCenso = document.getElementById('listaCenso');
        const filtroEdad = document.getElementById('filtroEdad');
        const filtroLugarNacimiento = document.getElementById('filtroLugarNacimiento');
        const botonFiltrar = document.getElementById('botonFiltrar');
        const botonReiniciarFiltros = document.getElementById('reiniciarFiltros');
        const resultadosFiltro = document.getElementById('resultadosFiltro');
        const contenidoEstadisticas = document.getElementById('contenidoEstadisticas');
        
        // Función para calcular la edad a partir de la fecha de nacimiento
        function calcularEdad(fechaNacimiento) {
            const hoy = new Date();
            const fechaNac = new Date(fechaNacimiento);
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();
            
            if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
            
            return edad;
        }
        
        // Función para formatear la fecha
        function formatearFecha(fechaString) {
            const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(fechaString).toLocaleDateString('es-ES', opciones);
        }
        
        // Función para mostrar la lista de censo
        function mostrarListaCenso() {
            if (datosCenso.length === 0) {
                listaCenso.innerHTML = '<p>No hay registros aún. Agrega personas usando el formulario.</p>';
                return;
            }
            
            let html = `
                <table>
                    <thead>
                        <tr>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Edad</th>
                            <th>Sexo</th>
                            <th>Lugar Nacimiento</th>
                            <th>Fecha Nacimiento</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            datosCenso.forEach(persona => {
                html += `
                    <tr>
                        <td>${persona.nombre}</td>
                        <td>${persona.apellido}</td>
                        <td>${calcularEdad(persona.fechaNacimiento)}</td>
                        <td>${persona.sexo === 'M' ? 'Masculino' : persona.sexo === 'F' ? 'Femenino' : 'Otro'}</td>
                        <td>${persona.lugarNacimiento}</td>
                        <td>${formatearFecha(persona.fechaNacimiento)}</td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            `;
            
            listaCenso.innerHTML = html;
        }
        
        // Función para generar estadísticas
        function generarEstadisticas() {
            const estadisticas = {};
            
            datosCenso.forEach(persona => {
                const edad = calcularEdad(persona.fechaNacimiento);
                const clave = `${edad}_${persona.lugarNacimiento}`;
                
                if (!estadisticas[clave]) {
                    estadisticas[clave] = {
                        edad: edad,
                        lugarNacimiento: persona.lugarNacimiento,
                        cantidad: 0
                    };
                }
                
                estadisticas[clave].cantidad++;
            });
            
            // Ordenar por edad y luego por lugar
            const estadisticasOrdenadas = Object.values(estadisticas).sort((a, b) => {
                if (a.edad !== b.edad) {
                    return a.edad - b.edad;
                }
                return a.lugarNacimiento.localeCompare(b.lugarNacimiento);
            });
            
            if (estadisticasOrdenadas.length === 0) {
                contenidoEstadisticas.innerHTML = '<p>No hay datos para mostrar estadísticas.</p>';
                return;
            }
            
            let html = `
                <table>
                    <thead>
                        <tr>
                            <th>Edad</th>
                            <th>Lugar de Nacimiento</th>
                            <th>Personas</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            estadisticasOrdenadas.forEach(estadistica => {
                html += `
                    <tr>
                        <td>${estadistica.edad}</td>
                        <td>${estadistica.lugarNacimiento}</td>
                        <td>${estadistica.cantidad}</td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            `;
            
            contenidoEstadisticas.innerHTML = html;
        }
        
        // Función para aplicar filtros
        function aplicarFiltros() {
            const edadFiltro = filtroEdad.value;
            const lugarFiltro = filtroLugarNacimiento.value.toLowerCase();
            
            let datosFiltrados = [...datosCenso];
            
            if (edadFiltro) {
                datosFiltrados = datosFiltrados.filter(persona => {
                    return calcularEdad(persona.fechaNacimiento) == edadFiltro;
                });
            }
            
            if (lugarFiltro) {
                datosFiltrados = datosFiltrados.filter(persona => {
                    return persona.lugarNacimiento.toLowerCase().includes(lugarFiltro);
                });
            }
            
            if (datosFiltrados.length === 0) {
                resultadosFiltro.innerHTML = '<p>No se encontraron registros con los filtros aplicados.</p>';
                return;
            }
            
            let html = `
                <h3>Resultados del Filtro (${datosFiltrados.length} registros)</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Edad</th>
                            <th>Lugar Nacimiento</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            datosFiltrados.forEach(persona => {
                html += `
                    <tr>
                        <td>${persona.nombre}</td>
                        <td>${persona.apellido}</td>
                        <td>${calcularEdad(persona.fechaNacimiento)}</td>
                        <td>${persona.lugarNacimiento}</td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            `;
            
            resultadosFiltro.innerHTML = html;
        }
        
        // Event Listeners
        formularioCenso.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nuevaPersona = {
                nombre: inputNombre.value.trim(),
                apellido: inputApellido.value.trim(),
                fechaNacimiento: inputFechaNacimiento.value,
                sexo: inputSexo.value,
                lugarNacimiento: inputLugarNacimiento.value.trim()
            };
            
            datosCenso.push(nuevaPersona);
            mostrarListaCenso();
            generarEstadisticas();
            
            // Resetear el formulario
            formularioCenso.reset();
        });
        
        botonFiltrar.addEventListener('click', aplicarFiltros);
        
        botonReiniciarFiltros.addEventListener('click', function() {
            filtroEdad.value = '';
            filtroLugarNacimiento.value = '';
            resultadosFiltro.innerHTML = '<p>Usa los filtros para ver estadísticas.</p>';
        });
        
        // Inicializar la vista
        mostrarListaCenso();
        generarEstadisticas();