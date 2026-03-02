const SUPABASE_URL = "https://lfquuyclblwzewbotmvs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcXV1eWNsYmx3emV3Ym90bXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA4NTEsImV4cCI6MjA4NzUxNjg1MX0.3J8ONWFC43mx_BKmjhZ70QHn05n1vrHAbxhO_o-lRpU";

async function verificarEmailDuplicado(correo) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/registros?correo=eq.${encodeURIComponent(correo)}&select=id`, 
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            }
        );
        
        if (!response.ok) return false;
        
        const data = await response.json();
        return data.length > 0;
        
    } catch (error) {
        console.error('Error verificando email:', error);
        return false;
    }
}

async function registrarUsuario(nombre, correo) {
    try {
        console.log('Verificando email duplicado:', correo);
        
        // Verificar si el email ya existe
        const existe = await verificarEmailDuplicado(correo);
        if (existe) {
            throw new Error('Este correo electrónico ya está registrado');
        }

        console.log('Registrando nuevo usuario:', { nombre, correo });
        
        // Insertar el registro
        const response = await fetch(`${SUPABASE_URL}/rest/v1/registros`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                created_at: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error respuesta:', response.status, errorText);
            throw new Error(`Error al registrar: ${response.status}`);
        }

        const nuevoRegistro = await response.json();
        console.log('Registro exitoso:', nuevoRegistro);
        
        return { success: true, data: nuevoRegistro };
        
    } catch (error) {
        console.error('Error detallado:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalRegistro');
    const btnRegistro = document.getElementById('btnRegistro');
    const cerrarModal = document.querySelector('.cerrar-modal');
    const formRegistro = document.getElementById('formRegistro');
    const mensajeExito = document.getElementById('mensajeExito');
    const mensajeError = document.createElement('div');

    // Configurar mensaje de error
    mensajeError.className = 'mensaje-error';
    mensajeError.style.cssText = `
        color: #dc3545;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 15px;
        display: none;
        text-align: center;
    `;
    
    if (formRegistro) {
        formRegistro.parentNode.insertBefore(mensajeError, formRegistro);
    }

    if (btnRegistro) {
        btnRegistro.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            mensajeError.style.display = 'none';
        });
    }

    function cerrarModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (formRegistro) {
            formRegistro.reset();
            formRegistro.style.display = 'block';
        }
        if (mensajeExito) {
            mensajeExito.style.display = 'none';
        }
        mensajeError.style.display = 'none';
    }

    if (cerrarModal) {
        cerrarModal.addEventListener('click', cerrarModalFunc);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModalFunc();
        }
    });

    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            
            if (!nombre || !correo) {
                mostrarError('Por favor completa todos los campos');
                return;
            }

            if (!correo.includes('@') || !correo.includes('.')) {
                mostrarError('Por favor ingresa un email válido');
                return;
            }
            
            const btnEnviar = formRegistro.querySelector('.btn-enviar');
            const textoOriginal = btnEnviar.textContent;
            
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'Verificando...';
            mensajeError.style.display = 'none';

            try {
                await registrarUsuario(nombre, correo);
                
                // Mostrar mensaje de éxito
                formRegistro.style.display = 'none';
                mensajeExito.style.display = 'block';
                mensajeError.style.display = 'none';
                
                // Cerrar modal después de 2 segundos
                setTimeout(() => {
                    cerrarModalFunc();
                }, 2000);
                
            } catch (error) {
                mostrarError(error.message);
                console.error('Error:', error);
            } finally {
                btnEnviar.disabled = false;
                btnEnviar.textContent = textoOriginal;
            }
        });
    }

    function mostrarError(mensaje) {
        mensajeError.textContent = mensaje;
        mensajeError.style.display = 'block';
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            mensajeError.style.display = 'none';
        }, 5000);
    }

    // Efectos hover para el menú
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f0f0f0';
            item.style.transform = 'scale(1.02)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = '';
            item.style.transform = 'scale(1)';
        });
    });
});