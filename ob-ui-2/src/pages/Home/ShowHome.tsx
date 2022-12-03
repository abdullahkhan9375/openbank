import { BaseButton  } from "../../common";
import { Link } from "react-router-dom";
import { actionButtonClass, altActionButtonClass } from "../../common/buttons/styles";
import { mainContainer } from "../../common/CommonStyling";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IShowHome {}

export const ShowHome = (aShowHomeProps: IShowHome) =>
{
    return (
        <div className={mainContainer}>
          <div className="h-2/5 w-[40vw] container mx-auto flex flex-col justify-evenly items-center">
            <h1 className='text-9xl text-black font-bold'> OpenBank </h1>
              <p className='text-6xl text-black font-light'> The first (free) B.Y.O.B platform. </p>
          </div>
          <div className='h-2/5 w-2/4 container mx-auto flex flex-row justify-between items-start' >
            <button className={`${actionButtonClass} text-2xl px-2 py-2 mr-3 w-full`}>
              <Link to="/bankedit"><p className="text-gray-light font-extrabold">Create your bank. </p></Link>
            </button>
            <button className={`${altActionButtonClass} text-2xl px-2 py-2 mr-3 w-full`}><p className="text-gray-light font-extrabold">Explore</p>
            </button>
          </div>
      </div>
    )
};
