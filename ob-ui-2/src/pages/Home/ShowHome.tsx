import { Link } from "react-router-dom";
import { actionButtonClass, altActionButtonClass } from "../../common";
import { mainContainerClass } from "../../common";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IShowHome {}

export const ShowHome = (aShowHomeProps: IShowHome) =>
{
    return (
        <div className={mainContainerClass}>
          <div className="h-2/5 mt-20 w-[40vw] container mx-auto flex flex-col justify-around items-center">
            <h1 className='text-9xl text-black font-bold'> OpenBank </h1>
            <p className='text-6xl w-[10em] text-center text-black font-light'> The first (free) B.Y.O.B platform </p>
          </div>
          <div className='h-2/5 w-2/4 mt-20 container mx-auto flex flex-row justify-between items-start' >
            <button className={`${actionButtonClass} text-2xl px-2 py-2 mr-3 w-full`}>
              <Link to="/banks/new"><p className="text-white font-bold">Create your bank</p></Link>
            </button>
            <button className={`${altActionButtonClass} text-2xl px-2 py-2 mr-3 w-full`}><p className="text-white font-bold">Explore</p>
            </button>
          </div>
      </div>
    )
};
