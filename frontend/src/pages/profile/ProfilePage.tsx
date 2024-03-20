import React, { useState } from "react";
import PageContainer from "../../containers/pageContainer";
import SectionContainer from "../../containers/sectionContainer";
import { selectCurrentUser } from "../../slices/auth";
import { useSelector } from "react-redux";
import { getObjectPath } from "../../utils/utilFunctions";
import { useGetOrdersQuery, useGetTagsQuery } from "../../services/customer";
import LoadingPage from "../errors/LoadingPage";
import TagListInputComponent from "../../components/InputComponents/TagListInputComponent";
import { CustomerOrderResponse, Tag } from "../../types";
import ProfileTableRow from "../../components/Table/TableRow/ProfileTableRow";

const ProfilePage: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const tagData = useGetTagsQuery({});
  const preferenceKey = `${user?.email}-preferences`;
  const [update, setUpdate] = useState(false);
  const preferences = JSON.parse(localStorage.getItem(preferenceKey) ?? "[]");
  const recentOrders = useGetOrdersQuery(undefined);
  if (
    recentOrders.isLoading ||
    recentOrders.isError ||
    recentOrders.isFetching ||
    recentOrders.isUninitialized
  )
    return <>404</>;
  const addPreference = (pref: Tag | null) => {
    if (!pref) {
      return;
    }
    for (const p of preferences) {
      if (p.id === pref.id) {
        return;
      }
    }
    preferences.push(pref);

    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    setUpdate(!update);
  };

  const removePreference = (id: number) => {
    const removeIndex = preferences.findIndex((pref: Tag) => pref.id === id);
    preferences.splice(removeIndex, 1);
    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    setUpdate(!update);
  };

  if (tagData.isError || tagData.isLoading || tagData.isUninitialized) {
    return <LoadingPage />;
  }

  return (
    <PageContainer>
      <SectionContainer>
        <h1 className="text-2xl font-semibold">Your Profile</h1>
      </SectionContainer>
      <SectionContainer>
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl">
              {user?.firstname} {user?.lastname}
            </h1>
            <h2 className="text-md text-gray-500 italic">{user?.email}</h2>
            <img
              src={getObjectPath(user?.imagepath ?? "")}
              className="rounded-full mt-5 w-60 h-60 object-contain"
            />
          </div>
        </div>
      </SectionContainer>
      <div className="divider" />
      <div>
        <h1 className="text-2xl pl-3">Eat again?</h1>
        {recentOrders.data
          .slice()
          .reverse()
          .reduce(
            (accum: CustomerOrderResponse[], order: CustomerOrderResponse) => {
              if (accum.length >= 5) return accum;
              if (
                !accum.find(
                  (item: CustomerOrderResponse) =>
                    item.restaurantid === order.restaurantid
                )
              ) {
                accum.push(order);
              }
              return accum;
            },
            []
          )
          .map((order) => {
            return (
              <ProfileTableRow
                key={order.restaurantid}
                restaurantid={order.restaurantid}
              />
            );
          })}
      </div>
      <div className="divider" />
      <h1 className="text-xl">Edit Your Preferences</h1>
      <TagListInputComponent
        options={tagData.data}
        data={preferences as Tag[]}
        label={"Preferences"}
        placeholder={"Enter preference"}
        addValue={addPreference}
        removeValue={removePreference}
      />
      <SectionContainer />
    </PageContainer>
  );
};

export default ProfilePage;
