import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import '../styles/filter.css';
import { useEffect, useState, useContext } from 'react';
import { usePromiseHandler } from '../hooks/usePromiseHandler';
import { SelectBox } from './ui-components/SelectBox'
import { URLS } from '../constants/urls';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { IProduct, ICategory } from '../interfaces/app';
import { AppContext } from '../contexts/AppContext'
import LoadingButton from '@mui/lab/LoadingButton';

interface Props {
  resetChartOnClear: () => void;
}

export const FilterBox = (props: Props) => {
  const { updateChartOptions } = useContext(AppContext);
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [products, setProducts] = useState<Array<IProduct>>([]);
  const [selectedCategory, setselectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Array<string>>([]);
  const [isReportLoading, setIsReportLoading] = useState<boolean>(false);
  const [disableReportBtn, setDisableReportBtn] = useState<boolean>(true);
  let previousSelection: Record<string, string | string[]> = {
    selectedCategory: '',
    selectedProduct: []
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(URLS.getCategory)
      const categories  = await response.json();
      setCategories(categories);
    } catch(err) {
      console.warn('unable to fetch categories', err);
    }
  };

  const fetchProducts = async (categoryName: string) => {
    try {
      const response = await fetch(URLS.getProductsByCategory(categoryName))
      const productsArray  = await response.json();
      setProducts(productsArray.products);
      buildProductChartData();
    } catch(err) {
      console.warn('unable to fetch products', err);
    }
  };

  const fetchCategoriesAction = usePromiseHandler(fetchCategories);
  const fetchProductsAction = usePromiseHandler(fetchProducts);

  useEffect(() => {
    fetchCategoriesAction.perform();
  }, []);

  useEffect(() => {
    if (previousSelection.selectedCategory !== selectedCategory
      || previousSelection.selectedProduct.length !== selectedProduct.length) {
        setDisableReportBtn(false);
      }
  }, [selectedCategory, selectedProduct])

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedProduct([]);
    setselectedCategory(event.target.value);
    fetchProductsAction.perform(event.target.value);
  };

  const handleProductChange = (event: SelectChangeEvent) => {
    setSelectedProduct(event.target.value as any);
  };

  const handleClearFilter = () => {
    if (!selectedCategory && !selectedProduct.length) {
      return;
    }
    setselectedCategory('');
    setSelectedProduct([]);
    setProducts([]);
    setDisableReportBtn(true);
    props.resetChartOnClear();
  };

  const diableProductSelectBox = products.length === 0 
    || fetchCategoriesAction.isRunning 
    || fetchProductsAction.isRunning;

  const buildProductChartData = () => {
    const filteredProducts = selectedProduct.length
      ? products.filter((product) => selectedProduct.includes(product.title))
      : products;
    const productNames = filteredProducts.map(product => product.title);
    const productPrices = filteredProducts.map(product => product.price);
    return {
      chart: {
        type: 'column'
      },
      title: {
        text: selectedCategory
      },
      xAxis: {
        title: {
          text: selectedCategory
        },
        categories: productNames
      },
      yAxis: {
        title: {
          text: 'Price'
        }
      },
      series: [
        {
          name: 'Price',
          data: productPrices
        }
      ]
    };
  };

  const handleRunReport = () => {
    setIsReportLoading(true);
    setTimeout(() => {
      const chartOptions = buildProductChartData();
      updateChartOptions(chartOptions);
      setIsReportLoading(false);
      setDisableReportBtn(true);
      previousSelection = {
        selectedCategory,
        selectedProduct
      }
    }, 3000);
  };

  return (
    <aside className="filter-container">
      <div className="filter-header">
        <h3>Filters</h3>
        <Button variant="text" size="small" onClick={handleClearFilter}>Clear</Button>
      </div>
      <SelectBox 
        name="Categories"
        id="category"
        value={selectedCategory}
        disabled={fetchCategoriesAction.isRunning}
        onChange={(event) => handleCategoryChange(event)}
      >
        {
          categories.map((category: ICategory) => (
            <MenuItem
              key={category.name}
              value={category.slug}
            >
              {category.name}
            </MenuItem>
          ))
          }
      </SelectBox>
      <SelectBox 
        name="Products"
        id="products"
        value={selectedProduct}
        disabled={diableProductSelectBox}
        multiple={true}
        renderValue={(selected: string[]) => selected.join(', ')}
        onChange={(event) => handleProductChange(event)}
      >
        {
          products.map((product: IProduct) => (
            <MenuItem
              key={product.title}
              value={product.title}
            >
              <Checkbox checked={selectedProduct.indexOf(product.title) > -1} />
              <ListItemText primary={product.title} />
            </MenuItem>
          ))
        }
      </SelectBox>
      <div className="run-report-btn">
        <LoadingButton
          variant="contained"
          disabled={disableReportBtn}
          onClick={handleRunReport}
          loading={isReportLoading}>
          Run report
        </LoadingButton>
      </div>
    </aside>
  );
};
