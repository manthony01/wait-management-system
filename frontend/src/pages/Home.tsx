import React from "react";
import PageContainer from "../containers/pageContainer";
import RestaurantCard from "../components/RestaurantCard/RestaurantCard";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import RestaurantIcon from "../components/Icons/RestaurantIcon";
import ArrowIcon from "../components/Icons/ArrowIcon";
import { useGetRestaurantsQuery } from "../services/customer";
import { Link } from "react-router-dom";
import { getObjectPath } from "../utils/utilFunctions";
export const Home = () => {
  const { data, isLoading, isError, isFetching, isUninitialized } =
    useGetRestaurantsQuery({});

  if (isLoading || isError || isFetching || isUninitialized) {
    return <>404</>;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center pt-12 bg-dinner-pattern w-full h-[800px] bg-cover bg-center">
        <h1
          className="text-xl md:text-4xl text-center text-base-content font-bold mb-5"
          data-testid="landing-text"
        >
          Order from anytime, anywhere
        </h1>
        <Autocomplete
          id="country-select-demo"
          className="w-5/6 sm:w-2/3 md:w-1/2 lg:w-1/3"
          options={data}
          autoHighlight
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <Link to={`/restaurant/${option.id}/menu`}>
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {option.name}
              </Box>
            </Link>
          )}
          renderInput={(params) => (
            <div
              ref={params.InputProps.ref}
              className="w-full bg-base-100 rounded-full flex justify-center items-center px-4"
            >
              <RestaurantIcon />
              <input
                {...params.inputProps}
                type="text"
                placeholder="Enter Restaurant Name"
                className="rounded-full w-full p-3 bg-base-100 outline-none"
              />
              <ArrowIcon />
            </div>
          )}
        />
      </div>
      <PageContainer>
        <h1 className="text-3xl">Restaurants</h1>
        <div className="grid md:grid-cols-2 max-w-full mt-10 gap-10">
          {data.length > 0 &&
            data.map((restaurant) => (
              <div key={restaurant.id} data-testid="restaurant-name">
                <Link to={`/restaurant/${restaurant.id}/menu`}>
                  <RestaurantCard
                    imagePath={getObjectPath(restaurant.imagepath)}
                    name={restaurant.name}
                    comment={restaurant.comment}
                  />
                </Link>
              </div>
            ))}
        </div>
        <div className="divider" />
      </PageContainer>
    </>
  );
};
