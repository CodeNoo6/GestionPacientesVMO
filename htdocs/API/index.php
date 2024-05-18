<?php
$host = "localhost";
$usuario = "root";
$password = "";
$basededatos = "ApiGestionPacientesDB";

$conexion = new mysqli($host, $usuario, $password, $basededatos);

if ($conexion->connect_error) {
    die ("Conexión no establecida: " . $conexion->connect_error);
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Asegúrate de incluir OPTIONS
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    case 'GET':
        if(isset($_GET['id'])){
            $id = $_GET['id'];
            consultaPorId($conexion, $id);
        } else {
            consulta($conexion);
        }
        break;
    case 'POST':
        $datos_json = file_get_contents("php://input");
        $datos = json_decode($datos_json, true);
        insertar($conexion, $datos);
        break;
    case 'PUT':
        $datos_json = file_get_contents("php://input");
        $datos = json_decode($datos_json, true);
        if(isset($_GET['id'])){
            $id = $_GET['id'];
            actualizar($conexion, $id, $datos);
        } else {
            echo "No se proporcionó un ID para actualizar.";
        }
        break;
    case 'DELETE':
        $id = $_GET['id'];
        borrar($conexion, $id);
        break;
    default:
        echo "Método no permitido";
        break;
}

function consulta($conexion) {
    $sql = "SELECT * FROM Paciente";
    $resultado = $conexion->query($sql);

    if ($resultado === FALSE) {
        die("Error en la consulta: " . $conexion->error);
    }

    if ($resultado->num_rows > 0) {
        $datos = array();
        while ($fila = $resultado->fetch_assoc()) {
            $datos[] = $fila;
        }
        echo json_encode($datos);
    } else {
        echo "No hay registros en la tabla Paciente.";
    }
}

function consultaPorId($conexion, $id) {
    $sql = "SELECT * FROM Paciente WHERE id = '$id'";
    $resultado = $conexion->query($sql);

    if ($resultado === FALSE) {
        die("Error en la consulta: " . $conexion->error);
    }

    if ($resultado->num_rows > 0) {
        $datos = $resultado->fetch_assoc();
        echo json_encode($datos);
    } else {
        echo "No se encontró ningún paciente con el ID especificado.";
    }
}

function insertar($conexion, $datos) {
    $DNI = $datos['DNI'];
    $Nombre = $datos['Nombre'];
    $Apellido = $datos['Apellido'];
    $CorreoElectronico = $datos['CorreoElectronico'];
    $Telefonos = $datos['Telefonos'];
    $FechaNacimiento = $datos['FechaNacimiento'];
    $Direccion = $datos['Direccion'];
    $CiudadID = $datos['CiudadID'];

    $sql = "INSERT INTO Paciente (DNI, Nombre, Apellido, CorreoElectronico, Telefonos, FechaNacimiento, Direccion, CiudadID) VALUES ('$DNI', '$Nombre', '$Apellido', '$CorreoElectronico', '$Telefonos', '$FechaNacimiento', '$Direccion', '$CiudadID')";
    
    if ($conexion->query($sql) === TRUE) {
        echo json_encode(array("message" => "Datos insertados correctamente."));
    } else {
        echo json_encode(array("message" => "Error al insertar datos: " . $conexion->error));
    }
}

function borrar($conexion, $id) {
    $sql = "DELETE FROM Paciente WHERE id = '$id'";
    
    if ($conexion->query($sql) === TRUE) {
        echo json_encode(array("message" => "Registro eliminado correctamente."));
    } else {
        echo json_encode(array("message" => "Error al eliminar registro: " . $conexion->error));
    }
}

function actualizar($conexion, $id, $datos) {
    $DNI = $datos['DNI'];
    $Nombre = $datos['Nombre'];
    $Apellido = $datos['Apellido'];
    $CorreoElectronico = $datos['CorreoElectronico'];
    $Telefonos = $datos['Telefonos'];
    $FechaNacimiento = $datos['FechaNacimiento'];
    $Direccion = $datos['Direccion'];
    $CiudadID = $datos['CiudadID'];

    $sql = "UPDATE Paciente SET DNI='$DNI', Nombre='$Nombre', Apellido='$Apellido', CorreoElectronico='$CorreoElectronico', Telefonos='$Telefonos', FechaNacimiento='$FechaNacimiento', Direccion='$Direccion', CiudadID='$CiudadID' WHERE id='$id'";
    
    if ($conexion->query($sql) === TRUE) {
        echo json_encode(array("message" => "Datos actualizados correctamente."));
    } else {
        echo json_encode(array("message" => "Error al actualizar datos: " . $conexion->error));
    }
}
?>
