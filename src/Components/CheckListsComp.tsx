import redDot from "../assets/images/redDot.png";
import AccordionExp from "./AccordionComp";

function CheckListsComp() {
  return (
    <div className="border-black bg-black h-screen p-1">
      <div className="md:w-[50%] bg-[#2b0d0d] md:mx-auto mt-4">
        <div className=" w-full  border-[#e5e1e2] bg-white border-b-2 p-1 ">
          <h5 className=" w-full text-[#0c0d0d] font-sans font-bold  text-lg leading-[normal] ml-4 mt-2">
            Task Name
          </h5>
          <div className="mb-2 ml-4 items-center flex  text-[#f90000] font-sans font-semibold  text-xs leading-[normal] h-4">
            <img src={redDot} alt="redDot-logo" className="h-3 w-3" />
            <span className="ml-2"> Ticket progress is blocked </span>
          </div>
        </div>
        <div className=" pb-4  border-[#e1e3e5] bg-white ">
          {/* accordion  component*/}
          <AccordionExp />
        </div>
      </div>
    </div>
  );
}
export default CheckListsComp;
