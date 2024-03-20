import React from "react";

type RestaurantCardProps = {
  imagePath: string;
  name: string;
  comment: string;
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  imagePath,
  name,
  comment,
}: RestaurantCardProps) => (
  <div className="card w-full max-h-64 shadow-md carousel-item hover:scale-105 transition ease-linear">
    <figure className="w-full h-32 bg-white">
      <img src={imagePath} alt="Shoes" className="object-cover" />
    </figure>
    <div className="flex flex-col h-24 p-3">
      <h2 className="card-title">{name}</h2>
      <p>{comment}</p>
    </div>
  </div>
);

export default RestaurantCard;
