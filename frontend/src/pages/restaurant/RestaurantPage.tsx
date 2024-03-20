import React from "react";
import PageContainer from "../../containers/pageContainer";
import SectionContainer from "../../containers/sectionContainer";
import { Link, useParams } from "react-router-dom";
import { useGetRestaurantQuery } from "../../services/customer";
import {
  useDeleteStaffMutation,
  useGetAllStaffQuery,
} from "../../services/manager";
import LoadingPage from "../errors/LoadingPage";
import {
  getObjectPath,
  raiseError,
  raiseNotification,
} from "../../utils/utilFunctions";
import { MANAGER } from "../../const";
import AddStaffModal from "../../components/Forms/AddStaffForm/AddStaffModal";
import { PythonError, Staff } from "../../types";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../slices/auth";
import LoyaltySection from "./LoyaltySection";

const RestaurantPage: React.FC = () => {
  const { restaurantId } = useParams();
  const id = parseInt(restaurantId ?? "0");
  const restaurantData = useGetRestaurantQuery(id);
  const staffData = useGetAllStaffQuery({
    restaurant_id: id,
  });
  const [deleteStaff] = useDeleteStaffMutation();
  const user = useSelector(selectCurrentUser);

  const handleDeleteStaff = async (email: string, role: string) => {
    try {
      const roles = role.split("|");
      roles.forEach(async (r) => {
        await deleteStaff({
          restaurant_id: id,
          email,
          role: r,
        }).unwrap();
      });
      raiseNotification(`Successfully deleted staff: ${email}`);
    } catch (error: unknown) {
      raiseError((error as PythonError).data.detail);
    }
  };

  if (
    restaurantData.isLoading ||
    restaurantData.isError ||
    restaurantData.isUninitialized ||
    staffData.isLoading ||
    staffData.isError ||
    staffData.isUninitialized
  ) {
    return <LoadingPage />;
  }

  const restaurant = restaurantData.data;
  const staff: (Omit<Staff, "role"> & { role: string })[] = [];
  [...staffData.data].forEach((account) => {
    const exists = staff.filter((v) => v.email === account.email);
    if (exists.length > 0) {
      const existingIndex = staff.indexOf(exists[0]);
      staff[existingIndex] = {
        ...staff[existingIndex],
        role: staff[existingIndex].role.concat("|", account.role),
      };
    } else {
      staff.push(account);
    }
  });

  return (
    <PageContainer>
      <SectionContainer>
        <div>
          <h1 className="text-3xl mt-4 font-extrabold">{restaurant.name}</h1>
          <h2 className="text-lg">{restaurant.comment}</h2>
          <img
            src={getObjectPath(restaurant.imagepath)}
            className="w-full h-[250px] rounded-xl mt-5 shadow-lg object-cover"
          />
        </div>
        <div className="divider" />
        <h2 className="text-lg font-semibold">Your Menu</h2>
        <div className="flex justify-evenly">
          <Link
            to={`/restaurant/${restaurant.id}/menu`}
            className="link link-info"
          >
            View Menu
          </Link>
          <Link
            to={`/manager/restaurant/menu/${restaurant.id}`}
            className="link link-info"
          >
            Edit Menu
          </Link>
        </div>
        <div className="divider" />
        <h2 className="text-lg font-semibold">Your Staff</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
            </thead>
            <tbody>
              {staff.map((account) => (
                <tr key={account.email}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={getObjectPath(account.imagepath)} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {account.firstname} {account.lastname}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {account.role.split("|").map((role) => (
                      <span
                        key={`${account.email}-role-${role}`}
                        className="badge badge-ghost badge-sm mx-1"
                      >
                        {role.toLocaleUpperCase()}
                      </span>
                    ))}
                  </td>
                  <td>{account.email}</td>
                  {account.role === MANAGER && user?.email === account.email ? (
                    <th>
                      <span>Owner</span>
                    </th>
                  ) : (
                    <th>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() =>
                          handleDeleteStaff(account.email, account.role)
                        }
                      >
                        Fire
                      </button>
                    </th>
                  )}
                </tr>
              ))}
              <tr></tr>
            </tbody>
          </table>
        </div>
        <AddStaffModal restaurantId={restaurant.id} />
        <div className="divider" />
        <LoyaltySection restaurantId={id} />
      </SectionContainer>
    </PageContainer>
  );
};

export default RestaurantPage;
