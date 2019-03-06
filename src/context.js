import React, {Component} from 'react';
import {detailProduct, storeProducts} from "./data";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart: []
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
  getId = (id) => {
    return this.state.products.find((item) => item.id === id);
  };
  handleDetail = (id) => {
    const product = this.getId(id);
    this.setState(() => {
      return {
        detailProduct: product
      }
    })
  };
  addToCart = (id) => {
    let tempProducts = [...this.state.products];
    let index = tempProducts.indexOf(this.getId(id));
    const productInCart = tempProducts[index];
    productInCart.inCart = true;
    productInCart.count = 1;
    const price = productInCart.price;
    productInCart.total = price;
    this.setState(() => {
      return {
        products: tempProducts,
        inCart: [...this.state.cart, productInCart]
      }
    }, () => console.log(this.state));
  };
  render() {
    return (
      <div>
        <ProductContext.Provider value = {{
          ...this.state,
          getId: this.getId(),
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