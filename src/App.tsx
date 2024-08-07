import { useEffect, useContext, useState } from "react";
import "./App.css";
import { FilterBox } from './components/FilterBox';
import { usePromiseHandler } from './hooks/usePromiseHandler';
import { URLS } from './constants/urls';
import { ReportChart } from './components/ReportChart';
import { IProduct } from './interfaces/app';
import { AppContext } from './contexts/AppContext';
import Highcharts from 'highcharts';

function App() {
  const { chartOptions, updateChartOptions } = useContext(AppContext);
  const [categoryChartOptions, setCategoryChartOptions] = useState<Highcharts.Options>({});

  // Fetching all the products to show the pie chart on page load.
  // Since the categories API does not give the value of categories to draw a Pie chart.
  const fetchAllProducts = async () => {
    try {
      const response = await fetch(URLS.allProducts)
      const allProductsArr  = await response.json();
      const categoryChartOptions = buildCategoryChartData(allProductsArr.products);
      updateChartOptions(categoryChartOptions as Highcharts.Options);
      setCategoryChartOptions(categoryChartOptions as Highcharts.Options);
    } catch(err) {
      console.warn('unable to fetch all products', err);
    }
  };

  const fetchAllProductsAction = usePromiseHandler(fetchAllProducts);

  useEffect(() => {
    fetchAllProductsAction.perform();
  }, []);

  const buildCategoryChartData = (products: IProduct[]) => {
    const chartData = Object.values(products.reduce((acc: any, product: IProduct) => {
      if (!acc[product.category]) {
        acc[product.category] = { name: product.category, y: 0 };
      }
      acc[product.category].y += product.price;
      return acc;
    }, {}));

    return {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Product by category'
      },
      xAxis: {
        title: {
          text: 'Categories'
        },
      },
      series: [
        {
          name: 'Price',
          data: chartData
        }
      ]
    };
  };

  const resetChartOnClear = () => {
    updateChartOptions(categoryChartOptions as Highcharts.Options);
  }

  return (
    <section className="app-container">
      <FilterBox resetChartOnClear={() => resetChartOnClear()}/>
      <ReportChart options={chartOptions} />
    </section>
  );
}

export default App;
