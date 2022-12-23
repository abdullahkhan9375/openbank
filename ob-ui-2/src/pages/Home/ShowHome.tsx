import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { altActionButtonClass } from "../../common";
import { mainContainerClass } from "../../common";
import { ShowSignin } from "../Authenticate/ShowSignin";
import { NavPanel } from "../Components/NavPanel";
import { Welcome } from "./Welcome";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IShowHome {}

export const ShowHome = (aShowHomeProps: IShowHome) =>
{
    const lIsSignedIn: boolean = useSelector((state: any) => state.global.user.isSignedIn);

    const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (lIsSignedIn)
    {
      return (
          <Welcome/>
      )
    }
    return (
       <>
       <NavPanel/>
        <div className={mainContainerClass}>
          
            { showLoginDialog && <ShowSignin onCancel={() => setShowLoginDialog(false)}/> }
                <div className="h-2/5 mt-20 w-[40vw] container mx-auto flex flex-col justify-around items-center">
                  <h1 className='text-9xl text-black font-bold'> OpenBank </h1>
                  <p className='text-6xl w-[10em] text-center text-black font-light'> The first (free) B.Y.O.B platform </p>
                </div>
                <div className='container flex flex-row justify-center mt-10 self-center mx-auto' >
                {/* <button className={`${actionButtonClass} text-2xl px-2 py-2 mr-3 w-full`}>
                  <Link to="/banks/new"><p className="text-white font-bold">Create your bank</p></Link>
                </button> */}
                  <button onClick={() => setShowLoginDialog(true)} className={`${altActionButtonClass} text-white font-bold self-center w-[12em] text-2xl`}>
                    Sign Up
                  </button>
                </div>
      </div>
      </>
    )
};
