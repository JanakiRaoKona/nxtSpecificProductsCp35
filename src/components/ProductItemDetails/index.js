// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsDetails: null,
    count: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetailsItems()
  }

  onClickPlus = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onClickMinus = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  getProductDetailsItems = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const similarProduct = data.similar_products.map(item => ({
        id: item.id,
        imageUrl: item.image_url,
        availability: item.availability,
        description: item.description,
        brand: item.brand,
        price: item.price,
        rating: item.rating,
        title: item.title,
        style: item.style,
        totalReviews: item.total_reviews,
      }))

      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        availability: data.availability,
        description: data.description,
        brand: data.brand,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: similarProduct,
      }
      this.setState({
        productsDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getTheFinalView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.inProgress:
        return this.loaderView()
      case apiStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  successView = () => {
    const {productsDetails, count} = this.state

    const {
      imageUrl,
      availability,
      description,
      brand,
      price,
      rating,
      totalReviews,
      title,
      similarProducts,
    } = productsDetails

    return (
      <div className="main-container">
        <div className="details-products-container">
          <img src={imageUrl} alt="product" className="product-image-details" />
          <div className="description-container">
            <h1 className="heading-title">{title}</h1>
            <p className="rate">{`Rs ${price}/-`}</p>
            <div className="rating-reviews">
              <div className="rating-background">
                <p className="reviews">{rating}</p>
                <img
                  className="star-image"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="paragraph-details">{description}</p>
            <p className="paragraph-details">
              <span className="span-av">Available:</span> {availability}
            </p>
            <p className="paragraph-details">
              <span className="span-av">Brand:</span> {brand}
            </p>
            <div className="button-cont">
              <button
                data-testid="minus"
                type="button"
                className="buttonPlus"
                onClick={this.onClickMinus}
              >
                <BsDashSquare />
              </button>
              <p className="product-number">{count}</p>
              <button
                data-testid="plus"
                type="button"
                className="buttonPlus"
                onClick={this.onClickPlus}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="error-button">
              ADD TO CART
            </button>
          </div>
        </div>
        {similarProducts && similarProducts.length > 0 && (
          <ul className="ul-list">
            {similarProducts.map(eachItem => (
              <SimilarProductItem similarItems={eachItem} key={eachItem.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  loaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products" className="nav-link">
        <button type="button" className="error-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  render() {
    return (
      <div>
        <Header />
        <div className="main-container">{this.getTheFinalView()}</div>
      </div>
    )
  }
}

export default ProductItemDetails
