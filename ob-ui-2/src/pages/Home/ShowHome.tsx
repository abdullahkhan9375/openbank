import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { altActionButtonClass } from "../../common";
import { mainContainerClass } from "../../common";
import { handleMessage } from "../../common/utils/HandleMessage";
import { ShowSignin } from "../Authenticate/ShowSignin";
import { MessagePanel, TMessage } from "../Components/MessagePanel";
import { NavPanel } from "../Components/NavPanel";

export const ShowHome = () =>
{
    const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false);
    const [message, setMessage] = useState<TMessage | undefined>(undefined);

    return (
       <>
       <NavPanel/>
        <div className={mainContainerClass}>
            { showLoginDialog && <ShowSignin
              onSuccess={(message: TMessage) => setMessage(handleMessage(message))}
              onFailure={(error: any) => setMessage(handleMessage(error))} onCancel={() => setShowLoginDialog(false)}/> }
                <div className="h-2/5 mt-20 w-[40vw] container mx-auto flex flex-col justify-around items-center">
                  <h1 className='text-9xl text-black font-bold'> OpenBank </h1>
                  <p className='text-6xl w-[10em] text-center text-black font-light'> The first (free) B.Y.O.B platform </p>
                </div>
                <div className='container flex flex-row justify-center mt-10 self-center mx-auto' >
                  <button onClick={() => setShowLoginDialog(true)} className={`${altActionButtonClass} text-white font-bold self-center w-[12em] text-2xl`}>
                    Sign Up
                  </button>
                </div>
                <MessagePanel onAcknowledge={() => setMessage(undefined)} {...message}/>
        </div>
      </>
    )
};
