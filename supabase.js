const SUPABASE_URL = "https://lfquuyclblwzewbotmvs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcXV1eWNsYmx3emV3Ym90bXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA4NTEsImV4cCI6MjA4NzUxNjg1MX0.3J8ONWFC43mx_BKmjhZ70QHn05n1vrHAbxhO_o-lRpU";

async function registrarUsuario(nombre, correo) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/registros`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al registrar');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalRegistro');
    const btnRegistro = document.getElementById('btnRegistro');
    const cerrarModal = document.querySelector('.cerrar-modal');
    const formRegistro = document.getElementById('formRegistro');
    const mensajeExito = document.getElementById('mensajeExito');

    if (btnRegistro) {
        btnRegistro.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; 
        });
    }

    if (cerrarModal) {
        cerrarModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            formRegistro.reset();
            mensajeExito.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            formRegistro.reset();
            mensajeExito.style.display = 'none';
        }
    });

    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            
            const btnEnviar = formRegistro.querySelector('.btn-enviar');
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'Enviando...';

            try {
                await registrarUsuario(nombre, correo);
                
                // Mostrar mensaje de éxito
                formRegistro.style.display = 'none';
                mensajeExito.style.display = 'block';
                
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    formRegistro.style.display = 'block';
                    mensajeExito.style.display = 'none';
                    formRegistro.reset();
                }, 2000);
                
            } catch (error) {
                alert('Error al registrar. Por favor intenta de nuevo.');
                console.error(error);
            } finally {
                btnEnviar.disabled = false;
                btnEnviar.textContent = 'Enviar';
            }
        });
    }

    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f0f0f0';
            item.style.transform = 'scale(1.02)';
            item.style.transition = 'all 0.3s ease';
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = '';
            item.style.transform = 'scale(1)';
        });
    });
});