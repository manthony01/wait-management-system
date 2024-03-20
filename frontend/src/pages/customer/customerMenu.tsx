import React, { useState } from "react";
import PageContainer from "../../containers/pageContainer";
import CardContainer from "../../containers/cardContainer";
import MenuItemCard from "../../components/menuItemCard/menuItemCard";
import SectionContainer from "../../containers/sectionContainer";
import {
  useGetRestaurantMenuQuery,
  useGetRestaurantQuery,
} from "../../services/customer";
import { useParams } from "react-router";
import NotFoundPage from "../errors/NotFoundPage";
import LoadingPage from "../errors/LoadingPage";
import { getObjectPath } from "../../utils/utilFunctions";
import OrderMenuItemModal from "../../components/Forms/OrderMenuItemModal/OrderMenuItemModal";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../slices/auth";
import LoyaltyBar from "../../components/LoyaltyBar/LoyaltyBar";

const CustomerMenu: React.FC = () => {
  const { id } = useParams();
  const [togglePreference, setTogglePreference] = useState(false);
  const user = useSelector(selectCurrentUser);
  const preferences = JSON.parse(
    localStorage.getItem(`${user?.email}-preferences`) ?? "[]"
  );
  const {
    data: menuData,
    isError: isMenuError,
    isLoading: isMenuLoading,
    isUninitialized: isMenuUnitialized,
  } = useGetRestaurantMenuQuery(parseInt(id ?? "0", 10));
  const {
    data: restaurantData,
    isError: isRestaurantError,
    isLoading: isRestaurantLoading,
    isUninitialized: isRestaurantUnitialized,
  } = useGetRestaurantQuery(parseInt(id ?? "0", 10));

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    const navbar = document.getElementById("navbar");
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
    if (element) {
      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight -
        125;
      window.scroll({ top, behavior: "smooth" });
    }
  };

  if (isMenuError || isRestaurantError) {
    return <NotFoundPage />;
  }
  if (
    isMenuLoading ||
    isMenuUnitialized ||
    isRestaurantLoading ||
    isRestaurantUnitialized
  ) {
    return <LoadingPage />;
  }

  let menu = menuData;
  if (togglePreference) {
    menu = menu
      .map((category) => {
        const clone = { ...category };
        clone.items = clone.items.filter((item) => {
          for (const tag of item.tags) {
            for (const p of preferences) {
              if (p.id === tag.id) {
                return true;
              }
            }
          }
          return false;
        });
        return clone;
      })
      .filter((category) => category.items.length !== 0);
  }

  return (
    <PageContainer>
      <div data-testid="customer-menu">
        <h1 className="text-3xl mt-4 font-extrabold">{restaurantData.name}</h1>
        <h2 className="text-lg">{restaurantData.comment}</h2>
        <img
          src={getObjectPath(restaurantData.imagepath)}
          className="w-full h-[250px] rounded-xl mt-5 shadow-lg object-cover"
        />
      </div>
      <div className="sticky top-12 pt-4 z-10 bg-base-100">
        <div className="flex justify-between mb-4">
          <h1 className="flex place-items-center gap-x-4">
            <span className="text-xl font-bold">{restaurantData.name}</span>
            <div className="divider divider-horizontal" />
            <div className="form-contro my-auto">
              <label className="label cursor-pointer">
                <span className="label-text mr-2">Only Preferences</span>
                <input
                  type="checkbox"
                  className="toggle toggle-secondary toggle-md"
                  checked={togglePreference}
                  onChange={() => setTogglePreference(!togglePreference)}
                />
              </label>
            </div>
          </h1>
          <div className="hidden sm:flex flex-col bg-base-100 rounded-full justify-center items-center px-4 gap-x-2">
            <LoyaltyBar restaurantId={parseInt(id ?? "0")} />
          </div>
        </div>
        <div className="carousel w-full border-b z-50 gap-x-5">
          {menu.map((category, index) => (
            <div
              key={index}
              className="carousel-item border-b-2 border-b-transparent hover:border-black h-full 
                         transform transition linear duration-150 hover:cursor-pointer"
              onClick={() => scrollTo(`category-${category.id}`)}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {menu.map((category, index) => (
        <SectionContainer key={index} sectionId={`category-${category.id}`}>
          <h1 className="mb-4 text-2xl leading-none text-gray-900 font-semibold">
            {category.name}
          </h1>
          <CardContainer>
            {category.items.map((menuItem, index) => {
              return (
                <React.Fragment key={index}>
                  <MenuItemCard
                    title={menuItem.title}
                    price={menuItem.cost}
                    description={menuItem.description}
                    imageUrl={menuItem.imagepath}
                    onClick={() => {
                      const modal = document.getElementById(
                        `menu-item-modal-${menuItem.id}`
                      ) as HTMLDialogElement;
                      if (modal && !modal.hasAttribute("open")) {
                        modal.showModal();
                      }
                    }}
                  />
                  <OrderMenuItemModal
                    menuItem={menuItem}
                    restaurantId={parseInt(id ?? "0", 10)}
                  />
                </React.Fragment>
              );
            })}
          </CardContainer>
        </SectionContainer>
      ))}
    </PageContainer>
  );
};

export default CustomerMenu;
