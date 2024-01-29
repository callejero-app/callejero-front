function deleteUserGuide() {
  return (
    <div
      className="w-full md:w-8/12 mx-auto pt-[80px]"
      style={
        {
          // background: `url("/images/callejero-dark.png")`,
          // backgroundRepeat: "space",
        }
      }
    >
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
          Por razones de seguridad, para eliminar tu cuenta de Tinder lo deberás
          hacer iniciando sesión en la app o en Tinder.com. Atención: cuando
          elimines tu cuenta, perderás permanentemente tus matches, tus mensajes
          y cualquier otra información asociada a la cuenta.
        </p>
        <p className="text-lg mt-8">Para eliminar tu cuenta:</p>
        <p className="text-lg mt-4">
          1. Inicia sesión en la app de Callejero o en{" "}
          <b className="text-callejero">
            <a href="https://callejero.com.co/">Callejero.com</a>
          </b>
        </p>
        <p className="text-lg mt-3">
          2. Toca el <b>icono de perfil</b>
        </p>
        <p className="text-lg mt-3">
          3. Ve a tus <b>Ajustes</b>
        </p>
        <p className="text-lg mt-3">
          4. Desplázate hacia abajo del todo de la página y selecciona{" "}
          <b>Borrar cuenta</b>
        </p>

        <h2 className="mt-12 text-2xl text-callejero font-bold">
          Cómo ocultar temporalmente tu perfil
        </h2>
        <p className="text-lg mt-4">
          Si lo que quieres tomarte un descanso de Tinder sin tener que eliminar
          tu cuenta, puedes ocultar tu perfil. Ya no se te mostrará en las
          recomendaciones ni en la pila de perfiles. Sin embargo, la gente a
          quien ya has dado Like todavía podrá ver tu perfil y hacer match
          contigo. También seguirás pudiendo ver y chatear con tus matches.
        </p>
        <p className="text-lg mt-8">Para ocultar tu perfil:</p>
        <p className="text-lg mt-4">
          1. Inicia sesión en la app de Callejero o en{" "}
          <b className="text-callejero">
            <a href="https://callejero.com.co/">Callejero.com</a>
          </b>
        </p>
        <p className="text-lg mt-3">
          2. Toca el <b>icono de perfil</b>
        </p>
        <p className="text-lg mt-3">
          3. Ve a tus <b>Ajustes</b>
        </p>
        <p className="text-lg mt-3 mb-8">
          4. Desplázate hasta <b>Mostrarme en Callejero</b>
        </p>
      </div>
    </div>
  );
}

export default deleteUserGuide;
