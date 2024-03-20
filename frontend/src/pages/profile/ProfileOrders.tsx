import React from "react";
import PageContainer from "../../containers/pageContainer";
import SectionContainer from "../../containers/sectionContainer";
import { useGetOrdersQuery } from "../../services/customer";
import ProfileTableRow from "../../components/Table/TableRow/MyOrdersTableRow";

const ProfileOrders = () => {
  const pendingOrders = useGetOrdersQuery("pending");
  const completedOrders = useGetOrdersQuery("completed");

  if (
    pendingOrders.isLoading ||
    pendingOrders.isError ||
    pendingOrders.isFetching ||
    pendingOrders.isUninitialized ||
    completedOrders.isLoading ||
    completedOrders.isError ||
    completedOrders.isFetching ||
    completedOrders.isUninitialized
  ) {
    return <div className="pt-12">404</div>;
  }

  return (
    <PageContainer>
      <SectionContainer>
        <span className="font-bold text-sm">PENDING ORDERS</span>
        <div className="overflow-x-auto">
          {pendingOrders.data.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th className="w-24"></th>
                  <th>Restaurant</th>
                  <th>OrderId</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.data
                  .slice()
                  .reverse()
                  .map((order) => {
                    return (
                      <ProfileTableRow
                        key={order.id}
                        order={order}
                        status="PENDING"
                      />
                    );
                  })}
              </tbody>
            </table>
          )}
          {pendingOrders.data.length === 0 && <>You have no pending orders</>}
        </div>
      </SectionContainer>
      <span className="font-bold text-sm">COMPLETE ORDERS</span>{" "}
      <div className="overflow-x-auto">
        {completedOrders.data.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th className="w-24"></th>
                <th>Restaurant</th>
                <th>OrderId</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.data
                .slice()
                .reverse()
                .map((order) => {
                  return (
                    <ProfileTableRow
                      key={order.id}
                      order={order}
                      status="COMPLETE"
                    />
                  );
                })}
            </tbody>
          </table>
        )}
        {completedOrders.data.length === 0 && <>You have no completed orders</>}
      </div>
    </PageContainer>
  );
};

export default ProfileOrders;
