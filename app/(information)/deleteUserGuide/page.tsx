function deleteUserGuide() {
  return (
    <div className="w-full md:w-8/12 mx-auto pt-[80px]">
      <div
        className="px-4 py-4"
        style={{
          background: "white",
          opacity: ".95",
          width: "100%",
        }}
      >
        <h1 className="text-3xl mt-8 text-callejero font-bold">
          Borrar tu cuenta de Callejero
        </h1>
        <p className="text-lg mt-8">
          Por razones de seguridad, para eliminar tu cuenta de Callejero lo
          deberás hacer iniciando sesión en la app. Atención: antes de eliminar
          tu cuenta debes tener el saldo en cero ($0) y no puedes tener reservas
          pendientes.
        </p>
        <p className="text-lg mt-8">Para eliminar tu cuenta:</p>
        <p className="text-lg mt-4">1. Inicia sesión en la app de Callejero</p>
        <p className="text-lg mt-3">
          2. Toca el <b>icono de perfil</b>
        </p>
        <p className="text-lg mt-3">
          3. Ve a <b>Configuración</b>
        </p>
        <p className="text-lg mt-3 mb-8">
          4. Desplázate hacia abajo del todo de la página y selecciona{" "}
          <b>Eliminar cuenta</b>
        </p>
      </div>
    </div>
  );
}

export default deleteUserGuide;
