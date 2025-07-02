class Employee {
    constructor({identificacion, nombre, correo, fecha_nacimiento, fecha_creacion, cargo}) {
        this.identificacion = identificacion;
        this.nombre = nombre;
        this.correo = correo;
        this.fecha_nacimiento = fecha_nacimiento;
        this.fecha_creacion = fecha_creacion;
        this.cargo = cargo;
    }
}

class EmployeeTable {
    constructor(selector) {
        this.selector = selector;
        this.table = null;
        this.employees = [];
    }

    async load() {
        const res = await fetch('data/employees.json?' + new Date().getTime());
        const data = await res.json();
        this.employees = data.map(emp => new Employee(emp));
        this.render();
    }

    render() {
        if (this.table) {
            this.table.replaceData(this.employees);
            return;
        }
        this.table = new Tabulator(this.selector, {
            data: this.employees,
            height: "auto",
            layout: "fitColumns",
            columns: [
                { title: "Identificación", field: "identificacion", sorter: "string" },
                { title: "Nombre", field: "nombre", sorter: "string" },
                { title: "Correo", field: "correo", sorter: "string" },
                { title: "Fecha Nacimiento", field: "fecha_nacimiento", sorter: "date", sorterParams: { format: "YYYY-MM-DD" } },
                { title: "Fecha Creación", field: "fecha_creacion", sorter: "date", sorterParams: { format: "YYYY-MM-DD" } },
                { title: "Cargo", field: "cargo", sorter: "string" }
            ],
            langs: {
                "es": {
                    "columns": {},
                    "ajax": {"loading": "Cargando...", "error": "Error"},
                    "groups": {"item": "elemento", "items": "elementos"},
                    "pagination": {"page_size": "Tamaño Página", "first": "Primera", "last": "Última", "prev": "Anterior", "next": "Siguiente"},
                    "headerFilters": {"default": "filtrar columna..."}
                }
            }
        });
    }

    filterByName(name) {
        if (this.table) {
            this.table.setFilter("nombre", "like", name.toLowerCase());
        }
    }
}

const employeeTable = new EmployeeTable("#employeesTable");

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function () {
        employeeTable.filterByName(this.value);
    });
}

window.onload = () => employeeTable.load();
