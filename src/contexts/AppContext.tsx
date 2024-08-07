import { PropsWithChildren, createContext, useState } from 'react';
import Highcharts from 'highcharts';

interface IAppContext {
  chartOptions: Highcharts.Options,
  updateChartOptions: (newOptions: Highcharts.Options) => void
}

export const AppContext = createContext<IAppContext>({
  chartOptions: {},
  updateChartOptions: () => null
});

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});

  const updateChartOptions = (newOptions: Highcharts.Options) => {
    setChartOptions(newOptions);
  }

  const contextValue: IAppContext = {
    chartOptions,
    updateChartOptions
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
};