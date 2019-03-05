import React, {Component} from 'react';
import { storeProducts, detailProduct } from "./data";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct
  };
  componentDidMount() {
    this.setProducts();
  }
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach((item) => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts };
    })
  };
  handleDetail = () => {
    console.log('handle detail');
  };
  addToCart = () => {
    console.log('add to cart')
  };
  render() {
    return (
      <div>
        <ProductContext.Provider value = {{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart
        }}>
          {this.props.children}
        </ProductContext.Provider>
      </div>
    );
  }
}
const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };