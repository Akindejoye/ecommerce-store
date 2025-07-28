function ProductCard({ product }) {
  // Default placeholder image
  const placeholderImage =
    "https://via.placeholder.com/150/cccccc/969696?text=No+Image";

  // Use product.image if it exists and is non-empty, otherwise use placeholder
  const imageSrc =
    product.image && product.image.trim() !== ""
      ? product.image
      : placeholderImage;

  return (
    <div className="product-card">
      <img src={imageSrc} alt={product.name || "Product image"} />
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
    </div>
  );
}

export default ProductCard;
