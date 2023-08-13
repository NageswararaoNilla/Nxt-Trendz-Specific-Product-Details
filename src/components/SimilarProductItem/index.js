import './index.css'

const SimilarProductItem = props => {
  const {productCardDetails} = props
  const {
    title,
    imageUrl,
    // style,
    price,
    // description,
    brand,
    // totalReviews,
    rating,
    // availability,
  } = productCardDetails

  return (
    <div>
      <img src={imageUrl} alt="similar product" />
      <p>{title}</p>
      <p>{brand}</p>
      <div>
        <p>Rs {price}/- </p>
        <p>
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </p>
      </div>
    </div>
  )
}

export default SimilarProductItem
