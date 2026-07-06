import { useCallback, useEffect, useState } from 'react'

/**
 * Hook para el patron repetido de "cargar datos al montar la pagina":
 * maneja los estados de cargando/error y expone recargar() para refrescar
 * despues de crear o modificar algo.
 *
 * @param {Function} cargarDatos - funcion async que trae los datos y setea el estado
 *   de la pagina. Debe venir memoizada con useCallback para no recargar en cada render.
 * @returns {{ cargando: boolean, error: string|null, recargar: Function }}
 */
export default function useCarga(cargarDatos) {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const recargar = useCallback(async () => {
    try {
      await cargarDatos()
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [cargarDatos])

  useEffect(() => {
    // la carga inicial es async: el setState ocurre al resolver, no de forma sincrona
    // eslint-disable-next-line react-hooks/set-state-in-effect
    recargar()
  }, [recargar])

  return { cargando, error, recargar }
}
