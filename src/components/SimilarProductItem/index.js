// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarItems} = props
  const {title, brand, price, rating, imageUrl} = similarItems
  return (
    <li className="list">
      <img src={imageUrl} alt={`similar product ${title}`} className="image2" />
      <h1 className="heading-similar">{title}</h1>
      <p className="brand-similar">by {brand}</p>
      <div className="rotate">
        <p className="brand-similar1">{`Rs${price}/-`}</p>
        <div className="rating-background1">
          <p className="reviews">{rating}</p>
          <img
            className="star-image"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
