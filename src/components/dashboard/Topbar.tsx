import { useState } from "react";
import {
  Bell,
  ChevronDown,
  User,
} from "lucide-react";


function Topbar() {

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);


  return (

    <div className="
      h-20
      bg-slate-950
      border-b
      border-slate-800
      flex
      items-center
      justify-between
      px-6
    ">


      {/* Search */}

      <div>

        <input

          type="text"

          placeholder="Search legal documents..."

          className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            px-4
            py-2
            text-white
            w-72
            outline-none
            focus:border-cyan-500
          "

        />

      </div>




      {/* Right Section */}

      <div className="
        flex
        items-center
        gap-6
      ">



        {/* Notification */}


        <div className="relative">


          <button

            onClick={() => setNotificationOpen(!notificationOpen)}

            className="
              relative
              text-slate-300
              hover:text-white
            "

          >

            <Bell size={24}/>


            <span className="
              absolute
              -top-2
              -right-2
              bg-red-500
              text-white
              text-xs
              rounded-full
              h-5
              w-5
              flex
              items-center
              justify-center
            ">

              3

            </span>


          </button>



          {
            notificationOpen && (

              <div className="
                absolute
                right-0
                top-10
                w-80
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                shadow-xl
                p-4
                z-50
              ">


                <h3 className="
                  text-white
                  font-semibold
                  mb-3
                ">

                  Notifications

                </h3>



                <div className="space-y-3">


                  <div className="
                    bg-slate-800
                    rounded-lg
                    p-3
                    text-sm
                    text-slate-300
                  ">

                    New document analysis completed

                  </div>



                  <div className="
                    bg-slate-800
                    rounded-lg
                    p-3
                    text-sm
                    text-slate-300
                  ">

                    Risk alert detected in Case #1024

                  </div>



                  <div className="
                    bg-slate-800
                    rounded-lg
                    p-3
                    text-sm
                    text-slate-300
                  ">

                    AI legal report generated

                  </div>


                </div>


              </div>

            )

          }


        </div>






        {/* Profile */}


        <div

          onClick={() => setProfileOpen(!profileOpen)}

          className="
            flex
            items-center
            gap-3
            cursor-pointer
            relative
          "

        >



          <div className="
            bg-cyan-500/20
            p-2
            rounded-full
            text-cyan-400
          ">

            <User size={22}/>

          </div>




          <div>

            <p className="
              text-white
              text-sm
              font-medium
            ">

              Om Sengar

            </p>


            <p className="
              text-slate-400
              text-xs
            ">

              Legal AI User

            </p>


          </div>




          <ChevronDown

            size={18}

            className="
              text-slate-400
            "

          />





          {/* Profile Dropdown */}


          {
            profileOpen && (

              <div className="
                absolute
                right-0
                top-12
                w-56
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                shadow-xl
                p-3
                z-50
              ">



                <div className="
                  text-white
                  p-3
                  rounded-lg
                  hover:bg-slate-800
                  cursor-pointer
                ">

                  👤 My Profile

                </div>



                <div className="
                  text-white
                  p-3
                  rounded-lg
                  hover:bg-slate-800
                  cursor-pointer
                ">

                  ⚙ Settings

                </div>




                <div className="
                  text-white
                  p-3
                  rounded-lg
                  hover:bg-slate-800
                  cursor-pointer
                ">

                  🔒 Security

                </div>




                <div className="
                  text-red-400
                  p-3
                  rounded-lg
                  hover:bg-slate-800
                  cursor-pointer
                ">

                  🚪 Logout

                </div>



              </div>

            )

          }



        </div>



      </div>


    </div>

  );

}


export default Topbar;