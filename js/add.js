class Employee {
    constructor(form) {
        this.identificacion = form.get('identificacion') || '';
        this.nombre = form.get('nombre') || '';
        this.correo = form.get('correo') || '';
        this.fecha_nacimiento = form.get('fecha_nacimiento') || '';
        this.fecha_creacion = form.get('fecha_creacion') || '';
        this.cargo = form.get('cargo') || '';
    }
}

document.getElementById('addEmployeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const newEmployee = new Employee(formData);
    try {
        const response = await fetch('php/save_employee.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEmployee)
        });
        const result = await response.json();
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: result.message,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = 'index.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message,
                confirmButtonColor: '#007bff'
            });
            this.reset();
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo guardar el empleado.',
            confirmButtonColor: '#007bff'
        });
    }
});
