import React from "react";
import { RequestAssistanceResponse } from "../../types";
import { useUpdateAssistanceRequestMutation } from "../../services/staff";
import { toast } from "react-toastify";
import PageContainer from "../../containers/pageContainer";
import SectionContainer from "../../containers/sectionContainer";

type Props = {
  request: RequestAssistanceResponse;
  onSelectRequest: (request: RequestAssistanceResponse | null) => void;
};

const TableRequestDetails: React.FC<Props> = ({ request, onSelectRequest }) => {
  const [updateRequestStatus] = useUpdateAssistanceRequestMutation();
  return (
    <PageContainer>
      <div className="h-full flex flex-col justify-between">
        <div className="flex h-full flex-col justify-between">
          <div className="w-full flex flex-grow">
            <div className="w-full flex flex-col">
              <SectionContainer>
                <div className="w-full border-b border-b-neutral">
                  <span className="font-bold">
                    Table {request.tableid} requires assistance
                  </span>{" "}
                </div>
              </SectionContainer>
            </div>
          </div>
          <div className="w-full h-16">
            <button
              className="w-full h-full btn btn-primary rounded-none "
              onClick={() => {
                updateRequestStatus({
                  request_id: request.requestid,
                })
                  .unwrap()
                  .then(() => onSelectRequest(null))
                  .catch(() =>
                    toast.error(`Failed to update order status`, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    })
                  );
              }}
            >
              Mark as complete
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default TableRequestDetails;
