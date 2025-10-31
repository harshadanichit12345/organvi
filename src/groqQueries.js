export const allSpicesQuery = `*[_type == "spices"]{
  _id,
  title,
  description,
  price,
  "imageUrl": image.asset->
}`;
