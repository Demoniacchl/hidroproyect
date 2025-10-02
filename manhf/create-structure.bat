@echo off
REM script name: create-structure.bat
REM Ubicación: E:\hidro\hidroproyect\manhf

echo 🚀 Creando estructura del proyecto...
echo.

REM Directorio base
set "BASE_DIR=E:\hidro\hidroproyect\manhf\src"

REM Crear estructura de componentes
mkdir "%BASE_DIR%\components\ui\Button"
type nul > "%BASE_DIR%\components\ui\Button\Button.tsx"
type nul > "%BASE_DIR%\components\ui\Button\Button.css"

mkdir "%BASE_DIR%\components\ui\Input"
type nul > "%BASE_DIR%\components\ui\Input\Input.tsx"
type nul > "%BASE_DIR%\components\ui\Input\Input.css"

mkdir "%BASE_DIR%\components\ui\Card"
type nul > "%BASE_DIR%\components\ui\Card\Card.tsx"
type nul > "%BASE_DIR%\components\ui\Card\Card.css"

mkdir "%BASE_DIR%\components\ui\Modal"
type nul > "%BASE_DIR%\components\ui\Modal\Modal.tsx"
type nul > "%BASE_DIR%\components\ui\Modal\Modal.css"

mkdir "%BASE_DIR%\components\ui\Table"
type nul > "%BASE_DIR%\components\ui\Table\Table.tsx"
type nul > "%BASE_DIR%\components\ui\Table\Table.css"

mkdir "%BASE_DIR%\components\layout\Header"
type nul > "%BASE_DIR%\components\layout\Header\Header.tsx"
type nul > "%BASE_DIR%\components\layout\Header\Header.css"

mkdir "%BASE_DIR%\components\layout\Sidebar"
type nul > "%BASE_DIR%\components\layout\Sidebar\Sidebar.tsx"
type nul > "%BASE_DIR%\components\layout\Sidebar\Sidebar.css"

mkdir "%BASE_DIR%\components\layout"
type nul > "%BASE_DIR%\components\layout\Layout.tsx"

mkdir "%BASE_DIR%\components\auth\LoginForm"
type nul > "%BASE_DIR%\components\auth\LoginForm\LoginForm.tsx"
type nul > "%BASE_DIR%\components\auth\LoginForm\LoginForm.css"

mkdir "%BASE_DIR%\components\auth\ProtectedRoute"
type nul > "%BASE_DIR%\components\auth\ProtectedRoute\ProtectedRoute.tsx"

REM Crear estructura de páginas
mkdir "%BASE_DIR%\pages\auth"
type nul > "%BASE_DIR%\pages\auth\Login.tsx"

mkdir "%BASE_DIR%\pages\super-admin\users"
type nul > "%BASE_DIR%\pages\super-admin\SuperAdminDashboard.tsx"
type nul > "%BASE_DIR%\pages\super-admin\users\UserManagement.tsx"

mkdir "%BASE_DIR%\pages\super-admin\system"
type nul > "%BASE_DIR%\pages\super-admin\system\SystemConfig.tsx"

mkdir "%BASE_DIR%\pages\admin\clients"
type nul > "%BASE_DIR%\pages\admin\AdminDashboard.tsx"
type nul > "%BASE_DIR%\pages\admin\clients\ClientManagement.tsx"

mkdir "%BASE_DIR%\pages\admin\calendar"
type nul > "%BASE_DIR%\pages\admin\calendar\Calendar.tsx"

mkdir "%BASE_DIR%\pages\admin\approvals"
type nul > "%BASE_DIR%\pages\admin\approvals\Approvals.tsx"

mkdir "%BASE_DIR%\pages\tecnico\mantenciones"
type nul > "%BASE_DIR%\pages\tecnico\TecnicoDashboard.tsx"
type nul > "%BASE_DIR%\pages\tecnico\mantenciones\Mantenciones.tsx"

mkdir "%BASE_DIR%\pages\tecnico\reparaciones"
type nul > "%BASE_DIR%\pages\tecnico\reparaciones\Reparaciones.tsx"

mkdir "%BASE_DIR%\pages\common"
type nul > "%BASE_DIR%\pages\common\Dashboard.tsx"
type nul > "%BASE_DIR%\pages\common\Profile.tsx"
type nul > "%BASE_DIR%\pages\common\NotFound.tsx"

REM Crear hooks, context, services, etc.
mkdir "%BASE_DIR%\hooks"
type nul > "%BASE_DIR%\hooks\useAuth.ts"
type nul > "%BASE_DIR%\hooks\useApi.ts"
type nul > "%BASE_DIR%\hooks\useLocalStorage.ts"

mkdir "%BASE_DIR%\context"
type nul > "%BASE_DIR%\context\AuthContext.tsx"

mkdir "%BASE_DIR%\services"
type nul > "%BASE_DIR%\services\auth.service.ts"
type nul > "%BASE_DIR%\services\clientes.service.ts"
type nul > "%BASE_DIR%\services\equipos.service.ts"
type nul > "%BASE_DIR%\services\mantenciones.service.ts"
type nul > "%BASE_DIR%\services\api.ts"

mkdir "%BASE_DIR%\types"
type nul > "%BASE_DIR%\types\auth.types.ts"
type nul > "%BASE_DIR%\types\clientes.types.ts"
type nul > "%BASE_DIR%\types\equipos.types.ts"
type nul > "%BASE_DIR%\types\common.types.ts"

mkdir "%BASE_DIR%\utils"
type nul > "%BASE_DIR%\utils\constants.ts"
type nul > "%BASE_DIR%\utils\helpers.ts"
type nul > "%BASE_DIR%\utils\formatters.ts"

mkdir "%BASE_DIR%\assets\images"
mkdir "%BASE_DIR%\assets\icons"
mkdir "%BASE_DIR%\assets\styles"
type nul > "%BASE_DIR%\assets\styles\globals.css"
type nul > "%BASE_DIR%\assets\styles\variables.css"

REM Crear archivo App.tsx principal
type nul > "%BASE_DIR%\App.tsx"

echo.
echo ✅ Estructura creada exitosamente!
echo 📁 Ubicación: %BASE_DIR%
echo.
pause