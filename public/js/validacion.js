

const SITE_NAME = "MiEcommerce";
const FORBIDDEN_STRINGS = ["password", "1234", "qwerty"];
const SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//controla que se escriba bien el gmail
const LETTER_REGEX = /[a-zA-Z]/;
const NUMBER_REGEX = /[0-9]/;

function validarNoVacio(valor, nombreCampo) {
    if (valor.length === 0) {
        return { valido: false, mensaje: `El campo ${nombreCampo} no puede estar vacío.` };
    }
    return { valido: true };
}

function validarEmailFormato(email) {
    if (!EMAIL_REGEX.test(email)) {
        return { valido: false, mensaje: "El email no tiene un formato válido." };
    }
    return { valido: true };
}

function validarPasswordLongitud(password) {
    if (password.length < 8) {
        return { valido: false, mensaje: "La contraseña debe tener al menos 8 caracteres." };
    }
    return { valido: true };
}

function validarPasswordTieneLetra(password) {
    if (!LETTER_REGEX.test(password)) {
        return { valido: false, mensaje: "La contraseña debe incluir al menos una letra." };
    }
    return { valido: true };
}

function validarPasswordTieneNumero(password) {
    if (!NUMBER_REGEX.test(password)) {
        return { valido: false, mensaje: "La contraseña debe incluir al menos un número." };
    }
    return { valido: true };
}

function validarPasswordTieneCaracterEspecial(password) {
    if (!SPECIAL_CHARS_REGEX.test(password)) {
        return {
            valido: false,
            mensaje: 'La contraseña debe incluir al menos un carácter especial (! @ # $ % ^ & * ( ) , . ? " : { } | < >).',
        };
    }
    return { valido: true };
}

function validarPasswordSinCadenasProhibidas(password, nombre, apellido) {
    const passwordLower = password.toLowerCase();

    const prohibidas = [
        ...FORBIDDEN_STRINGS,
        SITE_NAME.toLowerCase(),
        nombre.toLowerCase(),
        apellido.toLowerCase(),
    ].filter((str) => str.length > 0);

    const encontrada = prohibidas.find((str) => passwordLower.includes(str));

    if (encontrada) {
        return {
            valido: false,
            mensaje: "La contraseña no puede contener palabras comunes, tu nombre, tu apellido o el nombre del sitio.",
        };
    }
    return { valido: true };
}

function validarPasswordDistintaDelEmail(password, email) {
    if (password.toLowerCase() === email.toLowerCase()) {
        return { valido: false, mensaje: "La contraseña no puede ser igual al email." };
    }
    return { valido: true };
}


function validarFormulario(datos) {
    const errores = [];

    const chkNombre = validarNoVacio(datos.nombre, "Nombre");
    if (!chkNombre.valido) errores.push({ campo: "nombre", mensaje: chkNombre.mensaje });

    const chkApellido = validarNoVacio(datos.apellido, "Apellido");
    if (!chkApellido.valido) errores.push({ campo: "apellido", mensaje: chkApellido.mensaje });

    const chkEmailVacio = validarNoVacio(datos.email, "Email");
    if (!chkEmailVacio.valido) {
        errores.push({ campo: "email", mensaje: chkEmailVacio.mensaje });
    } else {
        const chkEmailFormato = validarEmailFormato(datos.email);
        if (!chkEmailFormato.valido) errores.push({ campo: "email", mensaje: chkEmailFormato.mensaje });
    }

    const chkPassVacia = validarNoVacio(datos.password, "Contraseña");
    if (!chkPassVacia.valido) {
        errores.push({ campo: "password", mensaje: chkPassVacia.mensaje });
    } else {
        const reglasPassword = [
            validarPasswordLongitud(datos.password),
            validarPasswordTieneLetra(datos.password),
            validarPasswordTieneNumero(datos.password),
            validarPasswordTieneCaracterEspecial(datos.password),
            validarPasswordSinCadenasProhibidas(datos.password, datos.nombre, datos.apellido),
            validarPasswordDistintaDelEmail(datos.password, datos.email),
        ];

        reglasPassword.forEach((resultado) => {
            if (!resultado.valido) errores.push({ campo: "password", mensaje: resultado.mensaje });
        });
    }

    return errores;
}


function agruparErroresPorCampo(errores) {
    const agrupado = {};
    errores.forEach((err) => {
        if (!agrupado[err.campo]) {
            agrupado[err.campo] = [];
        }
        agrupado[err.campo].push(err.mensaje);
    });
    return agrupado;
}

function limpiarErrores() {
    document.querySelectorAll(".error-msg").forEach((contenedor) => {
        contenedor.innerHTML = "";
    });
    const general = document.getElementById("error-general");
    if (general) general.textContent = "";
}

function mostrarErrores(erroresAgrupados) {
    limpiarErrores();

    Object.keys(erroresAgrupados).forEach((campo) => {
        const contenedor = document.getElementById("error-" + campo);
        if (!contenedor) return;

        const mensajes = erroresAgrupados[campo];

        if (mensajes.length === 1) {
            contenedor.textContent = mensajes[0];
        } else {
            const ul = document.createElement("ul");
            ul.className = "list-disc list-inside";
            mensajes.forEach((msg) => {
                const li = document.createElement("li");
                li.textContent = msg;
                ul.appendChild(li);
            });
            contenedor.appendChild(ul);
        }
    });
}

function mostrarErrorGeneral(mensaje) {
    const general = document.getElementById("error-general");
    if (general) general.textContent = mensaje;
}
function mostrarLoadingOverlay() {
    const overlay = document.getElementById("loadingOverlay");
    overlay.classList.remove("hidden");
}
async function enviarRegistro(datos) {
    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        const resultado = await response.json();

        if (!response.ok) {//errores de las validaciones
            if (resultado.errores) {
                mostrarErrores(agruparErroresPorCampo(resultado.errores));
            } else {
                mostrarErrorGeneral(resultado.mensaje || "Ocurrió un error al registrarte. Probá de nuevo.");
            }
            return;
        }

        // Registro exitoso
        limpiarErrores();
        mostrarLoadingOverlay();
        setTimeout(() => {
            window.location.href = "/login";
        }, 5000);
    } catch (error) {
        // Error de red (servidor caído, sin conexión, etc.)
        mostrarErrorGeneral("No se pudo conectar con el servidor. Probá de nuevo en unos segundos.");
    }
}




document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
    };

    const errores = validarFormulario(datos);
    mostrarErrores(agruparErroresPorCampo(errores));

    if (errores.length > 0) {
        return;
    }

    enviarRegistro(datos);
});