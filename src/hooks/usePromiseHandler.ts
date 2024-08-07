import { useState } from 'react';

enum PromiseStates {
  Running = 'Running',
  Successful = 'Successful',
  Error = 'Error',
}
export const usePromiseHandler = <T>(
  promiseMethod: (...args: any[]) => Promise<T | void>
) => {
  const [state, setState] = useState<PromiseStates>();

  const isRunning = state === PromiseStates.Running,
    isSuccessful = state === PromiseStates.Successful,
    isError = state === PromiseStates.Error;
  
    async function perform(...args: any): ReturnType<typeof promiseMethod> {
    setState(PromiseStates.Running);
    let promise;
    try {
      promise = promiseMethod(...args);
      await promise;
      setState(PromiseStates.Successful);
    } catch (error) {
      setState(PromiseStates.Error);
    }
    return promise;
  }

  return { perform, isRunning, isSuccessful, isError, state };
};
