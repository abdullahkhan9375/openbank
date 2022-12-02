import { BaseButton  } from "../../common";
import { Link } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IShowHome {}

export const ShowHome = (aShowHomeProps: IShowHome) =>
{
    return (
        <div className='container mx-auto flex flex-col items-center justify-center w-screen h-screen' >
          <div className="h-2/5 w-[40vw] container mx-auto flex flex-col justify-evenly items-center">
            <h1 className='text-9xl text-black font-bold'> OpenBank </h1>
              <p className='text-6xl text-black font-light'> The first (free) B.Y.O.B platform. </p>
          </div>
          <div className='h-2/5 w-2/4 container mx-auto flex flex-row justify-between items-start' >
            <button className={`border-4 bg-purple font-extrabold shadow-sm rounded-sm text-2xl px-2 py-2 mr-3 w-full`}>
              <Link to="/user"><p className="text-gray-light font-extrabold">Create your bank. </p></Link>
            </button>
            <button className={`border-4 bg-black shadow-sm rounded-sm text-2xl px-2 py-2 mr-3 w-full`}><p className="text-gray-light font-extrabold">Explore</p>
            </button>
          </div>
      </div>
    )
};
