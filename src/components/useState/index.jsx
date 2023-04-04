import { useState, useEffect, useCallback } from "react";
import { Container, Input, Button } from "semantic-ui-react";

const APIFETCH = "https://rickandmortyapi.com/api/character/";
const SECURITY_CODE = "ivan";

export function UseStateComponent({ name }) {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [state, setState] = useState({
    value: "",
    error: false,
    loading: false,
    deleted: false,
    confirmed: false,
  });

  const onWrite = (newValue) => {
    setState({
      ...state,
      value: newValue,
    });
  };

  const onCheck = () => {
    setState({
      ...state,
      loading: true,
    });
  };

  const onDelete = () => {
    setState({
      ...state,
      deleted: true,
    });
  };

  const onReset = () => {
    setState({
      ...state,
      confirmed: false,
      deleted: false,
      value: "",
    });
  };

  let showName = datas.map((n) => n.name);
  console.log(showName);

  const changeState = useCallback(() => {
    const onConfirm = () => {
      setState({
        ...state,
        error: false,
        confirmed: true,
        loading: false,
      });
    };

    const onError = () => {
      setState({
        ...state,
        error: true,
        loading: false,
      });
    };

    if (state.loading && showName && showName.length > 0 && state.value) {
      setTimeout(() => {
        state.value?.toString() === showName[0]?.toString()
          ? onConfirm()
          : onError();
      }, 2000);
    }
  }, [state]);

  useEffect(() => {
    async function getApi() {
      let data = await fetch(APIFETCH).then((res) => res.json());
      setDatas(data.results);
    }
    getApi();
  }, []);

  useEffect(() => {
    changeState();
  }, [changeState]);

  if (!state.deleted && !state.confirmed) {
    return (
      <Container text>
        <h2>Eliminar {name}</h2>
        <p>Por favor escribe el código de seguridad</p>
        <Input
          error={state.error}
          loading={state.loading}
          icon="user"
          type="text"
          placeholder="Código de seguridad"
          value={state.value}
          onChange={(e) => onWrite(e.target.value)}
        />
        {state.error && <p>Error: el código es incorrecto</p>}
        <Button content="Primary" primary onClick={() => onCheck()}>
          Comprobar
        </Button>
      </Container>
    );
  } else if (state.confirmed && !state.deleted) {
    return (
      <Container>
        <p>
          Advertencia ⚠️, ¿Estás seguro de querer eliminar esto?
          <span className="red">Es irrecuperable</span>
        </p>
        <button onClick={() => onDelete()}>Sí, eliminar</button>

        <button onClick={() => onReset()}>No, me arrepentí</button>
      </Container>
    );
  } else {
    return (
      <Container>
        <p>Eliminado con éxito</p>
        <button onClick={() => onReset()}>Resetear</button>
      </Container>
    );
  }
}
