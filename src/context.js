import React, {Component} from 'react';
import {detailProduct, storeProducts} from "./data";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
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
        cart: [...this.state.cart, productInCart]
      }
    }, () => this.addTotal());
  };
  openModal = (id) => {
    const modalProduct = this.getId(id);
    this.setState(() => {
      return {
        modalProduct: modalProduct,
        modalOpen: true
      }
    })
};
  closeModal = () => {
    this.setState(() => {
      return {
        modalOpen: false
      }
    })
  };
  increment = (id) => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find((index) => index.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price;
    this.setState(() => {
      return {
        cart: [...tempCart]
      }
    }, () => this.addTotal())
  };
  decrement = (id) => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find((index) => index.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count - 1;
    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price
      this.setState(() => {
        return {
          cart: [...tempCart]
        }
      }, () => this.addTotal())
    }
  };
  clearCart = () => {
    this.setState(() => {
      return {
        cart: []
      }
    }, () => {
        this.setProducts();
        this.addTotal();
    }
    )
  };
  removeItem = (id) => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter((item) => item.id !== id);
    let index = tempProducts.indexOf(this.getId(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    this.setState(() => {
      return {
        products: [...tempProducts],
        cart: [...tempCart]
      }
    }, () => this.addTotal())
  };
  addTotal = () => {
    let subTotal = 0;
    this.state.cart.map((item) => (subTotal += item.total));
    const tax = parseFloat((subTotal * 0.1).toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total
      }
    })
  };
  render() {
    return (
      <div>
        <ProductContext.Provider value = {{
          ...this.state,
          getId: this.getId(),
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment:this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}>
          {this.props.children}
        </ProductContext.Provider>
      </div>
    );
  }
}
const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };