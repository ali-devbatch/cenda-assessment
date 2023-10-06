import white from "../assets/images/white.png";
import danger from "../assets/images/danger.png";
import doneChecklist from "../assets/images/doneChecklist.png";
import addChecklist from "../assets/images/addChecklist.png";
import CI from "../assets/images/CI.png";
import noneChecklist from "../assets/images/noneChecklist.png";
import whiteDot from "../assets/images/whiteDot.png";
import redDot from "../assets/images/redDot.png";
import blueDot from "../assets/images/blueDot.png";
import yellowDot from "../assets/images/yellowDot.png";
import greenDot from "../assets/images/greenDot.png";
import arrow from "../assets/images/arrow.png";
import React, { useEffect, useState } from "react";
import AddNewItemModal from "../modals/Modal";
import { createDatabaseOwn, getTasksCollection } from "../db/db";

function CheckListsComp() {
  const [checkList, setCheckList] = useState("checkList1");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [tasks, setTasks] = useState([]);
  // State to track the modal's open/closed state
  const [isModalClosed, setIsModalClosed] = useState(true);

  // Fetch data from RxDB when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await createDatabaseOwn();
        const tasksCollection = await getTasksCollection(db);
        const allTasks = await tasksCollection.find().exec();
        setTasks(allTasks);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, [isModalClosed]);

  //dropdown function
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  //2nd checkList function
  const handleSecondChecklistClick = () => {
    setCheckList("secondChecklist");
    setIsDropdownOpen(false); // Close the dropdown
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle saving a new item
  const handleSaveNewItem = async (newItemData: any) => {
    try {
      const db = await createDatabaseOwn();
      const tasks = await getTasksCollection(db);

      // Create a new document with title and description
      const newItem = await tasks?.insert({
        title: newItemData.task,
        description: newItemData.description,
        status: newItemData.status,
        checkList: checkList,
        createdAt: Date.now(),
        completed: false, // You can set other properties as needed
      });
      setIsModalOpen(false);
      setIsModalClosed(!isModalClosed);
      console.log("Item saved:", newItem);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  //function to change status
  const changeStatus = async (status: any, result: any) => {
    try {
      const db = await createDatabaseOwn();
      const tasks = await getTasksCollection(db);
      const item = await tasks.find({
        selector: {
          title: status,
        },
      });

      await item.update({
        $set: {
          status: result,
        },
      });
      // Trigger the useEffect to fetch updated data
      setIsModalClosed(!isModalClosed);
      // }
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  return (
    <div className="border-black bg-black h-screen p-1">
      <div className="md:w-[50%] bg-[#f7f8fa] md:mx-auto mt-4">
        <div className=" w-full  border-[#e5e1e2] bg-white border-b-2 p-1">
          <h5 className=" w-full text-[#0c0d0d] font-['Roboto'] text-lg font-semibold leading-[normal] ml-4 mt-2">
            Task Name
          </h5>
          <div className="mb-2 ml-4 w-full flex  text-[#f90000] font-['Roboto'] text-xs leading-[normal]">
            <img src={redDot} alt="redDot-logo" className="h-3 w-3" />

            <span className="ml-2"> Ticket progress is blocked </span>
          </div>
        </div>

        <div className=" pb-4  border-[#e1e3e5] bg-white">
          {/* checklist condition  */}
          {checkList ? (
            <div>
              <div
                className="flex ml-4 justify-between cursor-pointer"
                onClick={toggleDropdown}
              >
                <div
                  onClick={() => {
                    setCheckList("checkList1");
                  }}
                  className="text-[#0c0d0d] font-['Roboto'] text-lg font-semibold leading-[normal] mt-4 h-8"
                >
                  {checkList === "checkList1" ? "Check List" : "2nd Check List"}
                </div>
                <img
                  src={arrow}
                  alt="arrow-logo"
                  className={`h-3 w-3 mt-5 mr-8 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          {isDropdownOpen && (
            <ul className="pl-4 cursor-pointer">
              <li
                className="py-1 flex items-center"
                onClick={handleSecondChecklistClick}
              >
                <div className="text-[#0c0d0d] font-['Roboto'] text-lg font-semibold leading-[normal]">
                  {checkList !== "secondChecklist"
                    ? "2nd Check List"
                    : "Check List"}
                </div>
              </li>
            </ul>
          )}

          <div className="py-1 border h-12 flex items-center ">
            <img src={CI} alt="CI-logo" className="h-8 w-7 ml-3" />
            <div className=" flex items-center ml-3 w-3/4">
              <h5> Light Bulb 150S</h5>
            </div>

            <p className="text-end  w-1/4 mr-4 text-[.7rem] text-slate-400">
              7 STEPS
            </p>
          </div>

          {/* Render items based on the current checkList */}
          {tasks.map((items: any, index) => {
            // Check if the task's checklist matches the current checkList state
            if (items?._data?.checkList === checkList) {
              return (
                <div key={index}>
                  <div className="py-1 flex items-center ">
                    <img
                      onClick={async () => {
                        let result =
                          items?._data?.status === "notStarted"
                            ? "Started"
                            : items?._data?.status === "Started"
                            ? "Done"
                            : "notStarted";
                        await changeStatus(items?._data?.title, result);
                      }}
                      src={
                        items?._data?.status === "notStarted"
                          ? `${white}`
                          : items?._data?.status === "Started"
                          ? `${noneChecklist}`
                          : items?._data?.status === "Done"
                          ? `${doneChecklist}`
                          : ""
                      }
                      alt="white-logo"
                      className="h-8 w-7 ml-3 cursor-pointer"
                    />
                    <div className=" ml-4">
                      <h5>{items?._data?.title}</h5>
                      <div className="flex items-center">
                        <img
                          src={
                            items?._data?.status === "notStarted"
                              ? `${whiteDot}`
                              : items?._data?.status === "Started"
                              ? `${blueDot}`
                              : items?._data?.status === "Done"
                              ? `${greenDot}`
                              : ""
                          }
                          alt="whiteDot-logo"
                          className="h-3 w-3"
                        />
                        <p className="ml-2 text-[.7rem] text-slate-400">
                          {items?._data?.status === "notStarted"
                            ? `Not Started ${items?._data?.description}`
                            : items?._data?.status === "Started"
                            ? `Started ${items?._data?.description}`
                            : items?._data?.status === "Done"
                            ? `Done ${items?._data?.description}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return null; // Don't render items that don't match the current checkList
            }
          })}

          {/* last to add action*/}
          <div
            onClick={openModal}
            className="py-1 flex items-center cursor-pointer"
          >
            <img
              src={addChecklist}
              alt="addChecklist-logo"
              className="h-8 w-7 ml-3"
            />
            <div className=" ml-4">
              <h5 className="text-[#2b87e3] font-['Roboto'] font-medium leading-[1.375rem]">
                ADD NEW ITEM
              </h5>
            </div>
          </div>
        </div>
      </div>
      {/* Modal component */}
      {isModalOpen ? (
        <AddNewItemModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveNewItem}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default CheckListsComp;
