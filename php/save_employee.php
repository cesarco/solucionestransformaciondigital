<?php
header('Content-Type: application/json');

class Employee
{
    public $identificacion;
    public $nombre;
    public $correo;
    public $fecha_nacimiento;
    public $fecha_creacion;
    public $cargo;

    public function __construct($data)
    {
        $this->identificacion = $data['identificacion'] ?? '';
        $this->nombre = $data['nombre'] ?? '';
        $this->correo = $data['correo'] ?? '';
        $this->fecha_nacimiento = $data['fecha_nacimiento'] ?? '';
        $this->fecha_creacion = $data['fecha_creacion'] ?? '';
        $this->cargo = $data['cargo'] ?? '';
    }
}

class EmployeeManager
{
    private $jsonFile;
    private $employees = [];

    public function __construct($jsonFile)
    {
        $this->jsonFile = $jsonFile;
        if (file_exists(filename: $jsonFile)) {
            $data = json_decode(json: file_get_contents(filename: $jsonFile), associative: true);
            if (is_array(value: $data)) {
                foreach ($data as $emp) {
                    $this->employees[] = new Employee(data: $emp);
                }
            }
        }
    }

    public function exists($field, $value)
    {
        foreach ($this->employees as $emp) {
            if ($emp->$field === $value) {
                return true;
            }
        }
        return false;
    }

    public function add(Employee $employee)
    {
        $this->employees[] = $employee;
        $this->save();
    }

    private function save(): void
    {
        $arr = array_map(callback: fn($emp): array => [
            'identificacion' => $emp->identificacion,
            'nombre' => $emp->nombre,
            'correo' => $emp->correo,
            'fecha_nacimiento' => $emp->fecha_nacimiento,
            'fecha_creacion' => $emp->fecha_creacion,
            'cargo' => $emp->cargo
        ], array: $this->employees);
        file_put_contents(filename: $this->jsonFile, data: json_encode(value: $arr, flags: JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}

// --- Lógica principal ---
$jsonFile = '../data/employees.json';
$data = json_decode(json: file_get_contents(filename: 'php://input'), associative: true);
if (!$data) {
    echo json_encode(value: ['success' => false, 'message' => 'Datos no recibidos.']);
    exit;
}
$manager = new EmployeeManager($jsonFile);
if ($manager->exists(field: 'identificacion', value: $data['identificacion'])) {
    echo json_encode(value: ['success' => false, 'message' => 'La identificación ya existe.']);
    exit;
}
if ($manager->exists(field: 'correo', value: $data['correo'])) {
    echo json_encode(value: ['success' => false, 'message' => 'El correo ya existe.']);
    exit;
}
$employee = new Employee(data: $data);
$manager->add(employee: $employee);
echo json_encode(value: ['success' => true, 'message' => 'Empleado agregado correctamente.']);
