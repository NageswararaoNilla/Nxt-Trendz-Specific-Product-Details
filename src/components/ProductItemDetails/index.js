import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {productDetails: {}, count: 1, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = product => ({
    id: product.id,
    imageUrl: product.image_url,
    title: product.title,
    style: product.style,
    price: product.price,
    description: product.description,
    brand: product.brand,
    totalReviews: product.total_reviews,
    rating: product.rating,
    availability: product.availability,
  })

  getProductDetails = async () => {
    // console.log(this.props)
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      const updateData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(each =>
          this.getFormattedData(each),
        ),
      }
      //   console.log(updateData)
      this.setState({
        productDetails: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      //   console.log(data)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  renderProductDetails = () => {
    const {productDetails, count} = this.state
    console.log(productDetails)
    const {
      title,
      imageUrl,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails
    return (
      <div className="product-container">
        <img src={imageUrl} alt="product" />
        <div>
          <h1>{title}</h1>
          <p>Rs{price}/- </p>
          <div>
            <p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
              {rating}
            </p>
            <p>{totalReviews}Reviews</p>
          </div>
          <p>{description}</p>
          <p>Available: {availability}</p>
          <p>Brand: {brand}</p>
          <hr />
          <div>
            <button
              type="button"
              data-testid="minus"
              onClick={this.onDecrement}
            >
              <BsDashSquare />
            </button>
            <p>{count}</p>
            <button type="button" data-testid="plus" onClick={this.onIncrement}>
              <BsPlusSquare />
            </button>
          </div>
          <button type="button">ADD TO CART</button>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderSimilarProducts = () => {
    const {productDetails} = this.state
    const {similarProducts} = productDetails
    return (
      <div>
        <h1>Similar Products</h1>
        <ul>
          {similarProducts.map(eachItem => (
            <SimilarProductItem
              productCardDetails={eachItem}
              key={eachItem.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  onClickNavigate = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.onClickNavigate}>
        Continue Shopping
      </button>
    </div>
  )

  renderAllProdcuts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <>
            {this.renderProductDetails()}
            {this.renderSimilarProducts()}
          </>
        )
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllProdcuts()}
      </>
    )
  }
}

export default ProductItemDetails
